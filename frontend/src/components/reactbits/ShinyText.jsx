import React from 'react';

export const ShinyText = ({ text, disabled = false, speed = 4, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 dark:from-slate-100 dark:via-blue-400 dark:to-slate-100 bg-no-repeat bg-clip-text text-transparent ${className}`}
      style={{
        backgroundSize: '200% 100%',
        animation: disabled ? 'none' : `shimmer ${animationDuration} linear infinite`,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
