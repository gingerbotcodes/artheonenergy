import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
} from 'react';

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
};

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = 'd562401f-b04b-458d-b550-b9f5622c836a';
const STAGE_DURATION_MS = 4000;

const BATTERY_STAGES = [
  {
    key: 'new',
    label: 'New Battery',
    status: 'Fresh start',
    image: '/battery-sequence/stage-1-new.png',
    alt: 'New closed inverter battery before internal inspection',
    detail: 'A fresh battery starts with a clean structure and stable power delivery.',
  },
  {
    key: 'aging',
    label: 'Sulphated Battery',
    status: 'Blocked plates',
    image: '/battery-sequence/stage-2-sulphated.png',
    alt: 'Battery with sulphated internal plates',
    detail: 'Over time, white sulphate deposits build up on the lead plates and reduce useful battery capacity.',
  },
  {
    key: 'testing',
    label: 'Expert Testing',
    status: 'Diagnostics',
    image: '/battery-sequence/stage-3-testing.png',
    alt: 'Trained expert running voltage, life, resistance, and load tests on a battery',
    detail: 'Before regeneration, trained experts check voltage, life, resistance, and load response so the battery condition is clear.',
  },
  {
    key: 'pulse',
    label: 'Pulse Desulphation',
    status: 'Pulse active',
    image: '/battery-sequence/stage-3-pulse-desulphation.png',
    alt: 'Battery connected to pulse regeneration machine during desulphation',
    detail: 'Advanced pulse wave modulation sends controlled energy waves that help break down sulphate buildup.',
  },
  {
    key: 'restored',
    label: 'Fresh Lead Cells',
    status: 'Recovered',
    image: '/battery-sequence/stage-4-restored.png',
    alt: 'Desulphated battery with clean fresh-looking lead cells',
    detail: 'As the buildup clears, the lead cells look cleaner and the battery can return to stronger working condition.',
  },
] as const;

const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-battery-regeneration-works',
    title: 'How battery regeneration brings weak batteries back into service',
    excerpt:
      'A simple explanation of sulfation, desulfation, and what recovery looks like without the heavy lab language.',
    date: '2026-06-18',
    category: 'Regeneration',
    readTime: '4 min read',
    sections: [
      {
        heading: 'The short version',
        paragraphs: [
          'Lead-acid batteries often lose useful capacity because sulfate builds up on the plates. That buildup blocks the battery from storing and releasing energy properly.',
          'Regeneration uses controlled electrical pulses and charging cycles to help reduce that buildup. The goal is simple: recover useful battery life before replacement becomes the only option.',
        ],
      },
      {
        heading: 'What changes during recovery',
        paragraphs: [
          'A healthy battery accepts charge more cleanly, holds it longer, and delivers steadier power under load. A regenerated battery should be tested before and after treatment so the improvement is visible.',
        ],
        bullets: [
          'Improved charge acceptance',
          'Better usable runtime',
          'Lower replacement pressure',
        ],
      },
    ],
  },
  {
    slug: 'when-to-check-vrla-batteries',
    title: 'When should you check a VRLA battery bank?',
    excerpt:
      'Early warning signs that a backup or fleet battery needs testing before it becomes a costly surprise.',
    date: '2026-06-12',
    category: 'Maintenance',
    readTime: '3 min read',
    sections: [
      {
        heading: 'Do not wait for complete failure',
        paragraphs: [
          'A battery bank usually gives hints before it fails. Shorter backup time, slower charging, heating, or uneven voltage readings are all signs worth checking.',
          'A quick inspection can help decide whether the battery can be regenerated or should be replaced.',
        ],
      },
      {
        heading: 'Simple checkup rhythm',
        paragraphs: [
          'For active business use, a quarterly check is a practical baseline. For high-load sites, monthly condition tracking gives better protection.',
        ],
        bullets: [
          'Check runtime trends',
          'Compare batteries in the same bank',
          'Record charging behavior after every service cycle',
        ],
      },
    ],
  },
  {
    slug: 'regeneration-vs-replacement-cost',
    title: 'Regeneration vs replacement: where the savings come from',
    excerpt:
      'A practical look at how battery recovery can reduce waste, downtime, and capital cost.',
    date: '2026-06-05',
    category: 'Savings',
    readTime: '5 min read',
    sections: [
      {
        heading: 'Replacement is not always the first move',
        paragraphs: [
          'If a battery is physically damaged, replacement is usually the right call. But if the main issue is capacity loss from sulfation, regeneration may recover enough performance to extend service life.',
        ],
      },
      {
        heading: 'Where value appears',
        paragraphs: [
          'The savings are not only from buying fewer batteries. You also reduce disposal frequency, downtime, and the operational friction of changing batteries too early.',
        ],
        bullets: [
          'Lower replacement spend',
          'Less battery waste',
          'More predictable uptime',
        ],
      },
    ],
  },
];

