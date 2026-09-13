import express from 'express';
import { searchTools, logSearch } from '../models/search.js';

const router = express.Router();

// Live search endpoint used by the debounced client-side search box.
router.get('/search', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (q.length < 2) return res.json({ query: q, results: [] });

  try {
    const rows = await searchTools(q, { limit: 8 });
    // Log only "real" searches (avoid a row per keystroke): 3+ chars.
    if (q.length >= 3) logSearch(q, rows.length);
    res.json({
      query: q,
      results: rows.map((t) => ({
        name: t.name,
        slug: t.slug,
        category: t.category_name || '',
        icon: t.category_icon || '🔧',
      })),
    });
  } catch (err) {
    console.error('[api/search]', err.message);
    res.status(500).json({ query: q, results: [], error: 'search_failed' });
  }
});

export default router;
