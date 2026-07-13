import React, { useEffect, useState } from 'react';

export const SquaresBackground = ({ className = '' }) => {
  const [squares, setSquares] = useState([]);

  useEffect(() => {
    const rows = 10;
    const cols = 10;
    const items = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        items.push({ id: `${r}-${c}`, opacity: 0 });
      }
    }
    setSquares(items);

    const interval = setInterval(() => {
      setSquares((prev) =>
        prev.map((sq) => {
          if (Math.random() < 0.06) {
            return { ...sq, opacity: Math.random() * 0.12 + 0.04 };
          }
          // Decay rate
          return { ...sq, opacity: Math.max(0, sq.opacity - 0.015) };
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`absolute inset-0 grid grid-cols-10 grid-rows-10 gap-[1px] bg-slate-950/5 pointer-events-none ${className}`}>
      {squares.map((sq) => (
        <div
          key={sq.id}
          className="w-full h-full bg-blue-500/10 dark:bg-blue-400/5 border border-slate-500/5 transition-opacity duration-300"
          style={{ opacity: sq.opacity }}
        />
      ))}
    </div>
  );
};

export default SquaresBackground;
