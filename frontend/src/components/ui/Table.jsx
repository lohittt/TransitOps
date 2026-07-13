import React from 'react';

export const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/20 ${className}`}>
      <table className="w-full text-left border-collapse text-sm min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-200/60 bg-slate-50/80 text-slate-500 dark:border-slate-800/60 dark:bg-slate-950/60 dark:text-slate-400">
            {headers.map((h, i) => (
              <th key={i} className="px-5 py-3.5 font-semibold text-xs tracking-wider uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
