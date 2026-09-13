import { query, withClient } from '../db/pool.js';
import { slugify } from '../lib/slugify.js';

export async function create({ name, url, category_guess = '', description = '', raw_data = {}, source = 'user' }) {
  const { rows } = await query(
    `INSERT INTO tool_submissions (name, url, category_guess, description, raw_data, source)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (url) WHERE status = 'pending' DO NOTHING
     RETURNING *`,
    [name, url, category_guess, description, raw_data, source]
  );
  return rows[0] || null;
}

export async function listByStatus(status = 'pending') {
  const { rows } = await query(
    'SELECT * FROM tool_submissions WHERE status = $1 ORDER BY created_at DESC',
    [status]
  );
  return rows;
}

export async function pendingCount() {
  const { rows } = await query(
    "SELECT COUNT(*)::int AS n FROM tool_submissions WHERE status = 'pending'"
  );
  return rows[0].n;
}

export async function getById(id) {
  const { rows } = await query('SELECT * FROM tool_submissions WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function reject(id) {
  await query("UPDATE tool_submissions SET status = 'rejected' WHERE id = $1", [id]);
}

// Approve: turn the submission into a live tool row, then mark it approved.
// Runs in a transaction so we never end up half-approved.
export async function approve(id, { categoryId = null } = {}) {
  return withClient(async (client) => {
    const { rows: subRows } = await client.query(
      "SELECT * FROM tool_submissions WHERE id = $1 AND status = 'pending' FOR UPDATE",
      [id]
    );
    const sub = subRows[0];
    if (!sub) return null;

    // Ensure a unique slug.
    let base = slugify(sub.name) || 'tool';
    let slug = base;
    let n = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { rows } = await client.query('SELECT 1 FROM tools WHERE slug = $1', [slug]);
      if (rows.length === 0) break;
      slug = `${base}-${++n}`;
    }

    const { rows: toolRows } = await client.query(
      `INSERT INTO tools (name, slug, description, url, category_id, source)
       VALUES ($1, $2, $3, $4, $5, 'auto') RETURNING *`,
      [sub.name, slug, sub.description || '', sub.url, categoryId]
    );

    await client.query("UPDATE tool_submissions SET status = 'approved' WHERE id = $1", [id]);
    return toolRows[0];
  });
}
