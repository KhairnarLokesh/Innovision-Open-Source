import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/create-notification";
import { getAdminDb } from "@/lib/firebase-admin";

export async function POST(req) {
  try {
    const { idToken } = await req.json();
    const cookieStore = await cookies();

    if (idToken) {
      // Set session cookie
      cookieStore.set("session", idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });


      try {
        const { getAuth } = await import("firebase-admin/auth");
        const decoded = await getAuth().verifyIdToken(idToken);
        const userEmail = decoded.email;
        if (userEmail) {
          const adminDb = getAdminDb();
          const now = new Date();
          const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
          createNotification(adminDb, {
            userId: userEmail,
            title: "Welcome back!",
            body: `You signed in at ${timeStr}. Ready to keep learning?`,
            type: "system",
            link: "/profile",
          }).catch(() => { });
        }
      } catch (_) { }

      return NextResponse.json({ success: true });
    } else {
      // Clear session cookie
      cookieStore.delete("session");
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return NextResponse.json({ success: true });
}
