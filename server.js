import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import cookieParser from 'cookie-parser';

import { config, isProd } from './src/config/index.js';
import { pool, query } from './src/db/pool.js';
import { runMigrations } from './src/db/migrate.js';
import { seed } from './src/db/seed.js';
import { adminLocals } from './src/middleware/auth.js';
import { scheduleDiscovery } from './src/services/discovery.js';

import publicRoutes from './src/routes/public.js';
import apiRoutes from './src/routes/api.js';
import adminRoutes from './src/routes/admin.js';
import seoRoutes from './src/routes/seo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Behind Railway's proxy — trust it so secure cookies + protocol work.
app.set('trust proxy', 1);

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Template globals available to every render.
app.locals.siteName = config.siteName;
app.locals.siteTagline = config.siteTagline;
app.locals.siteUrl = config.siteUrl;
app.locals.adsenseClient = config.adsenseClient;
app.locals.year = new Date().getFullYear();
// Cache-busting token for static assets (css/js). Changes on every deploy so
// browsers never serve a stale stylesheet. Uses the Railway commit sha when
// available, otherwise the boot time.
app.locals.assetVersion =
  (process.env.RAILWAY_GIT_COMMIT_SHA || '').slice(0, 8) || String(Date.now());

// Static assets (cached in production).
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: isProd ? '7d' : 0,
  extensions: ['html'],
}));

// Parsers
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Sessions (stored in Postgres)
const PgStore = connectPgSimple(session);
app.use(session({
  store: new PgStore({ pool, tableName: 'session', createTableIfMissing: false }),
  name: 'onekit.sid',
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}));

app.use(adminLocals);

// Routes
app.use('/', seoRoutes); // sitemap.xml, robots.txt, ads.txt
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

// Health check for the platform.
app.get('/healthz', (req, res) => res.json({ ok: true }));

// ── 404 ──
app.use((req, res) => {
  res.status(404).render('error', {
    nav: '', meta: { title: `Not found · ${config.siteName}`, description: '', canonical: config.siteUrl + req.originalUrl, noindex: true, jsonLd: [] },
    status: 404, message: "We couldn't find that page. It may have moved or never existed.",
  });
});

// ── Error handler ──
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[error]', err.stack || err);
  const status = err.status || 500;
  res.status(status).render('error', {
    nav: '', meta: { title: `Error · ${config.siteName}`, description: '', canonical: config.siteUrl, noindex: true, jsonLd: [] },
    status, message: isProd ? 'Something went wrong on our end. Please try again.' : String(err.message || err),
  });
});

async function start() {
  if (process.env.SKIP_MIGRATIONS !== 'true') {
    try {
      await runMigrations();
    } catch (err) {
      console.error('[startup] migrations failed:', err.message);
      // Don't crash the whole app if the DB is briefly unavailable at boot.
    }
  }

  // Auto-seed: populate the catalog when the tools table is empty (first
  // deploy), or when RESEED_ON_BOOT is set. No manual `npm run seed` needed.
  if (config.autoSeed) {
    try {
      const { rows } = await query('SELECT COUNT(*)::int AS n FROM tools');
      const isEmpty = rows[0].n === 0;
      if (isEmpty || config.reseedOnBoot) {
        console.log(`[startup] auto-seeding catalog (${isEmpty ? 'empty database' : 'RESEED_ON_BOOT'})...`);
        await seed();
      } else {
        console.log(`[startup] catalog already has ${rows[0].n} tools, skipping auto-seed`);
      }
    } catch (err) {
      console.error('[startup] auto-seed failed:', err.message);
    }
  }

  scheduleDiscovery();

  app.listen(config.port, () => {
    console.log(`\n  ${config.siteName} running on http://localhost:${config.port}`);
    console.log(`  Admin:  http://localhost:${config.port}/admin`);
    console.log(`  Env:    ${config.env}\n`);
  });
}

start();

export default app;
