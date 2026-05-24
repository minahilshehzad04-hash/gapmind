'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Check your email for the confirmation link!');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div>
                <label className="text-sm font-medium text-slate-300">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:border-blue-500 outline-none transition-all"
                />
            </div>
            <div>
                <label className="text-sm font-medium text-slate-300">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:border-blue-500 outline-none transition-all"
                />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            {message && <p className="text-green-500 text-xs">{message}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 border border-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold transition-all disabled:opacity-50"
            >
                {loading ? 'Creating account...' : 'Sign Up'}
            </button>
        </form>
    );
}
