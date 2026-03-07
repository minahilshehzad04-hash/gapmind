import Link from "next/link";
import { AuthButton } from "./AuthButton";

export default function Navbar() {
    return (
        <nav className="w-full h-20 border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50" aria-label="Main Navigation">
            <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group" aria-label="GapMind AI Home">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        G
                    </div>
                    <span className="font-outfit font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        GapMind AI
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                    <Link href="/upload" className="hover:text-white transition-colors">Analyze</Link>
                    <AuthButton />
                </div>

                {/* Mobile menu could be added here */}
            </div>
        </nav>
    );
}
