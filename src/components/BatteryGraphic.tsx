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
const CELL_COUNT = 6;

const FLOW_PARTICLES = [
  { id: 'p-1', left: 11, top: 74, driftX: 5, rise: 8, size: 3 },
  { id: 'p-2', left: 20, top: 66, driftX: -4, rise: 7, size: 2 },
  { id: 'p-3', left: 31, top: 72, driftX: 4, rise: 9, size: 3 },
  { id: 'p-4', left: 42, top: 64, driftX: -5, rise: 7, size: 2 },
  { id: 'p-5', left: 55, top: 70, driftX: 6, rise: 8, size: 3 },
  { id: 'p-6', left: 68, top: 63, driftX: -4, rise: 7, size: 2 },
  { id: 'p-7', left: 80, top: 71, driftX: 5, rise: 8, size: 3 },
];

const CURRENT_LINES = [
  { id: 'l-1', top: 18, offset: -12 },
  { id: 'l-2', top: 36, offset: -4 },
  { id: 'l-3', top: 54, offset: 4 },
  { id: 'l-4', top: 72, offset: 12 },
];

const CellParticle = ({
  scrollProgress,
  left,
  top,
  driftX,
  rise,
  size,
}: {
  scrollProgress: MotionValue<number>;
  left: number;
  top: number;
  driftX: number;
  rise: number;
  size: number;
}) => {
  const x = useTransform(
    scrollProgress,
    STATE_STOPS,
    [0, driftX * 0.15, driftX * 0.48, driftX * 0.9, driftX * 0.36],
  );
  const y = useTransform(
    scrollProgress,
    STATE_STOPS,
    ['10%', `${-rise * 0.15}%`, `${-rise * 0.5}%`, `${-rise}%`, `${-rise * 0.38}%`],
  );
  const opacity = useTransform(scrollProgress, STATE_STOPS, [0, 0.08, 0.22, 0.5, 0.18]);
  const scale = useTransform(scrollProgress, STATE_STOPS, [0.5, 0.72, 0.92, 1.04, 0.72]);

  return (
    <motion.div
      style={{ left: `${left}%`, top: `${top}%`, x, y, opacity, scale }}
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cffff0]/35 bg-[#b7ffe2]/30"
      aria-hidden="true"
    >
      <div
        className="rounded-full bg-[#effff7]"
        style={{ width: `${size}px`, height: `${size}px` }}
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
  const x = useTransform(
    scrollProgress,
    STATE_STOPS,
    [`${offset - 8}%`, `${offset - 3}%`, `${offset}%`, `${offset + 3}%`, `${offset + 1}%`],
  );
  const scaleX = useTransform(scrollProgress, STATE_STOPS, [0, 0.18, 0.62, 0.96, 0.4]);
  const opacity = useTransform(scrollProgress, STATE_STOPS, [0, 0.18, 0.58, 0.78, 0.16]);

  return (
    <motion.div
      style={{ top: `${top}%`, x, scaleX, opacity }}
      className="absolute left-[7%] h-px w-[86%] origin-left bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(214,255,240,0.86),rgba(255,255,255,0))]"
      aria-hidden="true"
    />
  );
};

export const BatteryGraphic = ({
  scrollProgress,
  compact = false,
}: BatteryGraphicProps) => {
  const shellGlow = useTransform(scrollProgress, STATE_STOPS, [0.04, 0.1, 0.16, 0.28, 0.42]);
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
      'rgba(249,115,22,0.28)',
      'rgba(250,204,21,0.34)',
      'rgba(34,197,94,0.42)',
      'rgba(0,255,136,0.5)',
    ],
  );
  const fillHeight = useTransform(scrollProgress, STATE_STOPS, ['1%', '25%', '50%', '75%', '100%']);
  const fillOpacity = useTransform(scrollProgress, STATE_STOPS, [0.12, 0.5, 0.68, 0.84, 0.96]);
  const crackOpacity = useTransform(scrollProgress, STATE_STOPS, [0.82, 0.56, 0.26, 0.08, 0]);
  const pulseOpacity = useTransform(scrollProgress, STATE_STOPS, [0, 0.16, 0.34, 0.24, 0.12]);
  const mistOpacity = useTransform(scrollProgress, STATE_STOPS, [0, 0.04, 0.12, 0.3, 0.48]);
  const staticNoiseOpacity = useTransform(scrollProgress, STATE_STOPS, [0.3, 0.2, 0.1, 0.03, 0]);
  const rimOpacity = useTransform(scrollProgress, STATE_STOPS, [0.28, 0.36, 0.48, 0.7, 0.9]);
  const capGlowOpacity = useTransform(scrollProgress, STATE_STOPS, [0.08, 0.14, 0.22, 0.34, 0.48]);

  const auraBackground = useMotionTemplate`radial-gradient(circle, rgba(0,255,136, ${shellGlow}), rgba(0,255,136, 0) 70%)`;
  const shellShadow = useMotionTemplate`0 34px 90px -48px rgba(0,255,136, ${shellGlow}), inset 0 0 28px rgba(2,5,10,0.96)`;
  const terminalGlow = useMotionTemplate`0 0 28px ${terminalGlowColor}`;
  const rimGlow = useMotionTemplate`0 0 0 1px rgba(210,255,235, ${rimOpacity}), inset 0 0 24px rgba(0,255,136, ${shellGlow})`;
  const energyField = useMotionTemplate`linear-gradient(180deg, rgba(255,255,255,0.36) 0%, ${energyColor} 16%, ${energyColor} 100%)`;
  const pulseField = useMotionTemplate`radial-gradient(circle at 50% 86%, rgba(255,255,255, ${pulseOpacity}), rgba(0,255,136, 0) 62%)`;
  const capGlow = useMotionTemplate`0 0 16px rgba(255,255,255, ${capGlowOpacity})`;

  const wrapperWidthClass = compact
    ? 'max-w-[min(10.5rem,44vw)] sm:max-w-[11.5rem]'
    : 'max-w-[min(18rem,72vw)] sm:max-w-[20rem] lg:max-w-[23rem] xl:max-w-[25rem]';

  const windowInsetClass = compact ? 'inset-x-[0.9rem] bottom-[1.3rem] top-[3rem]' : 'inset-x-[1.2rem] bottom-[1.6rem] top-[3.35rem]';
  const labelClass = compact
    ? 'bottom-3 rounded-lg px-3 py-1.5 text-[8px] tracking-[0.2em]'
    : 'bottom-4 rounded-xl px-4 py-2 text-[9px] tracking-[0.28em]';

  return (
    <motion.div
      className={`relative mx-auto aspect-[1.04] w-full ${wrapperWidthClass}`}
      aria-hidden="true"
    >
      <motion.div
        style={{ backgroundImage: auraBackground }}
        className="pointer-events-none absolute -inset-10 rounded-[3rem] blur-3xl"
      />

      <div className="absolute left-[8%] right-[8%] top-0 z-20 flex items-end justify-between">
        <motion.div
          style={{ boxShadow: terminalGlow }}
          className="relative h-8 w-9 rounded-t-lg border border-slate-500 bg-gradient-to-b from-slate-300 to-slate-700"
        >
          <span className="absolute inset-0 grid place-items-center text-sm font-black text-slate-950">-</span>
        </motion.div>
        <motion.div
          style={{ boxShadow: terminalGlow }}
          className="relative h-8 w-9 rounded-t-lg border border-rose-300/80 bg-gradient-to-b from-rose-400 to-rose-700"
        >
          <span className="absolute inset-0 grid place-items-center text-sm font-black text-white">+</span>
        </motion.div>
      </div>

      <motion.div
        style={{ boxShadow: shellShadow }}
        className="absolute inset-x-0 bottom-0 top-4 overflow-hidden rounded-[1.55rem] border border-white/12 bg-[linear-gradient(180deg,#161d28,#0b1119_22%,#080d14_100%)]"
      >
        <div className="absolute inset-x-0 top-0 h-[3.2rem] border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03)_46%,rgba(0,0,0,0.18))]" />
        <div className="absolute left-[20%] right-[20%] top-[0.7rem] h-[0.42rem] rounded-full border border-white/8 bg-black/35 shadow-[inset_0_1px_4px_rgba(255,255,255,0.08)]" />

        <div className="absolute inset-x-[9%] top-[1.2rem] flex justify-between">
          {Array.from({ length: CELL_COUNT }).map((_, index) => (
            <motion.div
              key={`cap-${index}`}
              style={{ boxShadow: capGlow }}
              className="h-3.5 w-3.5 rounded-full border border-white/18 bg-[linear-gradient(180deg,#111827,#334155)]"
            />
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[2.9rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.18))]" />
        <div className="absolute inset-x-[8%] bottom-[1.2rem] flex justify-between opacity-35">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={`rib-${index}`} className="h-6 w-[12%] rounded-t-sm bg-white/[0.06]" />
          ))}
        </div>

        <motion.div
          style={{ boxShadow: rimGlow }}
          className={`absolute ${windowInsetClass} overflow-hidden rounded-[1rem] border border-white/12 bg-[#05070c]`}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%,transparent_82%,rgba(255,255,255,0.04))]" />

          <div className="absolute inset-0 grid grid-cols-6 gap-[2px] p-2.5">
            {Array.from({ length: CELL_COUNT }).map((_, index) => (
              <div
                key={`cell-${index}`}
                className="relative overflow-hidden rounded-[0.35rem] border border-white/8 bg-[linear-gradient(180deg,rgba(203,213,225,0.2),rgba(71,85,105,0.24)_26%,rgba(15,23,42,0.88))]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(transparent_72%,rgba(2,6,23,0.54)_72%)] [background-size:100%_8px]" />
              </div>
            ))}
          </div>

          <motion.div
            style={{ height: fillHeight, opacity: fillOpacity, background: energyField }}
            className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/12"
          >
            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/38 to-transparent" />
            <motion.div
              style={{ backgroundImage: pulseField }}
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
            <CellParticle
              key={particle.id}
              scrollProgress={scrollProgress}
              left={particle.left}
              top={particle.top}
              driftX={particle.driftX}
              rise={particle.rise}
              size={particle.size}
            />
          ))}

          <motion.div
            style={{ opacity: mistOpacity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(185,255,228,0.44),transparent_56%),radial-gradient(circle_at_48%_24%,rgba(0,255,136,0.15),transparent_46%)]"
          />

          <motion.div
            style={{ opacity: staticNoiseOpacity }}
            className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:8px_8px,8px_8px] mix-blend-screen"
          />

          <motion.svg
            viewBox="0 0 260 170"
            style={{ opacity: crackOpacity }}
            className="absolute inset-0 h-full w-full"
          >
            <path
              d="M42 26 58 54 49 77 65 102 58 134"
              stroke="rgba(255,245,240,0.38)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M121 18 111 49 128 70 116 104 136 134"
              stroke="rgba(255,245,240,0.32)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M205 24 191 56 206 82 193 116 209 142"
              stroke="rgba(255,245,240,0.34)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M77 76 52 92"
              stroke="rgba(255,245,240,0.24)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M150 90 175 104"
              stroke="rgba(255,245,240,0.22)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </motion.svg>

          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/10 to-transparent" />
        </motion.div>

        <div className={`absolute left-1/2 -translate-x-1/2 border border-white/12 bg-black/35 backdrop-blur-sm ${labelClass}`}>
          <p className="battery-brand-text font-mono uppercase text-slate-300">
            Artheon Energy
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
