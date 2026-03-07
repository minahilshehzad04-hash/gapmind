import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import React from 'react'

export async function AuthButton() {
    const supabase = await createClient()

    const [
        { data: { user } },
    ] = await Promise.all([
        supabase.auth.getUser(),
    ])

    let profile: { avatar_url?: string; full_name?: string } | null = null
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('avatar_url, full_name')
            .eq('id', user.id)
            .single()
        profile = data as { avatar_url?: string; full_name?: string } | null
    }

    const signOut = async () => {
        'use server'

        const supabase = await createClient()
        await supabase.auth.signOut()
        return redirect('/login')
    }

    return user ? (
        <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-3">
                {profile?.avatar_url ? (
                    <Image
                        src={profile.avatar_url}
                        alt={profile.full_name || 'User'}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border border-slate-700"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">
                        {(profile?.full_name || user.email)?.[0].toUpperCase()}
                    </div>
                )}
                <span className="text-slate-400">Hey, {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}!</span>
            </div>
            <form action={signOut}>
                <button className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all border border-slate-700">
                    Logout
                </button>
            </form>
        </div>
    ) : (
        <a
            href="/login"
            className="py-2 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/20"
        >
            Login
        </a>
    )
}
