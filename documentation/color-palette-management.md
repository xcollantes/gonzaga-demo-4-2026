# Color Palette Management

## Tailwind CSS v4 Color System

This application uses Tailwind CSS v4 with its modern `@theme` directive for color management. The color system is centralized in `src/styles/globals.css`.

## Color Variable Structure

### Core Color Definitions

```css
@theme {
  --color-background: #ffffff;
  --color-foreground: #171717;
  --color-card: #ffffff;
  --color-card-foreground: #171717;
  --color-popover: #ffffff;
  --color-popover-foreground: #171717;
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
  --color-secondary: #f1f5f9;
  --color-secondary-foreground: #0f172a;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-accent: #f1f5f9;
  --color-accent-foreground: #0f172a;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #ffffff;
  --color-border: #e2e8f0;
  --color-input: #e2e8f0;
  --color-ring: #3b82f6;
  --radius: 0.5rem;
}
```

### Usage in Components

Colors are accessed through Tailwind's color palette system:

```tsx
// Background colors
<div className="bg-background text-foreground">
  
// Primary colors
<Button className="bg-primary text-primary-foreground">

// Secondary colors  
<Card className="bg-card border-border">

// Destructive colors
<Button variant="destructive" className="bg-destructive text-destructive-foreground">
```

## Dark Mode Implementation

Dark mode support is currently commented out but prepared for implementation:

```css
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: #0a0a0a;
    --color-foreground: #ededed;
    --color-card: #0a0a0a;
    --color-card-foreground: #ededed;
    --color-primary: #3b82f6;
    --color-primary-foreground: #ffffff;
    --color-secondary: #1e293b;
    --color-secondary-foreground: #f8fafc;
    --color-muted: #1e293b;
    --color-muted-foreground: #94a3b8;
    --color-accent: #1e293b;
    --color-accent-foreground: #f8fafc;
    --color-destructive: #dc2626;
    --color-destructive-foreground: #ffffff;
    --color-border: #1e293b;
    --color-input: #1e293b;
    --color-ring: #3b82f6;
  }
}
```

### Enabling Dark Mode

To enable dark mode:

1. Uncomment the dark mode section in `globals.css`
2. Add dark mode toggle logic to your components
3. Update body class management

```typescript
// Example dark mode toggle implementation
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  document.documentElement.classList.toggle('dark', darkMode);
}, [darkMode]);
```

## Custom Color Modifications

### Adding New Colors

Extend the color palette by adding variables to the `@theme` directive:

```css
@theme {
  /* Existing colors... */
  --color-success: #22c55e;
  --color-success-foreground: #ffffff;
  --color-warning: #f59e0b;
  --color-warning-foreground: #ffffff;
  --color-info: #3b82f6;
  --color-info-foreground: #ffffff;
}
```

Use in components:

```tsx
<Alert className="bg-success text-success-foreground">
<Badge className="bg-warning text-warning-foreground">
```

### Brand Color Customization

To implement brand-specific colors:

```css
@theme {
  --color-brand-primary: #your-brand-color;
  --color-brand-secondary: #your-secondary-color;
  --color-brand-accent: #your-accent-color;
}
```

### Component-Specific Color Overrides

Override colors for specific components using CSS custom properties:

```css
.custom-card {
  --color-card: var(--color-brand-primary);
  --color-card-foreground: var(--color-brand-primary-foreground);
}
```

```tsx
<Card className="custom-card">
  <CardContent>Brand-colored card</CardContent>
</Card>
```

## Color Accessibility

### Contrast Ratios

Ensure color combinations meet WCAG AA standards:

- Normal text: 4.5:1 contrast ratio minimum
- Large text: 3:1 contrast ratio minimum  
- Interactive elements: 3:1 contrast ratio minimum

### Color Testing

Use browser developer tools to verify contrast:

```typescript
// Test color combinations
const testContrast = (bg: string, fg: string) => {
  // Use browser's accessibility tools or libraries
  // like 'color-contrast' to verify ratios
};
```

## Color Utilities

### HSL Color Management

Colors use HSL format for better manipulation:

```css
background: hsl(var(--color-background));
color: hsl(var(--color-foreground));
```

### Dynamic Color Generation

Create color variations programmatically:

```typescript
// Utility for color manipulation
const adjustColorLightness = (color: string, percent: number) => {
  // Implementation for lightening/darkening colors
  return `hsl(${hue}, ${saturation}%, ${lightness + percent}%)`;
};
```

## Integration with shadcn/ui

The color system is fully compatible with shadcn/ui components:

```tsx
// shadcn/ui components automatically use theme colors
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

<Button variant="default">   // Uses --color-primary
<Button variant="secondary"> // Uses --color-secondary  
<Button variant="destructive"> // Uses --color-destructive
```

## Color System Best Practices

### Semantic Naming

Use semantic color names instead of literal colors:

```css
/* Good */
--color-error: #ef4444;
--color-success: #22c55e;

/* Avoid */
--color-red: #ef4444;
--color-green: #22c55e;
```

### Consistent Foreground Pairing

Always define foreground colors for backgrounds:

```css
--color-primary: #3b82f6;
--color-primary-foreground: #ffffff;
```

### Scalable Color Architecture

Structure colors for easy maintenance:

```css
@theme {
  /* Base colors */
  --color-slate-50: #f8fafc;
  --color-slate-900: #0f172a;
  
  /* Semantic mappings */
  --color-background: var(--color-slate-50);
  --color-foreground: var(--color-slate-900);
}
```

This approach enables easy theme switching and brand customization while maintaining component compatibility.