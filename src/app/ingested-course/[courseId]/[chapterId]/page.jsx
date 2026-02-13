"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Loader2,
    Clock,
    ChevronUp,
    List,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function IngestedChapterPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [chapter, setChapter] = useState(null);
    const [courseTitle, setCourseTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [readProgress, setReadProgress] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        fetchChapter();
    }, [params.courseId, params.chapterId]);

    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return;
            const el = contentRef.current;
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                setReadProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)));
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const fetchChapter = async () => {
        try {
            const res = await fetch(
                `/api/ingested-courses/${params.courseId}/chapters/${params.chapterId}`
            );
            if (res.ok) {
                const data = await res.json();
                setChapter(data.chapter);
                setCourseTitle(data.courseTitle || "");
            } else {
                setError("Chapter not found");
            }
        } catch (err) {
            setError("Failed to load chapter");
        }
        setLoading(false);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading chapter...</p>
                </div>
            </div>
        );
    }

    if (error || !chapter) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                    <p className="text-muted-foreground mb-4">{error || "Chapter not found"}</p>
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/ingested-course/${params.courseId}`)}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Course
                    </Button>
                </div>
            </div>
        );
    }

    const estimatedReadTime = Math.ceil((chapter.wordCount || 0) / 200);

    return (
        <div className="min-h-screen bg-background" ref={contentRef}>
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
                <div
                    className="h-full bg-linear-to-r from-purple-500 to-blue-500 transition-all duration-150"
                    style={{ width: `${readProgress}%` }}
                />
            </div>

            {/* Top Navigation */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                router.push(`/ingested-course/${params.courseId}`)
                            }
                            className="shrink-0"
                        >
                            <List className="h-4 w-4 mr-1" />
                            All Chapters
                        </Button>
                        <span className="text-sm text-muted-foreground truncate hidden sm:block">
                            {courseTitle}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {estimatedReadTime} min read
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 font-medium">
                            {readProgress}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Chapter Content */}
            <div className="max-w-4xl mx-auto px-6 py-10">
                {/* Chapter Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-purple-500 font-medium mb-2">
                        <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold">
                            {chapter.chapterNumber}
                        </span>
                        Chapter {chapter.chapterNumber}
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                        {chapter.title}
                    </h1>
                    {chapter.summary && (
                        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
                            {chapter.summary}
                        </p>
                    )}
                    <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{chapter.wordCount?.toLocaleString()} words</span>
                        <span>•</span>
                        <span>{estimatedReadTime} min read</span>
                    </div>
                    <hr className="mt-6 border-border/50" />
                </div>

                {/* Chapter Text */}
                <article className="prose prose-lg dark:prose-invert max-w-none leading-relaxed">
                    {chapter.content.split("\n\n").map((paragraph, index) => {
                        if (!paragraph.trim()) return null;
                        return (
                            <p
                                key={index}
                                className="mb-4 text-foreground/90 leading-[1.8]"
                            >
                                {paragraph.trim()}
                            </p>
                        );
                    })}
                </article>

                {/* Chapter Navigation */}
                <div className="mt-12 pt-6 border-t border-border/50">
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.push(
                                    `/ingested-course/${params.courseId}/${chapter.previousChapterId}`
                                )
                            }
                            disabled={!chapter.previousChapterId}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Previous Chapter</span>
                        </Button>

                        <span className="text-sm text-muted-foreground">
                            Chapter {chapter.chapterNumber}
                        </span>

                        <Button
                            onClick={() =>
                                router.push(
                                    `/ingested-course/${params.courseId}/${chapter.nextChapterId}`
                                )
                            }
                            disabled={!chapter.nextChapterId}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            <span>Next Chapter</span>
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {readProgress > 20 && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-purple-500 text-white shadow-lg shadow-purple-500/25 flex items-center justify-center hover:bg-purple-600 transition-all z-50"
                >
                    <ChevronUp className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
