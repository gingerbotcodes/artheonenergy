import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const SITE_URL = 'https://artheonenergy.com';
const SITE_NAME = 'Artheon Energy';
const SITE_EMAIL = 'care@artheonenergy.com';
const SITE_PHONE = '+919916890049';
const SOLAR_IMAGE = `${SITE_URL}/seo/solar-energy-og.webp`;
const BATTERY_IMAGE = `${SITE_URL}/seo/battery-regeneration-og.webp`;
const DIST_DIR = resolve('dist');

const pages = [
  {
    path: '/',
    output: 'index.html',
    kind: 'home',
    title: 'Solar Installation & EV Charging | Artheon Energy',
    description:
      'Artheon Energy designs and installs solar power systems for homes, farms, commercial buildings and factories, with industrial EV charging across India.',
    image: SOLAR_IMAGE,
    imageAlt: 'Solar panel installation delivered by Artheon Energy',
  },
  {
    path: '/regeneration',
    output: 'regeneration.html',
    kind: 'regeneration',
    title: 'Battery Regeneration Services | Artheon Energy',
    description:
      'Extend useful lead-acid battery life with testing, sulphation diagnosis and controlled pulse desulphation from Artheon Energy.',
    image: BATTERY_IMAGE,
    imageAlt: 'Lead-acid battery regeneration and testing by Artheon Energy',
  },
  {
    path: '/blog',
    output: 'blog.html',
    kind: 'blog',
    title: 'Battery Regeneration Blog | Artheon Energy',
    description:
      'Practical guides to lead-acid battery sulphation, desulphation, maintenance, regeneration and replacement savings from Artheon Energy.',
    image: BATTERY_IMAGE,
    imageAlt: 'Battery testing and regeneration guidance from Artheon Energy',
  },
  {
    path: '/blog/how-battery-regeneration-works',
    output: 'blog/how-battery-regeneration-works.html',
    kind: 'article',
    title: 'How battery regeneration brings weak batteries back into service | Artheon Energy',
    description:
      'A simple explanation of sulfation, desulfation, and what recovery looks like without the heavy lab language.',
    image: BATTERY_IMAGE,
    imageAlt: 'Artheon Energy guide: How battery regeneration brings weak batteries back into service',
    article: {
      title: 'How battery regeneration brings weak batteries back into service',
      date: '2026-06-18',
      category: 'Regeneration',
    },
  },
  {
    path: '/blog/when-to-check-vrla-batteries',
    output: 'blog/when-to-check-vrla-batteries.html',
    kind: 'article',
    title: 'When should you check a VRLA battery bank? | Artheon Energy',
    description:
      'Early warning signs that a backup or fleet battery needs testing before it becomes a costly surprise.',
    image: BATTERY_IMAGE,
    imageAlt: 'Artheon Energy guide: When should you check a VRLA battery bank?',
    article: {
      title: 'When should you check a VRLA battery bank?',
      date: '2026-06-12',
      category: 'Maintenance',
    },
  },
  {
    path: '/blog/regeneration-vs-replacement-cost',
    output: 'blog/regeneration-vs-replacement-cost.html',
    kind: 'article',
    title: 'Regeneration vs replacement: where the savings come from | Artheon Energy',
    description:
      'A practical look at how battery recovery can reduce waste, downtime, and capital cost.',
    image: BATTERY_IMAGE,
    imageAlt: 'Artheon Energy guide: Regeneration vs replacement savings',
    article: {
      title: 'Regeneration vs replacement: where the savings come from',
      date: '2026-06-05',
      category: 'Savings',
    },
  },
  {
    path: '/terms',
    output: 'terms.html',
    kind: 'terms',
    title: 'Terms & Conditions | Artheon Energy',
    description:
      'Read the terms and conditions for using the Artheon Energy website and requesting solar, EV charging or battery regeneration services.',
    image: SOLAR_IMAGE,
    imageAlt: 'Artheon Energy solar installation',
  },
];

const escapeAttribute = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const upsertMeta = (html, attribute, key, content) => {
  const pattern = new RegExp(
    `<meta\\s+[^>]*${attribute}=["']${escapeRegExp(key)}["'][^>]*>`,
    'i',
  );
  const tag = `<meta ${attribute}="${key}" content="${escapeAttribute(content)}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `${tag}</head>`);
};

const removeMeta = (html, attribute, key) => {
  const pattern = new RegExp(
    `<meta\\s+[^>]*${attribute}=["']${escapeRegExp(key)}["'][^>]*>`,
    'gi',
  );
  return html.replace(pattern, '');
};

const getCanonical = (page) => `${SITE_URL}${page.path === '/' ? '/' : page.path}`;

const getBreadcrumbItems = (page) => {
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Solar', item: `${SITE_URL}/` },
  ];

  if (page.kind === 'article') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: `${SITE_URL}/blog`,
    });
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: page.article.title,
      item: getCanonical(page),
    });
    return items;
  }

  const labels = {
    regeneration: 'Battery Regeneration',
    blog: 'Blog',
    terms: 'Terms & Conditions',
  };
  items.push({
    '@type': 'ListItem',
    position: 2,
    name: labels[page.kind],
    item: getCanonical(page),
  });
  return items;
};

