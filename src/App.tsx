import { useRef } from 'react';
import { useScroll, motion, useSpring, useTransform } from 'framer-motion';
import { BatteryGraphic } from './components/BatteryGraphic';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Reusable animated typography component for staggered reveals
const FadeInText = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll on the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth the scroll for the entire page's linked animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 12,
    restDelta: 0.001
  });

  // Parallax background blobs based on scroll
  const blob1Y = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
  const blob2Y = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);

  return (
    <div className="bg-slate-950 text-slate-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden relative">

      {/* Premium Cinematic Backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-950 to-slate-950" />
        {/* Animated Atmospheric Blobs */}
        <motion.div style={{ y: blob1Y }} className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-emerald-900/20 blur-[120px] mix-blend-screen opacity-50" />
        <motion.div style={{ y: blob2Y }} className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-cyan-900/10 blur-[100px] mix-blend-screen opacity-50" />
      </div>

      <Header />

      {/* Main Content Area */}
      <div ref={containerRef} className="relative w-full max-w-[1400px] mx-auto flex flex-col md:flex-row min-h-[400vh] pt-20">

        {/* LEFT PANEL: Sticky Battery */}
        <div className="w-full md:w-1/2 sticky top-20 h-[50vh] md:h-[calc(100vh-5rem)] flex items-center justify-center p-4 md:p-12 z-10 pointer-events-none md:bg-transparent -mt-[10vh] md:mt-0">
          <div className="w-full max-w-[220px] md:max-w-[400px] transition-transform duration-700">
            <BatteryGraphic scrollProgress={scrollYProgress} />
          </div>
        </div>

        {/* RIGHT PANEL: Floating Glassmorphic Text Sections */}
        <div className="w-full md:w-1/2 flex flex-col z-20 pb-16 md:pb-32 -mt-[5vh] md:mt-0 px-4 md:px-0 lg:pr-12">

          {/* SECTION 1: HERO */}
          <section className="min-h-[70vh] md:min-h-[calc(100vh-5rem)] flex flex-col justify-end md:justify-center pb-12 md:py-24 relative perspective-[1000px]">
            <motion.div
              style={{ rotateX: useTransform(smoothProgress, [0, 0.2], [0, 5]) }}
              className="w-full bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden group"
            >
              {/* Internal card glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <FadeInText delay={0}>
                <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tight drop-shadow-xl">
                  Don't Replace.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Regenerate.</span>
                </h1>
              </FadeInText>

              <FadeInText delay={0.2}>
                <p className="text-lg md:text-2xl text-slate-300 leading-relaxed font-medium mb-10 max-w-lg">
                  Save up to <span className="text-emerald-400 font-bold">70%</span> on battery replacement costs with advanced high-frequency pulse technology.
                </p>
              </FadeInText>

              <FadeInText delay={0.4} className="flex gap-4 items-center text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">
                <motion.span
                  animate={{ width: ["0px", "40px"] }}
                  transition={{ duration: 1, delay: 1 }}
                  className="h-[2px] bg-gradient-to-r from-emerald-500 to-transparent rounded-full"
                />
                <span>Scroll to discover</span>
                <motion.svg animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></motion.svg>
              </FadeInText>
            </motion.div>
          </section>

          {/* SECTION 2: PROBLEM */}
          <section id="problem" className="min-h-[85vh] md:min-h-[calc(100vh-5rem)] flex flex-col justify-end md:justify-center pb-12 md:py-24 relative perspective-[1000px]">
            <motion.div
              style={{ rotateX: useTransform(smoothProgress, [0.1, 0.33, 0.5], [5, 0, -5]) }}
              className="w-full bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <FadeInText>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight drop-shadow-xl">
                  The Silent Killer:<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">Sulfation</span>
                </h2>
              </FadeInText>

              <FadeInText delay={0.2}>
                <p className="text-lg md:text-2xl text-slate-300 leading-relaxed font-medium max-w-lg">
                  Over time, hard <span className="text-red-300 font-semibold">lead sulfate crystals</span> form on the battery plates. This invisible buildup destroys capacity, drastically reduces range, and ultimately kills the battery prematurely.
                </p>
              </FadeInText>
            </motion.div>
          </section>

          {/* SECTION 3: SOLUTION */}
          <section id="solution" className="min-h-[85vh] md:min-h-[calc(100vh-5rem)] flex flex-col justify-end md:justify-center pb-12 md:py-24 relative perspective-[1000px]">
            <motion.div
              style={{ rotateX: useTransform(smoothProgress, [0.4, 0.66, 0.8], [5, 0, -5]) }}
              className="w-full bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <FadeInText>
                <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(34,211,238,0.2)]">Proprietary Technology</div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight drop-shadow-xl">
                  High-Frequency<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">Pulse Tech</span>
                </h2>
              </FadeInText>

              <FadeInText delay={0.2}>
                <p className="text-lg md:text-2xl text-slate-300 leading-relaxed font-medium max-w-lg">
                  Our RG-16X machines send precise electrical pulses. These frequencies resonate with sulfate crystals, <span className="text-cyan-200 font-semibold text-shadow-sm">safely shattering and dissolving them</span> without harming the delicate lead plates underneath.
                </p>
              </FadeInText>
            </motion.div>
          </section>

          {/* SECTION 4: RESULT */}
          <section id="result" className="min-h-[85vh] md:min-h-[calc(100vh-5rem)] flex flex-col justify-end md:justify-center pb-12 md:py-24 relative perspective-[1000px]">
            <motion.div
              style={{ rotateX: useTransform(smoothProgress, [0.8, 1], [5, 0]) }}
              className="w-full bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <FadeInText>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight drop-shadow-xl">
                  Like-New<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">Performance</span>
                </h2>
              </FadeInText>

              <FadeInText delay={0.2}>
                <p className="text-lg md:text-2xl text-slate-300 leading-relaxed font-medium max-w-lg">
                  Battery capacity is fully restored to <span className="text-emerald-400 font-bold">80-100%</span> of its original strength. Extend equipment lifespan, eliminate downtime, and maximize your ROI for a fraction of replacement costs.
                </p>
              </FadeInText>
            </motion.div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
