import { useState } from 'react';
import { AnimatePresence, motion, type MotionValue } from 'framer-motion';
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

  const closeMenu = () => setIsMenuOpen(false);

  const themeLabel = themeMode === 'system' ? 'Auto' : resolvedTheme === 'lite' ? 'Lite' : 'Dark';
  const ThemeIcon =
    themeMode === 'system'
      ? LaptopMinimal
      : resolvedTheme === 'lite'
        ? SunMedium
        : MoonStar;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-20 w-full max-w-[1480px] items-center justify-between border-b border-white/10 bg-ink-950/75 px-4 backdrop-blur-2xl sm:px-6 lg:px-10">
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
          <button
            type="button"
            onClick={onCycleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100 transition hover:border-cyan-200/50 hover:text-cyan-100"
            aria-label="Switch color mode"
          >
            <ThemeIcon className="h-3.5 w-3.5" />
            <span>{themeLabel}</span>
          </button>

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
          style={{ scaleX: progress }}
          className="h-full origin-left bg-gradient-to-r from-cyan-300 via-emerald-400 to-emerald-300"
        />
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-white/10 bg-ink-950/95 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:hidden"
          >
            <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-2">
              <button
                type="button"
                onClick={onCycleTheme}
                className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-100"
              >
                <span className="inline-flex items-center gap-2">
                  <ThemeIcon className="h-4 w-4" />
                  Theme
                </span>
                <span className="font-semibold uppercase tracking-[0.12em] text-cyan-100">
                  {themeLabel}
                </span>
              </button>

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
