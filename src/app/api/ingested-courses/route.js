import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

/**
 * GET /api/ingested-courses - List all ingested courses for the current user
 */
export async function GET(request) {
    try {
        const db = getAdminDb();
        if (!db) {
            return NextResponse.json(
                { error: "Database not available" },
                { status: 503 }
            );
        }

        // Get user ID from auth
        let userId = null;
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("session");

        if (sessionCookie) {
            try {
                const { getAuth } = await import("firebase-admin/auth");
                const decoded = await getAuth().verifySessionCookie(
                    sessionCookie.value,
                    true
                );
                userId = decoded.uid;
            } catch {
                // try token
            }
        }

        if (!userId) {
            const authHeader = request.headers.get("authorization");
            if (authHeader) {
                try {
                    const { getAuth } = await import("firebase-admin/auth");
                    const token = authHeader.replace("Bearer ", "");
                    const decoded = await getAuth().verifyIdToken(token);
                    userId = decoded.uid;
                } catch {
                    // auth failed
                }
            }
        }

        if (!userId) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const snapshot = await db
            .collection("ingested_courses")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();

        const courses = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                description: data.description,
                chapterCount: data.metadata?.chapterCount || 0,
                totalWords: data.metadata?.totalWords || 0,
                estimatedReadingTime: data.metadata?.estimatedReadingTime || 0,
                source: {
                    fileName: data.source?.fileName || "",
                    fileType: data.source?.fileType || "",
                },
                status: data.status,
                createdAt: data.createdAt?.toDate?.() || null,
            };
        });

        return NextResponse.json({ courses });
    } catch (error) {
        console.error("Error fetching ingested courses:", error);
        return NextResponse.json(
            { error: "Failed to fetch courses" },
            { status: 500 }
        );
    }
}
