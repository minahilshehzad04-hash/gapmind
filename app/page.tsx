import Link from "next/link";
import { ArrowRight, Brain, Target, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Analyze. Learn. Excel.
            </div>

            <h1 className="font-outfit text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Bridge the Gap to Your <span className="text-blue-500">Dream Career</span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed font-inter">
              Upload your resume and let our AI analyze your skills against your target job role.
              Get a personalized learning roadmap to land that job.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/upload"
                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all overflow-hidden shadow-xl shadow-blue-600/20"
              >
                <div className="relative z-10 flex items-center gap-2">
                  Start Analyzing <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border border-slate-800 hover:bg-slate-900 rounded-2xl font-bold transition-all text-slate-300 hover:text-white"
              >
                Sign In
              </Link>
            </div>

            <div className="flex gap-8 pt-12 border-t border-slate-800/50">
              <div>
                <div className="text-2xl font-bold font-outfit">10k+</div>
                <div className="text-slate-500 text-sm">Skills Analyzed</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-outfit">500+</div>
                <div className="text-slate-500 text-sm">Roadmaps Created</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-outfit">98%</div>
                <div className="text-slate-500 text-sm">User Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center" aria-hidden="true">
            {/* Visual element placeholder or AI graphic */}
            <div className="absolute w-[120%] h-[120%] bg-blue-600/5 blur-[80px] rounded-full animate-pulse-slow" />
            <div className="relative w-full aspect-square max-w-lg bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <Brain className="w-12 h-12 text-blue-500 opacity-20 group-hover:opacity-40 transition-opacity" />
              </div>
              <div className="space-y-6">
                <div className="h-4 w-1/3 bg-slate-800 rounded-full" />
                <div className="h-12 w-full bg-slate-800/50 rounded-2xl" />
                <div className="h-4 w-1/2 bg-slate-800 rounded-full" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-blue-500/5 border border-blue-500/10 rounded-2xl" />
                  <div className="h-24 bg-slate-800/20 border border-slate-800 rounded-2xl" />
                </div>
                <div className="h-4 w-2/3 bg-slate-800 rounded-full" />
                <div className="space-y-2">
                  <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-blue-500 to-indigo-600" />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Skill Match</span>
                    <span>65%</span>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute top-1/4 -right-4 px-4 py-2 bg-slate-800 border border-slate-700 shadow-xl rounded-xl font-bold text-xs rotate-12 transition-transform hover:rotate-0">
                React.js Expert
              </div>
              <div className="absolute bottom-1/4 -left-4 px-4 py-2 bg-blue-600 border border-blue-500 shadow-xl rounded-xl font-bold text-xs -rotate-12 transition-transform hover:rotate-0">
                Next.js Roadmap
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-slate-950/50 border-y border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="font-outfit text-3xl md:text-5xl font-bold">Why GapMind AI?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our advanced AI models deep dive into your resume and compare it against industry standards to provide actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-6 h-6 text-blue-500" />}
              title="AI Skill Extraction"
              description="Automatically identifies your hard and soft skills from any PDF resume with high accuracy."
            />
            <FeatureCard
              icon={<Target className="w-6 h-6 text-indigo-500" />}
              title="Role Matching"
              description="Compare your current profile against any job role to identify exactly what's missing."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-purple-500" />}
              title="Learning Roadmap"
              description="Get a step-by-step plan with curated resources to bridge your skill gap in record time."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1 group">
      <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-outfit text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
