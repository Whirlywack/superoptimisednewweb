"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component that catches JavaScript errors anywhere in the child component tree
 * Follows the coding standards for error handling and user experience
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for debugging (development only)
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Return custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI following Elevated Brutalism design
      return (
        <div
          className="flex min-h-screen items-center justify-center"
          style={{ backgroundColor: "var(--off-white)" }}
        >
          <div
            className="max-w-md border-2 p-8 text-center"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
            }}
          >
            <div className="mb-6 flex justify-center">
              <AlertTriangle
                size={48}
                style={{ color: "var(--primary)" }}
              />
            </div>
            
            <h2
              className="mb-4 font-bold uppercase tracking-tight"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--off-black)",
              }}
            >
              Something went wrong
            </h2>
            
            <p
              className="mb-6"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--warm-gray)",
                lineHeight: "1.5",
              }}
            >
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>

            <button
              onClick={this.handleReset}
              className="flex items-center justify-center font-medium uppercase transition-colors hover:bg-off-black hover:text-off-white"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--off-black)",
                backgroundColor: "var(--light-gray)",
                padding: "var(--space-sm) var(--space-md)",
                border: "2px solid var(--light-gray)",
                gap: "var(--space-xs)",
                cursor: "pointer",
                width: "100%",
              }}
            >
              <RefreshCw size={16} />
              Try Again
            </button>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details
                className="mt-6 text-left"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                }}
              >
                <summary
                  className="cursor-pointer font-medium"
                  style={{ color: "var(--off-black)" }}
                >
                  Error Details (Development)
                </summary>
                <pre
                  className="mt-2 overflow-auto rounded border p-2"
                  style={{
                    backgroundColor: "var(--light-gray)",
                    fontSize: "var(--text-xs)",
                    maxHeight: "200px",
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      {"\n\nComponent Stack:"}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary component for functional components
 * Use this when you need to wrap specific sections with error handling
 */
export function ErrorBoundaryWrapper({
  children,
  fallback,
  onError,
}: ErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}