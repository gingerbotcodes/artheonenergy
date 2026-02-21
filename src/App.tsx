import { useRef, useState, type ReactNode } from 'react';
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

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'problem',
    navLabel: 'Problem',
    sequence: '01',
    eyebrow: 'Failure Pattern',
    title: 'Sulfation Gradually Strangles Healthy Cells',
    description:
      'High-cycling fleets lose runtime because hardened sulfate crystals lock active material on lead plates. The battery still looks normal while usable capacity drops week by week.',
    highlights: [
      'Runtime fades before voltage alarms trigger.',
      'Replacement cycles accelerate across entire fleets.',
      'Idle charging windows hide structural damage.',
      'Unplanned downtime compounds logistics cost.',
    ],
    impactLabel: 'Typical pre-regeneration retention',
    impactValue: '35-55%',
    accent:
      'bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.24),transparent_58%)]',
  },
  {
    id: 'diagnostics',
    navLabel: 'Diagnostics',
    sequence: '02',
    eyebrow: 'Signal Scan',
    title: 'RG-16X Maps Degradation Before It Treats',
    description:
      'Each battery is profiled for resistance behavior and pulse response. That diagnostic pass determines the regeneration band so energy is focused on crystal breakup instead of plate stress.',
    highlights: [
      'Cell behavior is profiled before pulse application.',
      'Pulse width and cadence are tuned by response curve.',
      'Process windows are built for repeated industrial use.',
      'Technician workflow is standardized across sites.',
    ],
    impactLabel: 'Initial screening turnaround',
    impactValue: '8-12 min',
    accent:
      'bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.24),transparent_58%)]',
  },
  {
    id: 'regeneration',
    navLabel: 'Regeneration',
    sequence: '03',
    eyebrow: 'Pulse Treatment',
    title: 'High-Frequency Pulses Dissolve Crystal Buildup',
    description:
      'Targeted resonance disrupts sulfate structures and returns active material to the electrolyte cycle. The process restores performance while preserving the battery chassis and lead architecture.',
    highlights: [
      'Crystal fragmentation happens in controlled stages.',
      'Thermal profile remains stable during pulse cycles.',
      'Electrolyte activity recovers without harsh stripping.',
      'Reconditioning can be repeated across battery lifespan.',
    ],
    impactLabel: 'Primary cycle duration',
    impactValue: '2-4 hrs',
    accent:
      'bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.24),transparent_58%)]',
  },
  {
    id: 'impact',
    navLabel: 'Impact',
    sequence: '04',
    eyebrow: 'Operational ROI',
    title: 'Recovered Capacity, Lower Spend, Longer Asset Life',
    description:
      'Most treated batteries recover into an operational range that eliminates urgent replacement pressure. Teams gain predictable uptime and redirect capital away from avoidable battery swaps.',
    highlights: [
      'Recovered batteries re-enter rotation immediately.',
      'Replacement budget drops by up to 70%.',
      'Fleet reliability improves across peak shifts.',
      'Warranty-backed output supports procurement confidence.',
    ],
    impactLabel: 'Post-regeneration usable capacity',
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

const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-[0_18px_30px_-24px_rgba(8,145,178,0.7)] backdrop-blur-xl sm:p-4">
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
      {label}
    </p>
    <p className="mt-1 font-display text-xl font-bold text-slate-100 sm:text-2xl">
      {value}
    </p>
  </div>
);

function App() {
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

  const recoveryScoreValue = useTransform(smoothProgress, [0, 1], [38, 94]);
  const savingsScoreValue = useTransform(smoothProgress, [0, 1], [18, 70]);
  const uptimeScoreValue = useTransform(smoothProgress, [0, 1], [71, 97]);

  const [recoveryScore, setRecoveryScore] = useState(38);
  const [savingsScore, setSavingsScore] = useState(18);
  const [uptimeScore, setUptimeScore] = useState(71);

  useMotionValueEvent(recoveryScoreValue, 'change', (latest) => {
    setRecoveryScore(Math.round(latest));
  });
  useMotionValueEvent(savingsScoreValue, 'change', (latest) => {
    setSavingsScore(Math.round(latest));
  });
  useMotionValueEvent(uptimeScoreValue, 'change', (latest) => {
    setUptimeScore(Math.round(latest));
  });

  return (
    <div className="relative overflow-x-clip bg-ink-950 text-slate-100">
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
      />

      <main
        ref={containerRef}
        className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-4 pb-24 pt-28 sm:px-6 md:pt-32 lg:flex-row lg:items-start lg:gap-14 lg:px-10"
      >
        <aside className="relative w-full lg:sticky lg:top-28 lg:h-[calc(100vh-8.25rem)] lg:w-[46%]">
          <motion.div
            style={{ rotateX: stageTilt }}
            className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_36px_90px_-42px_rgba(15,23,42,0.95)] backdrop-blur-2xl sm:p-7 lg:p-9"
          >
            <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(56,189,248,0.08),transparent_42%,rgba(16,185,129,0.08))]" />
            <div className="relative z-10 flex h-full flex-col gap-8">
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300/90">
                  Regeneration Storyline
                </p>
                <h1 className="font-display text-4xl font-bold leading-[1.04] text-white sm:text-5xl lg:text-[3.35rem]">
                  Don&apos;t Replace.
                  <br />
                  <span className="text-transparent bg-gradient-to-r from-emerald-300 via-cyan-200 to-cyan-400 bg-clip-text">
                    Recover Battery Life.
                  </span>
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  A single scroll shows the full cycle from sulfation damage to
                  measurable recovery with Artheon&apos;s RG-16X pulse regeneration.
                </p>
              </div>

              <div className="grid flex-1 place-items-center">
                <BatteryGraphic scrollProgress={smoothProgress} />
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <MetricCard label="Recovered" value={`${recoveryScore}%`} />
                <MetricCard label="Savings" value={`${savingsScore}%`} />
                <MetricCard label="Uptime" value={`${uptimeScore}%`} />
              </div>
            </div>
          </motion.div>
        </aside>

        <div className="relative flex w-full flex-col gap-12 pb-8 lg:w-[54%] lg:gap-16">
          <div className="pointer-events-none absolute -left-6 top-0 hidden h-full w-px bg-white/10 lg:block" />
          <motion.div
            style={{ height: timelineHeight }}
            className="pointer-events-none absolute -left-6 top-0 hidden w-px bg-gradient-to-b from-cyan-300 via-emerald-400 to-emerald-500 lg:block"
          />

          {STORY_CHAPTERS.map((chapter, index) => (
            <section
              key={chapter.id}
              id={chapter.id}
              className="min-h-[76vh] scroll-mt-28 pt-3 md:scroll-mt-32"
            >
              <FadeInBlock delay={index * 0.05}>
                <article className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_26px_60px_-32px_rgba(7,89,133,0.75)] backdrop-blur-2xl sm:p-8 lg:p-10">
                  <div className={`absolute inset-0 ${chapter.accent}`} />
                  <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(255,255,255,0.08),transparent_28%,transparent_66%,rgba(255,255,255,0.06))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10 space-y-6">
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/90">
                      {chapter.sequence} / {chapter.eyebrow}
                    </p>
                    <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.85rem]">
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
                </article>
              </FadeInBlock>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
