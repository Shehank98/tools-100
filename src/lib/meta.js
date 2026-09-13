import { config } from '../config/index.js';

const abs = (path = '') => `${config.siteUrl}${path}`;

// Build the meta object every page template expects.
export function buildMeta({ title, description, path = '', ogType = 'website', jsonLd = [], noindex = false }) {
  const full = title ? `${title} · ${config.siteName}` : `${config.siteName} — ${config.siteTagline}`;
  return {
    title: full,
    description: description || `${config.siteName} — a free, searchable directory of the best online tools.`,
    canonical: abs(path),
    ogType,
    jsonLd,
    noindex,
  };
}

// Site-wide WebSite schema (with search action) for the homepage.
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteName,
    url: abs('/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${abs('/search')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

// SoftwareApplication schema for a tool detail page.
export function toolJsonLd(tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: abs(`/tool/${tool.slug}`),
    applicationCategory: tool.category_name || 'Utility',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

// BreadcrumbList schema.
export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

// CollectionPage schema for a category listing.
export function collectionJsonLd(category, tools) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Tools`,
    description: category.description,
    url: abs(`/category/${category.slug}`),
    hasPart: tools.slice(0, 25).map((t) => ({
      '@type': 'SoftwareApplication',
      name: t.name,
      url: abs(`/tool/${t.slug}`),
      applicationCategory: category.name,
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    })),
  };
}
