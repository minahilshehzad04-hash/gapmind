import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "AI Skill Gap Analyzer | Bridge Your Career Gap | GapMind AI",
  description: "Analyze your resume against job roles and get a personalized learning roadmap powered by AI. land your dream career with GapMind AI.",
  keywords: ["AI Resume Analysis", "Skill Gap Analyzer", "Career Roadmap", "Resume Review", "Job Readiness"],
  authors: [{ name: "GapMind AI Team" }],
  openGraph: {
    title: "GapMind AI - Bridge Your Career Gap",
    description: "Personalized learning roadmaps powered by AI analysis of your resume and target job.",
    type: "website",
    locale: "en_US",
    url: "https://gapmind-ai.vercel.app",
    siteName: "GapMind AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "GapMind AI - Bridge Your Career Gap",
    description: "Get a personalized AI learning roadmap based on your resume.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-slate-950 text-slate-50 min-h-screen font-sans selection:bg-blue-500/30">
        <AuthProvider>
          <div className="relative overflow-hidden min-h-screen flex flex-col">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none" aria-hidden="true">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>

            <footer className="border-t border-slate-800/50 py-12 px-6">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                    G
                  </div>
                  <span className="font-outfit font-bold text-xl tracking-tight">GapMind AI</span>
                </div>
                <p className="text-slate-400 text-sm">
                  © {new Date().getFullYear()} GapMind AI. Empowering students with AI.
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
