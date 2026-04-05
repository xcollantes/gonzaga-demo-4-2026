/**
 * ThemePreview Component
 *
 * A component that displays color swatches for the current theme.
 * Useful for showcasing the color palette of each theme.
 */

import { useTheme } from "@/contexts/ThemeContext";

interface ColorSwatchProps {
  name: string;
  color: string;
  textColor: string;
}

const ColorSwatch = ({ name, color, textColor }: ColorSwatchProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="h-12 w-full rounded-md border"
        style={{ backgroundColor: color }}
      />
      <div className="text-xs font-medium" style={{ color: textColor }}>
        {name}
      </div>
    </div>
  );
};

export function ThemePreview() {
  const { theme } = useTheme();

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">
        Current Theme: <span className="capitalize">{theme || "light"}</span>
      </h3>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <ColorSwatch
          name="Background"
          color="var(--color-background)"
          textColor="var(--color-foreground)"
        />
        <ColorSwatch
          name="Foreground"
          color="var(--color-foreground)"
          textColor="var(--color-background)"
        />
        <ColorSwatch
          name="Primary"
          color="var(--color-primary)"
          textColor="var(--color-primary-foreground)"
        />
        <ColorSwatch
          name="Secondary"
          color="var(--color-secondary)"
          textColor="var(--color-secondary-foreground)"
        />
        <ColorSwatch
          name="Accent"
          color="var(--color-accent)"
          textColor="var(--color-accent-foreground)"
        />
        <ColorSwatch
          name="Muted"
          color="var(--color-muted)"
          textColor="var(--color-muted-foreground)"
        />
      </div>
    </>
  );
}