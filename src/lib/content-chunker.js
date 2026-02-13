/**
 * AI-Powered Content Chunking Service
 * Uses Gemini AI to intelligently split extracted text into logical chapters.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MAX_INPUT_CHARS = 100000; // ~25k tokens for Gemini
const MIN_CHAPTER_LENGTH = 200; // minimum chars per chapter

/**
 * Use Gemini AI to analyze text and produce structured chapters
 */
export async function chunkContentWithAI(text, fileName) {
    // Truncate very long texts to fit within token limits
    const truncatedText =
        text.length > MAX_INPUT_CHARS ? text.slice(0, MAX_INPUT_CHARS) : text;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert educational content organizer. Analyze the following text extracted from a document titled "${fileName}" and break it into logical chapters for a structured course.

INSTRUCTIONS:
1. Identify natural topic boundaries and section breaks
2. Create 3-15 chapters depending on content length
3. Each chapter should cover a coherent topic or concept
4. Generate a clear, descriptive title for each chapter
5. Write a brief 1-2 sentence summary for each chapter
6. Do NOT modify the original text content - only organize it into chapters
7. Ensure no content is lost - all text should be included in some chapter
8. If the text is short, create fewer chapters (minimum 2)

Return your response as a valid JSON array with this exact format:
[
  {
    "chapterNumber": 1,
    "title": "Chapter Title Here",
    "summary": "Brief summary of what this chapter covers.",
    "content": "The actual text content for this chapter..."
  }
]

IMPORTANT: Return ONLY the JSON array, no other text, no markdown code fences.

TEXT TO ORGANIZE:
---
${truncatedText}
---`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Clean up the response - remove markdown code fences if present
        let cleanedResponse = response.trim();
        if (cleanedResponse.startsWith("```")) {
            cleanedResponse = cleanedResponse
                .replace(/^```(?:json)?\s*\n?/, "")
                .replace(/\n?```\s*$/, "");
        }

        const chapters = JSON.parse(cleanedResponse);

        if (!Array.isArray(chapters) || chapters.length === 0) {
            throw new Error("AI returned invalid chapter structure");
        }

        // Validate and clean chapters
        const validChapters = chapters
            .filter(
                (ch) =>
                    ch.content &&
                    ch.content.trim().length >= MIN_CHAPTER_LENGTH &&
                    ch.title
            )
            .map((ch, index) => ({
                chapterNumber: index + 1,
                title: ch.title.trim(),
                summary: ch.summary ? ch.summary.trim() : "",
                content: ch.content.trim(),
                wordCount: ch.content.trim().split(/\s+/).length,
            }));

        if (validChapters.length === 0) {
            throw new Error("No valid chapters generated from AI analysis");
        }

        return validChapters;
    } catch (error) {
        if (error.message.includes("No valid chapters") || error.message.includes("invalid chapter")) {
            throw error;
        }
        console.error("AI chunking failed, using fallback:", error.message);
        return fallbackChunking(text, fileName);
    }
}

/**
 * Fallback: simple word-count-based chunking when AI fails
 */
function fallbackChunking(text, fileName) {
    const words = text.split(/\s+/);
    const totalWords = words.length;

    // Aim for ~1500 words per chapter
    const targetChapterSize = 1500;
    const numChapters = Math.max(2, Math.min(15, Math.ceil(totalWords / targetChapterSize)));
    const wordsPerChapter = Math.ceil(totalWords / numChapters);

    const chapters = [];
    for (let i = 0; i < numChapters; i++) {
        const start = i * wordsPerChapter;
        const end = Math.min(start + wordsPerChapter, totalWords);
        const chapterWords = words.slice(start, end);
        const content = chapterWords.join(" ");

        if (content.trim().length < MIN_CHAPTER_LENGTH) continue;

        chapters.push({
            chapterNumber: chapters.length + 1,
            title: `Chapter ${chapters.length + 1}`,
            summary: `Section ${chapters.length + 1} of ${fileName}`,
            content: content.trim(),
            wordCount: chapterWords.length,
        });
    }

    return chapters;
}

/**
 * Generate a course title from file name using AI
 */
export async function generateCourseTitle(fileName, textPreview) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    const preview = textPreview.slice(0, 1000);

    const prompt = `Given a document with filename "${cleanName}" and this text preview:
"${preview}"

Generate a concise, professional course title (max 80 characters). 
Return ONLY the title text, nothing else.`;

    try {
        const result = await model.generateContent(prompt);
        const title = result.response.text().trim().replace(/^["']|["']$/g, "");
        return title || cleanName;
    } catch {
        // Fallback to cleaned filename
        return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }
}

/**
 * Generate a course description from text preview using AI
 */
export async function generateCourseDescription(textPreview) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const preview = textPreview.slice(0, 2000);

    const prompt = `Based on this text preview from an educational document:
"${preview}"

Write a compelling 2-3 sentence course description. 
Return ONLY the description text, nothing else.`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch {
        return "AI-generated course from uploaded document content.";
    }
}
