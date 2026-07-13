import React, { useRef, useState } from 'react';

export const Card = ({ children, className = '', ...props }) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-800/40 bg-white/65 dark:bg-slate-950/65 backdrop-blur-md shadow-md hover:shadow-lg hover:border-slate-350 dark:hover:border-slate-700/80 transition-all duration-300 ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-xl"
        style={{
          background: `radial-gradient(300px circle at ${coords.x}px ${coords.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};

export default Card;
