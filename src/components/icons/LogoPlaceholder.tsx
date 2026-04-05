interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

/**
 * SVG Logo Placeholder Component
 *
 * A placeholder logo that can be used throughout the application.
 * Accepts customization props for size and color.
 */
export default function LogoPlaceholder({
  width = 40,
  height = 40,
  className = '',
  color = 'currentColor'
}: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo"
    >
      <path
        d="M20 4L4 12V28L20 36L36 28V12L20 4Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M20 4V20M20 20V36M20 20L36 12M20 20L4 12"
        stroke={color}
        strokeWidth="2"
      />
      <circle
        cx="20"
        cy="20"
        r="6"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle
        cx="20"
        cy="20"
        r="2"
        fill={color}
      />
    </svg>
  );
}