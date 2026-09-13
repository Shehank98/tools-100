# OneKitApp - Universal Online Tools Hub

A fast, SEO-first **directory / launcher** for online tools (PDF → JPG, image
compressors, unit converters, text tools, calculators, and more). Tools are
**links** - grouped into categories, searchable, click-tracked, and ready for
Google AdSense. This is v1: a directory + launcher, not a tool engine.

**Stack:** Node.js + Express · EJS server-rendered HTML (great for SEO) ·
PostgreSQL (full-text search via `tsvector`) · vanilla CSS/JS (no framework).

---

## What's inside

**Public site**
- Homepage: hero + search, then a full directory of every category with all
  its tool links (iLovePDF-style), plus a sticky category quick-nav
- Category pages with tag filtering - clean URLs like `/category/pdf-tools`
- Tool pages - `/tool/pdf-to-jpg-converter` - with Schema.org structured data
- **Live search** (debounced, `/api/search`) backed by Postgres full-text search
- **Click tracking**: `/go/:slug` increments `click_count`, then redirects
- SEO layer: per-page `<title>`/meta, canonical + Open Graph, auto `sitemap.xml`,
  `robots.txt`, `ads.txt`, JSON-LD (WebSite, SoftwareApplication, Breadcrumb)
- Ad slots (header banner, in-feed, sidebar) - placeholders until AdSense is live
- Privacy / cookie / terms page + GDPR cookie-consent banner
- "Submit a tool" form → review queue

**Admin panel** (`/admin`, session login, bcrypt)
- Dashboard: totals, top-clicked tools, pending count, missed searches
- Tool CRUD, Category CRUD
- **Bulk CSV import**
- **Review queue**: approve a submission → live tool, or reject

**Auto-discovery (Option A + B)**
- `node-cron` job gathers candidates (curated list + optional RSS feeds) into the
  review queue as `pending` - nothing is auto-published (Option C stays off)
- Public submission form is Option B

---

## Quick start (local)

Requires **Node 20+** and **PostgreSQL 12+**.

```bash
# 1. install
npm install

# 2. configure
cp .env.example .env
#    → set DATABASE_URL, SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# 3. run (migrations + catalog seed happen automatically on first boot)
npm run dev            # or: npm start
```

Open <http://localhost:3000>, admin at <http://localhost:3000/admin>.

> **No manual seed step needed.** On boot the app runs migrations, then, if
> the `tools` table is empty, auto-loads the built-in catalog (15 categories,
> 140+ real tools, admin user). Set `AUTO_SEED=false` to disable, or
> `RESEED_ON_BOOT=true` for one boot to re-import the catalog after you edit
> it. `SKIP_MIGRATIONS=true` disables the boot migrations. You can still run
> `npm run migrate` / `npm run seed` manually if you prefer.

---

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Railway provides this) |
| `PGSSL` | `true` for managed Postgres requiring SSL |
| `PORT` | Web server port (Railway injects it) |
| `SESSION_SECRET` | Signs session cookies - use a long random string |
| `SITE_URL` | Public base URL (for canonical, sitemap, JSON-LD) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin login (or `ADMIN_PASSWORD_HASH`) |
| `ADSENSE_CLIENT` | AdSense id `ca-pub-…` - blank = ad placeholders |
| `DISCOVERY_ENABLED` | `true` to run the discovery cron |
| `DISCOVERY_CRON` | Cron schedule, UTC (default `0 7 * * *`) |
| `DISCOVERY_FEEDS` | Optional comma-separated RSS/Atom feed URLs |

---

## Deploy to Railway

1. Create a Railway project → **Add PostgreSQL** plugin (sets `DATABASE_URL`).
2. Deploy this repo as a web service (Nixpacks auto-detects Node; see
   `railway.json`). Health check: `/healthz`.
3. Add service variables: `SESSION_SECRET`, `SITE_URL`, `ADMIN_EMAIL`,
   `ADMIN_PASSWORD`, `PGSSL=true` (if needed), and `ADSENSE_CLIENT` once approved.
4. That's it for data: on first boot the app auto-loads the catalog (15
   categories, 140+ tools). No `railway run npm run seed` needed. To refresh
   the catalog later after editing `seed-data.js`, set `RESEED_ON_BOOT=true`,
   redeploy once, then set it back to `false`.
5. Point the custom domain **www.onekitapp.com** at the Railway service in the
   Railway dashboard (Settings → Domains). *(The `CNAME` file in this repo is a
   leftover from GitHub Pages hosting; the domain is now configured in Railway.)*

Schema migrations apply automatically on every deploy at boot.

---

## Bulk CSV import

Admin → **Import**. Header row required. Columns:

- `name`, `url` - **required**
- `description`, `category` (name or slug), `tags` (comma/semicolon separated),
  `featured` (`true`/`false`) - optional

A ready example lives at [`docs/sample-tools.csv`](docs/sample-tools.csv).

---

## AdSense checklist (do these before applying)

Ad slots are already built into the layout (never directly above the search bar
or nav, per policy). Before you apply:

1. Have real content live (this seed ships 140+ real tools + working search).
2. Add your publisher id to `ADSENSE_CLIENT` - this activates the slots and
   generates `ads.txt` automatically.
3. Privacy policy + cookie consent banner are already included.
4. Keep Core Web Vitals healthy: ad script loads `async` + deferred, images are
   lazy-loaded, no framework bloat.

---

## Database schema

`categories`, `tools` (with a trigger-maintained `search_vector tsvector` +
GIN index), `tool_submissions` (review queue), `admin_users`, `search_logs`,
and a `session` store. See [`src/db/migrations`](src/db/migrations).

## Project layout

```
server.js                 app entry (Express, sessions, routes, error handling)
src/
  config/                 env config
  db/                     pool, migrations, migrate + seed runners, seed data
  lib/                    slugify, meta/JSON-LD helpers
  middleware/             admin auth
  models/                 data access (tools, categories, search, submissions…)
  routes/                 public, api, admin, seo
  services/               discovery cron
  views/                  EJS templates (public + admin)
public/                   css, js, static assets
```

---

Built to rank for long-tail "[tool] free online" searches and grow with the
directory. PRs and tool suggestions welcome.
