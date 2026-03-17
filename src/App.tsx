import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { BatteryGraphic } from './components/BatteryGraphic';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

type ThemeMode = 'system' | 'lite' | 'dark';
type ResolvedTheme = 'lite' | 'dark';

type StoryPanel = {
  id: string;
  navLabel: string;
  sequence: string;
  eyebrow: string;
  stageLabel: string;
  title: string;
  copy: string[];
  metricValue: string;
  metricLabel: string;
  accentColor: string;
  accentGlow: string;
};

type InstrumentReadouts = {
  charge: number;
  plateHealth: number;
  sulfation: number;
  savings: number;
};

const THEME_MODE_STORAGE_KEY = 'artheon-theme-mode';
const PANEL_STOPS = [0, 0.25, 0.5, 0.75, 1];

const STORY_PANELS: StoryPanel[] = [
  {
    id: 'problem',
    navLabel: 'Problem',
    sequence: '0%',
    eyebrow: 'The Problem',
    stageLabel: 'Depleted',
    title: 'A tired VRLA battery falls flat long before the job is done.',
    copy: [
      'Sulfation locks usable energy away inside the plates, so runtime drops and charge response gets sluggish.',
      'The battery still looks intact from the outside, but it cannot deliver stable backup under real load.',
      'That is where avoidable replacements, missed shifts, and downtime usually begin.',
    ],
    metricValue: '0-15%',
    metricLabel: 'usable capacity left',
    accentColor: '#cc2200',
    accentGlow: 'rgba(204,34,0,0.22)',
  },
  {
    id: 'diagnosis',
    navLabel: 'Diagnosis',
    sequence: '25%',
    eyebrow: 'Diagnosis',
    stageLabel: 'Charging',
    title: 'The system checks how the battery accepts energy before recovery starts.',
    copy: [
      'VRLA regeneration reads voltage behavior, internal resistance, and how quickly the cell can take charge.',
      'That first scan shows whether the battery is still recoverable and how aggressively it should be treated.',
      'Instead of guessing, the process starts from measured battery health.',
    ],
    metricValue: '5',
    metricLabel: 'health signals checked',
    accentColor: '#f97316',
    accentGlow: 'rgba(249,115,22,0.22)',
  },
  {
    id: 'process',
    navLabel: 'Process',
    sequence: '50%',
    eyebrow: 'The Process',
    stageLabel: 'Mid-Charge',
    title: 'Controlled desulfation pulses reopen blocked plate area step by step.',
    copy: [
      'Targeted current breaks down hardened sulfate so more active material can work again.',
      'As the blockage loosens, the battery starts holding charge instead of bleeding it away.',
      'Recovery is gradual, visible, and tied directly to the battery response.',
    ],
    metricValue: '3',
    metricLabel: 'desulfation phases',
    accentColor: '#facc15',
    accentGlow: 'rgba(250,204,21,0.18)',
  },
  {
    id: 'recovery',
    navLabel: 'Recovery',
    sequence: '75%',
    eyebrow: 'Recovery',
    stageLabel: 'Regenerating',
    title: 'Charge acceptance stabilizes and usable capacity starts coming back online.',
    copy: [
      'The cell moves from weak response to reliable delivery as sulfation drops and charge flow clears up.',
      'At this stage the battery can once again support real operating loads, not just bench numbers.',
      'The improvement is visible in both stored charge and runtime confidence.',
    ],
    metricValue: '+32%',
    metricLabel: 'capacity regained',
    accentColor: '#22c55e',
    accentGlow: 'rgba(34,197,94,0.2)',
  },
  {
    id: 'result',
    navLabel: 'Result',
    sequence: '100%',
    eyebrow: 'Result',
    stageLabel: 'Restored',
    title: 'A restored battery goes back to work without the cost of immediate replacement.',
    copy: [
      'The battery finishes the cycle bright, stable, and ready for useful service again.',
      'That means longer battery life, better planning, and fewer surprise failures in the field.',
      'When recovery works, replacement spend can be pushed back instead of pulled forward.',
    ],
    metricValue: '70%',
    metricLabel: 'saved vs replacement',
    accentColor: '#00ff88',
    accentGlow: 'rgba(0,255,136,0.22)',
  },
];

