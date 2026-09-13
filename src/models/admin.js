import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';

export async function findByEmail(email) {
  const { rows } = await query('SELECT * FROM admin_users WHERE email = $1', [
    String(email || '').toLowerCase(),
  ]);
  return rows[0] || null;
}

// Verify a login. Returns the admin row on success, null otherwise.
export async function verify(email, password) {
  const admin = await findByEmail(email);
  if (!admin) return null;
  const ok = await bcrypt.compare(password || '', admin.password_hash);
  return ok ? admin : null;
}
