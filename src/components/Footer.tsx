import { motion } from 'framer-motion';

export const Footer = () => {
    return (
        <>
            {/* CTA Section */}
            <section id="contact" className="w-full relative z-30 bg-slate-950 py-24 md:py-32 px-4 md:px-8 border-t border-slate-800">
                <div className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-xl p-6 md:p-16 rounded-[2rem] border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative overflow-hidden group">
                    {/* Glowing background effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    <div className="relative z-10 text-center mb-10 md:mb-12">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                            Book Your Complimentary <br className="hidden md:block" />
                            <span className="text-emerald-500 shadow-emerald-500/20 drop-shadow-md">Battery Health Checkup</span>
                        </h3>
                        <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto">
                            Our experts will test your fleet's batteries and demonstrate exactly how much you can save with regeneration.
                        </p>
                    </div>

                    <form className="space-y-6 relative z-10 max-w-3xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Name / Company</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-600 shadow-inner"
                                    placeholder="e.g. Acme Logistics"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-600 shadow-inner"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Setup Type</label>
                                <div className="relative">
                                    <select defaultValue="" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none cursor-pointer shadow-inner">
                                        <option value="" disabled>Select Application</option>
                                        <option value="e-rickshaw">E-Rickshaw</option>
                                        <option value="forklift">Forklift / Material Handling</option>
                                        <option value="ups">UPS / Inverter</option>
                                        <option value="solar">Solar Storage Ecosystem</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Number of Batteries</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-600 shadow-inner"
                                    placeholder="e.g. 12"
                                    min="1"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg md:text-xl py-4 md:py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] mt-4 md:mt-8"
                        >
                            Get My Free Assessment
                        </motion.button>
                    </form>
                </div>
            </section>

            {/* Actual Footer */}
            <footer className="bg-slate-950 py-8 md:py-12 border-t border-slate-900 border-dashed relative z-30">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-black text-slate-400 leading-none text-xs">
                            A
                        </div>
                        <span className="text-sm font-bold text-slate-400 tracking-wide">
                            Artheon Energy
                        </span>
                    </div>
                    <div className="text-xs md:text-sm text-slate-500 font-medium text-center md:text-left">
                        &copy; {new Date().getFullYear()} Artheon Energy. All rights reserved.
                    </div>
                    <div className="flex gap-4 md:gap-6 text-xs md:text-sm font-medium text-slate-500">
                        <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </>
    );
};
