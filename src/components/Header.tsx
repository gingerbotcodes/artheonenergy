

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-slate-950/80 backdrop-blur-md z-50 border-b border-slate-900 flex items-center justify-between px-6 lg:px-12 shadow-sm shadow-slate-900/50">
            <div className="flex items-center gap-3">
                {/* Simple SVG Logo visually distinct */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center font-black text-slate-950 text-xl leading-none">
                    A
                </div>
                <span className="text-xl md:text-2xl font-bold text-white tracking-wide flex items-center gap-1">
                    Artheon<span className="text-emerald-500">Energy</span>
                </span>
            </div>
            <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-300">
                <a href="#problem" className="hover:text-emerald-400 hover:scale-105 transition-all">The Problem</a>
                <a href="#solution" className="hover:text-emerald-400 hover:scale-105 transition-all">Our Tech</a>
                <a href="#result" className="hover:text-emerald-400 hover:scale-105 transition-all">The Result</a>
            </nav>
            <a href="#contact" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-500 hover:text-slate-950 transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] whitespace-nowrap hidden sm:flex">
                Contact Us
            </a>
            {/* Mobile Menu Icon Placeholder */}
            <button className="sm:hidden text-slate-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
        </header>
    );
};
