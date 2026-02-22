"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark, coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useNightMode } from "@/contexts/nightMode";

// Copy button component for code blocks
const CopyButton = ({ code, theme }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied!", {
        icon: <Check className="h-4 w-4 text-green-500" />,
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        absolute top-2 right-2 p-2 rounded-md
        transition-all duration-200 ease-in-out z-10
        ${copied
          ? "bg-green-500/20 text-green-400"
          : theme === "dark"
            ? "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-200"
            : "bg-gray-300/50 text-gray-600 hover:bg-gray-400/50 hover:text-gray-800"
        }
      `}
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <Check className="h-4 w-4 animate-scale-check" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
};

const MarkDown = ({ content }) => {
  const [theme, setTheme] = useState("light");
  const { nightMode } = useNightMode();

  // Listen for theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    // Listen for theme changes
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem("theme") || "light";
      setTheme(currentTheme);
    };

    // Listen for storage events (theme changes in other tabs)
    window.addEventListener("storage", handleThemeChange);

    // Also check periodically for theme changes (fallback)
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem("theme") || "light";
      if (currentTheme !== theme) {
        setTheme(currentTheme);
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      clearInterval(interval);
    };
  }, [theme]);

  // Select appropriate theme based on current mode
  const codeTheme = theme === "dark" ? coldarkDark : coldarkCold;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        blockquote({ node, children }) {
          // Check for GitHub-style callouts like [!NOTE], [!TIP], etc.
          const content = React.Children.toArray(children);
          const firstChild = content[0];

          if (typeof firstChild?.props?.children?.[0] === 'string') {
            const text = firstChild.props.children[0];
            const match = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);

            if (match) {
              const type = match[1].toUpperCase();
              const remainingContent = [...content];

              // Remove the [!TYPE] prefix from the first child
              remainingContent[0] = React.cloneElement(firstChild, {
                children: [text.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i, '').trim(), ...firstChild.props.children.slice(1)]
              });

              const styles = {
                NOTE: "border-blue-500 bg-blue-500/5 text-blue-700 dark:text-blue-300",
                TIP: "border-green-500 bg-green-500/5 text-green-700 dark:text-green-300",
                IMPORTANT: "border-purple-500 bg-purple-500/5 text-purple-700 dark:text-purple-300",
                WARNING: "border-yellow-500 bg-yellow-500/5 text-yellow-700 dark:text-yellow-300",
                CAUTION: "border-red-500 bg-red-500/5 text-red-700 dark:text-red-300"
              };

              return (
                <div className={`my-6 p-4 border-l-4 rounded-r-lg ${styles[type] || styles.NOTE}`}>
                  <div className="font-bold text-xs uppercase mb-2 flex items-center gap-2">
                    {type === "NOTE" && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                    {type === "TIP" && <span className="w-2 h-2 rounded-full bg-green-500" />}
                    {type === "IMPORTANT" && <span className="w-2 h-2 rounded-full bg-purple-500" />}
                    {match[1]}
                  </div>
                  <div className="text-sm leading-relaxed">{remainingContent}</div>
                </div>
              );
            }
          }

          return (
            <blockquote className="border-l-4 border-muted pl-4 my-6 italic text-muted-foreground">
              {children}
            </blockquote>
          );
        },
        h2({ children }) {
          return (
            <h2 className="text-2xl font-bold mt-12 mb-6 pb-2 border-b border-border/50 flex items-center gap-3 group">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              {children}
            </h2>
          );
        },
        h3({ children }) {
          return (
            <h3 className="text-xl font-semibold mt-8 mb-4 text-foreground/90">
              {children}
            </h3>
          );
        },
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).trim();

          return !inline && match ? (
            <div className="relative group my-4">
              {/* Language badge */}
              <div className={`absolute top-0 left-0 px-3 py-1 text-xs font-medium rounded-tl-md rounded-br-md ${theme === "dark"
                  ? "text-gray-400 bg-gray-800"
                  : "text-gray-600 bg-gray-200"
                }`}>
                {match[1]}
              </div>

              {/* Copy button */}
              <CopyButton code={codeString} theme={theme} />

              <SyntaxHighlighter
                customStyle={{
                  fontSize: "14px",
                  borderRadius: "6px",
                  paddingTop: "2.5rem",
                  backgroundColor: theme === "dark" ? "#111827" : "#f9fafb",
                }}
                style={codeTheme}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code
              className={`${className || ""} text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded`}
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkDown;