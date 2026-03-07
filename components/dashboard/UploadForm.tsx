'use client';

import { uploadResumeAction } from "@/app/upload/actions";
import { Upload, FileText, Target, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function UploadForm() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        try {
            const result = await uploadResumeAction(formData);
            if (result.error) {
                setError(result.error);
                setIsPending(false);
            } else if (result.analysisId) {
                window.location.href = `/results/${result.analysisId}`;
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unexpected error occurred";
            setError(message);
            setIsPending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}
            <div className="space-y-4">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" /> Target Job Role
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        "Frontend Developer",
                        "Backend Developer",
                        "Full Stack Developer",
                        "Mobile Developer",
                        "Data Scientist"
                    ].map((role) => (
                        <label key={role} className="relative group cursor-pointer">
                            <input
                                type="radio"
                                name="targetRole"
                                value={role}
                                className="peer sr-only"
                                required
                            />
                            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl peer-checked:border-blue-500 peer-checked:bg-blue-500/10 hover:border-slate-700 transition-all text-center">
                                <span className="text-sm font-semibold peer-checked:text-blue-400">{role}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" /> Resume (PDF)
                </label>
                <div className="relative group">
                    <input
                        type="file"
                        name="resume"
                        accept=".pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                    />
                    <div className="w-full py-12 border-2 border-dashed border-slate-800 bg-slate-900/50 rounded-3xl flex flex-col items-center justify-center group-hover:border-blue-500/50 transition-all">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="font-medium">Click or drag to upload</p>
                        <p className="text-xs text-slate-500 mt-2">Maximum file size: 5MB</p>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? "Analyzing..." : "Start Analysis"}
                {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
            </button>
        </form>
    );
}
