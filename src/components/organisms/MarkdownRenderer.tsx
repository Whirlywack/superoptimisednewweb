import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Hash, 
  ChevronRight,
  Code,
  FileText,
  List,
  Quote
} from "lucide-react";

interface MarkdownRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  showHeadingAnchors?: boolean;
  maxWidth?: "none" | "prose" | "narrow";
  variant?: "article" | "documentation" | "comment";
  enableSyntaxHighlight?: boolean;
  onHeadingClick?: (id: string, text: string) => void;
  className?: string;
}

interface CodeBlockProps {
  children: string;
  language?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  fileName?: string;
}

function CodeBlock({ 
  children, 
  language = "text", 
  showLineNumbers = true, 
  showCopyButton = true,
  fileName 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const handleCopy = async () => {
    if (!codeRef.current) return;
    
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const lines = children.trim().split("\n");

  return (
    <div className="group relative my-4">
      {/* Header */}
      {(fileName || showCopyButton) && (
        <div className="flex items-center justify-between px-4 py-2 bg-warm-gray/10 dark:bg-warm-gray/20 border-b border-warm-gray/20 rounded-t-md">
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
                "hover:bg-warm-gray/20 dark:hover:bg-warm-gray/30",
                copied ? "text-green-600 dark:text-green-400" : "text-warm-gray"
              )}
              aria-label="Copy code"
            >
              <LucideIcon icon={copied ? Check : Copy} size="xs" />
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      )}

      {/* Code Content */}
      <div className="relative overflow-x-auto">
        <pre className={cn(
          "p-4 bg-off-black dark:bg-off-black/50 text-off-white",
          "border border-warm-gray/20 dark:border-warm-gray/30",
          fileName || showCopyButton ? "rounded-t-none rounded-b-md" : "rounded-md",
          "text-sm font-mono leading-relaxed"
        )}>
          {showLineNumbers ? (
            <div className="flex">
              {/* Line Numbers */}
              <div className="select-none pr-4 text-warm-gray/60 text-right">
                {lines.map((_, index) => (
                  <div key={index} className="leading-relaxed">
                    {index + 1}
                  </div>
                ))}
              </div>
              
              {/* Code */}
              <code ref={codeRef} className="flex-1">
                {lines.map((line, index) => (
                  <div key={index} className="leading-relaxed">
                    {line || "\u00A0"}
                  </div>
                ))}
              </code>
            </div>
          ) : (
            <code ref={codeRef} className="block">
              {children}
            </code>
          )}
        </pre>

        {/* Copy button (when no header) */}
        {!fileName && showCopyButton && (
          <button
            onClick={handleCopy}
            className={cn(
              "absolute top-2 right-2 p-2 rounded transition-colors opacity-0 group-hover:opacity-100",
              "bg-warm-gray/20 hover:bg-warm-gray/30",
              copied ? "text-green-400" : "text-warm-gray"
            )}
            aria-label="Copy code"
          >
            <LucideIcon icon={copied ? Check : Copy} size="sm" />
          </button>
        )}
      </div>
    </div>
  );
}

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  showAnchor?: boolean;
  onHeadingClick?: (id: string, text: string) => void;
}

function Heading({ level, children, showAnchor = true, onHeadingClick }: HeadingProps) {
  const text = typeof children === "string" ? children : "";
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const handleClick = () => {
    if (onHeadingClick) {
      onHeadingClick(id, text);
    } else {
      // Default behavior: scroll to element
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const sizeClasses = {
    1: "text-3xl font-bold",
    2: "text-2xl font-semibold",
    3: "text-xl font-semibold", 
    4: "text-lg font-medium",
    5: "text-base font-medium",
    6: "text-sm font-medium",
  };

  const marginClasses = {
    1: "mt-8 mb-4 first:mt-0",
    2: "mt-6 mb-3 first:mt-0",
    3: "mt-5 mb-3 first:mt-0",
    4: "mt-4 mb-2 first:mt-0",
    5: "mt-3 mb-2 first:mt-0",
    6: "mt-2 mb-1 first:mt-0",
  };

  return (
    <Tag
      id={id}
      className={cn(
        "group flex items-center gap-2 text-off-black dark:text-off-white scroll-mt-20",
        sizeClasses[level],
        marginClasses[level]
      )}
    >
      {children}
      {showAnchor && (
        <button
          onClick={handleClick}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-light-gray dark:hover:bg-warm-gray/20 rounded"
          aria-label={`Link to ${text}`}
        >
          <LucideIcon icon={Hash} size="sm" className="text-warm-gray" />
        </button>
      )}
    </Tag>
  );
}

export function MarkdownRenderer({
  content,
  showLineNumbers = true,
  showCopyButton = true,
  showHeadingAnchors = true,
  maxWidth = "prose",
  variant = "article",
  enableSyntaxHighlight = false,
  onHeadingClick,
  className,
  ...props
}: MarkdownRendererProps) {
  const [parsedContent, setParsedContent] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Simple markdown parser for demo purposes
    // In a real implementation, you'd use a proper markdown parser like `marked` or `remark`
    const parseMarkdown = (text: string) => {
      const lines = text.split("\n");
      const elements: React.ReactNode[] = [];
      let currentElement: string[] = [];
      let elementType: string | null = null;
      let keyCounter = 0;

      const flushCurrentElement = () => {
        if (currentElement.length === 0) return;

        const content = currentElement.join("\n");
        const key = `element-${keyCounter++}`;

        switch (elementType) {
          case "code":
            const match = content.match(/^```(\w+)?\n([\s\S]*?)```$/);
            if (match) {
              const [, language, code] = match;
              elements.push(
                <CodeBlock
                  key={key}
                  language={language}
                  showLineNumbers={showLineNumbers}
                  showCopyButton={showCopyButton}
                >
                  {code}
                </CodeBlock>
              );
            }
            break;
          case "blockquote":
            elements.push(
              <blockquote
                key={key}
                className="border-l-4 border-primary/30 pl-4 my-4 italic text-warm-gray"
              >
                <div className="flex items-start gap-2">
                  <LucideIcon icon={Quote} size="sm" className="mt-1 text-primary" />
                  <div className="flex-1">
                    {content.replace(/^>\s*/gm, "")}
                  </div>
                </div>
              </blockquote>
            );
            break;
          case "list":
            const listItems = content.split("\n").map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <LucideIcon icon={ChevronRight} size="xs" className="mt-1 text-primary" />
                <span>{item.replace(/^[*-]\s*/, "")}</span>
              </li>
            ));
            elements.push(
              <ul key={key} className="my-4 space-y-1">
                {listItems}
              </ul>
            );
            break;
          default:
            if (content.trim()) {
              elements.push(
                <p key={key} className="my-4 text-off-black dark:text-off-white leading-relaxed">
                  {content}
                </p>
              );
            }
        }

        currentElement = [];
        elementType = null;
      };

      for (const line of lines) {
        // Headings
        if (line.match(/^#{1,6}\s/)) {
          flushCurrentElement();
          const level = line.match(/^#+/)?.[0].length as 1 | 2 | 3 | 4 | 5 | 6;
          const text = line.replace(/^#+\s*/, "");
          elements.push(
            <Heading
              key={`heading-${keyCounter++}`}
              level={level}
              showAnchor={showHeadingAnchors}
              onHeadingClick={onHeadingClick}
            >
              {text}
            </Heading>
          );
          continue;
        }

        // Code blocks
        if (line.startsWith("```")) {
          if (elementType === "code") {
            currentElement.push(line);
            flushCurrentElement();
          } else {
            flushCurrentElement();
            elementType = "code";
            currentElement.push(line);
          }
          continue;
        }

        // Blockquotes
        if (line.startsWith(">")) {
          if (elementType !== "blockquote") {
            flushCurrentElement();
            elementType = "blockquote";
          }
          currentElement.push(line);
          continue;
        }

        // Lists
        if (line.match(/^[*-]\s/)) {
          if (elementType !== "list") {
            flushCurrentElement();
            elementType = "list";
          }
          currentElement.push(line);
          continue;
        }

        // Empty lines
        if (line.trim() === "") {
          if (elementType !== "code") {
            flushCurrentElement();
          } else {
            currentElement.push(line);
          }
          continue;
        }

        // Regular paragraphs
        if (elementType === "code" || elementType === "blockquote" || elementType === "list") {
          currentElement.push(line);
        } else {
          if (elementType !== "paragraph") {
            flushCurrentElement();
            elementType = "paragraph";
          }
          currentElement.push(line);
        }
      }

      flushCurrentElement();
      return elements;
    };

    setParsedContent(parseMarkdown(content));
  }, [content, showLineNumbers, showCopyButton, showHeadingAnchors, onHeadingClick]);

  const maxWidthClasses = {
    none: "",
    prose: "max-w-3xl",
    narrow: "max-w-2xl",
  };

  const variantClasses = {
    article: "text-base leading-relaxed",
    documentation: "text-sm leading-relaxed",
    comment: "text-sm leading-normal",
  };

  return (
    <div
      className={cn(
        "markdown-renderer",
        maxWidthClasses[maxWidth],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {parsedContent.length > 0 ? parsedContent : (
        <div className="text-center py-8">
          <LucideIcon icon={FileText} size="lg" className="mx-auto text-warm-gray mb-3" />
          <p className="text-warm-gray">No content to display</p>
        </div>
      )}
    </div>
  );
}