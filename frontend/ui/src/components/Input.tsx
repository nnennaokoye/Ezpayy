import React from 'react';
import { cn } from '../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-white/20 bg-white/5 backdrop-blur-sm px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:border-purple-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300',
            error && 'border-red-400 focus-visible:ring-red-400',
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              'mt-1 text-xs',
              error ? 'text-red-400' : 'text-gray-400'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input }; 