const TERMS_SECTIONS = [
  {
    title: 'Acceptance of Terms',
    body:
      'By using this website or requesting an Artheon Energy service, you agree to these terms and any service-specific conditions shared with you before work begins.',
  },
  {
    title: 'User Responsibilities',
    body:
      'You agree to provide accurate contact details, battery information, site access details, and any safety information needed to evaluate or service your batteries.',
  },
  {
    title: 'Intellectual Property',
    body:
      'The website content, visuals, brand assets, and technical presentation belong to Artheon Energy or its licensors and may not be copied or reused without written permission.',
  },
  {
    title: 'Disclaimers',
    body:
      'Battery regeneration results depend on battery age, condition, damage, chemistry, and usage history. We do not guarantee recovery for every battery submitted for inspection.',
  },
  {
    title: 'Limitations of Liability',
    body:
      'To the maximum extent permitted by law, Artheon Energy is not liable for indirect, incidental, or consequential losses related to website use or service decisions.',
  },
  {
    title: 'Governing Law',
    body:
      'These terms are governed by the laws of India, and any disputes will be handled under the jurisdiction agreed in the final service documentation.',
  },
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const getPath = () => window.location.pathname;

const scrollToHash = (hash: string) => {
  if (!hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const target = document.querySelector(hash);
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const useRoute = () => {
  const [path, setPath] = useState(() => getPath());

  useEffect(() => {
    const syncPath = () => setPath(getPath());
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  const navigate = (href: string) => {
    const url = new URL(href, window.location.origin);
    window.history.pushState(null, '', `${url.pathname}${url.hash}`);
    setPath(url.pathname);
    requestAnimationFrame(() => scrollToHash(url.hash));
  };

  return { path, navigate };
};

const App = () => {
  const { path, navigate } = useRoute();

  useEffect(() => {
    const pageTitle =
      path === '/blog'
        ? 'Blog | Artheon Energy'
        : path === '/terms'
          ? 'Terms & Conditions | Artheon Energy'
          : path.startsWith('/blog/')
            ? 'Article | Artheon Energy'
            : 'Artheon Energy | Battery Regeneration';
    document.title = pageTitle;
  }, [path]);

  const page = (() => {
    if (path === '/blog') return <BlogPage navigate={navigate} />;
    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      return <BlogPostPage slug={slug} navigate={navigate} />;
    }
    if (path === '/terms') return <TermsPage navigate={navigate} />;
    return <HomePage navigate={navigate} />;
  })();

  return (
    <div className="site-shell">
      <SiteHeader navigate={navigate} />
      {page}
      <SiteFooter navigate={navigate} />
    </div>
  );
};

const SiteHeader = ({ navigate }: { navigate: (href: string) => void }) => {
  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    navigate(href);
  };

  return (
    <header className="site-header">
      <a className="brand-mark" href="/" onClick={(event) => onLinkClick(event, '/')}>
        <img src="/logo.svg" alt="Artheon Energy" />
        <span>Artheon Energy</span>
      </a>

      <nav className="site-nav" aria-label="Primary navigation">
        <a href="/" onClick={(event) => onLinkClick(event, '/')}>Home</a>
        <a href="/blog" onClick={(event) => onLinkClick(event, '/blog')}>Blog</a>
        <a href="/terms" onClick={(event) => onLinkClick(event, '/terms')}>Terms</a>
      </nav>

      <a className="header-cta" href="/#contact" onClick={(event) => onLinkClick(event, '/#contact')}>
        Book Checkup
      </a>
    </header>
  );
};

const HomePage = ({ navigate }: { navigate: (href: string) => void }) => (
  <main>
    <HeroSection navigate={navigate} />
    <ProcessSection />
    <ValueSection />
    <ContactSection />
  </main>
);

const HeroSection = ({ navigate }: { navigate: (href: string) => void }) => (
  <section className="hero-section">
    <div className="hero-grid" aria-hidden="true" />
    <div className="hero-content">
      <div className="hero-copy">
        <p className="eyebrow">Battery regeneration specialists</p>
        <h1>Artheon Energy</h1>
        <p className="hero-lede">
          Recover battery life, reduce waste, and keep your backup or fleet systems moving
          with a cleaner regeneration process.
        </p>
        <div className="hero-actions">
          <button className="primary-action" type="button" onClick={() => navigate('/#contact')}>
            Book Checkup
          </button>
          <button className="ghost-action" type="button" onClick={() => navigate('/blog')}>
            Read Articles
          </button>
        </div>
      </div>

      <InteractiveBattery />
    </div>
  </section>
);

const InteractiveBattery = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = BATTERY_STAGES[activeStageIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveStageIndex((currentIndex) => (currentIndex + 1) % BATTERY_STAGES.length);
    }, STAGE_DURATION_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const batteryStyle = {
    '--stage-duration': `${STAGE_DURATION_MS}ms`,
  } as CSSProperties;

  return (
    <section className="battery-stage" aria-label="Battery regeneration animation">
      <div
        className={`battery-device image-sequence-stage stage-${activeStage.key}`}
        style={batteryStyle}
        role="img"
        aria-label={activeStage.alt}
      >
        <span className="cinema-sweep" aria-hidden="true" />
        <span className="sequence-halo" aria-hidden="true" />
        <img className="sequence-battery-image" src={activeStage.image} alt="" />
      </div>

      <div className="stage-caption battery-story-copy">
        <span>Stage {activeStageIndex + 1} / {BATTERY_STAGES.length} · {activeStage.status}</span>
        <h3>{activeStage.label}</h3>
        <p>{activeStage.detail}</p>
      </div>
      <div className="degradation-timeline" key={activeStage.key} aria-hidden="true">
        <span />
      </div>
    </section>
  );
};

const ProcessSection = () => {
  const steps = [
    {
      title: 'Check',
      text: 'We test how the battery accepts and delivers charge before recommending work.',
    },
    {
      title: 'Regenerate',
      text: 'Controlled desulfation pulses help reopen blocked plate area inside the battery.',
    },
    {
      title: 'Verify',
      text: 'The recovered battery is checked again so performance gains are easy to understand.',
    },
  ];

  return (
    <section className="section-block" id="process">
      <div className="section-heading">
        <p className="eyebrow">Simple process</p>
        <h2>Three steps from weak battery to useful battery.</h2>
      </div>
      <div className="process-list">
        {steps.map((step, index) => (
          <article className="process-item" key={step.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

const ValueSection = () => (
  <section className="section-block value-section">
    <div>
      <p className="eyebrow">Cleaner economics</p>
      <h2>Regenerate when it makes sense. Replace only when needed.</h2>
    </div>
    <div className="metric-strip" aria-label="Service highlights">
      <div>
        <strong>95%</strong>
        <span>target health after recovery checks</span>
      </div>
      <div>
        <strong>2 yrs</strong>
        <span>warranty support on treated batteries</span>
      </div>
      <div>
        <strong>70%</strong>
        <span>potential savings versus replacement</span>
      </div>
    </div>
  </section>
);

const ContactSection = () => {
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('subject', 'New Battery Checkup Request');
    formData.append('from_name', 'Artheon Energy Website');

    setSubmitState('submitting');
    setMessage('');

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      const result = (await response.json()) as { success?: boolean; message?: string };

      if (response.ok && result.success) {
        setSubmitState('success');
        setMessage('Request sent. Our team will call you shortly.');
        form.reset();
        return;
      }

      setSubmitState('error');
      setMessage(result.message ?? 'Could not send request. Please try again.');
    } catch {
      setSubmitState('error');
      setMessage('Network issue while sending request. Please try again.');
    }
  };

  return (
    <section className="section-block contact-section" id="contact">
      <div>
        <p className="eyebrow">Book Checkup</p>
        <h2>Tell us about your batteries.</h2>
        <p>
          Send your basic details and we will help you understand whether regeneration is worth checking.
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Name or Company
          <input name="name" type="text" required />
        </label>
        <label>
          Phone Number
          <input name="phone" type="tel" inputMode="tel" required />
        </label>
        <label>
          Setup Type
          <select name="setup" defaultValue="" required>
            <option value="" disabled>Select setup</option>
            <option value="backup">UPS / Backup Power</option>
            <option value="fleet">Fleet Battery</option>
            <option value="solar">Solar Storage</option>
            <option value="industrial">Industrial Battery Bank</option>
          </select>
        </label>
        <button type="submit" disabled={submitState === 'submitting'}>
          {submitState === 'submitting' ? 'Sending...' : 'Request Checkup'}
        </button>
        <p className={`form-message ${submitState}`} aria-live="polite">
          {message}
        </p>
      </form>
    </section>
  );
};

const BlogPage = ({ navigate }: { navigate: (href: string) => void }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(BLOG_POSTS.map((post) => post.category)))],
    [],
  );

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = category === 'All' || post.category === category;
    const searchableText = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
    return matchesCategory && searchableText.includes(query.trim().toLowerCase());
  });

  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">Blog</p>
        <h1>Battery regeneration notes, minus the jargon.</h1>
        <p>Useful articles for shops, fleets, backup sites, and anyone trying to avoid early battery replacement.</p>
      </section>

      <section className="blog-controls" aria-label="Blog filters">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search blog articles"
          placeholder="Search articles"
        />
        <div className="category-filter">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={item === category ? 'is-active' : ''}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="blog-grid" aria-label="Article list">
        {filteredPosts.map((post) => (
          <article className="blog-card" key={post.slug}>
            <span>{post.category}</span>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="blog-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <small>{post.readTime}</small>
            </div>
            <button type="button" onClick={() => navigate(`/blog/${post.slug}`)}>
              Read more
            </button>
          </article>
        ))}
      </section>
    </main>
  );
};

