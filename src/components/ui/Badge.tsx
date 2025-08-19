import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  const baseClasses = 'inline-flex items-center rounded-full border font-medium';
  
  const variantClasses = {
    default: 'border-gray-200 bg-gray-100 text-gray-900',
    primary: 'border-primary-200 bg-primary-100 text-primary-900',
    secondary: 'border-secondary-200 bg-secondary-100 text-secondary-900',
    success: 'border-green-200 bg-green-100 text-green-900',
    warning: 'border-yellow-200 bg-yellow-100 text-yellow-900',
    destructive: 'border-red-200 bg-red-100 text-red-900',
    outline: 'border-gray-300 bg-white text-gray-700'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};
