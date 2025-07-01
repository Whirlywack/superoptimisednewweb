import React from "react";
import { cn } from "@/lib/utils";
import { Button, IconButton } from "@/components/ui/button";
import { MonoText } from "@/components/ui/Typography";
import { LucideIcon } from "@/components/ui/Icon";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageInfo?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact";
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  showPageInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  size = "md",
  variant = "default",
  className,
  ...props
}: PaginationControlsProps) {
  const isCompact = variant === "compact";
  
  // Calculate which page numbers to show
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[0] > 1;
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const buttonSize = size;

  if (isCompact) {
    return (
      <div
        className={cn("flex items-center justify-between gap-4", className)}
        {...props}
      >
        <IconButton
          icon={<LucideIcon icon={ChevronLeft} size="sm" />}
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          variant="outline"
          size={buttonSize}
          aria-label="Previous page"
        />

        <div className="flex items-center gap-2">
          <MonoText variant="muted" className="text-sm">
            Page {currentPage} of {totalPages}
          </MonoText>
        </div>

        <IconButton
          icon={<LucideIcon icon={ChevronRight} size="sm" />}
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          variant="outline"
          size={buttonSize}
          aria-label="Next page"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col items-center gap-4", className)}
      {...props}
    >
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <IconButton
          icon={<LucideIcon icon={ChevronLeft} size="sm" />}
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          variant="outline"
          size={buttonSize}
          aria-label="Previous page"
        />

        {/* First page */}
        {showFirstLast && showLeftEllipsis && (
          <>
            <Button
              onClick={() => handlePageClick(1)}
              variant={1 === currentPage ? "primary" : "outline"}
              size={buttonSize}
              className="w-10"
            >
              1
            </Button>
            {visiblePages[0] > 2 && (
              <span className="px-2 text-warm-gray">...</span>
            )}
          </>
        )}

        {/* Visible page numbers */}
        {visiblePages.map((page) => (
          <Button
            key={page}
            onClick={() => handlePageClick(page)}
            variant={page === currentPage ? "primary" : "outline"}
            size={buttonSize}
            className="w-10"
          >
            {page}
          </Button>
        ))}

        {/* Last page */}
        {showFirstLast && showRightEllipsis && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2 text-warm-gray">...</span>
            )}
            <Button
              onClick={() => handlePageClick(totalPages)}
              variant={totalPages === currentPage ? "primary" : "outline"}
              size={buttonSize}
              className="w-10"
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next button */}
        <IconButton
          icon={<LucideIcon icon={ChevronRight} size="sm" />}
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          variant="outline"
          size={buttonSize}
          aria-label="Next page"
        />
      </div>

      {/* Page info */}
      {showPageInfo && (
        <MonoText variant="muted" className="text-center">
          Showing page {currentPage} of {totalPages}
        </MonoText>
      )}
    </div>
  );
}