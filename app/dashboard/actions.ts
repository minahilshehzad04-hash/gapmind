'use server';

import { createClient } from "@/utils/supabase/server";
import { extractTextFromPDF } from "@/lib/pdf-service";
import { ensureUserRecord } from "@/lib/supabase-user";
import { revalidatePath } from "next/cache";

export async function uploadResume(formData: FormData) {
    const file = formData.get("resume") as File;
    if (!file) {
        throw new Error("No file uploaded");
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        await ensureUserRecord(supabase, user);

        // 1. Upload to Storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("resumes")
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from("resumes")
            .getPublicUrl(fileName);

        // 3. Extract Text
        const buffer = Buffer.from(await file.arrayBuffer());
        const extractedText = await extractTextFromPDF(buffer);

        // 4. Save to Database
        const { error: dbError } = await supabase
            .from("resumes")
            .insert({
                user_id: user.id,
                file_name: file.name,
                file_path: uploadData.path,
                file_url: publicUrl,
                extracted_text: extractedText,
            });

        if (dbError) throw dbError;

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: unknown) {
        console.error("Upload error:", error);
        return { error: error instanceof Error ? error.message : "Unknown error" };
    }
}
