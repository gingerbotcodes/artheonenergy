import { useRef, useState, type FormEvent } from 'react';
import { Factory, Mail, Phone, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    formRef.current?.reset();
  };

  return (
    <>
      <section
        id="contact"
        className="relative z-30 border-t border-white/10 bg-ink-950/40 px-4 py-20 sm:px-6 md:py-24 lg:px-10"
      >
        <div className="mx-auto grid w-full max-w-[1320px] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 shadow-[0_35px_80px_-42px_rgba(15,23,42,0.95)] backdrop-blur-md sm:p-9">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/85">
              Free Checkup
            </p>
            <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Book a Free
              <span className="text-transparent bg-gradient-to-r from-cyan-200 via-emerald-300 to-emerald-400 bg-clip-text">
                {' '}
                Battery Checkup.
              </span>
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
              Tell us about your setup and we will show you if your batteries can
              be improved instead of replaced.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-200/20 text-cyan-100">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Warranty support on treated batteries.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-200/20 text-emerald-100">
                  <Factory className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Useful for shops, warehouses, transport, and backup systems.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2"
              >
                <Phone className="h-4 w-4 text-cyan-200" />
                +91 98765 43210
              </a>
              <a
                href="mailto:hello@artheonenergy.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2"
              >
                <Mail className="h-4 w-4 text-emerald-200" />
                hello@artheonenergy.com
              </a>
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_35px_80px_-42px_rgba(15,23,42,0.95)] backdrop-blur-md sm:p-8"
          >
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-emerald-200/85">
              Request Callback
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-slate-200">
                  Name or Company
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="organization"
                  type="text"
                  required
                  placeholder="Acme Logistics"
                  className="w-full rounded-xl border border-white/15 bg-ink-950/70 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/25"
                />
              </div>

              <div>
                <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium text-slate-200">
                  Phone Number
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-white/15 bg-ink-950/70 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/25"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-setup" className="mb-2 block text-sm font-medium text-slate-200">
                    Setup Type
                  </label>
                  <select
                    id="contact-setup"
                    name="setup"
                    required
                    defaultValue=""
                    className="w-full cursor-pointer rounded-xl border border-white/15 bg-ink-950/70 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/25"
                  >
                    <option value="" disabled>
                      Select setup
                    </option>
                    <option value="e-rickshaw">E-Rickshaw Fleet</option>
                    <option value="forklift">Forklift / Material Handling</option>
                    <option value="backup">UPS / Backup Power</option>
                    <option value="solar">Solar Storage</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-volume" className="mb-2 block text-sm font-medium text-slate-200">
                    Batteries in Rotation
                  </label>
                  <input
                    id="contact-volume"
                    name="volume"
                    inputMode="numeric"
                    type="number"
                    required
                    min="1"
                    placeholder="12"
                    className="w-full rounded-xl border border-white/15 bg-ink-950/70 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/25"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-emerald-300/40 bg-emerald-300/90 px-5 py-3.5 font-semibold text-ink-950 transition hover:bg-emerald-200"
            >
              Book My Free Checkup
            </button>

            <p
              aria-live="polite"
              className="mt-3 min-h-6 text-sm text-emerald-100"
            >
              {submitted
                ? 'Request sent. Our team will call you shortly to schedule your free checkup.'
                : ''}
            </p>
          </form>
        </div>
      </section>

      <footer className="relative z-30 border-t border-white/10 bg-ink-950 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col items-start justify-between gap-4 text-sm text-slate-400 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Artheon Energy. Battery Regeneration Systems.</p>
          <div className="flex gap-5">
            <a href="#" className="transition-colors hover:text-cyan-200">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-cyan-200">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};
