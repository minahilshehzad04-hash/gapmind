import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { FileText, Plus, History, BrainCircuit } from "lucide-react";
import ResumeUpload from "@/components/dashboard/ResumeUpload";

export default async function Dashboard() {
    const supabase = await createClient();

    const [
        { data: { user } },
    ] = await Promise.all([
        supabase.auth.getUser(),
    ]);

    if (!user) {
        return redirect("/login");
    }

    const [
        { data: analyses },
        { data: profile }
    ] = await Promise.all([
        supabase
            .from("analyses")
            .select("*, resumes(*)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single()
    ]);

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="font-outfit text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Welcome back, {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                    </h1>
                    <p className="text-slate-500 mt-2">Track your progress and bridge your skill gaps.</p>
                </div>
                <Link
                    href="/upload"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
                >
                    <Plus className="w-5 h-5" /> New Analysis
                </Link>
            </div>

            <ResumeUpload />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <StatCard
                    icon={<History className="w-6 h-6 text-blue-500" />}
                    label="Total Analyses"
                    value={analyses?.length || 0}
                />
                <StatCard
                    icon={<BrainCircuit className="w-6 h-6 text-indigo-500" />}
                    label="Avg. Skill Match"
                    value={analyses && analyses.length > 0
                        ? `${Math.round(analyses.reduce((acc, curr) => acc + (curr.skill_gap_percentage || 0), 0) / analyses.length)}%`
                        : "N/A"}
                />
                <StatCard
                    icon={<FileText className="w-6 h-6 text-purple-500" />}
                    label="Resumes Uploaded"
                    value={new Set(analyses?.map(a => a.resume_id)).size || 0}
                />
            </div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="font-outfit text-2xl font-bold">Recent Analyses</h2>
                <Link
                    href="/history"
                    className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                >
                    View All
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {analyses && analyses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {analyses.map((analysis) => (
                        <Link
                            key={analysis.id}
                            href={`/results/${analysis.id}`}
                            className="flex items-center justify-between p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all group"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-blue-500 group-hover:scale-110 transition-transform">
                                    {analysis.skill_gap_percentage}%
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{analysis.target_role}</h3>
                                    <p className="text-sm text-slate-500">
                                        {new Date(analysis.created_at).toLocaleDateString()} • {analysis.resumes.file_name}
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
                    <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">No analyses found. Start your first one today!</p>
                    <Link href="/upload" className="text-blue-500 font-bold hover:underline mt-4 inline-block">
                        Upload your resume
                    </Link>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
    return (
        <div className="p-6 rounded-3xl bg-slate-900/30 border border-slate-800">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                    {icon}
                </div>
                <span className="text-slate-400 text-sm font-medium">{label}</span>
            </div>
            <div className="text-3xl font-bold font-outfit">{value}</div>
        </div>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    );
}
