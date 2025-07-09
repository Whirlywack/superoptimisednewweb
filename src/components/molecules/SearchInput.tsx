import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TextField } from "@/components/ui/Input";
import { IconButton } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Search, X } from "lucide-react";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  variant?: "default" | "filled" | "outline";
  size?: "sm" | "md" | "lg";
  showClearButton?: boolean;
  loading?: boolean;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  onSearch,
  onClear,
  variant = "default",
  size = "md",
  showClearButton = true,
  loading = false,
  debounceMs = 300,
  className,
  placeholder = "Search...",
  defaultValue = "",
  ...props
}: SearchInputProps) {
  const [query, setQuery] = useState(defaultValue?.toString() || "");
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for debounced search
    if (onSearch && debounceMs > 0) {
      const timer = setTimeout(() => {
        onSearch(newQuery);
      }, debounceMs);
      setDebounceTimer(timer);
    } else if (onSearch) {
      onSearch(newQuery);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    onSearch?.(query);
  };

  const handleClear = () => {
    setQuery("");
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    onClear?.();
    onSearch?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <form onSubmit={handleSearch} className="relative">
        {/* Search Icon */}
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <LucideIcon
            icon={Search}
            size="sm"
            className="text-warm-gray"
          />
        </div>

        {/* Input Field */}
        <TextField
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          variant={variant === "outline" ? "default" : variant}
          size={size}
          className={cn(
            "pl-10",
            showClearButton && query && "pr-10"
          )}
          disabled={loading}
          {...props}
        />

        {/* Clear Button */}
        {showClearButton && query && !loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <IconButton
              type="button"
              icon={<LucideIcon icon={X} size="xs" />}
              onClick={handleClear}
              variant="ghost"
              size="sm"
              aria-label="Clear search"
              className="size-6"
            />
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </form>
    </div>
  );
}