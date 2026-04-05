/**
 * Metric Card Component.
 *
 * This component is used to display a metric card with a title, value, change, and progress bar.
 */

import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    isPositive?: boolean;
  };
  progress?: {
    value: number; // Between 0 and 1 (0% to 100%)
    color?: string;
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  progress,
  className,
}: MetricCardProps) {
  // Calculate color based on positive/negative change
  const changeColor = change?.isPositive !== false ? 'text-green-500' : 'text-red-500';

  // Default progress bar color if not specified
  const progressBarColor = progress?.color || 'bg-primary';

  // Convert progress value to percentage width
  const progressWidth = progress ? `${Math.max(0, Math.min(100, progress.value * 100))}%` : '0%';

  return (
    <Card className={cn('p-6', className)}>
      <h3 className="font-bold mb-2">{title}</h3>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold">{value}</span>
        {change && (
          <span className={`ml-2 ${changeColor} text-sm`}>
            {change.value}
          </span>
        )}
      </div>

      {progress && (
        <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${progressBarColor} rounded-full`}
            style={{ width: progressWidth }}
          />
        </div>
      )}
    </Card>
  );
}