import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useTransform,
} from 'framer-motion';

interface BatteryGraphicProps {
  scrollProgress: MotionValue<number>;
  compact?: boolean;
}

const STATE_STOPS = [0, 0.25, 0.5, 0.75, 1];
const PLATE_COUNT = 6;

const FLOW_PARTICLES = [
  { id: 'p-1', left: 16, baseY: 216, driftX: 6, size: 4 },
  { id: 'p-2', left: 24, baseY: 202, driftX: -4, size: 3 },
  { id: 'p-3', left: 35, baseY: 228, driftX: 8, size: 4 },
  { id: 'p-4', left: 48, baseY: 208, driftX: -6, size: 3 },
  { id: 'p-5', left: 59, baseY: 224, driftX: 7, size: 4 },
  { id: 'p-6', left: 71, baseY: 196, driftX: -5, size: 3 },
  { id: 'p-7', left: 82, baseY: 214, driftX: 5, size: 4 },
];

const CURRENT_LINES = [
  { id: 'l-1', top: 29, offset: -22 },
  { id: 'l-2', top: 43, offset: -10 },
  { id: 'l-3', top: 58, offset: 2 },
  { id: 'l-4', top: 72, offset: 12 },
];

const FlowParticle = ({
  scrollProgress,
  left,
  baseY,
  driftX,
  size,
}: {
  scrollProgress: MotionValue<number>;
  left: number;
  baseY: number;
  driftX: number;
  size: number;
}) => {
  const x = useTransform(
    scrollProgress,
    STATE_STOPS,
    [0, driftX * 0.18, driftX * 0.48, driftX * 0.92, driftX * 0.42],
  );
  const y = useTransform(
    scrollProgress,
    STATE_STOPS,
    [baseY + 20, baseY + 8, baseY - 6, baseY - 22, baseY - 12],
  );
  const opacity = useTransform(scrollProgress, STATE_STOPS, [0, 0.1, 0.26, 0.52, 0.18]);
  const scale = useTransform(scrollProgress, STATE_STOPS, [0.4, 0.72, 0.9, 1.02, 0.7]);

  return (
    <motion.div
      style={{ left: `${left}%`, top: 0, x, y, opacity, scale }}
      className="absolute -translate-x-1/2 rounded-full border border-[#9ef6cf]/35 bg-[#9ef6cf]/30"
      aria-hidden="true"
    >
      <div
        className="rounded-full bg-[#dfffee]"
        style={{ height: `${size}px`, width: `${size}px` }}
      />
    </motion.div>
  );
};

const CurrentLine = ({
  scrollProgress,
  top,
  offset,
}: {
  scrollProgress: MotionValue<number>;
  top: number;
  offset: number;
}) => {
  const x = useTransform(scrollProgress, STATE_STOPS, [offset - 20, offset - 8, offset, offset + 8, offset + 4]);
  const scaleX = useTransform(scrollProgress, STATE_STOPS, [0, 0.18, 0.6, 0.92, 0.38]);
  const opacity = useTransform(scrollProgress, STATE_STOPS, [0, 0.18, 0.58, 0.76, 0.14]);

  return (
    <motion.div
      style={{ top: `${top}%`, x, scaleX, opacity }}
      className="absolute left-[9%] h-px w-[82%] origin-left bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(210,255,235,0.88),rgba(255,255,255,0))]"
      aria-hidden="true"
    />
  );
};

