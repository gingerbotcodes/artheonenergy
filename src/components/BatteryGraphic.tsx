import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface BatteryGraphicProps {
    scrollProgress: MotionValue<number>;
}

export const BatteryGraphic: React.FC<BatteryGraphicProps> = ({ scrollProgress }) => {
    // We divide the scroll into 4 sections, roughly at 0, 0.33, 0.66, 1

    // Liquid Level (Height of the fill):
    // 0 -> 80% (Normal operation)
    // 0.33 -> 15% (Sulfated)
    // 0.66 -> 50% (Pulsing / Regenerating)
    // 1 -> 100% (Restored to Like-New)
    const liquidHeight = useTransform(
        scrollProgress,
        [0, 0.1, 0.33, 0.5, 0.66, 0.8, 1],
        ["80%", "80%", "15%", "15%", "50%", "50%", "100%"]
    );

    // Liquid Color:
    // 0 -> #10b981 (emerald-500)
    // 0.33 -> #ef4444 (red-500) 
    // 0.66 -> #eab308 (yellow-500)
    // 1 -> #10b981 (emerald-500)
    const liquidColor = useTransform(
        scrollProgress,
        [0, 0.25, 0.33, 0.55, 0.66, 0.9, 1],
        ["#10b981", "#ef4444", "#ef4444", "#eab308", "#eab308", "#10b981", "#10b981"]
    );

    // Sulfate Crystals Opacity:
    // 0 -> 0
    // 0.33 -> 1 (Formation)
    // 0.66 -> 0 (Dissolved)
    const crystalsOpacity = useTransform(
        scrollProgress,
        [0, 0.2, 0.33, 0.45, 0.66, 1],
        [0, 0, 1, 1, 0, 0]
    );

    // Pulse Glow (Cyan rings):
    // appear between 0.5 and 0.8
    const pulseOpacity = useTransform(
        scrollProgress,
        [0, 0.5, 0.66, 0.75, 1],
        [0, 0, 1, 1, 0]
    );

    // Warranty Badge Spring Pop:
    const badgeScale = useTransform(
        scrollProgress,
        [0, 0.85, 0.9, 1],
        [0, 0, 1.2, 1]
    );

    return (
        <div className="relative w-full max-w-sm aspect-[4/5] flex flex-col items-center justify-end">

            {/* Battery Terminals */}
            <div className="flex justify-between w-[70%] mb-[-10px] z-10 relative">
                {/* Negative Terminal */}
                <div className="w-[15%] aspect-square bg-slate-400 rounded-t-xl border-2 border-slate-500 relative flex items-center justify-center">
                    <div className="w-1/2 h-1 bg-slate-600 rounded-full" />
                </div>
                {/* Positive Terminal */}
                <div className="w-[15%] aspect-square bg-red-500 rounded-t-xl border-2 border-red-600 relative flex items-center justify-center text-white font-bold text-xl leading-none">
                    +
                </div>
            </div>

            {/* Battery Body */}
            <div className="relative w-full h-[85%] bg-slate-800 rounded-2xl border-4 border-slate-700 overflow-hidden shadow-2xl flex flex-col p-4 pb-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">

                {/* Inner Battery Case / Plates Background */}
                <div className="relative w-full h-full bg-slate-900 rounded-t-md overflow-hidden flex border-2 border-b-0 border-slate-600">

                    {/* Create 6 cells to represent plates */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-1 relative h-full flex justify-center border-r border-slate-800 last:border-r-0 pt-4">
                            {/* Lead Plate core */}
                            <div className="w-[60%] h-[95%] bg-slate-600 opacity-60 rounded-t-sm mx-auto shadow-inner" />

                            {/* Sulfate Crystals Overlays */}
                            <motion.div
                                style={{
                                    opacity: crystalsOpacity,
                                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><path d='M5 5l5-5 5 5v10l-5 5-5-5z' fill='%23a1a1aa' opacity='0.6'/><path d='M8 8l4-2 2 4-4 2z' fill='%23eab308' opacity='0.5'/></svg>")`
                                }}
                                className="absolute inset-0 opacity-0 transition-opacity"
                            />

                            {/* Pulsing Energy Effect on plates */}
                            <motion.div
                                style={{ opacity: pulseOpacity }}
                                className="absolute inset-0 bg-gradient-to-t from-cyan-500/0 via-cyan-400/30 to-cyan-500/0 animate-pulse"
                            />
                        </div>
                    ))}

                    {/* Liquid Level Overlay */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 mix-blend-screen opacity-90 backdrop-blur-[2px]"
                        style={{
                            height: liquidHeight,
                            backgroundColor: liquidColor,
                        }}
                    >
                        {/* Liquid Surface highlight */}
                        <div className="absolute top-0 left-0 right-0 h-1 md:h-2 bg-white/40" />

                        {/* Energy Particles inside liquid during pulse */}
                        <motion.div
                            style={{ opacity: pulseOpacity }}
                            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-300/30 to-transparent animate-pulse"
                        />
                    </motion.div>

                </div>

                {/* Pulse Rings Overlay (The RG-16X machine effect) */}
                <motion.div
                    style={{ opacity: pulseOpacity }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="absolute w-[30%] aspect-square border-4 border-cyan-400 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50" />
                    <div className="absolute w-[50%] aspect-square border-2 border-cyan-400 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30 animation-delay-300" />
                    <div className="absolute w-[80%] aspect-square border border-cyan-400 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-10 animation-delay-700" />
                </motion.div>

                {/* Branding Label fixed on the battery */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[70%] max-w-[180px] bg-slate-950/80 backdrop-blur-md p-2 rounded-lg border border-slate-700 text-center shadow-lg z-20">
                    <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-0.5">Artheon Energy</div>
                    <div className="text-base text-white font-black italic">RG-16X</div>
                </div>
            </div>

            {/* Warranty Badge - Pops up at the end */}
            <motion.div
                style={{ scale: badgeScale }}
                className="absolute -top-8 -right-6 md:-right-12 w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full shadow-[0_0_40px_rgba(251,191,36,0.6)] flex items-center justify-center border-4 border-yellow-100 z-30 rotate-12"
            >
                <div className="text-center drop-shadow-md">
                    <div className="text-white text-3xl font-black leading-none">1-2</div>
                    <div className="text-yellow-100 text-xs font-bold uppercase tracking-wider mt-1">Years</div>
                    <div className="text-yellow-100 text-[9px] font-black uppercase tracking-widest border-t border-yellow-200/50 mt-1 pt-1">Warranty</div>
                </div>
            </motion.div>

        </div>
    );
};
