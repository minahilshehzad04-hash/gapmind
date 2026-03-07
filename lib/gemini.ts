import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function analyzeResumeWithGemini(resumeText: string, targetRole: string) {
    const prompt = `
    You are an expert HR and Career Coach. 
    Analyze the following resume text for the target role: "${targetRole}".
    
    1. Extract all technical skills found in the resume.
    2. Identify programming languages, frameworks, tools, and technologies.
    3. Compare these against the typical requirements for a ${targetRole}.
    4. Generate a list of missing skills.
    5. Create a 5-step learning roadmap to bridge the gap.
    
    Return the response strictly as a JSON object with this structure:
    {
        "extractedSkills": ["Skill 1", "Skill 2"],
        "missingSkills": ["Skill A", "Skill B"],
        "skillMatchPercentage": 85,
        "learningRoadmap": [
            {"step": 1, "task": "Task 1", "resource": "Suggested Resource"},
            {"step": 2, "task": "Task 2", "resource": "Suggested Resource"}
        ]
    }
    
    Resume Text:
    ${resumeText}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Find JSON block in case there's markdown formatting
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Failed to parse AI response as JSON");

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        throw new Error("Failed to analyze resume with Gemini");
    }
}
