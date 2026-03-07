'use client';

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 py-20 mx-auto">
            <div className="animate-in flex-1 flex flex-col w-full justify-center gap-6 text-foreground">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-outfit font-bold">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {isLogin
                            ? 'Login to access your dashboard and analyses'
                            : 'Sign up to bridge your skill gap with AI'}
                    </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl">
                    {isLogin ? <LoginForm /> : <SignupForm />}

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
