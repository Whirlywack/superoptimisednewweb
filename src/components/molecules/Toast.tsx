import React from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  closable?: boolean;
  icon?: React.ReactNode;
  duration?: number;
}

const toastVariants = {
  default: {
    container: "bg-background border-border text-foreground",
    icon: "text-foreground",
  },
  success: {
    container: "bg-light-gray border-primary text-off-black",
    icon: "text-primary",
  },
  warning: {
    container: "bg-light-gray border-warm-gray text-off-black",
    icon: "text-warm-gray",
  },
  error: {
    container: "bg-light-gray border-warm-gray text-off-black",
    icon: "text-warm-gray",
  },
  info: {
    container: "bg-light-gray border-primary text-off-black",
    icon: "text-primary",
  },
};

const defaultIcons = {
  default: null,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

export function Toast({
  className,
  variant = "default",
  title,
  description,
  action,
  onClose,
  closable = true,
  icon,
  duration,
  children,
  ...props
}: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const variantStyles = toastVariants[variant];
  const DefaultIcon = defaultIcons[variant];

  React.useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 150); // Allow fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 150); // Allow fade out animation
  };

  if (!isVisible) {
    return null;
  }

  const displayIcon = icon || (DefaultIcon && <DefaultIcon className="size-5" />);

  return (
    <div
      className={cn(
        "relative flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg",
        "transition-all duration-300 ease-in-out",
        "animate-in fade-in-0 slide-in-from-top-2",
        isVisible ? "opacity-100" : "opacity-0",
        variantStyles.container,
        className
      )}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {displayIcon && (
        <div className={cn("mt-0.5 shrink-0", variantStyles.icon)}>
          {displayIcon}
        </div>
      )}
      
      <div className="min-w-0 flex-1">
        {title && (
          <div className="mb-1 text-sm font-semibold leading-5">
            {title}
          </div>
        )}
        
        {description && (
          <div className="text-sm leading-5 opacity-90">
            {description}
          </div>
        )}
        
        {children}
        
        {action && (
          <div className="mt-3">
            {action}
          </div>
        )}
      </div>
      
      {closable && onClose && (
        <button
          type="button"
          onClick={handleClose}
          className={cn(
            "inline-flex shrink-0 items-center justify-center",
            "size-5 rounded-md",
            "hover:bg-black/10 dark:hover:bg-white/10",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2",
            variantStyles.icon
          )}
          aria-label="Close notification"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

interface ToastContextType {
  toasts: Array<{
    id: string;
    component: React.ReactNode;
  }>;
  toast: (props: Omit<ToastProps, 'onClose'> & { id?: string }) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    component: React.ReactNode;
  }>>([]);

  const toast = React.useCallback((props: Omit<ToastProps, 'onClose'> & { id?: string }) => {
    const id = props.id || Math.random().toString(36).substr(2, 9);
    
    const toastComponent = (
      <Toast
        {...props}
        key={id}
        onClose={() => dismiss(id)}
        duration={props.duration ?? 5000}
      />
    );

    setToasts(prev => [...prev, { id, component: toastComponent }]);
    return id;
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
          {toasts.map(({ component }) => component)}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}