export const BatteryGraphic = ({
  scrollProgress,
  compact = false,
}: BatteryGraphicProps) => {
  const shellGlow = useTransform(scrollProgress, STATE_STOPS, [0.05, 0.12, 0.18, 0.3, 0.42]);
  const energyColor = useTransform(
    scrollProgress,
    STATE_STOPS,
    ['#cc2200', '#f97316', '#facc15', '#22c55e', '#00ff88'],
  );
  const terminalGlowColor = useTransform(
    scrollProgress,
    STATE_STOPS,
    [
      'rgba(204,34,0,0.24)',
      'rgba(249,115,22,0.3)',
      'rgba(250,204,21,0.34)',
      'rgba(34,197,94,0.4)',
      'rgba(0,255,136,0.48)',
    ],
  );
  const fillHeight = useTransform(scrollProgress, STATE_STOPS, ['0.5%', '25%', '50%', '75%', '100%']);
  const fillOpacity = useTransform(scrollProgress, STATE_STOPS, [0.14, 0.56, 0.72, 0.84, 0.96]);
  const crackOpacity = useTransform(scrollProgress, STATE_STOPS, [0.82, 0.56, 0.28, 0.08, 0]);
  const chargePulseOpacity = useTransform(scrollProgress, STATE_STOPS, [0, 0.18, 0.38, 0.28, 0.14]);
  const regenMistOpacity = useTransform(scrollProgress, STATE_STOPS, [0, 0.04, 0.12, 0.28, 0.46]);
  const staticNoiseOpacity = useTransform(scrollProgress, STATE_STOPS, [0.35, 0.22, 0.12, 0.04, 0]);
  const caseRimOpacity = useTransform(scrollProgress, STATE_STOPS, [0.3, 0.4, 0.52, 0.7, 0.9]);

  const auraBackground = useMotionTemplate`radial-gradient(circle, rgba(0,255,136, ${shellGlow}), rgba(0,255,136, 0) 68%)`;
  const shellShadow = useMotionTemplate`0 32px 80px -44px rgba(0,255,136, ${shellGlow}), inset 0 0 28px rgba(1,4,9,0.94)`;
  const rimGlow = useMotionTemplate`0 0 0 1px rgba(199,255,230, ${caseRimOpacity}), inset 0 0 24px rgba(0,255,136, ${shellGlow})`;
  const energyField = useMotionTemplate`linear-gradient(180deg, rgba(255,255,255,0.34) 0%, ${energyColor} 18%, ${energyColor} 100%)`;
  const innerPulse = useMotionTemplate`radial-gradient(circle at 50% 85%, rgba(255,255,255, ${chargePulseOpacity}), rgba(0,255,136, 0) 62%)`;
  const terminalGlow = useMotionTemplate`0 0 24px ${terminalGlowColor}`;

  return (
    <motion.div
      className={`relative mx-auto aspect-[0.76] w-full ${
        compact
          ? 'max-w-[min(9rem,38vw)] sm:max-w-[10rem]'
          : 'max-w-[min(13.5rem,56vw)] sm:max-w-[15.5rem] lg:max-w-[19rem] xl:max-w-[20.5rem]'
      }`}
      aria-hidden="true"
    >
      <motion.div
        style={{ backgroundImage: auraBackground }}
        className="pointer-events-none absolute -inset-8 rounded-[3rem] blur-2xl"
      />

      <div className="absolute left-1/2 top-0 z-20 flex w-[70%] -translate-x-1/2 justify-between">
        <motion.div
          style={{ boxShadow: terminalGlow }}
          className="relative h-7 w-10 rounded-t-xl border border-slate-500 bg-gradient-to-b from-slate-400 to-slate-700"
        >
          <span className="absolute inset-0 grid place-items-center text-sm font-bold text-slate-950">-</span>
        </motion.div>
        <motion.div
          style={{ boxShadow: terminalGlow }}
          className="relative h-7 w-10 rounded-t-xl border border-rose-300/80 bg-gradient-to-b from-rose-400 to-rose-700"
        >
          <span className="absolute inset-0 grid place-items-center text-sm font-bold text-white">+</span>
        </motion.div>
      </div>

      <motion.div
        style={{ boxShadow: shellShadow }}
        className="absolute inset-x-0 bottom-0 top-5 overflow-hidden rounded-[2.8rem] border border-white/12 bg-[#0a0f15] p-4"
      >
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.08),transparent_26%,transparent_68%,rgba(0,255,136,0.08))]" />
        <motion.div
          style={{ boxShadow: rimGlow }}
          className="absolute inset-[0.9rem] overflow-hidden rounded-[2.15rem] border border-white/10 bg-[#05080d]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%,transparent_82%,rgba(255,255,255,0.03))]" />

          <div className="absolute inset-0 grid grid-cols-6 gap-[3px] p-3">
            {Array.from({ length: PLATE_COUNT }).map((_, index) => (
              <div
                key={`plate-${index}`}
                className="relative overflow-hidden rounded-md border border-white/8 bg-[linear-gradient(180deg,rgba(226,232,240,0.2),rgba(71,85,105,0.22)_28%,rgba(15,23,42,0.78))]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(transparent_74%,rgba(2,6,23,0.55)_74%)] [background-size:100%_9px]" />
              </div>
            ))}
          </div>

          <motion.div
            style={{ height: fillHeight, opacity: fillOpacity, background: energyField }}
            className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/12"
          >
            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/40 to-transparent" />
            <motion.div
              style={{ backgroundImage: innerPulse }}
              className="absolute inset-0"
            />
          </motion.div>

          {CURRENT_LINES.map((line) => (
            <CurrentLine
              key={line.id}
              scrollProgress={scrollProgress}
              top={line.top}
              offset={line.offset}
            />
          ))}

          {FLOW_PARTICLES.map((particle) => (
            <FlowParticle
              key={particle.id}
              scrollProgress={scrollProgress}
              left={particle.left}
              baseY={particle.baseY}
              driftX={particle.driftX}
              size={particle.size}
            />
          ))}

          <motion.div
            style={{ opacity: regenMistOpacity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_82%,rgba(175,255,219,0.44),transparent_58%),radial-gradient(circle_at_48%_28%,rgba(0,255,136,0.14),transparent_46%)]"
          />

          <motion.div
            style={{ opacity: staticNoiseOpacity }}
            className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:7px_7px,7px_7px] mix-blend-screen"
          />

          <motion.svg
            viewBox="0 0 240 320"
            style={{ opacity: crackOpacity }}
            className="absolute inset-0 h-full w-full"
          >
            <path
              d="M48 86 75 124 68 153 89 192 78 234"
              stroke="rgba(255,245,240,0.42)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M126 66 112 108 135 134 120 186 146 226"
              stroke="rgba(255,245,240,0.36)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M184 92 168 138 186 166 172 212 188 246"
              stroke="rgba(255,245,240,0.38)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M92 140 58 162"
              stroke="rgba(255,245,240,0.28)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M141 170 170 186"
              stroke="rgba(255,245,240,0.26)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </motion.svg>

          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/10 to-transparent" />
        </motion.div>

        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center">
          <div className="rounded-full border border-white/12 bg-black/40 px-4 py-2 shadow-[inset_0_0_12px_rgba(0,0,0,0.5)] backdrop-blur-sm">
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-slate-300">
              VRLA Cell Monitor
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
