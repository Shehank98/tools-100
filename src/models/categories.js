import { query } from '../db/pool.js';

// All categories with a live count of their active tools.
export async function listWithCounts() {
  const { rows } = await query(`
    SELECT c.*, COUNT(t.id) FILTER (WHERE t.is_active) AS tool_count
    FROM categories c
    LEFT JOIN tools t ON t.category_id = c.id
    GROUP BY c.id
    ORDER BY c.sort_order, c.name
  `);
  return rows;
}

export async function listAll() {
  const { rows } = await query('SELECT * FROM categories ORDER BY sort_order, name');
  return rows;
}

export async function getBySlug(slug) {
  const { rows } = await query('SELECT * FROM categories WHERE slug = $1', [slug]);
  return rows[0] || null;
}

export async function getById(id) {
  const { rows } = await query('SELECT * FROM categories WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function create({ name, slug, icon, description, sort_order }) {
  const { rows } = await query(
    `INSERT INTO categories (name, slug, icon, description, sort_order)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, slug, icon || '🧰', description || '', sort_order || 0]
  );
  return rows[0];
}

export async function update(id, { name, slug, icon, description, sort_order }) {
  const { rows } = await query(
    `UPDATE categories
     SET name = $2, slug = $3, icon = $4, description = $5, sort_order = $6
     WHERE id = $1 RETURNING *`,
    [id, name, slug, icon || '🧰', description || '', sort_order || 0]
  );
  return rows[0];
}

export async function remove(id) {
  await query('DELETE FROM categories WHERE id = $1', [id]);
}
