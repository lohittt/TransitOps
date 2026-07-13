import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useMockData } from '../../context/MockDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid,
  FiTruck,
  FiUsers,
  FiMapPin,
  FiTool,
  FiDroplet,
  FiDollarSign,
  FiPieChart,
  FiUser,
  FiLogOut
} from 'react-icons/fi';
import ShinyText from '../reactbits/ShinyText';
import logoImg from '../../images/logo.png';

export const Sidebar = ({ className = '' }) => {
  const { currentUser, addToast } = useMockData();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/portal', icon: FiGrid },
    { name: 'Vehicles', path: '/portal/vehicles', icon: FiTruck },
    { name: 'Drivers', path: '/portal/drivers', icon: FiUsers },
    { name: 'Trips', path: '/portal/trips', icon: FiMapPin },
    { name: 'Maintenance', path: '/portal/maintenance', icon: FiTool },
    { name: 'Fuel Logs', path: '/portal/fuel', icon: FiDroplet },
    { name: 'Expenses', path: '/portal/expenses', icon: FiDollarSign },
    { name: 'Reports', path: '/portal/reports', icon: FiPieChart },
    { name: 'Profile', path: '/portal/profile', icon: FiUser },
  ];

  const getFilteredNavItems = () => {
    const role = currentUser?.role;
    const filterFn = (item) => {
      const subpath = item.path === '/portal' ? '/' : item.path.replace('/portal', '');
      if (role === 'Fleet Manager') {
        return ['/', '/vehicles', '/drivers', '/maintenance', '/reports', '/profile'].includes(subpath);
      }
      if (role === 'Dispatcher') {
        return ['/', '/vehicles', '/trips', '/profile'].includes(subpath);
      }
      if (role === 'Safety Officer') {
        return ['/', '/drivers', '/trips', '/profile'].includes(subpath);
      }
      if (role === 'Financial Analyst') {
        return ['/', '/vehicles', '/fuel', '/expenses', '/reports', '/profile'].includes(subpath);
      }
      return true;
    };
    return navItems.filter(filterFn);
  };

  return (
    <aside className={`w-64 border-r border-slate-200/40 bg-white/60 dark:border-slate-800/40 dark:bg-slate-950/65 backdrop-blur-md flex flex-col h-screen shrink-0 ${className}`}>
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-100 dark:border-slate-900">
        <img src={logoImg} alt="TransitOps Logo" className="h-8.5 w-8.5 object-contain shrink-0" />
        <div className="flex flex-col min-w-0">
          <ShinyText text="TransitOps" speed={5} className="font-extrabold text-sm tracking-tight leading-none" />
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase mt-1">
            Operations Portal
          </span>
        </div>
      </div>
 
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1.5">
        {getFilteredNavItems().map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-900/60 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon size={15} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer User Details */}
      {currentUser && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/15 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80'}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-750 shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none">
                {currentUser.name}
              </span>
              <span className="text-[9px] text-blue-605 dark:text-blue-400 font-bold uppercase tracking-wider mt-1 truncate">
                {currentUser.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
          >
            <FiLogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
