import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";


// Initialize Groq with API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface CategoryScore {
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface FeedbackResponse {
  overallScore: number;
  summary: string;
  atsCompatibility: number;
  categoryScores: {
    formatting: CategoryScore;
    content: CategoryScore;
    experience: CategoryScore;
    skills: CategoryScore;
    impact: CategoryScore;
  };
  feedback: {
    strengths: string[];
    weaknesses: string[];
    actionableImprovements: string[];
  };
}

interface ImagePath {
  url: string;
  pageNumber: number;
}

interface GroqError extends Error {
  status?: number;
  code?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId, data } = await req.json();

    // Destructure the data object properly
    const {
      id,
      company,
      jobTitle,
      jobDescription,
      experienceLevel,
      resume,
      resume_name,
      imagePaths,
    } = data;

    console.log("Received request with:", {
      id: id,
      userId: userId,
      jobTitle: !!jobTitle,
      company: !!company,
      hasResume: !!resume,
      resumeName: resume_name,
      hasImages: !!imagePaths?.length,
      imageCount: imagePaths?.length || 0,
      jobDescriptionLength: jobDescription?.length || 0,
    });

    // Validate required fields
    if (!imagePaths || imagePaths.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing resume images. Please upload a resume.",
        },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required.",
        },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY environment variable is missing");
      return NextResponse.json(
        {
          success: false,
          error:
            "API key not configured. Please set GROQ_API_KEY in your environment variables.",
        },
        { status: 500 }
      );
    }

    // Create the prompt for AI analysis
    const jobInfo = `
JOB INFORMATION:
- Job Title: ${jobTitle || "Not provided"}
- Company: ${company || "Not provided"}
- Experience Level: ${experienceLevel || "Not provided"}
- Job Description: ${jobDescription || "Not provided"}
`;

    const prompt = `
Please analyze this resume based on the following criteria:

${jobInfo} if provided.

The resume is provided as images (one per page). Analyze all pages carefully.

RESUME ANALYSIS CRITERIA:

Analyze the resume across these 5 dimensions:
1. Formatting (structure, layout, readability)
2. Content (clarity, relevance, completeness)
3. Experience (quality of work history, achievements)
4. Skills (technical and soft skills presentation)
5. Impact (quantifiable results, action verbs)

Also evaluate:
- Overall quality (0-100 score)
- ATS compatibility (0-100 score)
- Key strengths
- Areas for improvement
- Actionable suggestions

Provide your analysis in the following EXACT JSON format:

{
  "overallScore": 85,
  "summary": "Brief overall summary of the resume quality and fit for the role",
  "atsCompatibility": 80,
  "categoryScores": {
    "formatting": {
      "score": 85,
      "feedback": "Detailed feedback on resume formatting",
      "suggestions": ["Specific suggestion 1", "Specific suggestion 2"]
    },
    "content": {
      "score": 80,
      "feedback": "Detailed feedback on content quality",
      "suggestions": ["Specific suggestion 1", "Specific suggestion 2"]
    },
    "experience": {
      "score": 75,
      "feedback": "Detailed feedback on experience presentation",
      "suggestions": ["Specific suggestion 1", "Specific suggestion 2"]
    },
    "skills": {
      "score": 90,
      "feedback": "Detailed feedback on skills section",
      "suggestions": ["Specific suggestion 1", "Specific suggestion 2"]
    },
    "impact": {
      "score": 82,
      "feedback": "Detailed feedback on impact and achievements",
      "suggestions": ["Specific suggestion 1", "Specific suggestion 2"]
    }
  },
  "feedback": {
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
    "actionableImprovements": ["Improvement 1", "Improvement 2", "Improvement 3"]
  }
}

CRITICAL: Return ONLY valid JSON in the exact structure above. No markdown, no code blocks, no additional text. Analyze critically do not be scared to score either low or high, be a bit brutal.`;

    try {
      const contentArray: Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      > = [
        {
          type: "text",
          text: prompt,
        },
        // Add all resume page images
        ...imagePaths.map((image: ImagePath) => ({
          type: "image_url" as const,
          image_url: {
            url: image.url,
          },
        })),
      ];

      // Call Groq API with images
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are an expert ATS resume analyzer and career coach with deep knowledge of hiring practices. Provide detailed, actionable feedback. Always respond with valid JSON only - no markdown formatting, no code blocks, no additional text.",
          },
          {
            role: "user",
            content: contentArray,
          },
        ],
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 1,
        max_completion_tokens: 4096,
        response_format: { type: "json_object" },
        top_p: 1,
        stream: false,
      });

      console.log("Groq API call successful");

      const aiReply = response.choices[0]?.message?.content;

      if (!aiReply) {
        throw new Error("No response received from AI service");
      }

      // Parse the AI response
      let parsedResponse: FeedbackResponse;
      try {
        // Clean up the response (remove any markdown code blocks if present)
        const cleanedResponse = aiReply
          .replace(/```json\n?/g, "")
          .replace(/\n?```/g, "")
          .trim();

        parsedResponse = JSON.parse(cleanedResponse) as FeedbackResponse;

        // Validate the response structure
        if (
          typeof parsedResponse.overallScore !== "number" ||
          !parsedResponse.categoryScores ||
          !parsedResponse.feedback
        ) {
          throw new Error(
            "Invalid response structure from AI - missing required fields"
          );
        }

        // Ensure scores are within valid bounds (0-100)
        parsedResponse.overallScore = Math.max(
          0,
          Math.min(100, Math.round(parsedResponse.overallScore))
        );
        parsedResponse.atsCompatibility = Math.max(
          0,
          Math.min(100, Math.round(parsedResponse.atsCompatibility || 0))
        );

        // Validate and normalize category scores
        const categories = [
          "formatting",
          "content",
          "experience",
          "skills",
          "impact",
        ] as const;

        for (const category of categories) {
          const categoryScore = parsedResponse.categoryScores[category];
          if (!categoryScore) {
            throw new Error(`Missing category score: ${category}`);
          }

          // Normalize score
          categoryScore.score = Math.max(
            0,
            Math.min(100, Math.round(categoryScore.score))
          );

          // Ensure arrays exist
          if (!Array.isArray(categoryScore.suggestions)) {
            categoryScore.suggestions = [];
          }
        }

        // Validate feedback arrays
        if (!Array.isArray(parsedResponse.feedback.strengths)) {
          parsedResponse.feedback.strengths = [];
        }
        if (!Array.isArray(parsedResponse.feedback.weaknesses)) {
          parsedResponse.feedback.weaknesses = [];
        }
        if (!Array.isArray(parsedResponse.feedback.actionableImprovements)) {
          parsedResponse.feedback.actionableImprovements = [];
        }

        // Ensure summary exists
        if (
          !parsedResponse.summary ||
          typeof parsedResponse.summary !== "string"
        ) {
          parsedResponse.summary = "Resume analysis completed";
        }

        console.log("Analysis completed successfully with scores:", {
          overall: parsedResponse.overallScore,
          ats: parsedResponse.atsCompatibility,
        });
      } catch (parseError: unknown) {
        console.error("Failed to parse AI response:", parseError);
        console.error("Raw AI response:", aiReply.substring(0, 500));

        return NextResponse.json(
          {
            success: false,
            error: "Failed to parse AI response - invalid JSON format",
            details:
              parseError instanceof Error
                ? parseError.message
                : "Unknown parse error",
            sample: aiReply.substring(0, 200),
          },
          { status: 500 }
        );
      }
      return NextResponse.json({
        success: true,
        data: parsedResponse,
        scanId: id, // Return the scan ID for reference
      });
    } catch (aiError: unknown) {
      console.error("Groq API error:", aiError);

      let errorMessage = "AI service error";
      let details = "Unknown error occurred";
      let statusCode = 500;

      if (aiError instanceof Error) {
        const groqError = aiError as GroqError;
        details = groqError.message;
        console.error("Error details:", details);
        console.error("Error stack:", groqError.stack);

        // Check for specific error types
        if (
          details.includes("API_KEY") ||
          details.includes("API key") ||
          details.includes("apiKey") ||
          details.includes("401") ||
          details.includes("Unauthorized")
        ) {
          errorMessage = "Invalid or missing API key";
          details =
            "Check that GROQ_API_KEY is correctly set in your .env.local file";
          statusCode = 401;
        } else if (
          details.includes("model") ||
          details.includes("MODEL") ||
          details.includes("not found")
        ) {
          errorMessage = "AI model not available";
          details =
            "The specified model may not be available or doesn't support vision";
        } else if (
          details.includes("quota") ||
          details.includes("rate_limit") ||
          details.includes("429") ||
          details.includes("Rate limit")
        ) {
          errorMessage = "API rate limit exceeded";
          details = "Too many requests. Please try again in a few minutes.";
          statusCode = 429;
        } else if (
          details.includes("timeout") ||
          details.includes("ETIMEDOUT") ||
          details.includes("ECONNREFUSED")
        ) {
          errorMessage = "Connection timeout";
          details = "Failed to connect to AI service. Please try again.";
          statusCode = 503;
        } else if (
          details.includes("image") ||
          details.includes("vision") ||
          details.includes("base64")
        ) {
          errorMessage = "Image processing error";
          details = "Failed to process resume images. Please try again.";
        }
      } else if (typeof aiError === "string") {
        details = aiError;
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: details,
        },
        { status: statusCode }
      );
    }
  } catch (err: unknown) {
    console.error("=== Analysis Error ===");
    console.error(err);

    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    const errorStack = err instanceof Error ? err.stack : undefined;

    console.error("Error message:", errorMessage);
    if (errorStack) {
      console.error("Error stack:", errorStack);
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
