import express from 'express';
import { config } from '../config/index.js';
import * as Tools from '../models/tools.js';
import * as Categories from '../models/categories.js';
import * as Submissions from '../models/submissions.js';
import { searchTools, logSearch } from '../models/search.js';
import {
  buildMeta, websiteJsonLd, toolJsonLd, breadcrumbJsonLd, collectionJsonLd,
} from '../lib/meta.js';

const router = express.Router();

// ── Homepage ──
router.get('/', async (req, res, next) => {
  try {
    const [categories, allTools] = await Promise.all([
      Categories.listWithCounts(),
      Tools.allActive(),
    ]);

    // Group tools under their category for the directory layout (iLovePDF-style).
    const byCat = new Map();
    for (const t of allTools) {
      if (!t.category_id) continue;
      if (!byCat.has(t.category_id)) byCat.set(t.category_id, []);
      byCat.get(t.category_id).push(t);
    }
    const groups = categories
      .map((category) => ({
        category,
        tools: (byCat.get(category.id) || []).sort(
          (a, b) => (b.is_featured - a.is_featured) || a.name.localeCompare(b.name)
        ),
      }))
      .filter((g) => g.tools.length > 0);

    const totalTools = allTools.length;
    res.render('home', {
      nav: 'home',
      meta: buildMeta({
        description: `Browse ${totalTools}+ free online tools in one clean, fast directory: PDF, image, text, converter, calculator, developer, SEO and security tools. ${config.siteTagline}`,
        jsonLd: [websiteJsonLd()],
      }),
      groups,
      totalTools,
      totalCategories: groups.length,
    });
  } catch (err) { next(err); }
});

// ── Category page ──
router.get('/category/:slug', async (req, res, next) => {
  try {
    const category = await Categories.getBySlug(req.params.slug);
    if (!category) return next();
    const activeTag = req.query.tag ? String(req.query.tag) : null;
    const [tools, tags] = await Promise.all([
      Tools.byCategory(category.id, { tag: activeTag }),
      Tools.tagsForCategory(category.id),
    ]);
    res.render('category', {
      nav: 'categories',
      meta: buildMeta({
        title: `Free ${category.name}`,
        description: `${category.description} Browse ${tools.length} free ${category.name.toLowerCase()} on ${config.siteName}.`,
        path: `/category/${category.slug}`,
        jsonLd: [
          collectionJsonLd(category, tools),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: category.name, path: `/category/${category.slug}` },
          ]),
        ],
      }),
      category,
      tools,
      tags,
      activeTag,
    });
  } catch (err) { next(err); }
});

// ── Tool detail page ──
router.get('/tool/:slug', async (req, res, next) => {
  try {
    const tool = await Tools.getBySlug(req.params.slug);
    if (!tool) return next();
    const related = tool.category_id
      ? (await Tools.byCategory(tool.category_id)).filter((t) => t.id !== tool.id).slice(0, 4)
      : [];
    let hostname = '';
    try { hostname = new URL(tool.url).hostname.replace(/^www\./, ''); } catch { /* ignore */ }
    const addedDate = new Date(tool.created_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
    res.render('tool', {
      nav: '',
      meta: buildMeta({
        title: `${tool.name}, Free Online Tool`,
        description: tool.description,
        path: `/tool/${tool.slug}`,
        ogType: 'article',
        jsonLd: [
          toolJsonLd(tool),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            ...(tool.category_slug ? [{ name: tool.category_name, path: `/category/${tool.category_slug}` }] : []),
            { name: tool.name, path: `/tool/${tool.slug}` },
          ]),
        ],
      }),
      tool,
      related,
      hostname,
      addedDate,
    });
  } catch (err) { next(err); }
});

// ── Click-through redirect (tracks clicks) ──
router.get('/go/:slug', async (req, res, next) => {
  try {
    const url = await Tools.registerClick(req.params.slug);
    if (!url) return next();
    res.redirect(302, url);
  } catch (err) { next(err); }
});

// ── Search results page ──
router.get('/search', async (req, res, next) => {
  try {
    const q = (req.query.q || '').toString().trim();
    const results = q ? await searchTools(q, { limit: 40 }) : [];
    if (q) logSearch(q, results.length);
    res.render('search', {
      nav: '',
      meta: buildMeta({
        title: q ? `Search: ${q}` : 'Search Tools',
        description: q ? `Tools matching “${q}” on ${config.siteName}.` : 'Search the OneKitApp directory of free online tools.',
        path: '/search',
        noindex: true, // search result pages should not be indexed
      }),
      q,
      results,
    });
  } catch (err) { next(err); }
});

// ── About ──
router.get('/about', (req, res) => {
  res.render('about', {
    nav: 'about',
    meta: buildMeta({
      title: 'About',
      description: `Learn about ${config.siteName}, a free curated directory of the best online tools.`,
      path: '/about',
    }),
  });
});

// ── Privacy / cookies / terms ──
router.get('/privacy', (req, res) => {
  res.render('privacy', {
    nav: '',
    meta: buildMeta({
      title: 'Privacy, Cookies & Terms',
      description: `Privacy policy, cookie policy and terms of use for ${config.siteName}.`,
      path: '/privacy',
    }),
    updated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  });
});

// ── Submit a tool (public submission form → review queue) ──
router.get('/submit', async (req, res, next) => {
  try {
    const categories = await Categories.listAll();
    res.render('submit', {
      nav: 'submit',
      meta: buildMeta({
        title: 'Submit a Tool',
        description: `Suggest a free online tool to add to the ${config.siteName} directory.`,
        path: '/submit',
      }),
      categories,
      form: {},
      success: req.query.ok === '1',
      error: null,
    });
  } catch (err) { next(err); }
});

router.post('/submit', async (req, res, next) => {
  try {
    const categories = await Categories.listAll();
    const name = (req.body.name || '').trim();
    const url = (req.body.url || '').trim();
    const category_guess = (req.body.category_guess || '').trim();
    const description = (req.body.description || '').trim();

    const rerender = (error) => res.status(400).render('submit', {
      nav: 'submit',
      meta: buildMeta({ title: 'Submit a Tool', path: '/submit' }),
      categories, form: { name, url, category_guess, description }, success: false, error,
    });

    if (!name || !url) return rerender('Please provide both a tool name and URL.');
    try {
      const u = new URL(url);
      if (!/^https?:$/.test(u.protocol)) throw new Error('bad');
    } catch {
      return rerender('Please enter a valid URL starting with http:// or https://');
    }

    await Submissions.create({
      name, url, category_guess, description,
      raw_data: { submitted_at: new Date().toISOString(), ua: req.get('user-agent') || '' },
      source: 'user',
    });
    res.redirect('/submit?ok=1');
  } catch (err) { next(err); }
});

export default router;