const parseStoredThemeMode = (value: string | null): ThemeMode | null => {
  if (value === 'system' || value === 'lite' || value === 'dark') {
    return value;
  }
  return null;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const interpolateStops = (progress: number, values: number[]) => {
  if (values.length !== PANEL_STOPS.length) {
    return values[0] ?? 0;
  }

  if (progress <= PANEL_STOPS[0]) {
    return values[0];
  }

  const lastStopIndex = PANEL_STOPS.length - 1;
  if (progress >= PANEL_STOPS[lastStopIndex]) {
    return values[lastStopIndex];
  }

  for (let index = 0; index < PANEL_STOPS.length - 1; index += 1) {
    const currentStop = PANEL_STOPS[index];
    const nextStop = PANEL_STOPS[index + 1];

    if (progress >= currentStop && progress <= nextStop) {
      const segmentProgress = (progress - currentStop) / (nextStop - currentStop);
      return values[index] + (values[index + 1] - values[index]) * segmentProgress;
    }
  }

  return values[lastStopIndex];
};

const getInstrumentReadouts = (progress: number): InstrumentReadouts => ({
  charge: Math.round(interpolateStops(progress, [0, 25, 50, 75, 100])),
  plateHealth: Math.round(interpolateStops(progress, [12, 28, 52, 79, 98])),
  sulfation: Math.round(interpolateStops(progress, [94, 78, 52, 21, 4])),
  savings: Math.round(interpolateStops(progress, [0, 6, 18, 42, 70])),
});

const ReadoutBar = ({
  label,
  value,
  toneClass,
}: {
  label: string;
  value: number;
  toneClass: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
      <span>{label}</span>
      <span className="text-slate-100">{value}%</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-white/8">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${toneClass} transition-[width] duration-150`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

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

  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const [readouts, setReadouts] = useState<InstrumentReadouts>(getInstrumentReadouts(0));

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

  const scrollytellingRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const visibilityRatiosRef = useRef(new Map<number, number>());
  const pendingReadoutsRef = useRef<InstrumentReadouts>(getInstrumentReadouts(0));
  const readoutAnimationFrameRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: scrollytellingRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.panelIndex);
          visibilityRatiosRef.current.set(index, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        const mostVisible = [...visibilityRatiosRef.current.entries()].sort((left, right) => (
          right[1] - left[1]
        ))[0];

        if (mostVisible) {
          setActivePanelIndex((previousIndex) => (
            previousIndex === mostVisible[0] ? previousIndex : mostVisible[0]
          ));
        }
      },
      {
        threshold: [0.2, 0.35, 0.5, 0.65, 0.8],
        rootMargin: '-18% 0px -18% 0px',
      },
    );

    panelRefs.current.forEach((panel) => {
      if (panel) {
        observer.observe(panel);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (readoutAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(readoutAnimationFrameRef.current);
      }
    };
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    pendingReadoutsRef.current = getInstrumentReadouts(clamp(latest, 0, 1));

    if (readoutAnimationFrameRef.current !== null) {
      return;
    }

    readoutAnimationFrameRef.current = window.requestAnimationFrame(() => {
      readoutAnimationFrameRef.current = null;
      const nextReadouts = pendingReadoutsRef.current;

      setReadouts((previousReadouts) => {
        if (
          previousReadouts.charge === nextReadouts.charge &&
          previousReadouts.plateHealth === nextReadouts.plateHealth &&
          previousReadouts.sulfation === nextReadouts.sulfation &&
          previousReadouts.savings === nextReadouts.savings
        ) {
          return previousReadouts;
        }

        return nextReadouts;
      });
    });
  });

  return (
    <div className="theme-canvas relative overflow-x-clip bg-ink-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#03060a_0%,#071019_48%,#03060a_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] [background-size:32px_32px] opacity-35" />
        <div className="absolute left-[18%] top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-300/15 to-transparent" />
        <div className="absolute right-[24%] top-0 h-full w-px bg-gradient-to-b from-transparent via-emerald-300/12 to-transparent" />
        <div className="absolute left-[9%] top-[12%] h-40 w-40 rounded-full bg-cyan-400/8 blur-3xl" />
        <div className="absolute bottom-[14%] right-[12%] h-48 w-48 rounded-full bg-emerald-400/7 blur-3xl" />
      </div>

      <Header
        chapters={STORY_PANELS.map(({ id, navLabel }) => ({ id, label: navLabel }))}
        progress={scrollYProgress}
        themeMode={themeMode}
        resolvedTheme={resolvedTheme}
        onCycleTheme={cycleThemeMode}
      />

      <main className="relative mx-auto w-full max-w-[1480px] px-4 pb-20 pt-28 sm:px-6 md:pt-32 lg:px-10">
        <section
          ref={scrollytellingRef}
          className="relative lg:grid lg:grid-cols-[minmax(18rem,40%)_minmax(0,60%)] lg:gap-10"
        >
          <aside className="relative z-20 mb-12 border-b border-white/10 pb-8 lg:mb-0 lg:border-b-0 lg:border-r lg:border-white/10 lg:pr-10">
            <div className="sticky top-[calc(var(--header-height)+0.75rem)]">
              <div className="relative overflow-hidden px-1 py-2 lg:flex lg:h-[calc(100vh-var(--header-height)-1.75rem)] lg:flex-col lg:justify-between lg:py-4">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,136,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_32%),linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:auto,auto,28px_28px,28px_28px] opacity-75" />
                <div className="pointer-events-none absolute inset-y-6 left-4 w-px bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent" />

                <div className="relative z-10 space-y-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-cyan-300/72">
                    VRLA Regeneration Live
                  </p>

                  <div className="flex flex-wrap items-end justify-between gap-5">
                    <div className="max-w-[30rem]">
                      <h1 className="font-display text-[clamp(2.35rem,6vw,4.6rem)] font-semibold leading-[0.88] text-white">
                        Battery restoration, mapped directly to scroll.
                      </h1>
                      <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
                        The battery on the left never moves. Its state changes in place from depleted
                        red to restored green while the right side walks through the recovery story.
                      </p>
                    </div>

                    <div className="min-w-[9rem]">
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                        Current State
                      </p>
                      <p className="mt-2 font-display text-5xl font-semibold leading-none text-white">
                        {readouts.charge}%
                      </p>
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-200">
                        {STORY_PANELS[activePanelIndex].stageLabel}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex min-h-[22rem] items-center justify-center py-8 sm:min-h-[24rem] lg:min-h-0 lg:flex-1 lg:py-10">
                  <BatteryGraphic scrollProgress={scrollYProgress} />
                </div>

                <div className="relative z-10 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <ReadoutBar
                      label="Charge"
                      value={readouts.charge}
                      toneClass="from-[#cc2200] via-[#facc15] to-[#00ff88]"
                    />
                    <ReadoutBar
                      label="Plate Health"
                      value={readouts.plateHealth}
                      toneClass="from-cyan-500 via-cyan-300 to-emerald-300"
                    />
                    <ReadoutBar
                      label="Sulfation"
                      value={readouts.sulfation}
                      toneClass="from-[#ff7a59] via-[#f97316] to-[#cc2200]"
                    />
                    <ReadoutBar
                      label="Savings"
                      value={readouts.savings}
                      toneClass="from-emerald-900 via-emerald-500 to-[#00ff88]"
                    />
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                    {STORY_PANELS.map((panel, index) => {
                      const isActive = index === activePanelIndex;
                      return (
                        <div
                          key={panel.id}
                          className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-white/8 py-2 first:border-t-0 ${
                            isActive ? 'text-white' : 'text-slate-500'
                          }`}
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full border border-white/15"
                            style={{
                              backgroundColor: isActive ? panel.accentColor : 'rgba(148,163,184,0.2)',
                              boxShadow: isActive ? `0 0 18px ${panel.accentGlow}` : 'none',
                            }}
                          />
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em]">
                            {panel.eyebrow}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                            {panel.sequence}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="relative lg:pl-10">
            {STORY_PANELS.map((panel, index) => {
              const isActive = index === activePanelIndex;

              return (
                <section
                  key={panel.id}
                  id={panel.id}
                  data-panel-index={index}
                  ref={(node) => {
                    panelRefs.current[index] = node;
                  }}
                  className="relative flex min-h-[72vh] scroll-mt-[calc(var(--header-height)+1rem)] items-center border-t border-white/10 py-12 first:border-t-0 sm:min-h-[78vh] sm:py-14 lg:min-h-[92vh] lg:py-20"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
                    style={{
                      opacity: isActive ? 1 : 0,
                      backgroundImage: `radial-gradient(circle at top left, ${panel.accentGlow}, transparent 58%)`,
                    }}
                  />

                  <div
                    className={`relative max-w-[42rem] space-y-6 transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-65 lg:opacity-45'
                    }`}
                  >
                    <div className="space-y-3">
                      <p
                        className="font-mono text-[11px] uppercase tracking-[0.3em]"
                        style={{ color: panel.accentColor }}
                      >
                        {panel.sequence} / {panel.eyebrow}
                      </p>
                      <h2 className="max-w-[16ch] font-display text-3xl font-semibold leading-[0.98] text-white sm:text-4xl lg:text-[3.4rem]">
                        {panel.title}
                      </h2>
                    </div>

                    <div className="max-w-[38rem] space-y-3 text-base leading-relaxed text-slate-300 sm:text-lg">
                      {panel.copy.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>

                    <div className="pt-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                        {panel.metricLabel}
                      </p>
                      <div className="mt-3 flex items-end gap-3">
                        <p className="font-display text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-7xl">
                          {panel.metricValue}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
