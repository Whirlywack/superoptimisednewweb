import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
  className?: string;
  overlayClassName?: string;
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-none m-4",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  closable = true,
  className,
  overlayClassName,
}: ModalProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsVisible(false), 150);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closable) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, closable, onClose]);

  if (!isVisible && !open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closable) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "transition-all duration-200 ease-out",
        open
          ? "bg-black/50 backdrop-blur-sm opacity-100"
          : "bg-black/0 backdrop-blur-0 opacity-0 pointer-events-none",
        overlayClassName
      )}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      <div
        className={cn(
          "relative w-full bg-background rounded-lg shadow-lg",
          "transition-all duration-200 ease-out",
          "max-h-[90vh] overflow-hidden",
          open
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0",
          modalSizes[size],
          className
        )}
      >
        {/* Header */}
        {(title || closable) && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex-1">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-foreground"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-muted-foreground"
                >
                  {description}
                </p>
              )}
            </div>
            
            {closable && (
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "ml-4 inline-flex items-center justify-center",
                  "h-8 w-8 rounded-md",
                  "hover:bg-muted",
                  "transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                )}
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ModalContent({ className, children, ...props }: ModalContentProps) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ModalFooter({ className, children, ...props }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Confirmation Dialog Component
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal open={open} onClose={onClose} size="sm" title={title} description={description}>
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === "destructive" ? "outline" : "primary"}
          onClick={handleConfirm}
          loading={loading}
          className={variant === "destructive" ? "border-warm-gray text-warm-gray hover:bg-light-gray" : ""}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// Alert Dialog Component
interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  actionText?: string;
  variant?: "default" | "success" | "warning" | "error";
}

export function AlertDialog({
  open,
  onClose,
  title = "Alert",
  description,
  actionText = "OK",
  variant = "default",
}: AlertDialogProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm" title={title} description={description}>
      <ModalFooter>
        <Button
          variant={variant === "error" ? "outline" : "primary"}
          onClick={onClose}
          className={variant === "error" ? "border-warm-gray text-warm-gray hover:bg-light-gray" : ""}
        >
          {actionText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}