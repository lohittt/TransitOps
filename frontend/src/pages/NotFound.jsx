import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import ShinyText from '../components/reactbits/ShinyText';
import SpotlightCard from '../components/reactbits/SpotlightCard';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] select-none">
      <SpotlightCard className="max-w-md w-full p-8 text-center border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-lg">
        <h1 className="text-6xl font-black text-blue-600 dark:text-blue-500 mb-2">404</h1>
        <h2 className="text-base font-extrabold text-slate-850 dark:text-white mb-2">
          Page <ShinyText text="Not Found" speed={5} className="font-extrabold" />
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          The operations dashboard route you are trying to view does not exist or has been archived. Check spelling or return to the main dashboard.
        </p>
        <Button variant="primary" size="sm" onClick={() => navigate('/')}>
          Go to Dashboard
        </Button>
      </SpotlightCard>
    </div>
  );
};

export default NotFound;