const BlogPostPage = ({
  slug,
  navigate,
}: {
  slug: string;
  navigate: (href: string) => void;
}) => {
  const post = BLOG_POSTS.find((item) => item.slug === slug);

  if (!post) {
    return (
      <main className="page-main">
        <section className="page-hero">
          <p className="eyebrow">Article not found</p>
          <h1>This post is not available.</h1>
          <button className="primary-action" type="button" onClick={() => navigate('/blog')}>
            Back to Blog
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-main">
      <article className="article-page">
        <button className="text-link" type="button" onClick={() => navigate('/blog')}>
          Back to Blog
        </button>
        <p className="eyebrow">{post.category}</p>
        <h1>{post.title}</h1>
        <div className="article-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readTime}</span>
        </div>

        <div className="article-body">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
};

const TermsPage = ({ navigate }: { navigate: (href: string) => void }) => (
  <main className="page-main">
    <article className="legal-page">
      <p className="eyebrow">Terms & Conditions</p>
      <h1>Clear terms for using Artheon Energy services.</h1>
      <p className="legal-intro">
        This template is written for readability and should be reviewed by a qualified legal professional before production use.
      </p>

      <ol>
        {TERMS_SECTIONS.map((section) => (
          <li key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </li>
        ))}
      </ol>

      <button className="primary-action" type="button" onClick={() => navigate('/')}>
        Return Home
      </button>
    </article>
  </main>
);

const SiteFooter = ({ navigate }: { navigate: (href: string) => void }) => (
  <footer className="site-footer">
    <p>© {new Date().getFullYear()} Artheon Energy. Battery Regeneration Systems.</p>
    <nav aria-label="Footer navigation">
      <button type="button" onClick={() => navigate('/blog')}>Blog</button>
      <button type="button" onClick={() => navigate('/terms')}>Terms</button>
    </nav>
  </footer>
);

export default App;
