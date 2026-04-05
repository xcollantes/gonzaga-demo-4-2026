import { Button } from "@/components/ui/Button";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Sun } from "lucide-react";

export const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function DarkModeToggleSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      disableHover
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      value={resolvedTheme}
      className={cn(
        "relative h-9 w-9 rounded-md border-1 border-[var(--color-border)]",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "overflow-hidden"
      )}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all duration-300 ease-in-out",
          resolvedTheme === 'dark'
            ? "opacity-0 rotate-90 scale-0"
            : "opacity-100 rotate-0 scale-100"
        )}
      />
      <div
        className={cn(
          "absolute inset-0 h-5 w-5 transition-all duration-300 ease-in-out",
          "flex items-center justify-center m-auto",
          resolvedTheme === 'dark'
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-0"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Moon with pastel yellow color */}
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="#FDEDA6"
            stroke="#6B7280"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}