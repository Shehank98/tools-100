import express from 'express';
import multer from 'multer';
import { parse as parseCsv } from 'csv-parse/sync';
import { requireAdmin } from '../middleware/auth.js';
import { slugify } from '../lib/slugify.js';
import { buildMeta } from '../lib/meta.js';
import * as Admin from '../models/admin.js';
import * as Tools from '../models/tools.js';
import * as Categories from '../models/categories.js';
import * as Submissions from '../models/submissions.js';
import * as Stats from '../models/stats.js';
import { topMissedSearches } from '../models/search.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

const adminMeta = (title) => buildMeta({ title: `${title} · Admin`, noindex: true });
const parseTags = (raw) =>
  (raw || '')
    .split(/[,;]/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 20);

// ── Auth ──
router.get('/login', (req, res) => {
  if (req.session?.adminId) return res.redirect('/admin');
  res.render('admin/login', { meta: adminMeta('Login'), error: null, email: '' });
});

router.post('/login', async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim();
    const admin = await Admin.verify(email, req.body.password || '');
    if (!admin) {
      return res.status(401).render('admin/login', {
        meta: adminMeta('Login'), error: 'Invalid email or password.', email,
      });
    }
    req.session.adminId = admin.id;
    req.session.adminEmail = admin.email;
    res.redirect('/admin');
  } catch (err) { next(err); }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// Everything below requires auth.
router.use(requireAdmin);

// ── Dashboard ──
router.get('/', async (req, res, next) => {
  try {
    const [stats, topClicked, pending, missed] = await Promise.all([
      Stats.dashboard(),
      Stats.topClicked(8),
      Submissions.pendingCount(),
      topMissedSearches(8),
    ]);
    res.render('admin/dashboard', {
      meta: adminMeta('Dashboard'), active: 'dashboard',
      stats, topClicked, pending, missed,
    });
  } catch (err) { next(err); }
});

// ── Tools list ──
router.get('/tools', async (req, res, next) => {
  try {
    const q = (req.query.q || '').toString().trim();
    const tools = await Tools.listAll({ q });
    res.render('admin/tools', {
      meta: adminMeta('Tools'), active: 'tools', tools, q,
      flash: req.query.flash || null,
    });
  } catch (err) { next(err); }
});

router.get('/tools/new', async (req, res, next) => {
  try {
    const categories = await Categories.listAll();
    res.render('admin/tool-form', {
      meta: adminMeta('New Tool'), active: 'tools',
      categories, tool: null, error: null,
    });
  } catch (err) { next(err); }
});

router.post('/tools', async (req, res, next) => {
  try {
    const categories = await Categories.listAll();
    const data = readToolForm(req.body);
    const err = validateTool(data);
    if (err) {
      return res.status(400).render('admin/tool-form', {
        meta: adminMeta('New Tool'), active: 'tools', categories, tool: data, error: err,
      });
    }
    data.slug = await uniqueToolSlug(data.name);
    await Tools.create(data);
    res.redirect('/admin/tools?flash=Tool+created');
  } catch (err) { next(err); }
});

router.get('/tools/:id/edit', async (req, res, next) => {
  try {
    const [tool, categories] = await Promise.all([
      Tools.getById(req.params.id), Categories.listAll(),
    ]);
    if (!tool) return next();
    res.render('admin/tool-form', {
      meta: adminMeta('Edit Tool'), active: 'tools', categories, tool, error: null,
    });
  } catch (err) { next(err); }
});

router.post('/tools/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const categories = await Categories.listAll();
    const existing = await Tools.getById(id);
    if (!existing) return next();
    const data = readToolForm(req.body);
    const err = validateTool(data);
    if (err) {
      return res.status(400).render('admin/tool-form', {
        meta: adminMeta('Edit Tool'), active: 'tools', categories,
        tool: { ...data, id }, error: err,
      });
    }
    // Keep the existing slug unless the name changed; ensure uniqueness.
    let slug = existing.slug;
    if (data.name !== existing.name) slug = await uniqueToolSlug(data.name, id);
    data.slug = slug;
    await Tools.update(id, data);
    res.redirect('/admin/tools?flash=Tool+updated');
  } catch (err) { next(err); }
});

router.post('/tools/:id/delete', async (req, res, next) => {
  try {
    await Tools.remove(parseInt(req.params.id, 10));
    res.redirect('/admin/tools?flash=Tool+deleted');
  } catch (err) { next(err); }
});

// ── Categories ──
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Categories.listWithCounts();
    res.render('admin/categories', {
      meta: adminMeta('Categories'), active: 'categories', categories,
      flash: req.query.flash || null,
    });
  } catch (err) { next(err); }
});

router.get('/categories/new', (req, res) => {
  res.render('admin/category-form', {
    meta: adminMeta('New Category'), active: 'categories', category: null, error: null,
  });
});

router.post('/categories', async (req, res, next) => {
  try {
    const data = readCategoryForm(req.body);
    if (!data.name) {
      return res.status(400).render('admin/category-form', {
        meta: adminMeta('New Category'), active: 'categories', category: data, error: 'Name is required.',
      });
    }
    data.slug = slugify(data.name);
    await Categories.create(data);
    res.redirect('/admin/categories?flash=Category+created');
  } catch (err) { next(err); }
});

router.get('/categories/:id/edit', async (req, res, next) => {
  try {
    const category = await Categories.getById(req.params.id);
    if (!category) return next();
    res.render('admin/category-form', {
      meta: adminMeta('Edit Category'), active: 'categories', category, error: null,
    });
  } catch (err) { next(err); }
});

