"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";

export default function BookmarkButton({
  roadmapId,
  chapterNumber,
  chapterTitle = "",
  roadmapTitle = "",
  size = "default"
}) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if chapter is bookmarked on mount
  useEffect(() => {
    if (!user) return;

    async function checkBookmark() {
      try {
        const res = await fetch("/api/bookmarks");
        const data = await res.json();

        if (data.bookmarks) {
          const bookmarkId = `${roadmapId}_${chapterNumber}`;
          setIsBookmarked(data.bookmarks.some(b => b.id === bookmarkId));
        }
      } catch (error) {
        console.error("Error checking bookmark:", error);
      }
    }

    checkBookmark();
  }, [user, roadmapId, chapterNumber]);

  const toggleBookmark = async () => {
    if (!user) {
      toast.error("Please login to bookmark chapters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapId,
          chapterNumber,
          chapterTitle,
          roadmapTitle,
          action: isBookmarked ? "remove" : "add",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsBookmarked(!isBookmarked);
        toast.success(
          isBookmarked ? "Bookmark removed" : "Chapter bookmarked!",
          {
            icon: <Bookmark className={`h-4 w-4 ${!isBookmarked ? "fill-yellow-500 text-yellow-500" : ""}`} />,
          }
        );
      }
    } catch (error) {
      toast.error("Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-9 w-9",
    lg: "h-10 w-10",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    default: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleBookmark}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        transition-all duration-200
        ${isBookmarked
          ? "text-yellow-500 hover:text-yellow-600"
          : "text-muted-foreground hover:text-foreground"
        }
      `}
      title={isBookmarked ? "Remove bookmark" : "Bookmark this chapter"}
    >
      <Bookmark
        className={`
          ${iconSizes[size]}
          transition-all duration-200
          ${isBookmarked ? "fill-yellow-500" : ""}
          ${loading ? "animate-pulse" : ""}
        `}
      />
    </Button>
  );
}
