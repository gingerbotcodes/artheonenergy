import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { BatteryGraphic } from './components/BatteryGraphic';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

type StoryChapter = {
  id: string;
  navLabel: string;
  sequence: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  impactLabel: string;
  impactValue: string;
  accent: string;
};

type ScoreSnapshot = {
  recovery: number;
  savings: number;
  uptime: number;
};

type ThemeMode = 'system' | 'lite' | 'dark';
type ResolvedTheme = 'lite' | 'dark';

const BATTERY_STAGE_POINTS = [0, 0.2, 0.42, 0.6, 0.78, 1];

const THEME_MODE_STORAGE_KEY = 'artheon-theme-mode';

const parseStoredThemeMode = (value: string | null): ThemeMode | null => {
  if (value === 'system' || value === 'lite' || value === 'dark') {
    return value;
  }
  return null;
};

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'problem',
    navLabel: 'Problem',
    sequence: '01',
    eyebrow: 'What Goes Wrong',
    title: 'Sulfation Slowly Steals Battery Power',
    description:
      'Inside old batteries, a hard layer called sulfation builds up. This blocks smooth power flow, so your battery gives less backup and drains faster.',
    highlights: [
      'Your battery runs out faster than before.',
      'Charging feels normal, but performance keeps dropping.',
      'You end up replacing batteries sooner than expected.',
      'Breakdowns interrupt daily work and deliveries.',
    ],
    impactLabel: 'Battery strength before checkup',
    impactValue: '35-55%',
    accent:
      'bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.24),transparent_58%)]',
  },
  {
    id: 'diagnostics',
    navLabel: 'Checkup',
    sequence: '02',
    eyebrow: 'Quick Check',
    title: 'We First Check Battery Health',
    description:
      'Before we start, we do a quick health check to see your battery condition. This helps us choose the right level for a safe and useful result.',
    highlights: [
      'We test first, then treat.',
      'Settings are based on your battery condition.',
      'The process stays consistent across all batteries.',
      'You get clear before-and-after results.',
    ],
    impactLabel: 'Typical check time',
    impactValue: '8-12 min',
    accent:
      'bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.24),transparent_58%)]',
  },
  {
    id: 'regeneration',
    navLabel: 'Fix',
    sequence: '03',
    eyebrow: 'Battery Fix',
    title: 'Targeted Pulses Break Sulfation Buildup',
    description:
      'We use controlled pulses to break the sulfation layer. This helps your battery hold charge better again without replacing it right away.',
    highlights: [
      'Sulfation gets reduced step by step.',
      'The process is controlled and safe.',
      'Battery backup improves after treatment.',
      'You can treat the same battery again later if needed.',
    ],
    impactLabel: 'Typical fix time',
    impactValue: '2-4 hrs',
    accent:
      'bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.24),transparent_58%)]',
  },
  {
    id: 'impact',
    navLabel: 'Impact',
    sequence: '04',
    eyebrow: 'Final Result',
    title: 'Better Runtime, Lower Cost, Longer Battery Life',
    description:
      'After this process, many batteries work much better in daily use. You save money, avoid surprise battery failure, and get more life from each unit.',
    highlights: [
      'Recovered batteries can go back to work quickly.',
      'Replacement spend can drop by up to 70%.',
      'Operations stay more reliable during busy hours.',
      'You get clearer planning and less surprise downtime.',
    ],
    impactLabel: 'Battery strength after checkup',
    impactValue: '80-100%',
    accent:
      'bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.24),transparent_58%)]',
  },
];

