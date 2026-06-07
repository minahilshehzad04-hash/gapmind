import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

const resumeAnalysisSchema = z.object({
    detectedSkills: z.array(z.string()),
    requiredSkills: z.array(z.string()),
    missingSkills: z.array(z.string()),
    resumeScore: z.number().min(0).max(100),
    learningRoadmap: z.array(
        z.object({
            month: z.string(),
            topics: z.array(z.string()),
            resources: z.array(z.string()),
        })
    ),
});

const parser = StructuredOutputParser.fromZodSchema(resumeAnalysisSchema);

const prompt = ChatPromptTemplate.fromTemplate(`
You are an expert HR and Career Coach.

Analyze the resume for the target role: "{targetRole}".

Use strict role relevance. Do not add trendy or adjacent skills unless they are genuinely required for the target role.

Important rules:
- For a generic "Full Stack Developer" role, prioritize fundamentals such as semantic HTML, CSS/responsive design, JavaScript/TypeScript, React/Next.js, backend APIs, databases, authentication, testing, Git, deployment, and system design basics.
- Include "LLM APIs", "Generative AI", "Prompt Engineering", or AI integration skills only if the target role explicitly contains words like AI, GenAI, LLM, chatbot, agent, machine learning, or AI integration.
- If the resume already includes React, Next.js, JavaScript, and TypeScript, do not over-penalize basic HTML/CSS. You may still list semantic HTML or responsive CSS only if the resume gives no evidence of them.
- Missing skills must be concrete skills that hiring managers commonly screen for in the exact target role.
- Do not repeat the same topic across multiple roadmap months.
- Each roadmap month should focus on different missing skills.
- Resources should be real, practical, and relevant. Prefer official documentation, MDN, freeCodeCamp, roadmap.sh, or well-known course platforms.
- Score should reflect only the exact target role, not unrelated advanced skills.

Tasks:
1. Detect technical skills from the resume.
2. List essential technical skills required for the target role.
3. Identify missing skills.
4. Calculate a resume score from 0 to 100.
5. Generate a structured 3-month learning roadmap.

Resume Text:
{resumeText}

Return only valid JSON that follows these instructions:
{formatInstructions}
`);

const skillAliases: Record<string, string[]> = {
    css: ["css", "tailwind css", "responsive web interfaces", "responsive design"],
    html: ["html", "semantic html", "web interfaces"],
    "llm apis": ["llm apis", "groq llm", "generative ai", "ai content generation"],
    "generative ai": ["generative ai", "groq llm", "llm apis", "ai content generation"],
    "prompt engineering": ["prompt engineering", "text prompts", "script generation"],
};

function normalizeSkill(skill: string) {
    return skill.toLowerCase().replace(/[^a-z0-9+#.]+/g, " ").trim();
}

function resumeContainsSkill(resumeText: string, skill: string) {
    const normalizedResume = normalizeSkill(resumeText);
    const normalizedSkill = normalizeSkill(skill);
    const aliases = skillAliases[normalizedSkill] ?? [normalizedSkill];

    return aliases.some((alias) => normalizedResume.includes(normalizeSkill(alias)));
}

function removeSkillsAlreadyInResume<T extends { missingSkills: string[]; detectedSkills: string[] }>(
    analysis: T,
    resumeText: string
) {
    const detectedSkillSet = new Set(analysis.detectedSkills.map(normalizeSkill));

    return {
        ...analysis,
        missingSkills: analysis.missingSkills.filter((skill) => {
            const normalizedSkill = normalizeSkill(skill);
            return !detectedSkillSet.has(normalizedSkill) && !resumeContainsSkill(resumeText, skill);
        }),
    };
}

export async function analyzeResumeWithLangChain(resumeText: string, targetRole: string) {
    const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY is not defined in environment variables");
    }

    try {
        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey,
            temperature: 0,
        });
        const chain = prompt.pipe(model).pipe(parser);

        const analysis = await chain.invoke({
            resumeText,
            targetRole,
            formatInstructions: parser.getFormatInstructions(),
        });

        return removeSkillsAlreadyInResume(analysis, resumeText);
    } catch (error: unknown) {
        console.error("LangChain Analysis Error:", error);
        const message = error instanceof Error ? error.message : "LangChain analysis failed";
        throw new Error("Analysis failed: " + message);
    }
}