const getStructuredData = (page) => {
  const canonical = getCanonical(page);
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const webPageId = `${canonical}#webpage`;
  const breadcrumbId = `${canonical}#breadcrumb`;
  const graph = [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
        contentUrl: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      email: SITE_EMAIL,
      telephone: SITE_PHONE,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: SITE_EMAIL,
        telephone: SITE_PHONE,
        areaServed: 'IN',
      },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { '@id': organizationId },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'WebPage',
      '@id': webPageId,
      url: canonical,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      primaryImageOfPage: { '@type': 'ImageObject', url: page.image },
      ...(page.kind === 'home' ? {} : { breadcrumb: { '@id': breadcrumbId } }),
      inLanguage: 'en-IN',
    },
  ];

  if (page.kind !== 'home') {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: getBreadcrumbItems(page),
    });
  }

  if (page.kind === 'home') {
    graph.push({
      '@type': 'Service',
      '@id': `${SITE_URL}/#solar-service`,
      name: 'Solar EPC and EV Charging Infrastructure',
      description: page.description,
      provider: { '@id': organizationId },
      areaServed: { '@type': 'Country', name: 'India' },
      serviceType: [
        'Residential solar installation',
        'Agricultural solar installation',
        'Commercial solar installation',
        'Industrial solar installation',
        'EV charging infrastructure',
      ],
      url: `${SITE_URL}/`,
    });
  }

  if (page.kind === 'regeneration') {
    graph.push({
      '@type': 'Service',
      '@id': `${canonical}#battery-regeneration-service`,
      name: 'Lead-Acid Battery Regeneration',
      description: page.description,
      provider: { '@id': organizationId },
      areaServed: { '@type': 'Country', name: 'India' },
      serviceType: [
        'Battery testing',
        'Sulphation diagnosis',
        'Pulse desulphation',
        'Lead-acid battery regeneration',
      ],
      url: canonical,
    });
  }

  if (page.kind === 'blog') {
    graph.push({
      '@type': 'Blog',
      '@id': `${canonical}#blog`,
      url: canonical,
      name: page.title,
      description: page.description,
      publisher: { '@id': organizationId },
      inLanguage: 'en-IN',
    });
  }

  if (page.kind === 'article') {
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${canonical}#article`,
      headline: page.article.title,
      description: page.description,
      image: [page.image],
      datePublished: page.article.date,
      dateModified: page.article.date,
      articleSection: page.article.category,
      author: { '@id': organizationId },
      publisher: { '@id': organizationId },
      mainEntityOfPage: { '@id': webPageId },
      isPartOf: { '@id': `${SITE_URL}/blog#blog` },
      inLanguage: 'en-IN',
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
};

const renderPage = (template, page) => {
  const canonical = getCanonical(page);
  let html = template
    .replace(/<html\s+lang=["'][^"']*["']>/i, '<html lang="en-IN">')
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(page.title)}</title>`)
    .replace(
      /<link\s+[^>]*rel=["']canonical["'][^>]*>/i,
      `<link rel="canonical" href="${canonical}">`,
    );

  html = upsertMeta(html, 'name', 'description', page.description);
  html = upsertMeta(
    html,
    'name',
    'robots',
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  );
  html = upsertMeta(html, 'name', 'author', SITE_NAME);
  html = upsertMeta(html, 'property', 'og:type', page.kind === 'article' ? 'article' : 'website');
  html = upsertMeta(html, 'property', 'og:site_name', SITE_NAME);
  html = upsertMeta(html, 'property', 'og:locale', 'en_IN');
  html = upsertMeta(html, 'property', 'og:title', page.title);
  html = upsertMeta(html, 'property', 'og:description', page.description);
  html = upsertMeta(html, 'property', 'og:url', canonical);
  html = upsertMeta(html, 'property', 'og:image', page.image);
  html = upsertMeta(html, 'property', 'og:image:type', 'image/webp');
  html = upsertMeta(html, 'property', 'og:image:width', '1200');
  html = upsertMeta(html, 'property', 'og:image:height', '630');
  html = upsertMeta(html, 'property', 'og:image:alt', page.imageAlt);
  html = upsertMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = upsertMeta(html, 'name', 'twitter:title', page.title);
  html = upsertMeta(html, 'name', 'twitter:description', page.description);
  html = upsertMeta(html, 'name', 'twitter:image', page.image);
  html = upsertMeta(html, 'name', 'twitter:image:alt', page.imageAlt);

  for (const key of ['article:published_time', 'article:modified_time', 'article:section']) {
    html = removeMeta(html, 'property', key);
  }
  if (page.kind === 'article') {
    html = upsertMeta(html, 'property', 'article:published_time', page.article.date);
    html = upsertMeta(html, 'property', 'article:modified_time', page.article.date);
    html = upsertMeta(html, 'property', 'article:section', page.article.category);
  }

  const structuredData = JSON.stringify(getStructuredData(page)).replaceAll('<', '\\u003c');
  html = html.replace(
    /<script\s+[^>]*id=["']artheon-structured-data["'][^>]*>[\s\S]*?<\/script>/i,
    `<script id="artheon-structured-data" type="application/ld+json">${structuredData}</script>`,
  );

  return html;
};

const template = await readFile(resolve(DIST_DIR, 'index.html'), 'utf8');

for (const page of pages) {
  const outputPath = resolve(DIST_DIR, page.output);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderPage(template, page));
}

console.log(`Generated ${pages.length} SEO-ready route files.`);
