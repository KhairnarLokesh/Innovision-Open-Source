import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { videoId } = await request.json();

    // In production, use youtube-transcript library or YouTube API
    // For demo, return sample transcript
    const transcript = `This is a sample transcript for video ${videoId}. 
    
In this video, we'll cover the following topics:
- Introduction to the subject
- Key concepts and fundamentals
- Practical examples and demonstrations
- Advanced techniques
- Best practices and tips
- Conclusion and next steps

Each section will be covered in detail with examples.`;

    return NextResponse.json({ transcript });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
