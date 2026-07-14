export const SITE_URL = 'https://artheonenergy.com';
export const SITE_NAME = 'Artheon Energy';
export const SITE_EMAIL = 'care@artheonenergy.com';
export const SITE_PHONE = '+919916890049';

const SOLAR_SOCIAL_IMAGE = `${SITE_URL}/seo/solar-energy-og.webp`;
const BATTERY_SOCIAL_IMAGE = `${SITE_URL}/seo/battery-regeneration-og.webp`;

export type SeoArticle = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
};

export type SeoPage = {
  canonical: string;
  description: string;
  image: string;
  imageAlt: string;
  indexable: boolean;
  kind: 'home' | 'regeneration' | 'blog' | 'article' | 'terms' | 'not-found';
  path: string;
  title: string;
  article?: SeoArticle;
};

const normalizePath = (path: string) => {
  if (!path || path === '/') return '/';
  return path.endsWith('/') ? path.slice(0, -1) : path;
};

export const getSeoPage = (path: string, article?: SeoArticle): SeoPage => {
  const normalizedPath = normalizePath(path);
  const basePage = {
    canonical: `${SITE_URL}${normalizedPath === '/' ? '/' : normalizedPath}`,
    indexable: true,
    path: normalizedPath,
  };

  if (normalizedPath === '/') {
    return {
      ...basePage,
      title: 'Solar Installation & EV Charging | Artheon Energy',
      description:
        'Artheon Energy designs and installs solar power systems for homes, farms, commercial buildings and factories, with industrial EV charging across India.',
      image: SOLAR_SOCIAL_IMAGE,
      imageAlt: 'Solar panel installation delivered by Artheon Energy',
      kind: 'home',
    };
  }

  if (normalizedPath === '/regeneration') {
    return {
      ...basePage,
      title: 'Battery Regeneration Services | Artheon Energy',
      description:
        'Extend useful lead-acid battery life with testing, sulphation diagnosis and controlled pulse desulphation from Artheon Energy.',
      image: BATTERY_SOCIAL_IMAGE,
      imageAlt: 'Lead-acid battery regeneration and testing by Artheon Energy',
      kind: 'regeneration',
    };
  }

  if (normalizedPath === '/blog') {
    return {
      ...basePage,
      title: 'Battery Regeneration Blog | Artheon Energy',
      description:
        'Practical guides to lead-acid battery sulphation, desulphation, maintenance, regeneration and replacement savings from Artheon Energy.',
      image: BATTERY_SOCIAL_IMAGE,
      imageAlt: 'Battery testing and regeneration guidance from Artheon Energy',
      kind: 'blog',
    };
  }

  if (normalizedPath === '/terms') {
    return {
      ...basePage,
      title: 'Terms & Conditions | Artheon Energy',
      description:
        'Read the terms and conditions for using the Artheon Energy website and requesting solar, EV charging or battery regeneration services.',
      image: SOLAR_SOCIAL_IMAGE,
      imageAlt: 'Artheon Energy solar installation',
      kind: 'terms',
    };
  }

  if (normalizedPath.startsWith('/blog/') && article) {
    return {
      ...basePage,
      title: `${article.title} | Artheon Energy`,
      description: article.excerpt,
      image: BATTERY_SOCIAL_IMAGE,
      imageAlt: `Artheon Energy guide: ${article.title}`,
      kind: 'article',
      article,
    };
  }

  return {
    ...basePage,
    title: 'Page Not Found | Artheon Energy',
    description: 'The requested Artheon Energy page could not be found.',
    image: SOLAR_SOCIAL_IMAGE,
    imageAlt: 'Artheon Energy',
    indexable: false,
    kind: 'not-found',
  };
};

const getBreadcrumbItems = (page: SeoPage) => {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Solar',
      item: `${SITE_URL}/`,
    },
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
      name: page.article?.title ?? 'Article',
      item: page.canonical,
    });
    return items;
  }

  const labels: Partial<Record<SeoPage['kind'], string>> = {
    regeneration: 'Battery Regeneration',
    blog: 'Blog',
    terms: 'Terms & Conditions',
  };

  const label = labels[page.kind];
  if (label) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: label,
      item: page.canonical,
    });
  }

  return items;
};

export const getStructuredData = (page: SeoPage) => {
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const webPageId = `${page.canonical}#webpage`;
  const breadcrumbId = `${page.canonical}#breadcrumb`;
  const graph: Array<Record<string, unknown>> = [
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
      url: page.canonical,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: page.image,
      },
      breadcrumb: page.kind === 'home' ? undefined : { '@id': breadcrumbId },
      inLanguage: 'en-IN',
    },
  ];

  if (page.kind !== 'home' && page.kind !== 'not-found') {
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
      '@id': `${page.canonical}#battery-regeneration-service`,
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
      url: page.canonical,
    });
  }

  if (page.kind === 'blog') {
    graph.push({
      '@type': 'Blog',
      '@id': `${page.canonical}#blog`,
      url: page.canonical,
      name: page.title,
      description: page.description,
      publisher: { '@id': organizationId },
      inLanguage: 'en-IN',
    });
  }

  if (page.kind === 'article' && page.article) {
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${page.canonical}#article`,
      headline: page.article.title,
      description: page.article.excerpt,
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

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
};

const upsertMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
};

const removeMeta = (attribute: 'name' | 'property', key: string) => {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();
};

export const applySeoMetadata = (page: SeoPage) => {
  document.documentElement.lang = 'en-IN';
  document.title = page.title;

  upsertMeta('name', 'description', page.description);
  upsertMeta(
    'name',
    'robots',
    page.indexable
      ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      : 'noindex, nofollow',
  );
  upsertMeta('name', 'author', SITE_NAME);

  upsertMeta('property', 'og:type', page.kind === 'article' ? 'article' : 'website');
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:locale', 'en_IN');
  upsertMeta('property', 'og:title', page.title);
  upsertMeta('property', 'og:description', page.description);
  upsertMeta('property', 'og:url', page.canonical);
  upsertMeta('property', 'og:image', page.image);
  upsertMeta('property', 'og:image:type', 'image/webp');
  upsertMeta('property', 'og:image:width', '1200');
  upsertMeta('property', 'og:image:height', '630');
  upsertMeta('property', 'og:image:alt', page.imageAlt);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', page.title);
  upsertMeta('name', 'twitter:description', page.description);
  upsertMeta('name', 'twitter:image', page.image);
  upsertMeta('name', 'twitter:image:alt', page.imageAlt);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.append(canonical);
  }
  canonical.href = page.canonical;

  if (page.kind === 'article' && page.article) {
    upsertMeta('property', 'article:published_time', page.article.date);
    upsertMeta('property', 'article:modified_time', page.article.date);
    upsertMeta('property', 'article:section', page.article.category);
  } else {
    removeMeta('property', 'article:published_time');
    removeMeta('property', 'article:modified_time');
    removeMeta('property', 'article:section');
  }

  let structuredData = document.head.querySelector<HTMLScriptElement>('#artheon-structured-data');
  if (!structuredData) {
    structuredData = document.createElement('script');
    structuredData.id = 'artheon-structured-data';
    structuredData.type = 'application/ld+json';
    document.head.append(structuredData);
  }
  structuredData.textContent = JSON.stringify(getStructuredData(page));
};
