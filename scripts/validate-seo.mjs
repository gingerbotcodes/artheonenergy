import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SITE_URL = 'https://artheonenergy.com';
const routes = [
  ['index.html', `${SITE_URL}/`],
  ['regeneration.html', `${SITE_URL}/regeneration`],
  ['blog.html', `${SITE_URL}/blog`],
  ['blog/how-battery-regeneration-works.html', `${SITE_URL}/blog/how-battery-regeneration-works`],
  ['blog/when-to-check-vrla-batteries.html', `${SITE_URL}/blog/when-to-check-vrla-batteries`],
  ['blog/regeneration-vs-replacement-cost.html', `${SITE_URL}/blog/regeneration-vs-replacement-cost`],
  ['terms.html', `${SITE_URL}/terms`],
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getTag = (html, expression, label) => {
  const match = html.match(expression);
  if (!match) throw new Error(`Missing ${label}`);
  return match[0];
};

const getAttribute = (tag, attribute, label) => {
  const match = tag.match(new RegExp(`${attribute}=["']([^"']+)["']`, 'i'));
  if (!match) throw new Error(`Missing ${attribute} on ${label}`);
  return match[1];
};

const getMeta = (html, attribute, key) => {
  const tag = getTag(
    html,
    new RegExp(`<meta\\s+[^>]*${attribute}=["']${escapeRegExp(key)}["'][^>]*>`, 'i'),
    `${attribute}=${key}`,
  );
  return getAttribute(tag, 'content', `${attribute}=${key}`);
};

const titles = new Set();
const canonicals = new Set();
const sitemap = await readFile(resolve('dist/sitemap.xml'), 'utf8');
const robots = await readFile(resolve('dist/robots.txt'), 'utf8');

if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) {
  throw new Error('robots.txt does not reference the canonical sitemap URL');
}

for (const [file, expectedCanonical] of routes) {
  const html = await readFile(resolve('dist', file), 'utf8');
  const title = getTag(html, /<title>[\s\S]*?<\/title>/i, 'title')
    .replace(/<\/?title>/gi, '')
    .trim();
  const description = getMeta(html, 'name', 'description');
  const robotsDirective = getMeta(html, 'name', 'robots');
  const openGraphUrl = getMeta(html, 'property', 'og:url');
  const openGraphImage = getMeta(html, 'property', 'og:image');
  const canonicalTag = getTag(
    html,
    /<link\s+[^>]*rel=["']canonical["'][^>]*>/i,
    'canonical link',
  );
  const canonical = getAttribute(canonicalTag, 'href', 'canonical link');
  const structuredTag = getTag(
    html,
    /<script\s+[^>]*id=["']artheon-structured-data["'][^>]*>[\s\S]*?<\/script>/i,
    'structured data',
  );
  const structuredData = JSON.parse(
    structuredTag.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, ''),
  );

  if (canonical !== expectedCanonical || openGraphUrl !== expectedCanonical) {
    throw new Error(`${file} has an incorrect canonical or og:url`);
  }
  if (!description || !robotsDirective.startsWith('index, follow')) {
    throw new Error(`${file} is missing an indexable description or robots directive`);
  }
  if (!Array.isArray(structuredData['@graph']) || structuredData['@graph'].length < 3) {
    throw new Error(`${file} has incomplete JSON-LD`);
  }
  if (titles.has(title) || canonicals.has(canonical)) {
    throw new Error(`${file} duplicates a title or canonical URL`);
  }
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) {
    throw new Error(`${file} is missing from sitemap.xml`);
  }

  const imagePath = new URL(openGraphImage).pathname.replace(/^\//, '');
  await access(resolve('dist', imagePath));
  titles.add(title);
  canonicals.add(canonical);
}

console.log(`Validated SEO metadata for ${routes.length} indexable routes.`);
