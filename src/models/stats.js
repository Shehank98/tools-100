import { query } from '../db/pool.js';

// Dashboard summary numbers.
export async function dashboard() {
  const { rows } = await query(`
    SELECT
      (SELECT COUNT(*) FROM tools)                                    AS total_tools,
      (SELECT COUNT(*) FROM tools WHERE is_active)                    AS active_tools,
      (SELECT COUNT(*) FROM categories)                              AS total_categories,
      (SELECT COUNT(*) FROM tool_submissions WHERE status='pending') AS pending_submissions,
      (SELECT COALESCE(SUM(click_count),0) FROM tools)               AS total_clicks
  `);
  return rows[0];
}

export async function topClicked(limit = 10) {
  const { rows } = await query(
    `SELECT t.id, t.name, t.slug, t.click_count, c.name AS category_name
     FROM tools t LEFT JOIN categories c ON c.id = t.category_id
     WHERE t.click_count > 0
     ORDER BY t.click_count DESC LIMIT $1`,
    [limit]
  );
  return rows;
}
