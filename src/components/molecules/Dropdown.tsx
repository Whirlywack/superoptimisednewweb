import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  contentClassName?: string;
}

export function Dropdown({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  align = "start",
  side = "bottom",
  className,
  contentClassName,
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, setIsOpen]);

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  const sideClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2", 
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  return (
    <div ref={dropdownRef} className={cn("relative inline-block", className)}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 min-w-[200px]",
            "bg-background border border-border rounded-lg shadow-lg",
            "animate-in fade-in-0 zoom-in-95",
            alignmentClasses[align],
            sideClasses[side],
            contentClassName
          )}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  icon?: React.ReactNode;
  shortcut?: string;
}

export function DropdownItem({
  children,
  disabled = false,
  selected = false,
  icon,
  shortcut,
  className,
  onClick,
  ...props
}: DropdownItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm cursor-pointer",
        "transition-colors",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-muted focus:bg-muted",
        selected && "bg-muted",
        className
      )}
      role="menuitem"
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      <div className="flex items-center gap-3 flex-1">
        {icon && (
          <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
            {icon}
          </span>
        )}
        <span className="flex-1">{children}</span>
        {selected && <Check className="w-4 h-4 text-primary" />}
      </div>
      {shortcut && (
        <span className="text-xs text-muted-foreground">{shortcut}</span>
      )}
    </div>
  );
}

export function DropdownSeparator({ className }: { className?: string }) {
  return <div className={cn("h-px bg-border my-1", className)} role="separator" />;
}

export function DropdownLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider", className)}>
      {children}
    </div>
  );
}

// Select Component
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className,
}: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const [isOpen, setIsOpen] = React.useState(false);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = onChange || setInternalValue;

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    setValue(optionValue);
    setIsOpen(false);
  };

  return (
    <Dropdown
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2",
            "text-left bg-background border border-border rounded-lg",
            "transition-colors",
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            className
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={cn(!selectedOption && "text-muted-foreground")}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
        </button>
      }
    >
      <div className="py-1">
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            disabled={option.disabled}
            selected={option.value === value}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </DropdownItem>
        ))}
      </div>
    </Dropdown>
  );
}

// Menu Component  
interface MenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Menu({ trigger, children, align = "start", side = "bottom", className }: MenuProps) {
  return (
    <Dropdown
      trigger={trigger}
      align={align}
      side={side}
      className={className}
      contentClassName="p-1"
    >
      {children}
    </Dropdown>
  );
}