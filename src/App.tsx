import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
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

const THEME_MODE_STORAGE_KEY = 'artheon-theme-mode';
const PANEL_STOPS = [0, 0.25, 0.5, 0.75, 1];

const STORY_PANELS: StoryPanel[] = [
  {
    id: 'problem',
    navLabel: 'Problem',
    sequence: '0%',
    eyebrow: 'The Problem',
    stageLabel: 'Depleted',
    title: 'A tired battery starts the day almost empty.',
    copy: [
      'Sulfation blocks active plate area, so the battery cannot store or deliver energy the way it used to.',
      'What looks like a normal battery from outside is already losing useful runtime and backup strength.',
      'That slow drop is what pushes fleets and backup systems toward early replacement.',
    ],
    metricValue: '0-15%',
    metricLabel: 'usable capacity left',
    accentColor: '#cc2200',
    accentGlow: 'rgba(204,34,0,0.2)',
  },
  {
    id: 'diagnosis',
    navLabel: 'Diagnosis',
    sequence: '25%',
    eyebrow: 'Diagnosis',
    stageLabel: 'Charging',
    title: 'The recovery cycle first checks how the cell accepts charge.',
    copy: [
      'The system reads how the battery responds under load and while taking energy back in.',
      'That gives a clear picture of how severe the sulfation is and how recoverable the battery still looks.',
      'The process starts from measured condition, not guesswork.',
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
    title: 'Controlled desulfation pulses reopen blocked plate area.',
    copy: [
      'As the pulses work through the cell, hardened sulfate begins to loosen and charge flow becomes cleaner.',
      'The battery does not move anywhere on screen because the change is happening inside the same unit.',
      'Mid-cycle is where the regeneration becomes visibly active.',
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
    title: 'Capacity and charge acceptance come back into a usable range.',
    copy: [
      'The battery begins holding more energy, responding more cleanly, and delivering steadier output.',
      'This is the point where the battery starts feeling dependable again in real use, not just on paper.',
      'The improvement is visible in the fill, glow, and reduced internal damage.',
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
    title: 'A restored battery goes back to work instead of straight to replacement.',
    copy: [
      'At full recovery the battery is stable, bright, and ready for useful service again.',
      'That means lower replacement pressure, fewer surprise failures, and better value from each battery.',
      'The whole story finishes with the same battery regenerated in place.',
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

const getActivePanelIndex = (progress: number) => {
  const normalizedProgress = clamp(progress, 0, 1);

  return PANEL_STOPS.reduce((closestIndex, stop, index) => {
    const currentDistance = Math.abs(stop - normalizedProgress);
    const closestDistance = Math.abs(PANEL_STOPS[closestIndex] - normalizedProgress);
    return currentDistance < closestDistance ? index : closestIndex;
  }, 0);
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

  const [activePanelIndex, setActivePanelIndex] = useState(0);

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

  const panelTrackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: panelTrackRef,
    offset: ['start start', 'end end'],
  });

  const desktopStageProgress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const mobileBatteryLift = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const batteryBackgroundOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.72, 0.86, 0.94]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const nextPanelIndex = getActivePanelIndex(clamp(latest, 0, 1));
    setActivePanelIndex((previousIndex) => (
      previousIndex === nextPanelIndex ? previousIndex : nextPanelIndex
    ));
  });

  const activePanel = STORY_PANELS[activePanelIndex];
  const panelPalette =
    resolvedTheme === 'dark'
      ? {
          surfaceTop: 'rgba(6,12,20,0.46)',
          surfaceBottom: 'rgba(6,12,20,0.16)',
          heroSurfaceTop: 'rgba(6,12,20,0.32)',
          heroSurfaceBottom: 'rgba(6,12,20,0.1)',
          sheen: 'rgba(255,255,255,0.16)',
          cornerGlow: 'rgba(255,255,255,0.12)',
          edgeGlow: 'rgba(255,255,255,0.04)',
          title: '#f8fafc',
          body: '#cbd5e1',
          meta: '#94a3b8',
          metric: '#f8fafc',
          shadow: '0 34px 100px -52px rgba(2,8,20,0.84)',
          activeRing: 'rgba(255,255,255,0.06)',
        }
      : {
          surfaceTop: 'rgba(255,255,255,0.52)',
          surfaceBottom: 'rgba(255,255,255,0.16)',
          heroSurfaceTop: 'rgba(255,255,255,0.4)',
          heroSurfaceBottom: 'rgba(255,255,255,0.12)',
          sheen: 'rgba(255,255,255,0.4)',
          cornerGlow: 'rgba(255,255,255,0.3)',
          edgeGlow: 'rgba(255,255,255,0.12)',
          title: '#0f172a',
          body: '#334155',
          meta: '#475569',
          metric: '#0f172a',
          shadow: '0 30px 84px -58px rgba(15,23,42,0.22)',
          activeRing: 'rgba(15,23,42,0.06)',
        };

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
        <section className="relative">
          <div className="hidden lg:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-[40%]">
              <div className="sticky top-[calc(var(--header-height)+0.8rem)] h-[calc(100vh-var(--header-height)-1.6rem)]">
                <motion.div
                  style={{ opacity: batteryBackgroundOpacity }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.12),transparent_48%),linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] [background-size:auto,30px_30px,30px_30px]"
                />
                <div className="absolute left-0 top-[9%] h-[82%] w-px bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent" />

                <div className="relative flex h-full items-center justify-center">
                  <div className="w-full max-w-[24rem] px-6 xl:max-w-[26rem]">
                    <BatteryGraphic scrollProgress={scrollYProgress} />
                  </div>
                </div>

                <div className="absolute left-6 right-8 top-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-300/72">
                    Background Regeneration
                  </p>
                </div>

                <div className="absolute bottom-8 left-6 right-8 space-y-3">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
                    <span>{activePanel.eyebrow}</span>
                    <span style={{ color: activePanel.accentColor }}>{activePanel.sequence}</span>
                  </div>
                  <div className="h-px overflow-hidden bg-white/10">
                    <motion.div
                      style={{ width: desktopStageProgress }}
                      className="h-full bg-gradient-to-r from-[#cc2200] via-[#facc15] to-[#00ff88]"
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {STORY_PANELS.map((panel, index) => {
                      const isActive = index === activePanelIndex;
                      return (
                        <span
                          key={`desktop-dot-${panel.id}`}
                          className="h-1.5 rounded-full"
                          style={{
                            backgroundColor: isActive ? panel.accentColor : 'rgba(148,163,184,0.18)',
                            boxShadow: isActive ? `0 0 14px ${panel.accentGlow}` : 'none',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-[40%] lg:w-[60%] lg:pl-10">
            <div className="pointer-events-none sticky top-[calc(var(--header-height)+0.55rem)] z-0 mb-4 h-[12.5rem] sm:h-[14rem] lg:hidden">
              <motion.div
                style={{ y: mobileBatteryLift, opacity: batteryBackgroundOpacity }}
                className="relative h-full"
              >
                <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.12),transparent_48%),linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:auto,24px_24px,24px_24px]" />
                <div className="absolute inset-x-0 top-2 flex justify-center">
                  <p
                    className="rounded-full border border-white/10 bg-black/35 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] backdrop-blur-sm"
                    style={{ color: activePanel.accentColor }}
                  >
                    {activePanel.stageLabel}
                  </p>
                </div>
                <div className="relative flex h-full items-center justify-center pt-5">
                  <div className="w-[11rem] sm:w-[12.5rem]">
                    <BatteryGraphic scrollProgress={scrollYProgress} compact />
                  </div>
                </div>
              </motion.div>
            </div>

            <div ref={panelTrackRef} className="relative z-10 pt-24 sm:pt-28 lg:pt-0 snap-y snap-proximity">
              {STORY_PANELS.map((panel, index) => {
                const isActive = index === activePanelIndex;
                const isLeadPanel = index === 0;
                const cardBackground = isLeadPanel
                  ? `linear-gradient(180deg, ${panelPalette.heroSurfaceTop}, ${panelPalette.heroSurfaceBottom})`
                  : `linear-gradient(180deg, ${panelPalette.surfaceTop}, ${panelPalette.surfaceBottom})`;
                const cardShadow = isActive
                  ? `${panelPalette.shadow}, 0 0 0 1px ${panelPalette.activeRing}, 0 24px 54px -42px ${panel.accentGlow}`
                  : panelPalette.shadow;

                return (
                  <section
                    key={panel.id}
                    id={panel.id}
                    className="relative flex min-h-[72vh] snap-start items-start py-10 first:pt-0 sm:min-h-[82vh] sm:py-12 lg:min-h-[100vh] lg:items-center lg:py-16"
                  >
                    <article
                      className={`relative max-w-[42rem] overflow-hidden rounded-[2rem] border border-white/14 p-6 backdrop-blur-[28px] transition-all duration-300 sm:p-8 lg:p-10 ${
                        isActive ? 'opacity-100' : 'opacity-80'
                      }`}
                      style={{
                        background: cardBackground,
                        boxShadow: cardShadow,
                      }}
                    >
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          backgroundImage: `linear-gradient(140deg, ${panelPalette.sheen}, transparent 24%, transparent 72%, ${panelPalette.edgeGlow})`,
                        }}
                      />
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          backgroundImage: `radial-gradient(circle at top left, ${panelPalette.cornerGlow}, transparent 34%), radial-gradient(circle at bottom right, ${panelPalette.edgeGlow}, transparent 38%)`,
                        }}
                      />
                      <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/10" />
                      <div
                        className="absolute inset-x-0 top-0 h-px"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${panel.accentColor}, transparent)`,
                          opacity: isActive ? 0.78 : 0,
                        }}
                      />

                      <div className="relative z-10 space-y-6">
                        <div className="space-y-3">
                          <p
                            className="font-mono text-[11px] uppercase tracking-[0.3em]"
                            style={{ color: panel.accentColor }}
                          >
                            {panel.sequence} / {panel.eyebrow}
                          </p>
                          <h2
                            className="max-w-[16ch] font-display text-3xl font-semibold leading-[0.98] sm:text-4xl lg:text-[3.4rem]"
                            style={{ color: panelPalette.title }}
                          >
                            {panel.title}
                          </h2>
                        </div>

                        <div
                          className="max-w-[38rem] space-y-3 text-base leading-relaxed sm:text-lg"
                          style={{ color: panelPalette.body }}
                        >
                          {panel.copy.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>

                        <div className="pt-2">
                          <p
                            className="font-mono text-[10px] uppercase tracking-[0.28em]"
                            style={{ color: panelPalette.meta }}
                          >
                            {panel.metricLabel}
                          </p>
                          <div className="mt-3 flex items-end gap-3">
                            <p
                              className="font-display text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl"
                              style={{ color: panelPalette.metric }}
                            >
                              {panel.metricValue}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </section>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
