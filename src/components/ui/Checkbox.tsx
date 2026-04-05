import { getFocusClasses } from '@/lib/focus-utils';
import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Checkbox component with Tailwind CSS styling.
 */
export function Checkbox({
  label,
  description,
  size = 'md',
  className = '',
  checked,
  onCheckedChange,
  onChange,
  ...props
}: CheckboxProps) {
  const id = React.useId();

  const sizeStyles = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const labelSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };

  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className={`
            ${sizeStyles[size]}
            rounded
            border-input
            text-primary
            ${getFocusClasses()}
            transition-all duration-200
            cursor-pointer
            hover:border-primary
            ${className}
          `}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="ml-2">
          {label && (
            <label
              htmlFor={id}
              className={`${labelSizeStyles[size]} font-medium text-foreground cursor-pointer transition-colors duration-200`}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={`text-muted-foreground ${size === 'sm' ? 'text-xs' : 'text-sm'} transition-colors duration-200`}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Checkbox;