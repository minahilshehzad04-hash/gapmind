import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ArrowRight, History, FileText, Calendar, Target, BrainCircuit, Search } from "lucide-react";
import Link from "next/link";

export default async function HistoryPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/login");

    const { data: analyses } = await supabase
        .from("analyses")
        .select("*, resumes(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 selection:bg-blue-500/30">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 lg:py-20">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-12 group">
                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest leading-none">
                            <History className="w-3.5 h-3.5" /> Archive
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold font-outfit text-white tracking-tight">Analysis History</h1>
                        <p className="text-slate-400 max-w-xl">
                            A complete record of your resume performance and career growth roadmaps.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                            <BrainCircuit className="w-5 h-5 text-blue-500" />
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold leading-none mb-1">Total Insights</div>
                                <div className="text-xl font-bold text-white leading-none">{analyses?.length || 0}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {!analyses || analyses.length === 0 ? (
                    <div className="py-24 text-center rounded-[3rem] border border-dashed border-slate-800 bg-slate-900/10 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No history yet</h3>
                        <p className="text-slate-500 mb-8 max-w-xs mx-auto">Upload your first resume to start tracking your skill gaps and progress.</p>
                        <Link href="/upload" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20">
                            Get Your First Score
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {analyses.map((analysis) => (
                            <Link
                                key={analysis.id}
                                href={`/results/${analysis.id}`}
                                className="group relative p-1 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all active:scale-[0.99]"
                            >
                                <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div className="flex items-start md:items-center gap-6">
                                        <div className="relative flex-shrink-0">
                                            <svg className="w-16 h-16 transform -rotate-90">
                                                <circle
                                                    cx="32"
                                                    cy="32"
                                                    r="28"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="transparent"
                                                    className="text-slate-800"
                                                />
                                                <circle
                                                    cx="32"
                                                    cy="32"
                                                    r="28"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                    fill="transparent"
                                                    strokeDasharray={175.9}
                                                    strokeDashoffset={175.9 - (175.9 * analysis.skill_gap_percentage) / 100}
                                                    className="text-blue-500 transition-all duration-1000"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-sm font-black text-white">{analysis.skill_gap_percentage}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Target className="w-3.5 h-3.5" />
                                                <span className="text-[10px] uppercase font-bold tracking-widest leading-none">Targeting</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{analysis.target_role}</h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <FileText className="w-3.5 h-3.5" />
                                                    <span className="truncate max-w-[150px]">{analysis.resumes?.file_name}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{new Date(analysis.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                                        <div className="md:text-right">
                                            <div className="text-[10px] uppercase tracking-wider text-slate-600 font-bold leading-none mb-1">Status</div>
                                            <div className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">Analysis Ready</div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                                            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
