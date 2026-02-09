"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, BookOpen, Network, Loader2, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageBackground, GridPattern, PageHeader, ScrollReveal, HoverCard } from "@/components/ui/PageWrapper";

export default function ContentIngestion() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [premiumStatus, setPremiumStatus] = useState({ isPremium: false });
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      if (user) {
        try {
          const res = await fetch("/api/premium/status");
          const data = await res.json();
          setPremiumStatus(data);
        } catch (error) {
          console.error("Error fetching premium status:", error);
        }
      }
    };
    fetchPremiumStatus();
  }, [user]);

  const handleFileUpload = async (type) => {
    if (!premiumStatus.isPremium) {
      toast.error("Content Ingestion is only available for Premium users. Please upgrade!");
      return;
    }

    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/content/ingest', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Content ingested successfully! ${data.chunks} chunks created.`);
        setFile(null);
      } else {
        toast.error(data.error || "Failed to ingest content");
      }
    } catch (error) {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 relative">
      <PageBackground />
      <GridPattern opacity={0.02} />

      <div className="max-w-7xl mx-auto relative z-10">
        <PageHeader
          title="Smart Content Ingestion"
          description="Auto-ingest PDFs and textbooks to build knowledge graphs"
          icon={Upload}
          iconColor="text-purple-500"
          badge={<><Sparkles className="h-3.5 w-3.5" /> AI-Powered</>}
        />

        {!premiumStatus.isPremium && (
          <ScrollReveal delay={100}>
            <div className="mb-6 p-4 bg-linear-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/25">
                  <Crown className="h-5 w-5 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Preview Only</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Content Ingestion is a Premium feature. Upgrade to upload and process PDFs, textbooks, and build knowledge graphs!
                  </p>
                  <Button
                    onClick={() => router.push("/premium")}
                    className="bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black transition-all duration-300 hover:scale-105"
                  >
                    Upgrade to Premium - ₹100/month
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <ScrollReveal delay={150} className="space-y-6">
            <HoverCard>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-purple-500" />
                    </div>
                    Upload Content
                  </CardTitle>
                  <CardDescription>
                    Upload PDFs or textbooks for automatic processing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="file"
                    accept=".pdf,.txt,.epub"
                    onChange={(e) => setFile(e.target.files[0])}
                    disabled={uploading}
                    className="bg-background/50"
                  />

                  {file && (
                    <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleFileUpload('pdf')}
                      disabled={uploading || !file}
                      variant="outline"
                      className="hover:bg-purple-500/10 hover:border-purple-500/50 transition-all"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button
                      onClick={() => handleFileUpload('textbook')}
                      disabled={uploading || !file}
                      variant="outline"
                      className="hover:bg-purple-500/10 hover:border-purple-500/50 transition-all"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Text/eBook
                    </Button>
                  </div>

                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing content...
                    </div>
                  )}
                </CardContent>
              </Card>
            </HoverCard>

            <HoverCard>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Supported Formats</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <FileText className="h-4 w-4 text-red-500" />
                      PDF documents
                    </li>
                    <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      Text files and eBooks (TXT, EPUB)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </HoverCard>
          </ScrollReveal>

          {/* Knowledge Graph Section */}
          <ScrollReveal delay={200} className="space-y-6">
            <HoverCard>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Network className="h-5 w-5 text-purple-500" />
                    </div>
                    Knowledge Graph
                  </CardTitle>
                  <CardDescription>
                    AI-powered content organization and relationship mapping
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-border/50 rounded-xl bg-background/30">
                      <h4 className="font-semibold mb-2">What happens:</h4>
                      <ol className="space-y-2 text-sm list-decimal list-inside text-muted-foreground">
                        <li>Content is extracted and chunked</li>
                        <li>Key concepts are identified</li>
                        <li>Relationships are mapped</li>
                        <li>Knowledge graph is built</li>
                        <li>Content becomes searchable</li>
                      </ol>
                    </div>

                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                      <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">
                        Benefits:
                      </h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <Network className="h-3 w-3 text-green-500" />
                          Better content coherence
                        </li>
                        <li className="flex items-center gap-2">
                          <Network className="h-3 w-3 text-green-500" />
                          Improved search & retrieval
                        </li>
                        <li className="flex items-center gap-2">
                          <Network className="h-3 w-3 text-green-500" />
                          Automatic prerequisite detection
                        </li>
                        <li className="flex items-center gap-2">
                          <Network className="h-3 w-3 text-green-500" />
                          Smart content recommendations
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </HoverCard>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
