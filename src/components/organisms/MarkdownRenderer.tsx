import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";
import { LucideIcon } from "@/components/ui/Icon";
import { 
  Copy, 
  Check, 
  Hash, 
  Code,
  FileText,
  ExternalLink
} from "lucide-react";

interface MarkdownRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  showCopyButton?: boolean;
  showHeadingAnchors?: boolean;
  maxWidth?: "none" | "prose" | "narrow";
  variant?: "article" | "documentation" | "comment" | "blog";
  enableSyntaxHighlight?: boolean;
  onHeadingClick?: (id: string, text: string) => void;
  className?: string;
}

interface CodeBlockProps {
  children: string;
  language?: string;
  showCopyButton?: boolean;
  fileName?: string;
}

function CodeBlock({ 
  children, 
  language = "text", 
  showCopyButton = true,
  fileName 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="group relative my-4">
      {/* Header */}
      {(fileName || language || showCopyButton) && (
        <div className="flex items-center justify-between px-4 py-2 bg-warm-gray/10 border-b border-warm-gray/20 rounded-t-md">
          <div className="flex items-center gap-2">
            <LucideIcon icon={Code} size="sm" className="text-warm-gray" />
            {fileName && (
              <span className="text-sm font-mono text-warm-gray">{fileName}</span>
            )}
            {language && (
              <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                {language}
              </span>
            )}
          </div>
          
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors",
                "hover:bg-warm-gray/20",
                copied ? "text-green-600" : "text-warm-gray"
              )}
              aria-label="Copy code"
            >
              <LucideIcon icon={copied ? Check : Copy} size="xs" />
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      )}

      {/* Code Content with syntax highlighting */}
      <SyntaxHighlighter
        style={prism}
        language={language}
        PreTag="div"
        customStyle={{
          backgroundColor: "#1a1a1a",
          color: "#fafafa",
          padding: "1rem",
          borderRadius: fileName || language || showCopyButton ? "0 0 0.375rem 0.375rem" : "0.375rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          margin: 0,
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

export function MarkdownRenderer({
  content,
  showCopyButton = true,
  showHeadingAnchors = true,
  maxWidth = "prose",
  variant = "article",
  enableSyntaxHighlight = true,
  onHeadingClick,
  className,
  ...props
}: MarkdownRendererProps) {
  const maxWidthClasses = {
    none: "",
    prose: "max-w-3xl",
    narrow: "max-w-2xl",
  };

  const variantClasses = {
    article: "text-base leading-relaxed",
    documentation: "text-sm leading-relaxed",
    comment: "text-sm leading-normal",
    blog: "text-lg leading-relaxed",
  };

  const baseClasses = cn(
    "prose prose-gray max-w-none",
    "prose-headings:text-off-black prose-headings:font-bold",
    "prose-p:text-off-black prose-p:leading-relaxed prose-p:mb-4",
    "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium",
    "prose-strong:text-off-black prose-strong:font-bold",
    "prose-em:text-off-black",
    "prose-code:text-primary prose-code:bg-light-gray prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
    "prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-light-gray prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:text-warm-gray",
    "prose-ul:text-off-black prose-ol:text-off-black",
    "prose-li:text-off-black",
    "prose-table:text-off-black prose-table:border-collapse",
    "prose-th:text-off-black prose-th:font-bold prose-th:bg-light-gray prose-th:border prose-th:border-light-gray prose-th:px-4 prose-th:py-2",
    "prose-td:text-off-black prose-td:border prose-td:border-light-gray prose-td:px-4 prose-td:py-2",
    variant === "compact" && "prose-sm",
    variant === "blog" && "prose-lg",
    maxWidthClasses[maxWidth],
    variantClasses[variant],
    className
  );

  if (!content?.trim()) {
    return (
      <div className="text-center py-8">
        <LucideIcon icon={FileText} size="lg" className="mx-auto text-warm-gray mb-3" />
        <p className="text-warm-gray">No content to display</p>
      </div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      <ReactMarkdown
        rehypePlugins={[
          rehypeSanitize, // XSS protection
          ...(enableSyntaxHighlight ? [rehypeHighlight] : [])
        ]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "text";

            return !inline ? (
              <CodeBlock
                language={language}
                showCopyButton={showCopyButton}
              >
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            ) : (
              <code className="text-primary bg-light-gray px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          h1({ children, ...props }) {
            const text = typeof children === "string" ? children : "";
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            
            return (
              <h1 
                id={id}
                className="group flex items-center gap-2 text-3xl font-bold text-off-black mb-4 mt-8 first:mt-0 scroll-mt-20" 
                {...props}
              >
                {children}
                {showHeadingAnchors && (
                  <button
                    onClick={() => {
                      if (onHeadingClick) {
                        onHeadingClick(id, text);
                      } else {
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-light-gray rounded"
                    aria-label={`Link to ${text}`}
                  >
                    <LucideIcon icon={Hash} size="sm" className="text-warm-gray" />
                  </button>
                )}
              </h1>
            );
          },
          h2({ children, ...props }) {
            const text = typeof children === "string" ? children : "";
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            
            return (
              <h2 
                id={id}
                className="group flex items-center gap-2 text-2xl font-bold text-off-black mb-3 mt-6 scroll-mt-20" 
                {...props}
              >
                {children}
                {showHeadingAnchors && (
                  <button
                    onClick={() => {
                      if (onHeadingClick) {
                        onHeadingClick(id, text);
                      } else {
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-light-gray rounded"
                    aria-label={`Link to ${text}`}
                  >
                    <LucideIcon icon={Hash} size="sm" className="text-warm-gray" />
                  </button>
                )}
              </h2>
            );
          },
          h3({ children, ...props }) {
            const text = typeof children === "string" ? children : "";
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            
            return (
              <h3 
                id={id}
                className="group flex items-center gap-2 text-xl font-bold text-off-black mb-2 mt-4 scroll-mt-20" 
                {...props}
              >
                {children}
                {showHeadingAnchors && (
                  <button
                    onClick={() => {
                      if (onHeadingClick) {
                        onHeadingClick(id, text);
                      } else {
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-light-gray rounded"
                    aria-label={`Link to ${text}`}
                  >
                    <LucideIcon icon={Hash} size="sm" className="text-warm-gray" />
                  </button>
                )}
              </h3>
            );
          },
          a({ children, href, ...props }) {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                {...props}
              >
                {children}
                {isExternal && <LucideIcon icon={ExternalLink} size="xs" />}
              </a>
            );
          },
          img({ src, alt, ...props }) {
            return (
              <img
                src={src}
                alt={alt}
                className="rounded-lg max-w-full h-auto my-4"
                loading="lazy"
                {...props}
              />
            );
          },
          table({ children, ...props }) {
            return (
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border-collapse border border-light-gray" {...props}>
                  {children}
                </table>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}