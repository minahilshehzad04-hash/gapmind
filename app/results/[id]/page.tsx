import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, BookOpen, GraduationCap, ClipboardList, Calendar } from "lucide-react";
import Link from "next/link";

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const [
        { data: { user } },
        { data, error: fetchError }
    ] = await Promise.all([
        supabase.auth.getUser(),
        supabase
            .from("analyses")
            .select("*, resumes(*)")
            .eq("id", id)
            .single()
    ]);

    if (!user) return redirect("/login");

    let analysis;
    try {
        if (fetchError || !data) {
            console.error("Analysis fetch error:", fetchError);
            return notFound();
        }
        analysis = data;
    } catch (error) {
        console.error("Error fetching analysis:", error);
        return redirect("/dashboard");
    }

    const roadmapData = (analysis.learning_roadmap as any[]) || [];

    // Normalize roadmap steps
    const roadmap = roadmapData.map((item, index) => ({
        title: item.month || item.step || `Phase ${index + 1}`,
        topics: item.topics || [],
        resources: Array.isArray(item.resources) ? item.resources : (item.resource ? [item.resource] : [])
    }));

    const detectedSkills = (analysis.extracted_skills as string[]) || [];
    const missingSkills = (analysis.missing_skills as string[]) || [];

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-inter selection:bg-blue-500/30">
            {/* Background Mesh Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-12 group">
                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </Link>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest leading-none">
                            <GraduationCap className="w-3.5 h-3.5" /> Career Analysis
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold font-outfit text-white tracking-tight">
                            {analysis.target_role}
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                            We've analyzed your profile against industry standards for <span className="text-white font-medium">{analysis.target_role}</span>.
                            Here's your personalized growth roadmap to bridge the gap.
                        </p>
                    </div>

                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <div className="relative group p-1 rounded-[2.5rem] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/5 backdrop-blur-3xl">
                            <div className="p-10 bg-[#0A0A0A]/80 rounded-[2.25rem] border border-white/5 flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <svg className="w-48 h-48 transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="86"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="transparent"
                                            className="text-slate-800/40"
                                        />
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="86"
                                            stroke="url(#score-gradient)"
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                            fill="transparent"
                                            strokeDasharray={540.35}
                                            strokeDashoffset={540.35 - (540.35 * analysis.skill_gap_percentage) / 100}
                                            className="transition-all duration-1000 ease-out"
                                        />
                                        <defs>
                                            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#6366f1" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-5xl font-black font-outfit text-white tracking-tighter">
                                            {analysis.skill_gap_percentage}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold -mt-1">SCORE</span>
                                    </div>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">Resume Score</h4>
                                <p className="text-sm text-slate-500 max-w-[200px]">Based on skill completeness and role relevance.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Skills Section */}
                    <div className="lg:col-span-5 space-y-12">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white font-outfit">Detected Strengths</h3>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {detectedSkills.map((skill: string) => (
                                    <div key={skill} className="px-4 py-2 bg-slate-900/50 border border-slate-800 hover:border-green-500/30 rounded-xl text-sm text-slate-300 transition-colors group/skill flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:scale-125 transition-transform" />
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <XCircle className="w-5 h-5 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white font-outfit">Priority Gaps</h3>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {missingSkills.map((skill: string) => (
                                    <div key={skill} className="px-4 py-2 bg-red-500/5 border border-red-500/10 hover:border-red-500/30 rounded-xl text-sm text-red-300 transition-colors group/skill flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:scale-125 transition-transform" />
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="p-8 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
                            <Lightbulb className="w-8 h-8 text-indigo-400 mb-4" />
                            <h4 className="text-lg font-bold text-white mb-2">Pro Tip</h4>
                            <p className="text-sm text-indigo-300/80 leading-relaxed">
                                Focus on the <span className="text-white font-semibold">top 3 missing skills</span> this month for a significant score boost and better interview chances.
                            </p>
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white font-outfit">Learning Timeline</h3>
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">3 Month Plan</span>
                        </div>

                        <div className="space-y-12 relative before:absolute before:inset-0 before:left-5 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-blue-600 before:via-indigo-600 before:to-transparent">
                            {roadmap.map((step, index) => (
                                <div key={index} className="relative pl-14 group">
                                    {/* Point */}
                                    <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-[14px] border border-slate-800 bg-slate-950 text-white shadow-2xl z-10 group-hover:border-blue-500/50 group-hover:bg-blue-600/10 transition-all duration-300">
                                        <span className="text-xs font-bold text-blue-400">{index + 1}</span>
                                    </div>

                                    <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-white/5 hover:border-white/10 transition-all backdrop-blur-sm group-hover:-translate-y-1 duration-300">
                                        <h3 className="text-2xl font-bold text-white font-outfit mb-6 tracking-tight">{step.title}</h3>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {step.topics.map((topic: string, ti: number) => (
                                                    <div key={ti} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 group/topic hover:bg-white/[0.07] transition-colors">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
                                                        <span className="text-sm font-medium text-slate-300">{topic}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-6 border-t border-white/5">
                                                <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-4 px-1">Curated Resources</div>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {step.resources.map((resource: string, ri: number) => (
                                                        <div key={ri} className="flex items-center gap-2.5 px-4 py-2 bg-indigo-500/10 border border-indigo-500/10 text-indigo-300 text-[11px] font-bold rounded-xl hover:bg-indigo-500/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-95">
                                                            <BookOpen className="w-3.5 h-3.5" />
                                                            <span>{resource}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

