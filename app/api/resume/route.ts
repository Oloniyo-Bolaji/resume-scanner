import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { FeedbackProps } from "@/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const Feedback = {};
export async function POST(req: Request) {
  try {
    const { jobTitle, jobDescription, experienceLevel, resumeUrl, imagePath } =
      await req.json();

    if (!resumeUrl || !imagePath) {
      return NextResponse.json(
        { success: false, error: "Missing resumeUrl or imagePath" },
        { status: 400 }
      );
    }

    // Generate AI response
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "model",
          parts: [
            {
              text: "You are an oral health assistant. Only answer questions about dentistry, oral hygiene, gum care, cavities, toothaches, braces, and dental health. If unrelated, politely decline.",
            },
          ],
        },
      ],
      config: {
        systemInstruction: `You are an expert résumé reviewer and ATS (Applicant Tracking System) specialist. Analyze the following résumé based on the job Title ${jobTitle}, job description ${jobDescription} and experience level ${experienceLevel} if provided and provide detailed scoring and feedback. Evaluate the résumé based on formatting, content, skills, impact and  experience, and how well it matches the job description (if provided). Give an overall score (out of 100) for the résumé. Score each key category separately (out of 100). Provide specific, constructive feedback for improvement in each area and return your response in the format  for easy parsing.`,
      },
    });

    const aiReply = response.text || "Sorry, I couldn’t generate a reply.";

    return NextResponse.json({
      success: true,
    });
  } catch (err: unknown) {
    console.error("Registration Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