router.post('/categories/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await Categories.getById(id);
    if (!existing) return next();
    const data = readCategoryForm(req.body);
    if (!data.name) {
      return res.status(400).render('admin/category-form', {
        meta: adminMeta('Edit Category'), active: 'categories', category: { ...data, id }, error: 'Name is required.',
      });
    }
    data.slug = data.name !== existing.name ? slugify(data.name) : existing.slug;
    await Categories.update(id, data);
    res.redirect('/admin/categories?flash=Category+updated');
  } catch (err) { next(err); }
});

router.post('/categories/:id/delete', async (req, res, next) => {
  try {
    await Categories.remove(parseInt(req.params.id, 10));
    res.redirect('/admin/categories?flash=Category+deleted');
  } catch (err) { next(err); }
});

// ── Bulk CSV import ──
router.get('/import', (req, res) => {
  res.render('admin/import', { meta: adminMeta('Bulk Import'), active: 'import', result: null, error: null });
});

router.post('/import', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).render('admin/import', {
        meta: adminMeta('Bulk Import'), active: 'import', result: null, error: 'Please choose a CSV file.',
      });
    }
    let records;
    try {
      records = parseCsv(req.file.buffer.toString('utf8'), {
        columns: (header) => header.map((h) => h.trim().toLowerCase()),
        skip_empty_lines: true,
        trim: true,
      });
    } catch (e) {
      return res.status(400).render('admin/import', {
        meta: adminMeta('Bulk Import'), active: 'import', result: null,
        error: `Could not parse CSV: ${e.message}`,
      });
    }

    const categories = await Categories.listAll();
    const catByKey = new Map();
    categories.forEach((c) => {
      catByKey.set(c.name.toLowerCase(), c.id);
      catByKey.set(c.slug.toLowerCase(), c.id);
    });

    const result = { created: 0, skipped: 0, errors: [] };
    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const name = (row.name || '').trim();
      const url = (row.url || '').trim();
      if (!name || !url) { result.skipped++; result.errors.push(`Row ${i + 2}: missing name or url`); continue; }
      try { new URL(url); } catch { result.skipped++; result.errors.push(`Row ${i + 2}: invalid url`); continue; }

      const catKey = (row.category || '').trim().toLowerCase();
      const categoryId = catByKey.get(catKey) || null;
      const slug = await uniqueToolSlug(name);
      try {
        await Tools.create({
          name, slug,
          description: (row.description || '').trim(),
          url,
          category_id: categoryId,
          tags: parseTags(row.tags),
          is_featured: ['1', 'true', 'yes'].includes((row.featured || '').toLowerCase()),
          is_active: true,
          source: 'manual',
        });
        result.created++;
      } catch (e) {
        result.skipped++;
        result.errors.push(`Row ${i + 2}: ${e.message}`);
      }
    }
    result.errors = result.errors.slice(0, 25);
    res.render('admin/import', { meta: adminMeta('Bulk Import'), active: 'import', result, error: null });
  } catch (err) { next(err); }
});

// ── Submission review queue ──
router.get('/submissions', async (req, res, next) => {
  try {
    const [submissions, categories] = await Promise.all([
      Submissions.listByStatus('pending'), Categories.listAll(),
    ]);
    res.render('admin/submissions', {
      meta: adminMeta('Review Queue'), active: 'submissions',
      submissions, categories, flash: req.query.flash || null,
    });
  } catch (err) { next(err); }
});

router.post('/submissions/:id/approve', async (req, res, next) => {
  try {
    const categoryId = req.body.category_id ? parseInt(req.body.category_id, 10) : null;
    await Submissions.approve(parseInt(req.params.id, 10), { categoryId });
    res.redirect('/admin/submissions?flash=Approved+and+published');
  } catch (err) { next(err); }
});

router.post('/submissions/:id/reject', async (req, res, next) => {
  try {
    await Submissions.reject(parseInt(req.params.id, 10));
    res.redirect('/admin/submissions?flash=Submission+rejected');
  } catch (err) { next(err); }
});

// ── helpers ──
function readToolForm(body) {
  return {
    name: (body.name || '').trim(),
    url: (body.url || '').trim(),
    description: (body.description || '').trim(),
    category_id: body.category_id ? parseInt(body.category_id, 10) : null,
    tags: parseTags(body.tags),
    icon_url: (body.icon_url || '').trim(),
    is_featured: body.is_featured === 'on' || body.is_featured === 'true',
    is_active: body.is_active === 'on' || body.is_active === 'true',
    source: 'manual',
  };
}

function validateTool(data) {
  if (!data.name) return 'Tool name is required.';
  if (!data.url) return 'Tool URL is required.';
  try {
    const u = new URL(data.url);
    if (!/^https?:$/.test(u.protocol)) return 'URL must start with http:// or https://';
  } catch { return 'Please enter a valid URL.'; }
  return null;
}

function readCategoryForm(body) {
  return {
    name: (body.name || '').trim(),
    icon: (body.icon || '').trim() || '🧰',
    description: (body.description || '').trim(),
    sort_order: parseInt(body.sort_order, 10) || 0,
  };
}

async function uniqueToolSlug(name, exceptId = null) {
  const base = slugify(name) || 'tool';
  let slug = base;
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Tools.slugExists(slug, exceptId)) {
    slug = `${base}-${++n}`;
  }
  return slug;
}

export default router;
