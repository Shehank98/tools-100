import { query } from '../db/pool.js';

const SELECT_WITH_CAT = `
  SELECT t.*, c.name AS category_name, c.slug AS category_slug, c.icon AS category_icon
  FROM tools t
  LEFT JOIN categories c ON c.id = t.category_id
`;

export async function getBySlug(slug, { activeOnly = true } = {}) {
  const { rows } = await query(
    `${SELECT_WITH_CAT} WHERE t.slug = $1 ${activeOnly ? 'AND t.is_active' : ''}`,
    [slug]
  );
  return rows[0] || null;
}

export async function getById(id) {
  const { rows } = await query(`${SELECT_WITH_CAT} WHERE t.id = $1`, [id]);
  return rows[0] || null;
}

export async function featured(limit = 8) {
  const { rows } = await query(
    `${SELECT_WITH_CAT} WHERE t.is_active AND t.is_featured
     ORDER BY t.click_count DESC, t.created_at DESC LIMIT $1`,
    [limit]
  );
  return rows;
}

export async function trending(limit = 8) {
  const { rows } = await query(
    `${SELECT_WITH_CAT} WHERE t.is_active
     ORDER BY t.click_count DESC, t.created_at DESC LIMIT $1`,
    [limit]
  );
  return rows;
}

export async function recent(limit = 8) {
  const { rows } = await query(
    `${SELECT_WITH_CAT} WHERE t.is_active ORDER BY t.created_at DESC LIMIT $1`,
    [limit]
  );
  return rows;
}

export async function byCategory(categoryId, { tag = null } = {}) {
  const params = [categoryId];
  let where = 'WHERE t.is_active AND t.category_id = $1';
  if (tag) {
    params.push(tag);
    where += ` AND $${params.length} = ANY(t.tags)`;
  }
  const { rows } = await query(
    `${SELECT_WITH_CAT} ${where} ORDER BY t.is_featured DESC, t.name`,
    params
  );
  return rows;
}

// Distinct tags used within a category (for the tag filter UI).
export async function tagsForCategory(categoryId) {
  const { rows } = await query(
    `SELECT DISTINCT unnest(tags) AS tag
     FROM tools WHERE is_active AND category_id = $1 ORDER BY tag`,
    [categoryId]
  );
  return rows.map((r) => r.tag);
}

// All active tools, newest first — used by the sitemap.
export async function allActive() {
  const { rows } = await query(
    `${SELECT_WITH_CAT} WHERE t.is_active ORDER BY t.updated_at DESC`
  );
  return rows;
}

// Atomically bump the click counter and return the destination URL.
export async function registerClick(slug) {
  const { rows } = await query(
    `UPDATE tools SET click_count = click_count + 1
     WHERE slug = $1 AND is_active RETURNING url`,
    [slug]
  );
  return rows[0]?.url || null;
}

// ── Admin ──
export async function listAll({ q = '', categoryId = null } = {}) {
  const params = [];
  const clauses = [];
  if (q) {
    params.push(`%${q}%`);
    clauses.push(`t.name ILIKE $${params.length}`);
  }
  if (categoryId) {
    params.push(categoryId);
    clauses.push(`t.category_id = $${params.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await query(
    `${SELECT_WITH_CAT} ${where} ORDER BY t.created_at DESC`,
    params
  );
  return rows;
}

export async function create(data) {
  const { rows } = await query(
    `INSERT INTO tools
       (name, slug, description, url, category_id, tags, icon_url, is_featured, is_active, source)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [
      data.name, data.slug, data.description || '', data.url,
      data.category_id || null, data.tags || [], data.icon_url || '',
      !!data.is_featured, data.is_active !== false, data.source || 'manual',
    ]
  );
  return rows[0];
}

export async function update(id, data) {
  const { rows } = await query(
    `UPDATE tools SET
       name = $2, slug = $3, description = $4, url = $5, category_id = $6,
       tags = $7, icon_url = $8, is_featured = $9, is_active = $10
     WHERE id = $1 RETURNING *`,
    [
      id, data.name, data.slug, data.description || '', data.url,
      data.category_id || null, data.tags || [], data.icon_url || '',
      !!data.is_featured, data.is_active !== false,
    ]
  );
  return rows[0];
}

export async function remove(id) {
  await query('DELETE FROM tools WHERE id = $1', [id]);
}

export async function slugExists(slug, exceptId = null) {
  const { rows } = await query(
    'SELECT 1 FROM tools WHERE slug = $1 AND ($2::int IS NULL OR id <> $2) LIMIT 1',
    [slug, exceptId]
  );
  return rows.length > 0;
}
