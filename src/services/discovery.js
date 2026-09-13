// ─────────────────────────────────────────────────────────────
// Auto-discovery (Option A): a scheduled job that gathers candidate
// tools and drops them into the review queue (tool_submissions,
// status = 'pending'). Nothing is published automatically — an admin
// approves or rejects from /admin/submissions.
//
// Sources:
//   1. RSS/Atom feeds listed in DISCOVERY_FEEDS (comma-separated URLs).
//   2. A small built-in curated candidate list, so the queue is never
//      empty on the very first run even without network access.
// ─────────────────────────────────────────────────────────────
import cron from 'node-cron';
import { config } from '../config/index.js';
import * as Submissions from '../models/submissions.js';

// A few hand-picked, well-known tools not in the initial seed. These give the
// review queue something real to approve on day one.
const CURATED_CANDIDATES = [
  { name: 'Excalidraw', url: 'https://excalidraw.com', category_guess: 'Color & Design', description: 'Virtual hand-drawn style whiteboard for sketching diagrams and wireframes.' },
  { name: 'Fast.com Speed Test', url: 'https://fast.com', category_guess: 'Productivity', description: 'Check your internet download speed instantly, powered by Netflix.' },
  { name: 'Carbon Code Images', url: 'https://carbon.now.sh', category_guess: 'Developer Tools', description: 'Create beautiful images of your source code to share on social media.' },
  { name: 'TinyWow', url: 'https://tinywow.com', category_guess: 'PDF Tools', description: 'A large free suite of PDF, image, video and writing tools with no watermarks.' },
  { name: 'Cron Expression Helper', url: 'https://crontab.guru', category_guess: 'Developer Tools', description: 'Write and understand cron schedule expressions with a live plain-English preview.' },
];

// Minimal RSS/Atom item extraction (avoids pulling in an XML parser dep).
function parseFeed(xml) {
  const items = [];
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) || [];
  for (const block of blocks) {
    const title = decode(pick(block, 'title'));
    let link = pick(block, 'link');
    // Atom uses <link href="…"/>
    if (!link) {
      const m = block.match(/<link[^>]*href=["']([^"']+)["']/i);
      if (m) link = m[1];
    }
    const description = decode(pick(block, 'description') || pick(block, 'summary'));
    if (title && link) items.push({ name: title.slice(0, 120), url: link.trim(), description: description.slice(0, 400) });
  }
  return items;
}

function pick(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (!m) return '';
  return m[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function decode(s) {
  return String(s)
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

async function fetchFeed(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'OneKitApp-Discovery/1.0' }, signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return parseFeed(xml);
  } catch (err) {
    console.warn(`[discovery] feed failed ${url}: ${err.message}`);
    return [];
  }
}

// Run one discovery pass. Returns the number of new submissions queued.
export async function runDiscovery({ includeCurated = true } = {}) {
  const feeds = (process.env.DISCOVERY_FEEDS || '')
    .split(',').map((s) => s.trim()).filter(Boolean);

  const candidates = [];
  if (includeCurated) candidates.push(...CURATED_CANDIDATES.map((c) => ({ ...c })));

  for (const feed of feeds) {
    const items = await fetchFeed(feed);
    for (const it of items) candidates.push({ ...it, category_guess: '' });
  }

  let queued = 0;
  for (const c of candidates) {
    try {
      const created = await Submissions.create({
        name: c.name,
        url: c.url,
        category_guess: c.category_guess || '',
        description: c.description || '',
        raw_data: { discovered_at: new Date().toISOString() },
        source: 'auto',
      });
      if (created) queued++;
    } catch (err) {
      console.warn(`[discovery] could not queue ${c.url}: ${err.message}`);
    }
  }

  console.log(`[discovery] pass complete — ${queued} new candidate(s) queued for review`);
  return queued;
}

// Schedule the recurring job (no-op unless DISCOVERY_ENABLED is true).
export function scheduleDiscovery() {
  if (!config.discovery.enabled) {
    console.log('[discovery] disabled (set DISCOVERY_ENABLED=true to enable)');
    return null;
  }
  if (!cron.validate(config.discovery.cron)) {
    console.warn(`[discovery] invalid cron "${config.discovery.cron}" — not scheduled`);
    return null;
  }
  const task = cron.schedule(config.discovery.cron, () => {
    console.log('[discovery] scheduled run starting…');
    runDiscovery().catch((e) => console.error('[discovery] run error', e));
  });
  console.log(`[discovery] scheduled (${config.discovery.cron} UTC)`);
  return task;
}

// Allow a manual pass: `node src/services/discovery.js`
if (import.meta.url === `file://${process.argv[1]}`) {
  const { pool } = await import('../db/pool.js');
  runDiscovery()
    .then(() => pool.end())
    .then(() => process.exit(0))
    .catch((e) => { console.error(e); process.exit(1); });
}
