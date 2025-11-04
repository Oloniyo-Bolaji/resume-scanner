// app/api/test/route.ts
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function GET() {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Explain the importance of fast language models",
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    return NextResponse.json({
      success: true,
      message: "API is working",
      response: response.choices[0]?.message?.content,
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
