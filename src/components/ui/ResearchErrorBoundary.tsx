"use client";

import type { ReactNode } from "react";
import React, { Component } from "react";
import { HomepageNavigation } from "../templates/Homepage/HomepageNavigation";
import { HomepageFooter } from "../templates/Homepage/HomepageFooter";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export class ResearchErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Research page error:", error, errorInfo);

    // Log to analytics or error reporting service
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "exception", {
        description: `Research page error: ${error.message}`,
        fatal: false,
      });
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      retryCount: 0,
    });

    // Clear any cached data that might be causing issues
    if (typeof window !== "undefined") {
      localStorage.removeItem("research-responses");
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.state.retryCount < this.maxRetries;
      const errorMessage = this.state.error?.message || "An unexpected error occurred";

      return (
        <div className="flex min-h-screen flex-col bg-off-white">
          <HomepageNavigation />

          <main className="flex flex-1 items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
              <div className="mb-lg">
                <h1 className="mb-md text-4xl font-bold text-off-black">Oops!</h1>
                <p className="mb-lg text-lg text-warm-gray">
                  Something went wrong with the research questions.
                </p>

                {process.env.NODE_ENV === "development" && (
                  <div className="mb-lg border border-red-200 bg-red-50 p-md text-left">
                    <p className="font-mono text-sm text-red-700">{errorMessage}</p>
                    <p className="mt-sm font-mono text-xs text-red-600">
                      Retry count: {this.state.retryCount}/{this.maxRetries}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-md">
                {canRetry ? (
                  <button
                    onClick={this.handleRetry}
                    className="w-full border-2 border-primary bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-off-black"
                  >
                    Try Again ({this.maxRetries - this.state.retryCount} attempts left)
                  </button>
                ) : (
                  <button
                    onClick={this.handleReset}
                    className="w-full border-2 border-primary bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-off-black"
                  >
                    Reset and Start Over
                  </button>
                )}

                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full border-2 border-light-gray bg-off-white px-6 py-3 font-semibold text-off-black transition-all hover:border-primary"
                >
                  Return to Homepage
                </button>
              </div>

              <div className="mt-lg">
                <p className="font-mono text-sm text-warm-gray">
                  If this problem persists, please try refreshing the page or contact support.
                </p>
              </div>
            </div>
          </main>

          <HomepageFooter />
        </div>
      );
    }

    return this.props.children;
  }
}
