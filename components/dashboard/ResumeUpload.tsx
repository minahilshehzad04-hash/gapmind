'use client';

import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadResume } from '@/app/dashboard/actions';

export default function ResumeUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setStatus('error');
            setError('Please upload a PDF file');
            return;
        }

        setIsUploading(true);
        setStatus('idle');
        setError(null);

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const result = await uploadResume(formData);
            if (result.error) {
                setStatus('error');
                setError(result.error);
            } else {
                setStatus('success');
                // Reset after 3 seconds
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (err: any) {
            setStatus('error');
            setError(err.message || 'Something went wrong');
        } finally {
            setIsUploading(false);
            // Clear input
            e.target.value = '';
        }
    };

    return (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-2 text-center md:text-left">
                    <h2 className="text-xl font-bold font-outfit">Quick Resume Upload</h2>
                    <p className="text-slate-500 text-sm">Upload your resume to start an analysis later.</p>
                </div>

                <div className="relative group min-w-[200px]">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                    />
                    <div className={`px-6 py-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-3
                        ${status === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-500' :
                            status === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' :
                                isUploading ? 'bg-blue-500/10 border-blue-500/50 text-blue-500' :
                                    'bg-slate-800/50 border-slate-700 group-hover:border-blue-500/50 text-slate-300'}`}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="font-bold">Extracting...</span>
                            </>
                        ) : status === 'success' ? (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-bold">Uploaded!</span>
                            </>
                        ) : status === 'error' ? (
                            <>
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-bold text-sm">{error || 'Failed'}</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                <span className="font-bold">Select PDF</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
