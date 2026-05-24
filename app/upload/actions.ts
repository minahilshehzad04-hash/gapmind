'use server';

import { createClient } from "@/utils/supabase/server";

import { extractTextFromPDF } from "@/lib/pdf-service";
import { analyzeResumeWithHuggingFace } from "@/lib/hf-service";

export async function uploadResumeAction(formData: FormData) {
    const file = formData.get("resume") as File;
    const targetRole = formData.get("targetRole") as string;

    if (!file || !targetRole) {
        return { error: "File and target role are required" };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    try {
        console.log("Starting upload process for role:", targetRole);

        // 1. Upload to Supabase Storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const filePath = `resumes/${fileName}`;

        console.log("Uploading file to storage:", filePath);
        const { error: uploadError } = await supabase.storage
            .from("resumes")
            .upload(fileName, file);

        if (uploadError) {
            console.error("Storage upload error:", uploadError);
            return { error: `Storage upload failed: ${uploadError.message}` };
        }

        // 2. Extract text from PDF
        console.log("Extracting text from PDF...");
        const buffer = Buffer.from(await file.arrayBuffer());
        const extractedText = await extractTextFromPDF(buffer);
        console.log("Text extracted, length:", extractedText.length);

        // 3. Save Resume record
        console.log("Saving resume record to DB...");
        const { data: resume, error: resumeError } = await supabase
            .from("resumes")
            .insert({
                user_id: user.id,
                file_name: file.name,
                file_path: filePath,
                extracted_text: extractedText,
            })
            .select()
            .single();

        if (resumeError) {
            console.error("Resume DB save error:", resumeError);
            return { error: `Database error: ${resumeError.message}` };
        }

        // 4. AI Analysis
        console.log("Starting Hugging Face AI Analysis...");
        const analysisResult = await analyzeResumeWithHuggingFace(extractedText, targetRole);
        console.log("AI Analysis complete.");

        // 5. Save Analysis record
        console.log("Saving analysis record to DB...");
        const { data: analysis, error: analysisError } = await supabase
            .from("analyses")
            .insert({
                user_id: user.id,
                resume_id: resume.id,
                target_role: targetRole,
                extracted_skills: analysisResult.detectedSkills,
                required_skills: analysisResult.requiredSkills,
                missing_skills: analysisResult.missingSkills,
                skill_gap_percentage: analysisResult.resumeScore,
                learning_roadmap: analysisResult.learningRoadmap,
            })
            .select()
            .single();

        if (analysisError) {
            console.error("Analysis DB save error:", analysisError);
            return { error: `Analysis save failed: ${analysisError.message}` };
        }

        console.log("Upload flow successful, returning analysis ID:", analysis.id);
        return { success: true, analysisId: analysis.id };
    } catch (error: unknown) {
        console.error("Upload action error:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return { error: message };
    }
}
