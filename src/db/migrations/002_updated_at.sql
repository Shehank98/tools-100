-- ─────────────────────────────────────────────────────────────
-- 002_updated_at: keep tools.updated_at fresh on every UPDATE
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tools_set_updated_at ON tools;
CREATE TRIGGER tools_set_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
