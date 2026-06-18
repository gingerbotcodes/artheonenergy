import { useState } from 'react';
import { AnimatePresence, motion, type MotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import {
  ArrowUpRight,
  LaptopMinimal,
  Menu,
  MoonStar,
  SunMedium,
  X,
} from 'lucide-react';

type ChapterLink = {
  id: string;
  label: string;
};

interface HeaderProps {
  chapters: ChapterLink[];
  progress: MotionValue<number>;
  themeMode: 'system' | 'lite' | 'dark';
  resolvedTheme: 'lite' | 'dark';
  onCycleTheme: () => void;
}

export const Header = ({
  chapters,
  progress,
  themeMode,
  resolvedTheme,
  onCycleTheme,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const progressGlowColor = useTransform(
    progress,
    [0, 0.5, 1],
    ['rgba(103,232,249,0.45)', 'rgba(52,211,153,0.5)', 'rgba(16,185,129,0.55)'],
  );
  const progressGlow = useMotionTemplate`0 2px 12px ${progressGlowColor}`;
  const progressPercent = useTransform(progress, [0, 1], [0, 100]);
  const progressDotLeft = useMotionTemplate`${progressPercent}%`;

  const closeMenu = () => setIsMenuOpen(false);

  const themeLabel =
    themeMode === 'system'
      ? 'System theme'
      : resolvedTheme === 'lite'
        ? 'Light theme'
        : 'Dark theme';
  const ThemeIcon =
    themeMode === 'system'
      ? LaptopMinimal
      : resolvedTheme === 'lite'
        ? SunMedium
        : MoonStar;
  const themeIconKey = `${themeMode}-${resolvedTheme}`;
  const themeAuraClass =
    themeMode === 'system'
      ? 'from-cyan-300/55 via-slate-200/25 to-emerald-300/55'
      : resolvedTheme === 'lite'
        ? 'from-amber-200/90 via-amber-100/55 to-sky-200/65'
        : 'from-indigo-300/45 via-slate-100/20 to-cyan-300/45';
  const themeIconClass =
    themeMode === 'system'
      ? 'text-cyan-50'
      : resolvedTheme === 'lite'
        ? 'text-amber-50'
        : 'text-slate-100';

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-20 w-full max-w-[1480px] items-center justify-between border-b border-white/10 bg-ink-950/75 px-4 backdrop-blur-md sm:px-6 lg:px-10">
        <a
          href="#"
          className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5"
          onClick={closeMenu}
        >
          <img
            src="/logo.png"
            alt="Artheon Energy"
            className="h-8 w-8 rounded-lg object-cover shadow-[0_0_20px_rgba(45,212,191,0.35)]"
          />
          <span className="font-display text-lg font-semibold text-white">
            Artheon
            <span className="text-emerald-300">Energy</span>
          </span>
        </a>

        <nav className="hidden items-center gap-2 lg:flex">
          {chapters.map((chapter) => (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-300 transition-colors hover:text-cyan-200"
            >
              {chapter.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={onCycleTheme}
            whileTap={{ scale: 0.94 }}
            className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.03] transition hover:border-cyan-200/55"
            aria-label={`Switch color mode. Current mode: ${themeLabel}`}
          >
            <motion.span
              className={`pointer-events-none absolute inset-[2px] rounded-full bg-gradient-to-br ${themeAuraClass}`}
              animate={{
                scale: [1, 1.04, 1],
                opacity:
                  themeMode === 'system'
                    ? [0.68, 0.9, 0.68]
                    : resolvedTheme === 'lite'
                      ? [0.85, 1, 0.85]
                      : [0.56, 0.76, 0.56],
              }}
              transition={{
                duration: themeMode === 'system' ? 1.7 : 2.1,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
            <span className="pointer-events-none absolute inset-[2px] rounded-full bg-[radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.48),transparent_56%)]" />
            <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-ink-950/60 shadow-[inset_0_0_12px_rgba(15,23,42,0.42)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={themeIconKey}
                  initial={{ opacity: 0, rotate: -56, scale: 0.5, y: 4 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
                  exit={{ opacity: 0, rotate: 56, scale: 0.45, y: -4 }}
                  transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  className={themeIconClass}
                >
                  <ThemeIcon className="h-[18px] w-[18px]" />
                </motion.span>
              </AnimatePresence>
            </span>

            <AnimatePresence>
              {themeMode === 'system' && (
                <motion.span
                  key="system-scanline"
                  className="pointer-events-none absolute bottom-[5px] left-1/2 z-20 h-[2px] w-5 -translate-x-1/2 rounded-full bg-cyan-100/90"
                  initial={{ opacity: 0, scaleX: 0.5 }}
                  animate={{ opacity: [0.2, 0.95, 0.2], scaleX: [0.6, 1, 0.6] }}
                  exit={{ opacity: 0, scaleX: 0.45 }}
                  transition={{
                    duration: 1.45,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </AnimatePresence>
          </motion.button>

          <div className="hidden lg:block">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-300/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100 transition-all hover:border-emerald-200 hover:bg-emerald-300/20"
            >
              Book Free Checkup
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-slate-200 lg:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="relative h-[2px] w-full bg-white/10">
        <motion.div
          style={{ scaleX: progress, boxShadow: progressGlow }}
          className="h-full origin-left bg-gradient-to-r from-cyan-300 via-emerald-400 to-emerald-300"
        />
        <motion.div
          style={{ left: progressDotLeft }}
          className="pointer-events-none absolute -top-[2px] h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-white shadow-[0_0_6px_rgba(52,211,153,0.7),0_0_12px_rgba(103,232,249,0.4)]"
        />
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-white/10 bg-ink-950/95 px-4 py-4 backdrop-blur-md sm:px-6 lg:hidden"
          >
            <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-2">
              {chapters.map((chapter) => (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  onClick={closeMenu}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-100"
                >
                  {chapter.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={closeMenu}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300/40 bg-emerald-300/14 px-4 py-3 text-sm font-semibold text-emerald-100"
              >
                Book Free Checkup
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
