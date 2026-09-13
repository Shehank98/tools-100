-- ─────────────────────────────────────────────────────────────
-- 003_no_category_icons: drop the emoji icon default (icon-free UI)
-- ─────────────────────────────────────────────────────────────

ALTER TABLE categories ALTER COLUMN icon SET DEFAULT '';
UPDATE categories SET icon = '' WHERE icon = '🧰';
