
export async function analyzeResumeWithHuggingFace(resumeText: string, targetRole: string) {
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
        throw new Error("HUGGINGFACE_API_KEY is not defined in environment variables");
    }

    const prompt = `You are an expert HR and Career Coach. 
Analyze the following resume text for the target role: "${targetRole}".

Task:
1. List the essential technical skills required for this role.
2. Compare them with the skills detected in the resume.
3. Identify exactly which technical skills are missing.
4. Calculate a "Resume Score" from 0 to 100 based on:
    - Skill Completeness: Percentage of required technical skills present.
    - Role Relevance: How well the candidate's background matches the target role.
5. Generate a structured 3-month learning roadmap to bridge this gap.

Return the response STRICTLY as a JSON object with this EXACT structure (no other text):
{
    "detectedSkills": ["Skill A", "Skill B"],
    "requiredSkills": ["Skill A", "Skill B", "Skill C"],
    "missingSkills": ["Skill C"],
    "resumeScore": 85,
    "learningRoadmap": [
        {
            "month": "Month 1",
            "topics": ["Topic 1", "Topic 2"],
            "resources": ["Resource Title - Link/Platform"]
        }
    ]
}

Resume Text:
${resumeText}`;

    try {
        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "Qwen/Qwen2.5-7B-Instruct",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 2000,
                    temperature: 0.1,
                }),
            }
        );

        const responseText = await response.text();

        if (!response.ok) {
            console.error("Hugging Face API Error:", responseText);

            if (response.status === 404) {
                return await tryDirectInference(resumeText, targetRole, apiKey);
            }

            throw new Error(`HF API HTTP ${response.status}: ${responseText.substring(0, 100)}`);
        }

        const result = JSON.parse(responseText);
        const text = result.choices[0].message.content || "";

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("AI did not return a valid JSON block");

        return JSON.parse(jsonMatch[0]);
    } catch (error: unknown) {
        console.error("Hugging Face Analysis Error:", error);
        const message = error instanceof Error ? error.message : "HF Analysis failed";
        throw new Error("Analysis failed: " + message);
    }
}

async function tryDirectInference(resumeText: string, targetRole: string, apiKey: string) {
    console.log("Attempting direct inference fallback...");
    const prompt = `Analyze resume for ${targetRole}. Return JSON with detectedSkills, requiredSkills, missingSkills, resumeScore (0-100), and learningRoadmap (3 months). Resume: ${resumeText}`;

    const response = await fetch(
        "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: { max_new_tokens: 1500 }
            }),
        }
    );

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Direct inference fallback failed: ${err}`);
    }

    const result = await response.json();
    const text = Array.isArray(result) ? result[0].generated_text : result.generated_text;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Fallback AI did not return JSON");
    return JSON.parse(jsonMatch[0]);
}
