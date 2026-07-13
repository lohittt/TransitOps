import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { useMockData } from '../../context/MockDataContext';

export const ToastContainer = () => {
  const { toasts } = useMockData();

  const icons = {
    success: <FiCheckCircle className="text-emerald-500 shrink-0" size={18} />,
    danger: <FiAlertCircle className="text-red-500 shrink-0" size={18} />,
    warning: <FiAlertTriangle className="text-amber-500 shrink-0" size={18} />,
    info: <FiInfo className="text-sky-500 shrink-0" size={18} />,
  };

  const themes = {
    success: 'border-emerald-250 bg-emerald-50/95 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/30 dark:text-emerald-400',
    danger: 'border-red-250 bg-red-50/95 text-red-800 dark:bg-red-950/30 dark:border-red-900/30 dark:text-red-400',
    warning: 'border-amber-250 bg-amber-50/95 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900/30 dark:text-amber-400',
    info: 'border-sky-250 bg-sky-50/95 text-sky-800 dark:bg-sky-950/30 dark:border-sky-900/30 dark:text-sky-400',
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts && toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md text-xs font-semibold leading-normal pointer-events-auto min-w-[280px] max-w-sm ${themes[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="flex-1">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
