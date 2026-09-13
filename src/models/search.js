import { query } from '../db/pool.js';

// Full-text search over tools using the tsvector column, ranked by relevance.
// Falls back to a prefix/ILIKE match so partial words (e.g. "compr") still
// return useful results while the user is typing.
export async function searchTools(qText, { limit = 20 } = {}) {
  const q = (qText || '').trim();
  if (!q) return [];

  const { rows } = await query(
    `
    SELECT t.*, c.name AS category_name, c.slug AS category_slug, c.icon AS category_icon,
           ts_rank(t.search_vector, websearch_to_tsquery('english', $1)) AS rank
    FROM tools t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.is_active
      AND (
        t.search_vector @@ websearch_to_tsquery('english', $1)
        OR t.name ILIKE $2
        OR EXISTS (SELECT 1 FROM unnest(t.tags) g WHERE g ILIKE $2)
      )
    ORDER BY rank DESC, t.is_featured DESC, t.click_count DESC
    LIMIT $3
    `,
    [q, `%${q}%`, limit]
  );
  return rows;
}

// Record what people searched for and how many results they got. Fire-and-forget.
export async function logSearch(q, resultsCount) {
  try {
    await query('INSERT INTO search_logs (query, results_count) VALUES ($1, $2)', [
      q.trim().slice(0, 200),
      resultsCount,
    ]);
  } catch {
    /* logging must never break search */
  }
}

// Top recent search terms that returned nothing (content gaps).
export async function topMissedSearches(limit = 10) {
  const { rows } = await query(
    `SELECT query, COUNT(*) AS n
     FROM search_logs
     WHERE results_count = 0 AND created_at > now() - interval '30 days'
     GROUP BY query ORDER BY n DESC LIMIT $1`,
    [limit]
  );
  return rows;
}
