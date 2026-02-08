import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { url } = await request.json();

    // Extract video ID from URL
    const videoId = extractVideoId(url);

    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    // In production, use YouTube Data API
    // For now, return mock data
    return NextResponse.json({
      videoId,
      title: "YouTube Video Course",
      duration: "15:30",
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
