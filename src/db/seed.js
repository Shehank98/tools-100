// Idempotent seed: categories, tools, and the initial admin user.
// Safe to run repeatedly (ON CONFLICT upserts by slug/email).
import bcrypt from 'bcryptjs';
import { pool } from './pool.js';
import { config } from '../config/index.js';
import { slugify } from '../lib/slugify.js';
import { categories, tools } from './seed-data.js';

export async function seed() {
  // ── Categories ──
  const catIdBySlug = new Map();
  for (const c of categories) {
    const slug = slugify(c.name);
    const { rows } = await pool.query(
      `INSERT INTO categories (name, slug, icon, description, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (slug) DO UPDATE
         SET name = EXCLUDED.name,
             icon = EXCLUDED.icon,
             description = EXCLUDED.description,
             sort_order = EXCLUDED.sort_order
       RETURNING id`,
      [c.name, slug, c.icon || '', c.description, c.sort_order]
    );
    catIdBySlug.set(c.name, rows[0].id);
  }
  console.log(`[seed] ${categories.length} categories upserted`);

  // ── Tools ──
  let toolCount = 0;
  for (const t of tools) {
    const slug = slugify(t.name);
    const categoryId = catIdBySlug.get(t.category) || null;
    await pool.query(
      `INSERT INTO tools (name, slug, description, url, category_id, tags, is_featured, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'manual')
       ON CONFLICT (slug) DO UPDATE
         SET name = EXCLUDED.name,
             description = EXCLUDED.description,
             url = EXCLUDED.url,
             category_id = EXCLUDED.category_id,
             tags = EXCLUDED.tags,
             is_featured = EXCLUDED.is_featured`,
      [t.name, slug, t.description, t.url, categoryId, t.tags || [], !!t.featured]
    );
    toolCount++;
  }
  console.log(`[seed] ${toolCount} tools upserted`);

  // ── Admin user ──
  const { email, password, passwordHash } = config.admin;
  let hash = passwordHash;
  if (!hash && password) {
    hash = await bcrypt.hash(password, 10);
  }
  if (email && hash) {
    await pool.query(
      `INSERT INTO admin_users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [email.toLowerCase(), hash]
    );
    console.log(`[seed] admin user ready: ${email}`);
  } else {
    console.warn('[seed] no ADMIN_PASSWORD or ADMIN_PASSWORD_HASH set — skipping admin user');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => pool.end())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[seed] failed:', err);
      process.exit(1);
    });
}
