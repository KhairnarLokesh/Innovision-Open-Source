import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const userRef = adminDb.collection("gamification").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Initialize new user with streak of 1 (starting today)
      const initialStats = {
        xp: 0,
        level: 1,
        streak: 1,
        badges: [],
        rank: 0,
        achievements: [],
        lastActive: new Date().toISOString(),
      };

      await userRef.set(initialStats);
      return NextResponse.json(initialStats);
    }

    const stats = userDoc.data();

    // Check if streak should be updated/reset
    const lastActive = new Date(stats.lastActive);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastActive.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Consecutive day - increment streak
      stats.streak = (stats.streak || 0) + 1;
      stats.lastActive = new Date().toISOString();
      await userRef.update({
        streak: stats.streak,
        lastActive: stats.lastActive,
      });
    } else if (daysDiff > 1) {
      // Missed one or more days - reset streak (starting today)
      stats.streak = 1;
      stats.lastActive = new Date().toISOString();
      await userRef.update({
        streak: 1,
        lastActive: stats.lastActive,
      });
    } else if (daysDiff === 0 && (!stats.streak || stats.streak === 0)) {
      // First activity of the day (e.g. if somehow streak was 0)
      stats.streak = 1;
      await userRef.update({
        streak: 1,
      });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, action, value } = await request.json();

    const userRef = adminDb.collection("gamification").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stats = userDoc.data();

    // Award XP based on action (removed daily_login)
    const xpRewards = {
      complete_chapter: 5,
      complete_course: 50,
      perfect_quiz: 2,
      help_student: 15,
      view_course: 10,
      complete_lesson: 5,
      correct_answer: 2, // 2 XP per correct answer
      generate_course: 10,
    };

    const xpGained = xpRewards[action] || value || 0;
    const newXP = stats.xp + xpGained;
    const newLevel = Math.floor(newXP / 1000) + 1;

    // Update streak for actual learning activities only
    let currentStreak = stats.streak || 0;
    const learningActions = [
      "complete_chapter",
      "complete_course",
      "perfect_quiz",
      "complete_lesson",
      "view_course",
      "correct_answer",
      "generate_course",
    ];

    if (learningActions.includes(action)) {
      const lastActive = stats.lastActive ? new Date(stats.lastActive) : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!lastActive) {
        // First time doing a learning activity
        currentStreak = 1;
      } else {
        lastActive.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) {
          // Same day, keep current streak (ensure it's at least 1)
          currentStreak = Math.max(stats.streak || 1, 1);
        } else if (daysDiff === 1) {
          // Consecutive day, increment streak
          currentStreak = (stats.streak || 0) + 1;
        } else if (daysDiff > 1) {
          // Streak broken, start fresh at 1
          currentStreak = 1;
        }
      }
    } else {
      // Not a learning action, keep current streak unchanged (ensure at least 1 if they are active)
      currentStreak = Math.max(stats.streak || 1, 1);
    }

    // Check for new badges
    const newBadges = checkBadges(stats, action);

    const updates = {
      xp: newXP,
      level: newLevel,
      streak: currentStreak,
      badges: [...new Set([...stats.badges, ...newBadges])],
      achievements: [
        ...stats.achievements,
        {
          title: getAchievementTitle(action),
          description: getAchievementDescription(action),
          xp: xpGained,
          timestamp: new Date().toISOString(),
        },
      ],
      lastActive: new Date().toISOString(),
    };

    await userRef.update(updates);

    return NextResponse.json({
      success: true,
      xpGained,
      currentStreak,
      newLevel: newLevel > stats.level,
      newBadges,
    });
  } catch (error) {
    console.error("Error updating stats:", error);
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
  }
}

function checkBadges(stats, action) {
  const badges = [];
  const currentBadges = stats.badges || [];

  // First course completion
  if (action === "complete_course" && !currentBadges.includes("first_course")) {
    badges.push("first_course");
  }

  // Perfect quiz score
  if (action === "perfect_quiz" && !currentBadges.includes("perfect_score")) {
    badges.push("perfect_score");
  }

  // 7-day streak
  if (stats.streak >= 7 && !currentBadges.includes("week_streak")) {
    badges.push("week_streak");
  }

  // 30-day streak
  if (stats.streak >= 30 && !currentBadges.includes("month_streak")) {
    badges.push("month_streak");
  }

  // Level 10 - Master
  if (stats.level >= 10 && !currentBadges.includes("master")) {
    badges.push("master");
  }

  // Level 50 - Legend
  if (stats.level >= 50 && !currentBadges.includes("legend")) {
    badges.push("legend");
  }

  // Night Owl - studying between 12 AM - 4 AM
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 4 && !currentBadges.includes("night_owl")) {
    badges.push("night_owl");
  }

  // Early Bird - studying between 4 AM - 6 AM
  if (hour >= 4 && hour < 6 && !currentBadges.includes("early_bird")) {
    badges.push("early_bird");
  }

  // Scholar - 10 courses completed (check achievements count)
  const coursesCompleted = (stats.achievements || []).filter(a => a.title === "Course Mastered!").length;
  if (coursesCompleted >= 10 && !currentBadges.includes("scholar")) {
    badges.push("scholar");
  }

  // Bookworm - 100 lessons completed
  const lessonsCompleted = (stats.achievements || []).filter(a => 
    a.title === "Lesson Complete!" || a.title === "Chapter Complete!"
  ).length;
  if (lessonsCompleted >= 100 && !currentBadges.includes("bookworm")) {
    badges.push("bookworm");
  }

  return badges;
}

function getAchievementTitle(action) {
  const titles = {
    complete_chapter: "Chapter Complete!",
    complete_course: "Course Mastered!",
    perfect_quiz: "Perfect Score!",
    help_student: "Helpful Hand",
    view_course: "Course Viewed!",
    complete_lesson: "Lesson Complete!",
    correct_answer: "Correct Answer!",
    generate_course: "New Course Generated!",
  };
  return titles[action] || "Achievement Unlocked!";
}

function getAchievementDescription(action) {
  const descriptions = {
    complete_chapter: "You completed a chapter",
    complete_course: "You completed an entire course",
    perfect_quiz: "You scored 100% on a quiz",
    help_student: "You helped another student",
    view_course: "You viewed a course",
    complete_lesson: "You completed a lesson",
    correct_answer: "You answered correctly",
    generate_course: "You generated a new AI course",
  };
  return descriptions[action] || "You earned an achievement";
}
