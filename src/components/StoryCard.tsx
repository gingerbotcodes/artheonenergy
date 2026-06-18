import { useRef } from 'react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PanelPalette {
  surfaceTop: string;
  surfaceBottom: string;
  heroSurfaceTop: string;
  heroSurfaceBottom: string;
  sheen: string;
  cornerGlow: string;
  edgeGlow: string;
  title: string;
  body: string;
  meta: string;
  metric: string;
  shadow: string;
  activeRing: string;
}

interface StoryPanel {
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
}

interface StoryCardProps {
  panel: StoryPanel;
  panelPalette: PanelPalette;
  isLeadPanel: boolean;
  /** Global active index — used for accent glow intensity */
  isGloballyActive: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Attempt to extract a leading number from a metric string.
 * Returns null if the string doesn't start with a parseable number.
 */
const parseMetricNumber = (value: string): { num: number; prefix: string; suffix: string } | null => {
  const match = value.match(/^([+-]?)(\d+(?:\.\d+)?)\s*(.*)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    num: parseFloat(match[2]),
    suffix: match[3],
  };
};

/* ------------------------------------------------------------------ */
/*  Animated metric display                                            */
/* ------------------------------------------------------------------ */

const AnimatedMetric = ({
  targetValue,
  cardProgress,
  color,
}: {
  targetValue: string;
  cardProgress: MotionValue<number>;
  color: string;
}) => {
  const parsed = parseMetricNumber(targetValue);
  const [displayValue, setDisplayValue] = useState(targetValue);

  // Map card progress 0.35..0.7 → 0..1 for the counter animation
  const counterProgress = useTransform(cardProgress, [0.25, 0.65], [0, 1]);

  useMotionValueEvent(counterProgress, 'change', (latest) => {
    if (!parsed) return;
    const clamped = Math.min(1, Math.max(0, latest));
    const current = Math.round(parsed.num * clamped);
    setDisplayValue(`${parsed.prefix}${current}${parsed.suffix}`);
  });

  if (!parsed) {
    // Non-numeric metrics (like "0-15%") just fade in
    return (
      <p
        className="font-display text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl"
        style={{ color }}
      >
        {targetValue}
      </p>
    );
  }

  return (
    <p
      className="font-display text-5xl font-semibold leading-none tabular-nums sm:text-6xl lg:text-7xl"
      style={{ color }}
    >
      {displayValue}
    </p>
  );
};

/* ------------------------------------------------------------------ */
/*  StoryCard                                                          */
/* ------------------------------------------------------------------ */

export const StoryCard = ({
  panel,
  panelPalette,
  isLeadPanel,
  isGloballyActive,
}: StoryCardProps) => {
  const cardRef = useRef<HTMLElement>(null);

  // Per-card scroll progress: 0 when card bottom hits viewport bottom,
  // 1 when card center reaches viewport center.
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'],
  });

  /* ---- Card entrance transforms ---- */
  const cardY = useTransform(cardProgress, [0, 0.6, 1], [50, 12, 0]);
  const cardOpacity = useTransform(cardProgress, [0, 0.3, 0.7], [0, 0.7, 1]);
  const cardScale = useTransform(cardProgress, [0, 0.5, 1], [0.965, 0.985, 1]);

  /* ---- Staggered content reveals ---- */
  const eyebrowOpacity = useTransform(cardProgress, [0.1, 0.4], [0, 1]);
  const eyebrowY = useTransform(cardProgress, [0.1, 0.4], [12, 0]);

  const titleOpacity = useTransform(cardProgress, [0.18, 0.5], [0, 1]);
  const titleY = useTransform(cardProgress, [0.18, 0.5], [18, 0]);

  const copyOpacity = useTransform(cardProgress, [0.28, 0.6], [0, 1]);
  const copyY = useTransform(cardProgress, [0.28, 0.6], [14, 0]);

  const metricOpacity = useTransform(cardProgress, [0.38, 0.7], [0, 1]);
  const metricY = useTransform(cardProgress, [0.38, 0.7], [16, 0]);

  /* ---- Accent top-line ---- */
  const accentScaleX = useTransform(cardProgress, [0.15, 0.65], [0, 1]);
  const accentOpacity = useTransform(cardProgress, [0.15, 0.65], [0.2, 0.85]);

  /* ---- Card styling ---- */
  const cardBackground = isLeadPanel
    ? `linear-gradient(180deg, ${panelPalette.heroSurfaceTop}, ${panelPalette.heroSurfaceBottom})`
    : `linear-gradient(180deg, ${panelPalette.surfaceTop}, ${panelPalette.surfaceBottom})`;

  const cardShadow = isGloballyActive
    ? `${panelPalette.shadow}, 0 0 0 1px ${panelPalette.activeRing}, 0 24px 54px -42px ${panel.accentGlow}`
    : panelPalette.shadow;

  return (
    <section
      ref={cardRef}
      id={panel.id}
      className="relative flex min-h-[72vh] items-start py-10 first:pt-0 sm:min-h-[82vh] sm:py-12 lg:min-h-[100vh] lg:items-center lg:py-16"
    >
      <motion.article
        style={{
          y: cardY,
          opacity: cardOpacity,
          scale: cardScale,
          background: cardBackground,
          boxShadow: cardShadow,
        }}
        className="relative max-w-[42rem] overflow-hidden rounded-[2rem] border border-white/14 p-6 backdrop-blur-[28px] sm:p-8 lg:p-10 scroll-animate"
      >
        {/* Sheen + corner glow overlays */}
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

        {/* Accent top-line — grows from center on scroll */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px origin-center"
          style={{
            background: `linear-gradient(90deg, transparent, ${panel.accentColor}, transparent)`,
            scaleX: accentScaleX,
            opacity: accentOpacity,
          }}
        />

        {/* Content with staggered reveals */}
        <div className="relative z-10 space-y-6">
          {/* Eyebrow */}
          <div className="space-y-3">
            <motion.p
              style={{ opacity: eyebrowOpacity, y: eyebrowY }}
              className="font-mono text-[11px] uppercase tracking-[0.3em]"
            >
              <span style={{ color: panel.accentColor }}>
                {panel.sequence} / {panel.eyebrow}
              </span>
            </motion.p>

            {/* Title */}
            <motion.h2
              style={{ opacity: titleOpacity, y: titleY, color: panelPalette.title }}
              className="max-w-[16ch] font-display text-3xl font-semibold leading-[0.98] sm:text-4xl lg:text-[3.4rem]"
            >
              {panel.title}
            </motion.h2>
          </div>

          {/* Copy paragraphs */}
          <motion.div
            style={{ opacity: copyOpacity, y: copyY, color: panelPalette.body }}
            className="max-w-[38rem] space-y-3 text-base leading-relaxed sm:text-lg"
          >
            {panel.copy.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </motion.div>

          {/* Metric */}
          <motion.div
            style={{ opacity: metricOpacity, y: metricY }}
            className="pt-2"
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.28em]"
              style={{ color: panelPalette.meta }}
            >
              {panel.metricLabel}
            </p>
            <div className="mt-3 flex items-end gap-3">
              <AnimatedMetric
                targetValue={panel.metricValue}
                cardProgress={cardProgress}
                color={panelPalette.metric}
              />
            </div>
          </motion.div>
        </div>
      </motion.article>
    </section>
  );
};
