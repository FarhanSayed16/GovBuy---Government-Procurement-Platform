// components/Input.jsx
import React from 'react';
import { cn } from '../utils/index'; // You can create a simple className utility

const Input = React.forwardRef(
  (
    {
      label,
      type = 'text',
      className,
      error,
      placeholder,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border',
            'bg-white text-black placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'border-gray-700 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        
        {error && (
          <span className="block text-sm text-red-500 mt-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;