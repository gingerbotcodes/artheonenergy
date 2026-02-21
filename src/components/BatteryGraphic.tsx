import React from 'react';
import { motion, MotionValue, useTransform, useSpring } from 'framer-motion';

interface BatteryGraphicProps {
    scrollProgress: MotionValue<number>;
}

export const BatteryGraphic: React.FC<BatteryGraphicProps> = ({ scrollProgress }) => {
    // Smoother physics for all transitions
    const smoothProgress = useSpring(scrollProgress, {
        stiffness: 50,
        damping: 15,
        restDelta: 0.001
    });

    // We divide the scroll into 4 sections: 0 (Hero), 0.33 (Problem), 0.66 (Solution), 1 (Result)

    // LIQUID LEVEL
    const liquidHeight = useTransform(
        smoothProgress,
        [0, 0.1, 0.33, 0.5, 0.66, 0.8, 1],
        ["80%", "80%", "15%", "15%", "50%", "50%", "100%"]
    );

    // LIQUID COLOR (Emerald -> Red -> Yellow -> Bright Emerald)
    const liquidColor = useTransform(
        smoothProgress,
        [0, 0.25, 0.33, 0.55, 0.66, 0.9, 1],
        ["#10b981", "#ef4444", "#ef4444", "#eab308", "#eab308", "#10b981", "#10b981"]
    );

    // SULFATE CRYSTALS (Appear at 0.33, dissolve by 0.66)
    const crystalsOpacity = useTransform(
        smoothProgress,
        [0, 0.2, 0.33, 0.45, 0.66, 1],
        [0, 0, 1, 1, 0, 0]
    );
    const crystalsScale = useTransform(
        smoothProgress,
        [0, 0.2, 0.33, 0.45, 0.66, 1],
        [0.8, 0.8, 1, 1, 1.2, 1.2]
    );

    // HIGH-FREQUENCY PULSE (RG-16X machine effect)
    const pulseOpacity = useTransform(
        smoothProgress,
        [0, 0.5, 0.66, 0.75, 1],
        [0, 0, 1, 1, 0]
    );

    // VIBRATION SHIFT (Intense shaking during pulsing phase)
    const shakeX = useTransform(
        smoothProgress,
        [0, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 1],
        [0, 0, -3, 3, -3, 3, 0, 0]
    );
    const shakeY = useTransform(
        smoothProgress,
        [0, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 1],
        [0, 0, 2, -2, 2, -2, 0, 0]
    );

    // RESTORED PARTICLES (Float up at the end)
    const particlesOpacity = useTransform(
        smoothProgress,
        [0, 0.8, 0.9, 1],
        [0, 0, 0.5, 1]
    );
    const particlesY = useTransform(smoothProgress, [0.8, 1], [50, -50]);

    // WARRANTY BADGE (Spring pop at the very end)
    const badgeScale = useTransform(
        smoothProgress,
        [0, 0.85, 0.95, 1],
        [0, 0, 1.2, 1]
    );
    const badgeRotate = useTransform(
        smoothProgress,
        [0, 0.85, 0.95, 1],
        [-90, -90, 20, 12]
    );

    // OVERALL GLOW surrounding the battery
    const batteryGlow = useTransform(
        smoothProgress,
        [0, 0.33, 0.66, 1],
        [
            "0px 0px 40px rgba(16, 185, 129, 0.1)", // Green tint
            "0px 0px 60px rgba(239, 68, 68, 0.2)",  // Red danger glow
            "0px 0px 100px rgba(34, 211, 238, 0.4)",// Cyan pulse glow
            "0px 0px 80px rgba(16, 185, 129, 0.5)"  // Bright Emerald restored
        ]
    );

    return (
        <motion.div
            style={{ x: shakeX, y: shakeY, filter: `drop-shadow(0 0 20px rgba(0,0,0,0.5))` }}
            className="relative w-full max-w-xs md:max-w-sm aspect-[4/5] flex flex-col items-center justify-end z-20"
        >
            {/* Massive Aura Glow behind battery */}
            <motion.div
                className="absolute inset-0 rounded-3xl -z-10 bg-transparent transition-shadow duration-300"
                style={{ boxShadow: batteryGlow }}
            />

            {/* Battery Terminals */}
            <div className="flex justify-between w-[65%] mb-[-12px] z-10 relative drop-shadow-xl">
                {/* Negative Terminal */}
                <div className="w-[18%] aspect-square bg-gradient-to-t from-slate-600 to-slate-400 rounded-t-xl border-x-2 border-t-2 border-slate-700 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute top-0 w-full h-1/2 bg-white/20" />
                    <div className="w-1/2 h-1 bg-slate-800 rounded-full z-10" />
                </div>
                {/* Positive Terminal */}
                <div className="w-[18%] aspect-square bg-gradient-to-t from-red-700 to-red-500 rounded-t-xl border-x-2 border-t-2 border-red-800 relative flex items-center justify-center text-white font-black text-2xl leading-none overflow-hidden hover:from-red-600 hover:to-red-400 transition-colors">
                    <div className="absolute top-0 w-full h-1/2 bg-white/20" />
                    <span className="z-10 drop-shadow-md">+</span>
                </div>
            </div>

            {/* Battery Body (The Glass Case) */}
            <motion.div
                className="relative w-full h-[85%] bg-slate-900/90 rounded-[2rem] border-4 border-slate-700 overflow-hidden flex flex-col p-3 md:p-5 pb-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-md"
            >
                {/* Glass Reflection Highlight */}
                <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-white/10 to-transparent skew-x-12 -translate-x-10 z-30 pointer-events-none" />

                {/* Inner Battery Case / Plates Array */}
                <div className="relative w-full h-full bg-slate-950 rounded-t-xl overflow-hidden flex border-2 border-b-0 border-slate-800 shadow-[inset_0_10px_30px_rgba(0,0,0,0.9)] z-0">

                    {/* The 6 Lead Plates */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-1 relative h-full flex justify-center border-r border-slate-900/50 last:border-r-0 pt-3 md:pt-4">
                            {/* Lead Plate core with metallic gradient */}
                            <div className="w-[50%] h-[96%] bg-gradient-to-b from-slate-500 via-slate-700 to-slate-900 rounded-t-sm mx-auto shadow-inner relative overflow-hidden">
                                {/* Plate grid texture lines */}
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_90%,rgba(0,0,0,0.3)_90%)] bg-[length:100%_10px]" />
                            </div>

                            {/* Sulfate Crystals Overlays (The buildup) */}
                            <motion.div
                                style={{
                                    opacity: crystalsOpacity,
                                    scale: crystalsScale,
                                }}
                                className="absolute inset-0 z-10 mix-blend-hard-light origin-bottom bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCc+PHBhdGggZD0nTTYgNmw2LTYgNiA2djEybC02IDYtNi02eicgZmlsbD0nI2ExYTFhYScgb3BhY2l0eT0nMC43Jy8+PHBhdGggZD0nTTEwIDEwbDUtMyAzIDUtNSAzWicgZmlsbD0nI2VhYjMwOCcgb3BhY2l0eT0nMC44Jy8+PHBhdGggZD0nTTQgMTRsMy0yIDIgMy0zIDJaJyBmaWxsPScjZmVmMDhhJyBvcGFjaXR5PScwLjYnLz48L3N2Zz4=')] bg-[length:30px_30px]"
                            />

                            {/* Pulsing Energy Effect on plates (The RG-16X Tech) */}
                            <motion.div
                                style={{ opacity: pulseOpacity }}
                                className="absolute inset-0 bg-gradient-to-t from-cyan-400/0 via-cyan-400/40 to-cyan-400/0 animate-[pulse_0.5s_ease-in-out_infinite] mix-blend-screen z-20"
                            />
                        </div>
                    ))}

                    {/* Liquid Level (The Electrolyte) */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 z-10 transition-colors duration-500 overflow-hidden"
                        style={{
                            height: liquidHeight,
                            backgroundColor: liquidColor,
                            boxShadow: "0 -10px 40px rgba(0,0,0,0.5) inset"
                        }}
                    >
                        {/* Dynamic Surface Wave/Highlight */}
                        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white/50 to-transparent" />

                        {/* Bubbles / Energy Particles inside liquid during pulse */}
                        <motion.div
                            style={{ opacity: pulseOpacity }}
                            className="absolute inset-x-0 bottom-0 h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMDAgMTAwJz48Y2lyY2xlIGN4PScyMCcgY3k9JzgwJyByPSczJyBmaWxsPScjNjdlOGY5JyBvcGFjaXR5PScwLjUnLz48Y2lyY2xlIGN4PSc1MCcgY3k9JzYwJyByPSc1JyBmaWxsPScjY2ZmYWZlJyBvcGFjaXR5PScwLjcnLz48Y2lyY2xlIGN4PSc4MCcgY3k9JzkwJyByPScyJyBmaWxsPScjMjJkM2VlJyBvcGFjaXR5PScwLjQnLz48L3N2Zz4=')] bg-[length:50px_50px] animate-[slideUp_3s_linear_infinite]"
                        />

                        {/* High-frequency energetic glow deep in the liquid */}
                        <motion.div
                            style={{ opacity: pulseOpacity }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-cyan-300/40 via-transparent to-transparent animate-[pulse_1s_ease-in-out_infinite]"
                        />

                        {/* Restored Sparkles inside liquid */}
                        <motion.div
                            style={{ opacity: particlesOpacity, y: particlesY }}
                            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCc+PHBhdGggZD0nTTIwIDAgTDIyIDE4IEw0MCAyMCBMMjIgMjIgTDIwIDQwIEwxOCAyMiBMMCAyMCBMMTggMTggWicgZmlsbD0nI2ZmZicgb3BhY2l0eT0nMC4zJy8+PC9zdmc+')] bg-[length:60px_60px]"
                        />
                    </motion.div>

                </div>

                {/* Pulse Rings Overlay out of the battery bounds (The RG-16X machine effect) */}
                <motion.div
                    style={{ opacity: pulseOpacity }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 mix-blend-screen"
                >
                    <div className="absolute w-[40%] aspect-square border-[6px] border-cyan-400 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-60 filter blur-[2px]" />
                    <div className="absolute w-[80%] aspect-square border-4 border-cyan-300 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40 animation-delay-300 filter blur-[4px]" />
                    <div className="absolute w-[120%] aspect-square border-2 border-cyan-200 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20 animation-delay-700 filter blur-[6px]" />
                </motion.div>

                {/* Branding Label fixed on the battery */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[60%] max-w-[150px] bg-gradient-to-b from-slate-800 to-slate-950 p-[2px] rounded-lg shadow-2xl z-40">
                    <div className="bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-md text-center border border-slate-700/50">
                        <div className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Artheon Energy</div>
                        <div className="text-sm md:text-base text-white font-black italic tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">RG-16X</div>
                    </div>
                </div>
            </motion.div>

            {/* Premium Warranty Badge - Popping up at 100% */}
            <motion.div
                style={{ scale: badgeScale, rotate: badgeRotate }}
                className="absolute -top-10 -right-6 md:-right-14 w-32 h-32 md:w-36 md:h-36 bg-gradient-to-br from-yellow-200 via-yellow-400 to-amber-600 rounded-full shadow-[0_10px_40px_rgba(245,158,11,0.5)] flex items-center justify-center border-[6px] border-yellow-100 z-50 overflow-hidden group"
            >
                {/* Badge shine effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

                <div className="text-center drop-shadow-lg">
                    <div className="text-white text-4xl md:text-5xl font-black leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">1-2</div>
                    <div className="text-yellow-900 text-xs md:text-sm font-black uppercase tracking-widest mt-1">Years</div>
                    <div className="text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest border-t border-yellow-200/60 mt-1 pt-1 opacity-90">Warranty</div>
                </div>
            </motion.div>

            {/* Glowing Particles (Restored state) surrounding battery */}
            <motion.div
                style={{ opacity: particlesOpacity }}
                className="absolute -inset-20 z-0 pointer-events-none"
            >
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                        animate={{
                            y: [0, -40 - Math.random() * 60],
                            x: [0, (Math.random() - 0.5) * 100],
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0]
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut"
                        }}
                        style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${40 + Math.random() * 40}%`
                        }}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
};
