import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from 'framer-motion';

interface BatteryGraphicProps {
  scrollProgress: MotionValue<number>;
}

type ParticleSpec = {
  id: string;
  left: number;
  top: number;
  drift: number;
  travel: number;
  duration: number;
  delay: number;
};

const PLATE_COUNT = 6;

const PARTICLE_SPECS: ParticleSpec[] = Array.from({ length: 10 }, (_, index) => {
  const left = 12 + ((index * 37) % 74);
  const top = 42 + ((index * 19) % 35);
  const drift = (index % 2 === 0 ? 1 : -1) * (14 + (index % 5) * 8);
  const travel = 34 + (index % 4) * 14;
  const duration = 2.3 + (index % 4) * 0.4;
  const delay = (index % 6) * 0.22;

  return {
    id: `particle-${index}`,
    left,
    top,
    drift,
    travel,
    duration,
    delay,
  };
});

export const BatteryGraphic = ({ scrollProgress }: BatteryGraphicProps) => {
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.4,
    restDelta: 0.001,
  });

  const fluidLevel = useTransform(
    smoothProgress,
    [0, 0.2, 0.42, 0.6, 0.78, 1],
    ['78%', '20%', '16%', '48%', '58%', '96%'],
  );

  const fluidHue = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.7, 1],
    [160, 4, 42, 168, 154],
  );

  const fluidColor = useMotionTemplate`hsl(${fluidHue} 82% 53%)`;

  const crystalOpacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.3, 0.52, 0.65, 1],
    [0, 0, 0.9, 0.95, 0.12, 0],
  );

  const pulseOpacity = useTransform(
    smoothProgress,
    [0, 0.48, 0.62, 0.84, 1],
    [0, 0, 1, 0.7, 0],
  );

  const sparkleOpacity = useTransform(smoothProgress, [0, 0.72, 0.88, 1], [0, 0, 0.55, 1]);

  const jitterX = useTransform(
    smoothProgress,
    [0, 0.52, 0.57, 0.62, 0.67, 0.72, 1],
    [0, 0, -2, 2, -2, 1, 0],
  );

  const jitterY = useTransform(
    smoothProgress,
    [0, 0.52, 0.57, 0.62, 0.67, 0.72, 1],
    [0, 0, 1, -1, 1, -1, 0],
  );

  const haloShadow = useTransform(
    smoothProgress,
    [0, 0.28, 0.6, 1],
    [
      '0 0 70px rgba(16,185,129,0.26)',
      '0 0 90px rgba(244,63,94,0.28)',
      '0 0 130px rgba(34,211,238,0.42)',
      '0 0 110px rgba(16,185,129,0.52)',
    ],
  );

  const badgeScale = useTransform(smoothProgress, [0, 0.86, 0.96, 1], [0, 0, 1.12, 1]);
  const badgeRotate = useTransform(smoothProgress, [0, 0.86, 0.96, 1], [-92, -92, 16, 10]);

  return (
    <motion.div
      style={{ x: jitterX, y: jitterY }}
      className="relative mx-auto aspect-[4/5] w-full max-w-[370px]"
    >
      <motion.div
        style={{ boxShadow: haloShadow }}
        className="absolute -inset-5 rounded-[2.8rem]"
      />

      <div className="absolute left-1/2 top-0 z-20 flex w-[68%] -translate-x-1/2 justify-between">
        <div className="h-6 w-10 rounded-t-xl border border-slate-500 bg-gradient-to-b from-slate-400 to-slate-600" />
        <div className="relative h-6 w-10 rounded-t-xl border border-rose-400/80 bg-gradient-to-b from-rose-400 to-rose-600">
          <span className="absolute inset-0 grid place-items-center text-sm font-bold text-white">+</span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 top-4 overflow-hidden rounded-[2.5rem] border border-white/15 bg-slate-900/70 p-3 shadow-[inset_0_0_35px_rgba(2,6,23,0.95)] backdrop-blur-xl sm:p-4">
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.08),transparent_22%,transparent_68%,rgba(56,189,248,0.12))]" />

        <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#020712]">
          <div className="absolute inset-0 grid grid-cols-6 gap-[2px] p-2">
            {Array.from({ length: PLATE_COUNT }).map((_, index) => (
              <div
                key={`plate-${index}`}
                className="relative overflow-hidden rounded-md border border-white/10 bg-gradient-to-b from-slate-300/30 via-slate-600/35 to-slate-900/60"
              >
                <div className="absolute inset-0 bg-[linear-gradient(transparent_74%,rgba(2,6,23,0.4)_74%)] [background-size:100%_8px]" />
                <motion.div
                  style={{ opacity: crystalOpacity }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(251,191,36,0.45),transparent_34%),radial-gradient(circle_at_72%_72%,rgba(254,242,153,0.4),transparent_34%)] mix-blend-hard-light"
                />
                <motion.div
                  style={{ opacity: pulseOpacity }}
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,182,212,0),rgba(34,211,238,0.55),rgba(6,182,212,0))]"
                />
              </div>
            ))}
          </div>

          <motion.div
            style={{ height: fluidLevel, background: fluidColor }}
            className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/20"
          >
            <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-white/55 to-transparent" />
            <motion.div
              style={{ opacity: pulseOpacity }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(165,243,252,0.4),transparent_60%)]"
            />
            <motion.div
              style={{ opacity: sparkleOpacity }}
              className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.26)_0%,transparent_32%,transparent_68%,rgba(255,255,255,0.22)_100%)]"
            />
          </motion.div>

          <motion.div
            style={{ opacity: pulseOpacity }}
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-200/55 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/35 animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite]" />
          </motion.div>

          <motion.div
            style={{ opacity: sparkleOpacity }}
            className="pointer-events-none absolute -inset-8"
          >
            {PARTICLE_SPECS.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute h-2 w-2 rounded-full bg-emerald-200 shadow-[0_0_14px_rgba(110,231,183,0.85)]"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
                animate={{
                  y: [0, -particle.travel],
                  x: [0, particle.drift],
                  opacity: [0, 0.9, 0],
                  scale: [0.2, 1.2, 0.1],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-30 w-[62%] max-w-[180px] -translate-x-1/2 rounded-xl border border-white/20 bg-slate-900/78 px-3 py-2 text-center shadow-[0_20px_40px_-20px_rgba(6,182,212,0.7)] backdrop-blur-lg">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
            Artheon Energy
          </p>
          <p className="font-display text-lg font-bold tracking-[0.08em] text-white">RG-16X</p>
        </div>
      </div>

      <motion.div
        style={{ scale: badgeScale, rotate: badgeRotate }}
        className="absolute -right-8 top-0 z-40 grid h-28 w-28 place-items-center rounded-full border-4 border-amber-100/90 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-center shadow-[0_22px_60px_-25px_rgba(245,158,11,0.85)]"
      >
        <div>
          <p className="font-display text-3xl font-black leading-none text-amber-950">1-2</p>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900/95">
            Years
          </p>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90">
            Warranty
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
