-- ─────────────────────────────────────────────────────────────
-- 001_init: core schema for OneKitApp
-- ─────────────────────────────────────────────────────────────

-- Categories --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  icon        TEXT        NOT NULL DEFAULT '🧰',
  description TEXT        NOT NULL DEFAULT '',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tools -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tools (
  id          SERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  description TEXT        NOT NULL DEFAULT '',
  url         TEXT        NOT NULL,
  category_id INTEGER     REFERENCES categories(id) ON DELETE SET NULL,
  tags        TEXT[]      NOT NULL DEFAULT '{}',
  icon_url    TEXT        NOT NULL DEFAULT '',
  is_featured BOOLEAN     NOT NULL DEFAULT false,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  click_count INTEGER     NOT NULL DEFAULT 0,
  source      TEXT        NOT NULL DEFAULT 'manual'
                CHECK (source IN ('manual', 'auto')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Full-text search vector: weighted name > description > tags.
  -- Kept in sync by the trigger below (a generated column can't be used here
  -- because array_to_string is only STABLE, not IMMUTABLE).
  search_vector tsvector
);

-- Maintain the search vector on insert/update.
CREATE OR REPLACE FUNCTION tools_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(coalesce(NEW.tags, '{}'), ' ')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tools_search_vector_trg ON tools;
CREATE TRIGGER tools_search_vector_trg
  BEFORE INSERT OR UPDATE OF name, description, tags ON tools
  FOR EACH ROW EXECUTE FUNCTION tools_search_vector_update();

CREATE INDEX IF NOT EXISTS tools_search_idx    ON tools USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS tools_category_idx  ON tools (category_id);
CREATE INDEX IF NOT EXISTS tools_active_idx    ON tools (is_active);
CREATE INDEX IF NOT EXISTS tools_featured_idx  ON tools (is_featured);
CREATE INDEX IF NOT EXISTS tools_tags_idx      ON tools USING GIN (tags);

-- Tool submissions (review queue) -----------------------------------------
CREATE TABLE IF NOT EXISTS tool_submissions (
  id             SERIAL PRIMARY KEY,
  name           TEXT        NOT NULL,
  url            TEXT        NOT NULL,
  category_guess TEXT        NOT NULL DEFAULT '',
  description    TEXT        NOT NULL DEFAULT '',
  raw_data       JSONB       NOT NULL DEFAULT '{}'::jsonb,
  status         TEXT        NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'approved', 'rejected')),
  source         TEXT        NOT NULL DEFAULT 'user',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS submissions_status_idx ON tool_submissions (status);
-- Avoid queuing the same URL twice while still pending.
CREATE UNIQUE INDEX IF NOT EXISTS submissions_pending_url_idx
  ON tool_submissions (url) WHERE status = 'pending';

-- Admin users -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Search logs (what people looked for) ------------------------------------
CREATE TABLE IF NOT EXISTS search_logs (
  id            SERIAL PRIMARY KEY,
  query         TEXT        NOT NULL,
  results_count INTEGER     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS search_logs_created_idx ON search_logs (created_at);

-- Session store (used by connect-pg-simple) -------------------------------
CREATE TABLE IF NOT EXISTS session (
  sid    VARCHAR      NOT NULL COLLATE "default",
  sess   JSON         NOT NULL,
  expire TIMESTAMP(6) NOT NULL,
  CONSTRAINT session_pkey PRIMARY KEY (sid)
);
CREATE INDEX IF NOT EXISTS session_expire_idx ON session (expire);
