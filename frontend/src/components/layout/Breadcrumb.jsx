import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export const Breadcrumb = () => {
  const { pathname } = useLocation();
  const paths = pathname.split('/').filter(x => x);

  return (
    <nav className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-6 shrink-0">
      <Link
        to="/"
        className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <FiHome size={12.5} />
        <span>TransitOps</span>
      </Link>
      {paths.map((path, index) => {
        const to = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        
        // Clean display name formatting
        let displayName = path.charAt(0).toUpperCase() + path.slice(1);
        if (displayName === 'Fuel') displayName = 'Fuel Logs';

        return (
          <React.Fragment key={to}>
            <FiChevronRight size={11} className="text-slate-400" />
            {isLast ? (
              <span className="text-slate-800 dark:text-slate-205 font-bold">
                {displayName}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
