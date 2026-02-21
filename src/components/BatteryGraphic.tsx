import { motion, type MotionValue, useSpring, useTransform } from 'framer-motion';

interface BatteryGraphicProps {
  scrollProgress: MotionValue<number>;
  compact?: boolean;
}

const PLATE_COUNT = 6;

type ElectronBubbleSpec = {
  id: string;
  left: number;
  top: number;
  travel: number;
  duration: number;
  delay: number;
};

const ELECTRON_BUBBLES: ElectronBubbleSpec[] = Array.from({ length: 12 }, (_, index) => ({
  id: `electron-${index}`,
  left: 8 + ((index * 17) % 84),
  top: 14 + ((index * 13) % 64),
  travel: 3 + (index % 4),
  duration: 2.2 + (index % 5) * 0.25,
  delay: (index % 6) * 0.18,
}));

export const BatteryGraphic = ({
  scrollProgress,
  compact = false,
}: BatteryGraphicProps) => {
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.32,
    restDelta: 0.001,
  });

  const fluidScaleY = useTransform(
    smoothProgress,
    [0, 0.2, 0.42, 0.6, 0.78, 1],
    [0.78, 0.2, 0.16, 0.48, 0.58, 0.96],
  );

  const fluidColor = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.7, 1],
    ['#10b981', '#ef4444', '#eab308', '#14b8a6', '#10b981'],
  );

  const crystalOpacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.3, 0.52, 0.65, 1],
    [0, 0, 0.86, 0.86, 0.08, 0],
  );

  const pulseOpacity = useTransform(
    smoothProgress,
    [0, 0.48, 0.62, 0.84, 1],
    [0, 0, 1, 0.62, 0],
  );

  const electronDriftX = useTransform(
    smoothProgress,
    [0, 0.3, 0.42, 0.6, 0.78, 1],
    [0, 10, 16, 5, -7, -14],
  );

  const electronOpacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.42, 0.75, 1],
    [0.14, 0.24, 0.34, 0.3, 0.2],
  );

  const shakeX = useTransform(
    smoothProgress,
    [0, 0.54, 0.58, 0.64, 0.7, 1],
    [0, 0, -0.8, 0.8, 0, 0],
  );

  const haloOpacity = useTransform(
    smoothProgress,
    [0, 0.28, 0.6, 1],
    [0.22, 0.3, 0.42, 0.36],
  );

  const badgeScale = useTransform(smoothProgress, [0, 0.86, 0.96, 1], [0, 0, 1.1, 1]);
  const badgeRotate = useTransform(smoothProgress, [0, 0.86, 0.96, 1], [-92, -92, 14, 10]);

  const frameWidthClass = compact
    ? 'max-w-[148px] sm:max-w-[168px]'
    : 'max-w-[clamp(11.5rem,21vh,19rem)]';

  const terminalWidthClass = compact ? 'w-[62%]' : 'w-[68%]';
  const terminalSlotClass = compact ? 'h-5 w-8' : 'h-6 w-10';
  const shellTopClass = compact ? 'top-3' : 'top-4';
  const shellPaddingClass = compact ? 'p-2' : 'p-3 sm:p-4';
  const shellRoundClass = compact ? 'rounded-[1.8rem]' : 'rounded-[2.5rem]';
  const coreRoundClass = compact ? 'rounded-[1.35rem]' : 'rounded-[2rem]';
  const labelClass = compact
    ? 'bottom-3 w-[66%] max-w-[110px] rounded-lg px-2 py-1'
    : 'bottom-5 w-[62%] max-w-[180px] rounded-xl px-3 py-2';
  const electronBubbles = compact
    ? ELECTRON_BUBBLES.slice(0, 6)
    : ELECTRON_BUBBLES;
  const electronBubbleClass = compact
    ? 'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/40 bg-cyan-300/18 px-[1px] py-[1px] font-mono text-[5px] font-semibold leading-none text-cyan-100'
    : 'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/40 bg-cyan-300/18 px-[2px] py-[1px] font-mono text-[6px] font-semibold leading-none text-cyan-100';

  return (
    <motion.div
      style={{ x: shakeX }}
      className={`relative mx-auto aspect-[4/5] w-full transform-gpu will-change-transform ${frameWidthClass}`}
    >
      <motion.div
        style={{ opacity: haloOpacity }}
        className="absolute -inset-4 rounded-[2.8rem] bg-[radial-gradient(circle,rgba(34,211,238,0.45),rgba(16,185,129,0.18)_46%,transparent_70%)] blur-xl"
      />

      <div
        className={`absolute left-1/2 top-0 z-20 flex -translate-x-1/2 justify-between ${terminalWidthClass}`}
      >
        <div className={`relative ${terminalSlotClass} rounded-t-xl border border-slate-500 bg-gradient-to-b from-slate-400 to-slate-600`}>
          <span className="absolute inset-0 grid place-items-center text-sm font-bold text-slate-900">-</span>
        </div>
        <div className={`relative ${terminalSlotClass} rounded-t-xl border border-rose-400/80 bg-gradient-to-b from-rose-400 to-rose-600`}>
          <span className="absolute inset-0 grid place-items-center text-sm font-bold text-white">+</span>
        </div>
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 ${shellTopClass} overflow-hidden border border-white/15 bg-slate-900/70 shadow-[inset_0_0_24px_rgba(2,6,23,0.92)] ${shellPaddingClass} ${shellRoundClass}`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.08),transparent_22%,transparent_68%,rgba(56,189,248,0.12))]" />

        <div className={`relative h-full overflow-hidden border border-white/10 bg-[#020712] ${coreRoundClass}`}>
          <div className="absolute inset-0 grid grid-cols-6 gap-[2px] p-2">
            {Array.from({ length: PLATE_COUNT }).map((_, index) => (
              <div
                key={`plate-${index}`}
                className="relative overflow-hidden rounded-md border border-white/10 bg-gradient-to-b from-slate-300/30 via-slate-600/35 to-slate-900/60"
              >
                <div className="absolute inset-0 bg-[linear-gradient(transparent_74%,rgba(2,6,23,0.4)_74%)] [background-size:100%_8px]" />
              </div>
            ))}
          </div>

          <motion.div
            style={{ opacity: crystalOpacity }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(251,191,36,0.44),transparent_34%),radial-gradient(circle_at_72%_72%,rgba(254,242,153,0.35),transparent_34%)] mix-blend-hard-light"
          />

          <motion.div
            style={{ opacity: pulseOpacity }}
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(6,182,212,0),rgba(34,211,238,0.44),rgba(6,182,212,0))]"
          />

          <motion.div
            style={{ x: electronDriftX, opacity: electronOpacity }}
            className="pointer-events-none absolute inset-0 transform-gpu will-change-transform"
          >
            {electronBubbles.map((bubble) => (
              <motion.div
                key={bubble.id}
                style={{ left: `${bubble.left}%`, top: `${bubble.top}%` }}
                className={electronBubbleClass}
                animate={{ y: [0, -bubble.travel, 0, bubble.travel, 0] }}
                transition={{
                  duration: bubble.duration,
                  delay: bubble.delay,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              >
                e-
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            style={{ scaleY: fluidScaleY, backgroundColor: fluidColor, originY: 1 }}
            className="absolute inset-x-0 bottom-0 h-full overflow-hidden border-t border-white/20 transform-gpu will-change-transform"
          >
            <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-white/55 to-transparent" />
            <motion.div
              style={{ opacity: pulseOpacity }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(165,243,252,0.38),transparent_60%)]"
            />
          </motion.div>

          <motion.div
            style={{ opacity: pulseOpacity }}
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-200/50 animate-[ping_1.6s_cubic-bezier(0,0,0.2,1)_infinite]" />
            {!compact && (
              <div className="absolute left-1/2 top-1/2 h-[8.5rem] w-[8.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/32 animate-[ping_1.9s_cubic-bezier(0,0,0.2,1)_infinite]" />
            )}
          </motion.div>
        </div>

        <div
          className={`absolute left-1/2 z-30 -translate-x-1/2 border border-white/20 bg-slate-900/78 text-center shadow-[0_20px_40px_-20px_rgba(6,182,212,0.7)] ${labelClass}`}
        >
          <p
            className={`font-mono uppercase text-slate-400 ${
              compact ? 'text-[8px] tracking-[0.16em]' : 'text-[10px] tracking-[0.2em]'
            }`}
          >
            Artheon Energy
          </p>
        </div>
      </div>

      <motion.div
        style={{ scale: badgeScale, rotate: badgeRotate }}
        className={`absolute z-40 grid place-items-center rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-center shadow-[0_22px_60px_-25px_rgba(245,158,11,0.85)] ${
          compact
            ? '-right-3 -top-1 h-16 w-16 border-2 border-amber-100/90'
            : '-right-8 top-0 h-28 w-28 border-4 border-amber-100/90'
        }`}
      >
        <div>
          <p className={`font-display font-black leading-none text-amber-950 ${compact ? 'text-lg' : 'text-3xl'}`}>
            1-2
          </p>
          <p
            className={`font-semibold uppercase text-amber-900/95 ${
              compact ? 'mt-0.5 text-[8px] tracking-[0.14em]' : 'mt-0.5 text-[11px] tracking-[0.2em]'
            }`}
          >
            Years
          </p>
          <p
            className={`font-bold uppercase text-white/90 ${
              compact ? 'text-[7px] tracking-[0.12em]' : 'text-[9px] tracking-[0.2em]'
            }`}
          >
            Warranty
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
