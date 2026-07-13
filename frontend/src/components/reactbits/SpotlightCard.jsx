import React, { useRef, useState } from 'react';

export const SpotlightCard = ({ children, className = '', ...props }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900/60 transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 rounded-xl"
        style={{
          background: `radial-gradient(250px circle at ${position.x}px ${position.y}px, rgba(37, 99, 235, 0.12), transparent 80%)`,
          opacity,
        }}
      />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};

export default SpotlightCard;
