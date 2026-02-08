import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { title, transcript } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analyze this video transcript and create a chapter-wise summary:

Title: ${title}
Transcript: ${transcript}

Create a JSON response with chapters:
{
  "chapters": [
    {"title": "Chapter 1 Title", "summary": "Brief summary", "duration": "2 min"},
    {"title": "Chapter 2 Title", "summary": "Brief summary", "duration": "3 min"}
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const chapters = jsonMatch ? JSON.parse(jsonMatch[0]) : { chapters: [] };

    return NextResponse.json(chapters);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
