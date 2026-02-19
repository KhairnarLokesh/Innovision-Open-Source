"use client";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { CircleCheckIcon, Clock } from "lucide-react";
import xpContext from "@/contexts/xp";
import { useAuth } from "@/contexts/auth";
import { calculateEstimatedTime } from "@/lib/time-utils";

function Roadmap({ roadMap, id }) {
  const [height, setHeight] = useState((roadMap.chapters.length - 1) * 34 * 4);
  const { awardXP } = useContext(xpContext);
  const { user } = useAuth();
  const [viewAwarded, setViewAwarded] = useState(false);

  // Calculate estimated time
  const estimatedTime = calculateEstimatedTime(roadMap.chapters.length, roadMap.difficulty);

  useEffect(() => {
    function updateHeight() {
      if (window.innerWidth < 640) {
        setHeight((roadMap.chapters.length - 1) * 44 * 4);
      } else {
        setHeight((roadMap.chapters.length - 1) * 34 * 4);
      }
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [roadMap.chapters.length]);

  // Award XP for viewing the course (only once per session)
  useEffect(() => {
    if (user && awardXP && !viewAwarded) {
      awardXP("view_course");
      setViewAwarded(true);
    }
  }, [user, awardXP, viewAwarded]);

  return (
    <div className="flex flex-col justify-center max-w-3xl">
      <div className="ml-3 mb-3">
        <h1 className="text-2xl font-semibold">{roadMap.courseTitle}</h1>
        <p className="text-primary ml-2">{roadMap.courseDescription}</p>
        
        {/* Estimated Time Badge */}
        <div className="flex items-center gap-2 mt-3 ml-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-medium">{estimatedTime}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {roadMap.chapters.length} {roadMap.chapters.length === 1 ? "chapter" : "chapters"}
          </div>
        </div>
      </div>
      <div className="relative flex flex-col">
        <div
          className="absolute w-1 top-1 left-7.5 bg-zinc-100 dark:bg-zinc-900"
          style={{ height: `${height}px` }}
        ></div>

        {roadMap.chapters?.map((chapter, index) => (
          <div key={index} className="relative flex ml-5 gap-4 h-32 max-sm:h-44 last:mb-0 sm:mb-2">
            <div className="w-6 h-6 shrink-0 rounded-full border bg-zinc-100 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 flex justify-center items-center">
              {chapter.completed ? <CircleCheckIcon className="text-green-600 dark:text-green-400" /> : ""}
            </div>

            <Link
              href={`/chapter-test/${id}/${index + 1}`}
              className="flex flex-col border h-max max-w-xl w-[85%] rounded-md p-4 hover:border-blue-400 transition-colors"
            >
              <span className="text-secondary-foreground font-semibold">
                {chapter.chapterNumber || index + 1} . {chapter.chapterTitle || chapter.title || `Chapter ${index + 1}`}
              </span>
              <span className="text-secondary-foreground">
                {chapter.chapterDescription || chapter.description || ""}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Roadmap;
