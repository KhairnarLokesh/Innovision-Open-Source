import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { content, title } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Enhance this educational content to make it more engaging and clear. Keep the same structure but improve:
- Clarity and readability
- Add relevant examples
- Improve explanations
- Make it more engaging for students

Title: ${title}

Content:
${content}

Return only the enhanced content in markdown format.`;

    const result = await model.generateContent(prompt);
    const enhanced = result.response.text();

    return NextResponse.json({ enhanced });
  } catch (error) {
    console.error("Error enhancing content:", error);
    return NextResponse.json(
      { error: "Failed to enhance content" },
      { status: 500 }
    );
  }
}
