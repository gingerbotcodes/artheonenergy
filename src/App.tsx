import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { BatteryGraphic } from './components/BatteryGraphic';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StoryCard } from './components/StoryCard';

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
  const mobileBatteryLift = useTransform(scrollYProgress, [0, 0.5, 1], [0, -5, -10]);
  const batteryBackgroundOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0.72, 0.78, 0.86, 0.9, 0.92, 0.94]);
  const mobileHeroOpacity = useTransform(scrollYProgress, [0, 0.06, 0.12, 0.18, 0.24], [1, 0.92, 0.7, 0.35, 0]);
  const mobileHeroY = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.24], [0, -4, -10, -18]);
  const mobileHeroScale = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.24], [1, 0.985, 0.965, 0.94]);
  const mobileTrayHeight = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.24, 0.34, 0.44, 0.56], [356, 348, 336, 320, 296, 260, 228]);
  const mobileBatteryScale = useTransform(scrollYProgress, [0, 0.08, 0.18, 0.3, 0.48], [1.0, 0.99, 0.96, 0.92, 0.84]);
  const mobileBatteryY = useTransform(scrollYProgress, [0, 0.1, 0.24, 0.48], [0, -3, -8, -16]);
  const mobileStageOpacity = useTransform(scrollYProgress, [0, 0.05, 0.12, 0.2], [0.35, 0.52, 0.82, 1]);

  /* ---- Parallax background transforms ---- */
  const bgGridY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const bgOrbLeftY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const bgOrbRightY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const bgLineCyanOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.15, 0.28, 0.18, 0.25]);
  const bgLineEmeraldOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.12, 0.22, 0.14, 0.2]);

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
        <motion.div
          style={{ y: bgGridY }}
          className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] [background-size:32px_32px] opacity-35 scroll-animate"
        />
        <motion.div
          style={{ opacity: bgLineCyanOpacity }}
          className="absolute left-[18%] top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-300 to-transparent scroll-animate"
        />
        <motion.div
          style={{ opacity: bgLineEmeraldOpacity }}
          className="absolute right-[24%] top-0 h-full w-px bg-gradient-to-b from-transparent via-emerald-300 to-transparent scroll-animate"
        />
        <motion.div
          style={{ y: bgOrbLeftY }}
          className="absolute left-[9%] top-[12%] h-40 w-40 rounded-full bg-cyan-400/8 blur-3xl scroll-animate"
        />
        <motion.div
          style={{ y: bgOrbRightY }}
          className="absolute bottom-[14%] right-[12%] h-48 w-48 rounded-full bg-emerald-400/7 blur-3xl scroll-animate"
        />
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
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={activePanel.eyebrow}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {activePanel.eyebrow}
                      </motion.span>
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={activePanel.sequence}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ color: activePanel.accentColor }}
                      >
                        {activePanel.sequence}
                      </motion.span>
                    </AnimatePresence>
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
                        <motion.span
                          key={`desktop-dot-${panel.id}`}
                          className="h-1.5 rounded-full"
                          animate={{
                            backgroundColor: isActive ? panel.accentColor : 'rgba(148,163,184,0.18)',
                            boxShadow: isActive ? `0 0 14px ${panel.accentGlow}` : '0 0 0px rgba(0,0,0,0)',
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-[40%] lg:w-[60%] lg:pl-10">
            <motion.div
              style={{ height: mobileTrayHeight }}
              className="pointer-events-none sticky top-[calc(var(--header-height)+0.55rem)] z-0 mb-5 lg:hidden"
            >
              <motion.div
                style={{ y: mobileBatteryLift, opacity: batteryBackgroundOpacity }}
                className="relative flex h-full flex-col items-center overflow-hidden rounded-[2.2rem]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.12),transparent_48%),linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:auto,24px_24px,24px_24px]" />
                <div className="absolute inset-0 border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))]" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(2,7,18,0)_0%,rgba(2,7,18,0.18)_48%,rgba(2,7,18,0.34)_100%)]" />

                <motion.div
                  style={{ opacity: mobileHeroOpacity, y: mobileHeroY, scale: mobileHeroScale }}
                  className="relative z-10 mx-auto max-w-[19rem] px-4 pt-4 text-center"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-cyan-300/88">
                    Artheon Energy
                  </p>
                  <h1
                    className="mt-2 font-display text-[1.55rem] font-semibold leading-[0.94] drop-shadow-[0_2px_14px_rgba(2,8,20,0.35)] sm:text-[1.8rem]"
                    style={{ color: panelPalette.title, textShadow: '0 1px 14px rgba(2,8,20,0.22)' }}
                  >
                    <span className="block">Don&apos;t replace</span>
                    <span className="block">your old battery.</span>
                  </h1>
                  <p
                    className="mt-2 text-[0.86rem] font-semibold uppercase tracking-[0.18em] sm:text-[0.95rem]"
                    style={{ color: '#00ff88' }}
                  >
                    Regenerate. Save Earth.
                  </p>
                  <p
                    className="mx-auto mt-3 max-w-[17.5rem] text-[0.88rem] leading-relaxed sm:text-[0.95rem]"
                    style={{ color: panelPalette.body }}
                  >
                    with just this four simple steps, from sulfation buildup to battery recovery,
                    watch your battery come back to life
                  </p>
                </motion.div>

                <motion.div
                  style={{ opacity: mobileStageOpacity }}
                  className="relative z-10 mt-4 flex justify-center"
                >
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activePanel.stageLabel}
                      initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="rounded-full border border-white/10 bg-black/35 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] backdrop-blur-sm"
                      style={{ color: activePanel.accentColor }}
                    >
                      {activePanel.stageLabel}
                    </motion.p>
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  style={{ scale: mobileBatteryScale, y: mobileBatteryY }}
                  className="relative z-10 mt-auto flex w-full items-end justify-center px-4 pb-4"
                >
                  <div className="w-[11.75rem] sm:w-[13rem]">
                    <BatteryGraphic scrollProgress={scrollYProgress} compact />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            <div ref={panelTrackRef} className="relative z-10 pt-8 sm:pt-10 lg:pt-0">
              {STORY_PANELS.map((panel, index) => (
                <StoryCard
                  key={panel.id}
                  panel={panel}
                  panelPalette={panelPalette}
                  isLeadPanel={index === 0}
                  isGloballyActive={index === activePanelIndex}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
