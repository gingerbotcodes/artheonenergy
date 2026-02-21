import { useRef } from 'react';
import { useScroll, motion } from 'framer-motion';
import { BatteryGraphic } from './components/BatteryGraphic';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll on the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="bg-slate-900 text-slate-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">

      {/* Background radial gradient down at z-0 */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-900 to-slate-950 pointer-events-none z-0" />

      {/* Navigation Header */}
      <Header />

      {/* Scroll-telling Container - Note pt-20 clears the header */}
      <div ref={containerRef} className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row min-h-[400vh] pt-20">

        {/* Left Side: Sticky Graphic */}
        {/* Mobile: Sticky at top (under header), takes 45vh. Desktop: takes remaining full height */}
        <div className="w-full md:w-1/2 sticky top-20 h-[45vh] md:h-[calc(100vh-5rem)] flex items-center justify-center p-4 md:p-8 z-10 pointer-events-none md:bg-transparent">
          <div className="w-full max-w-[200px] md:max-w-sm mt-2 md:mt-0">
            <BatteryGraphic scrollProgress={scrollYProgress} />
          </div>
        </div>

        {/* Right Side: Scrollable Text Sections */}
        {/* z-20 so on mobile, these glassmorphic cards scroll nicely over the battery elements below it */}
        <div className="w-full md:w-1/2 flex flex-col z-20 pb-16 md:pb-32 -mt-[5vh] md:mt-0">

          {/* Section 1: Hero */}
          <section className="min-h-[65vh] md:min-h-[calc(100vh-5rem)] flex flex-col justify-end md:justify-center px-4 sm:px-8 md:px-12 pb-10 md:py-24 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl bg-slate-900/60 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-6 md:p-0 rounded-3xl md:rounded-none border border-slate-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] md:shadow-none md:border-none"
            >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-[1.1]">
                Don't Replace.<br />
                <span className="text-emerald-500">Regenerate.</span>
              </h1>
              <p className="text-base md:text-xl text-slate-400 leading-relaxed mb-6 md:mb-8 font-medium">
                Save up to 70% on battery replacement costs with advanced high-frequency pulse technology.
              </p>
              <div className="flex gap-4 items-center text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">
                <span className="w-8 h-[2px] bg-slate-600 rounded-full"></span>
                Scroll to discover
              </div>
            </motion.div>
          </section>

          {/* Section 2: Problem */}
          <section id="problem" className="min-h-[80vh] md:min-h-[calc(100vh-5rem)] flex flex-col justify-end md:justify-center px-4 sm:px-8 md:px-12 pb-10 md:py-24 relative">
            <div className="max-w-xl bg-slate-900/60 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-6 md:p-0 rounded-3xl md:rounded-none border border-slate-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] md:shadow-none md:border-none">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-[1.1]">
                The Silent Killer:<br />
                <span className="text-red-500">Sulfation</span>
              </h2>
              <p className="text-base md:text-xl text-slate-400 leading-relaxed font-medium">
                Over time, hard lead sulfate crystals form on the battery plates. This invisible buildup destroys capacity, reduces range, and ultimately kills the battery prematurely.
              </p>
            </div>
          </section>

          {/* Section 3: Solution */}
          <section id="solution" className="min-h-[80vh] md:min-h-[calc(100vh-5rem)] flex flex-col justify-end md:justify-center px-4 sm:px-8 md:px-12 pb-10 md:py-24 relative">
            <div className="max-w-xl bg-slate-900/60 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-6 md:p-0 rounded-3xl md:rounded-none border border-slate-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] md:shadow-none md:border-none">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-[1.1]">
                High-Frequency<br />
                <span className="text-cyan-400">Pulse Tech</span>
              </h2>
              <p className="text-base md:text-xl text-slate-400 leading-relaxed font-medium">
                Our proprietary RG-16X regeneration machines send precise electrical pulses. These frequencies resonate with sulfate crystals, safely shattering and dissolving them without harming the delicate lead plates.
              </p>
            </div>
          </section>

          {/* Section 4: Result */}
          <section id="result" className="min-h-[80vh] md:min-h-[calc(100vh-5rem)] flex flex-col justify-end md:justify-center px-4 sm:px-8 md:px-12 pb-10 md:py-24 relative">
            <div className="max-w-xl bg-slate-900/60 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-6 md:p-0 rounded-3xl md:rounded-none border border-slate-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] md:shadow-none md:border-none">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-[1.1]">
                Like-New<br />
                <span className="text-emerald-500">Performance</span>
              </h2>
              <p className="text-base md:text-xl text-slate-400 leading-relaxed font-medium">
                Battery capacity is fully restored to 80-100% of its original strength. Extend equipment lifespan, eliminate downtime, and maximize your ROI for a fraction of replacement costs.
              </p>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
