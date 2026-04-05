export default function SmileOverlay() {
  return (
    <div className="w-1/2">
      <SmileSvg />
    </div>
  )
}

export function SmileSvg( { className }: { className?: string } ) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.7" className={className}>
      {/* Face oval */}
      <ellipse cx="50" cy="50" rx="35" ry="50" />
      {/* Eyes */}
      <circle cx="35" cy="40" r="5" />
      <circle cx="65" cy="40" r="5" />
      {/* Smile */}
      <path d="M 30 65 Q 50 80 70 65" strokeLinecap="round" />
    </svg>
  )
}
