import dotenv from 'dotenv';

dotenv.config();

const bool = (v, def = false) =>
  v === undefined ? def : ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  pgSsl: bool(process.env.PGSSL, false),
  sessionSecret: process.env.SESSION_SECRET || 'dev-insecure-secret-change-me',
  siteUrl: (process.env.SITE_URL || 'https://www.onekitapp.com').replace(/\/$/, ''),
  siteName: 'OneKitApp',
  siteTagline: 'Every online tool, in one place.',
  adsenseClient: process.env.ADSENSE_CLIENT || '',
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@onekitapp.com',
    password: process.env.ADMIN_PASSWORD || '',
    passwordHash: process.env.ADMIN_PASSWORD_HASH || '',
  },
  discovery: {
    enabled: bool(process.env.DISCOVERY_ENABLED, false),
    cron: process.env.DISCOVERY_CRON || '0 7 * * *',
  },
};

export const isProd = config.env === 'production';