const FadeInBlock = ({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-16% 0px' }}
    transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const MetricCard = ({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) => (
  <div
    className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl ${
      compact
        ? 'p-2 shadow-[0_16px_28px_-24px_rgba(8,145,178,0.7)]'
        : 'p-3 shadow-[0_18px_30px_-24px_rgba(8,145,178,0.7)] sm:p-4'
    }`}
  >
    <p
      className={`font-semibold uppercase text-slate-400 ${
        compact ? 'text-[9px] tracking-[0.18em]' : 'text-[10px] tracking-[0.2em]'
      }`}
    >
      {label}
    </p>
    <p
      className={`font-display font-bold text-slate-100 ${
        compact ? 'mt-1 text-lg' : 'mt-1 text-xl sm:text-2xl'
      }`}
    >
      {value}
    </p>
  </div>
);

const MetricsRow = ({
  scores,
  compact = false,
}: {
  scores: ScoreSnapshot;
  compact?: boolean;
}) => (
  <div className={`grid grid-cols-3 ${compact ? 'gap-2' : 'gap-3 sm:gap-4'}`}>
    <MetricCard compact={compact} label="Recovered" value={`${scores.recovery}%`} />
    <MetricCard compact={compact} label="Savings" value={`${scores.savings}%`} />
    <MetricCard compact={compact} label="Uptime" value={`${scores.uptime}%`} />
  </div>
);

const StoryChapterCard = ({
  chapter,
  index,
}: {
  chapter: StoryChapter;
  index: number;
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 88%', 'end 24%'],
  });

  const smoothLocalProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
    restDelta: 0.001,
  });

  const cardY = useTransform(smoothLocalProgress, [0, 1], [64, -20]);
  const cardScale = useTransform(smoothLocalProgress, [0, 0.7, 1], [0.97, 1, 1.015]);
  const cardOpacity = useTransform(smoothLocalProgress, [0, 0.2, 1], [0.52, 1, 1]);

  return (
    <section
      ref={sectionRef}
      id={chapter.id}
      className="min-h-[70svh] scroll-mt-[7.2rem] pt-3 md:min-h-[76vh] md:scroll-mt-32"
    >
      <FadeInBlock delay={index * 0.05}>
        <motion.article
          style={{ y: cardY, scale: cardScale, opacity: cardOpacity }}
          className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_26px_60px_-32px_rgba(7,89,133,0.75)] backdrop-blur-2xl sm:p-7 lg:p-10"
        >
          <div className={`absolute inset-0 ${chapter.accent}`} />
          <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(255,255,255,0.08),transparent_28%,transparent_66%,rgba(255,255,255,0.06))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10 space-y-5 sm:space-y-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-200/90 sm:text-xs sm:tracking-[0.28em]">
              {chapter.sequence} / {chapter.eyebrow}
            </p>
            <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.8rem]">
              {chapter.title}
            </h2>
            <p className="text-base leading-relaxed text-slate-200 sm:text-lg">
              {chapter.description}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {chapter.highlights.map((item) => (
                <p
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-slate-200"
                >
                  {item}
                </p>
              ))}
            </div>

            <div className="inline-flex items-baseline gap-3 rounded-full border border-cyan-200/30 bg-cyan-200/10 px-4 py-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-100/90">
                {chapter.impactLabel}
              </span>
              <span className="font-display text-2xl font-bold text-cyan-100">
                {chapter.impactValue}
              </span>
            </div>
          </div>
        </motion.article>
      </FadeInBlock>
    </section>
  );
};

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }
    const storedThemeMode = parseStoredThemeMode(
      window.localStorage.getItem(THEME_MODE_STORAGE_KEY),
    );
    return storedThemeMode ?? 'system';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const resolvedTheme: ResolvedTheme =
    themeMode === 'system' ? (systemPrefersDark ? 'dark' : 'lite') : themeMode;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }

    mediaQuery.addListener(handleMediaChange);
    return () => mediaQuery.removeListener(handleMediaChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (themeMode === 'system') {
      window.localStorage.removeItem(THEME_MODE_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const cycleThemeMode = () => {
    setThemeMode((currentMode) => {
      if (currentMode === 'system') {
        return 'lite';
      }
      if (currentMode === 'lite') {
        return 'dark';
      }
      return 'system';
    });
  };

  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.35,
    restDelta: 0.001,
  });

  const orbPrimaryY = useTransform(smoothProgress, [0, 1], ['-10%', '56%']);
  const orbSecondaryY = useTransform(smoothProgress, [0, 1], ['8%', '-34%']);
  const gridOffsetY = useTransform(smoothProgress, [0, 1], ['0%', '18%']);
  const stageTilt = useTransform(smoothProgress, [0, 1], [0, 4]);
  const timelineHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const mobileStageLift = useTransform(smoothProgress, [0, 1], [0, -10]);

  const recoveryScoreValue = useTransform(
    smoothProgress,
    BATTERY_STAGE_POINTS,
    [82, 38, 32, 58, 68, 94],
  );
  const savingsScoreValue = useTransform(
    smoothProgress,
    BATTERY_STAGE_POINTS,
    [54, 22, 18, 40, 52, 70],
  );
  const uptimeScoreValue = useTransform(
    smoothProgress,
    BATTERY_STAGE_POINTS,
    [90, 62, 56, 74, 82, 97],
  );

  const [scores, setScores] = useState<ScoreSnapshot>({
    recovery: 82,
    savings: 54,
    uptime: 90,
  });

  useMotionValueEvent(recoveryScoreValue, 'change', (latest) => {
    setScores((prev) => ({ ...prev, recovery: Math.round(latest) }));
  });
  useMotionValueEvent(savingsScoreValue, 'change', (latest) => {
    setScores((prev) => ({ ...prev, savings: Math.round(latest) }));
  });
  useMotionValueEvent(uptimeScoreValue, 'change', (latest) => {
    setScores((prev) => ({ ...prev, uptime: Math.round(latest) }));
  });

  return (
    <div className="theme-canvas relative overflow-x-clip bg-ink-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.15),transparent_52%),radial-gradient(circle_at_84%_22%,rgba(56,189,248,0.16),transparent_48%),linear-gradient(145deg,#020712,#040b1a_46%,#030817)]" />
        <motion.div
          style={{ y: orbPrimaryY }}
          className="absolute right-[-16%] top-[-8%] h-[42vw] w-[42vw] max-h-[540px] max-w-[540px] rounded-full bg-cyan-400/15 blur-[130px]"
        />
        <motion.div
          style={{ y: orbSecondaryY }}
          className="absolute bottom-[4%] left-[-20%] h-[46vw] w-[46vw] max-h-[620px] max-w-[620px] rounded-full bg-emerald-500/16 blur-[140px]"
        />
        <motion.div
          style={{ backgroundPositionY: gridOffsetY }}
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px] opacity-35"
        />
      </div>

      <Header
        chapters={STORY_CHAPTERS.map(({ id, navLabel }) => ({ id, label: navLabel }))}
        progress={smoothProgress}
        themeMode={themeMode}
        resolvedTheme={resolvedTheme}
        onCycleTheme={cycleThemeMode}
      />

      <main
        ref={containerRef}
        className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 pb-24 pt-28 sm:px-6 md:pt-32 lg:flex-row lg:items-start lg:gap-14 lg:px-10"
      >
        <section className="lg:hidden">
          <FadeInBlock>
            <article className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(56,189,248,0.12),transparent_44%,rgba(16,185,129,0.14))]" />
              <div className="relative z-10 space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-200/90">
                  How It Works
                </p>
                <h1 className="font-display text-4xl font-bold leading-[1.05] text-white">
                  Don&apos;t Replace.
                  <br />
                  <span className="text-transparent bg-gradient-to-r from-emerald-300 via-cyan-200 to-cyan-400 bg-clip-text">
                    Recover Battery Life.
                  </span>
                </h1>
                <p className="text-sm leading-relaxed text-slate-200">
                  Scroll through four simple steps, from sulfation buildup to
                  battery recovery, and watch the battery animation change live.
                </p>
              </div>
            </article>
          </FadeInBlock>
        </section>

        <div className="sticky top-[5.7rem] z-30 lg:hidden">
          <motion.div
            style={{ y: mobileStageLift }}
            className="rounded-[1.65rem] border border-white/10 bg-ink-900/78 p-3 shadow-[0_24px_54px_-34px_rgba(8,47,73,0.9)] backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3">
              <BatteryGraphic scrollProgress={smoothProgress} compact />
              <div className="min-w-0 flex-1 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200/90">
                  Live State
                </p>
                <MetricsRow scores={scores} compact />
              </div>
            </div>
          </motion.div>
        </div>

        <aside className="relative hidden w-full lg:sticky lg:top-28 lg:block lg:h-[calc(100vh-8.25rem)] lg:w-[46%]">
          <motion.div
            style={{ rotateX: stageTilt }}
            className="relative h-full overflow-visible rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_36px_90px_-42px_rgba(15,23,42,0.95)] backdrop-blur-2xl sm:p-7 lg:p-8"
          >
            <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(56,189,248,0.08),transparent_42%,rgba(16,185,129,0.08))]" />
            <div className="relative z-10 flex h-full flex-col gap-8">
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300/90">
                  How It Works
                </p>
                <h1 className="font-display text-4xl font-bold leading-[1.04] text-white sm:text-5xl lg:text-[3rem]">
                  Don&apos;t Replace.
                  <br />
                  <span className="text-transparent bg-gradient-to-r from-emerald-300 via-cyan-200 to-cyan-400 bg-clip-text">
                    Recover Battery Life.
                  </span>
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  One scroll shows how sulfation reduces performance, then how
                  RG-16X helps bring battery power back.
                </p>
              </div>

              <div className="grid min-h-0 flex-1 place-items-center pb-1">
                <BatteryGraphic scrollProgress={smoothProgress} />
              </div>

              <MetricsRow scores={scores} />
            </div>
          </motion.div>
        </aside>

        <div className="relative flex w-full flex-col gap-8 pb-8 lg:w-[54%] lg:gap-16">
          <div className="-mx-4 overflow-x-auto px-4 pb-1 lg:hidden [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            <div className="flex w-max gap-2">
              {STORY_CHAPTERS.map((chapter) => (
                <a
                  key={`chip-${chapter.id}`}
                  href={`#${chapter.id}`}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200"
                >
                  {chapter.navLabel}
                </a>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute -left-6 top-0 hidden h-full w-px bg-white/10 lg:block" />
          <motion.div
            style={{ height: timelineHeight }}
            className="pointer-events-none absolute -left-6 top-0 hidden w-px bg-gradient-to-b from-cyan-300 via-emerald-400 to-emerald-500 lg:block"
          />

          {STORY_CHAPTERS.map((chapter, index) => (
            <StoryChapterCard key={chapter.id} chapter={chapter} index={index} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
