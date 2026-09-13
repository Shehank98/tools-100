import express from 'express';
import { config } from '../config/index.js';
import * as Tools from '../models/tools.js';
import * as Categories from '../models/categories.js';

const router = express.Router();
const abs = (p) => `${config.siteUrl}${p}`;
const esc = (s) => String(s).replace(/[<>&'"]/g, (c) =>
  ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));

// ── sitemap.xml — regenerated on every request from the DB ──
router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const [tools, categories] = await Promise.all([Tools.allActive(), Categories.listAll()]);
    const urls = [];

    const push = (loc, { lastmod, priority = '0.6', changefreq = 'weekly' } = {}) => {
      urls.push(
        `<url><loc>${esc(loc)}</loc>` +
        (lastmod ? `<lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : '') +
        `<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
      );
    };

    push(abs('/'), { priority: '1.0', changefreq: 'daily' });
    push(abs('/about'), { priority: '0.4', changefreq: 'monthly' });
    push(abs('/submit'), { priority: '0.4', changefreq: 'monthly' });
    push(abs('/privacy'), { priority: '0.2', changefreq: 'yearly' });
    categories.forEach((c) => push(abs(`/category/${c.slug}`), { priority: '0.8' }));
    tools.forEach((t) => push(abs(`/tool/${t.slug}`), { lastmod: t.updated_at, priority: '0.7' }));

    res.type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`
    );
  } catch (err) { next(err); }
});

// ── robots.txt ──
router.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /go/',
      'Disallow: /search',
      '',
      `Sitemap: ${abs('/sitemap.xml')}`,
      '',
    ].join('\n')
  );
});

// ── ads.txt — fill in your AdSense publisher id via ADSENSE_CLIENT ──
router.get('/ads.txt', (req, res) => {
  res.type('text/plain');
  if (config.adsenseClient) {
    // ADSENSE_CLIENT looks like "ca-pub-1234567890123456"; ads.txt wants the digits.
    const pub = config.adsenseClient.replace(/^ca-pub-/, '');
    res.send(`google.com, pub-${pub}, DIRECT, f08c47fec0942fa0\n`);
  } else {
    res.send('# Add your AdSense publisher id (ADSENSE_CLIENT) to generate this file.\n');
  }
});

export default router;
