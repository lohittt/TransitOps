import React from 'react';
import { FiInbox } from 'react-icons/fi';

export const EmptyState = ({
  title = 'No records found',
  description = 'Try adjusting your filters or search query to find what you are looking for.',
  icon: Icon = FiInbox,
  children
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-250 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 max-w-sm mx-auto my-6">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-450 dark:text-slate-400 rounded-full mb-3">
        <Icon size={24} />
      </div>
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-normal">
        {description}
      </p>
      {children}
    </div>
  );
};

export default EmptyState;
