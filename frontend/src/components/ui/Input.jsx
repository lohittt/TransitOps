import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  type = 'text',
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-650 dark:text-slate-455">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`w-full rounded-lg border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-500 ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 font-medium">{error.message || error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
