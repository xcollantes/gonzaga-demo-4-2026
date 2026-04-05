import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  className?: string;
}

const TooltipContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => { },
});

export function Tooltip({ children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className={cn("relative inline-block", className)}>{children}</div>
    </TooltipContext.Provider>
  );
}

interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function TooltipTrigger({ children, asChild = false }: TooltipTriggerProps) {
  const { setOpen } = React.useContext(TooltipContext);

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);
  const handleFocus = () => setOpen(true);
  const handleBlur = () => setOpen(false);

  const eventHandlers = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, eventHandlers);
  }

  return (
    <span
      tabIndex={0}
      className="inline-block"
      {...eventHandlers}
    >
      {children}
    </span>
  );
}

interface TooltipContentProps {
  children: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export function TooltipContent({
  children,
  className,
  side = "top",
  align = "center",
  sideOffset = 5,
}: TooltipContentProps) {
  const { open } = React.useContext(TooltipContext);

  if (!open) return null;

  const sideClasses = {
    top: `bottom-[calc(100%+${sideOffset}px)]`,
    right: `left-[calc(100%+${sideOffset}px)] top-1/2 -translate-y-1/2`,
    bottom: `top-[calc(100%+${sideOffset}px)]`,
    left: `right-[calc(100%+${sideOffset}px)] top-1/2 -translate-y-1/2`,
  };

  const alignClasses = {
    start: side === "top" || side === "bottom" ? "left-0" : "top-0",
    center:
      side === "top" || side === "bottom"
        ? "left-1/2 -translate-x-1/2"
        : "top-1/2 -translate-y-1/2",
    end: side === "top" || side === "bottom" ? "right-0" : "bottom-0",
  };

  return (
    <div
      className={cn(
        "absolute z-50 max-w-xs overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
        sideClasses[side],
        alignClasses[align],
        className
      )}
      data-side={side}
    >
      {children}
    </div>
  );
}