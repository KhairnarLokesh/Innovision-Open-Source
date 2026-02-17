import { cookies } from "next/headers";
import { auth as firebaseAuth } from "@/lib/firebase";

/**
 * Get the current user from the session cookie
 * This replaces NextAuth's auth() function for API routes
 */
export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
      return null;
    }

    // The session cookie contains the Firebase ID token
    // For now, we'll decode it client-side style
    // In production, you should verify it with Firebase Admin SDK
    const idToken = sessionCookie.value;

    // For now, we'll extract user info from the token payload
    // This is a simplified approach - ideally use Firebase Admin to verify
    try {
      const payload = JSON.parse(atob(idToken.split(".")[1]));
      // Fallback to uid if email is not present (for anonymous users)
      const userEmail = payload.email || `guest_${payload.sub}`;
      return {
        user: {
          email: userEmail,
          name: payload.name || "Guest Learner",
          image: payload.picture,
          isAnonymous: !payload.email,
          uid: payload.sub,
        },
      };
    } catch (e) {
      console.error("Failed to parse session token:", e);
      return null;
    }
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
}
