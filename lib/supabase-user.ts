import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        return null;
    }

    return createSupabaseClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

export async function ensureUserRecord(supabase: SupabaseClient, user: User) {
    const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
        throw new Error(`Could not check user profile: ${profileError.message}`);
    }

    if (existingProfile) {
        return;
    }

    const userRecord = {
        id: user.id,
        full_name:
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            user.email,
        avatar_url: user.user_metadata?.avatar_url ?? null,
        email: user.email,
    };

    const adminClient = createAdminClient();

    if (!adminClient) {
        throw new Error(
            "Could not create user profile. Add SUPABASE_SERVICE_ROLE_KEY to .env or create the Supabase profile trigger."
        );
    }

    const { error } = await adminClient
        .from("profiles")
        .upsert(userRecord, { onConflict: "id" });

    if (error) {
        if (error.message.toLowerCase().includes("api key")) {
            throw new Error(
                "Invalid SUPABASE_SERVICE_ROLE_KEY. Use the service_role key from Supabase Project Settings > API, then restart the dev server."
            );
        }

        throw new Error(`Could not create user profile: ${error.message}`);
    }
}
