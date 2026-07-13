import React, { useState, useRef, useEffect } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiSun, FiMoon, FiBell, FiChevronDown, FiLogOut } from 'react-icons/fi';

export const TopNavbar = () => {
  const { currentUser, darkMode, setDarkMode, addToast } = useMockData();
  const { logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  // Compile compliance notifications dynamically
  const alerts = [
    { id: 'n1', text: 'Driver Alex Johnson license expiring soon (2027-10-15)', type: 'info', time: 'Just now' },
    { id: 'n2', text: 'Driver Marcus Aurelius license is Expired!', type: 'danger', time: '1h ago' },
    { id: 'n3', text: 'Vehicle Pick-03 has Open Maintenance order.', type: 'warning', time: '5h ago' }
  ];

  return (
    <header className="h-16 border-b border-slate-200/40 bg-white/70 dark:border-slate-800/40 dark:bg-slate-950/40 backdrop-blur-md flex items-center justify-between px-8 shrink-0 relative z-30">
      {/* Search box */}
      <div className="relative w-80 max-md:hidden">
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-slate-500">
          <FiSearch size={15} />
        </span>
        <input
          type="text"
          placeholder="Search vehicles, drivers, active dispatches..."
          className="w-full bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="md:hidden flex items-center">
        <span className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">TransitOps</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Theme toggler */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900 rounded-lg transition-colors"
          title="Toggle Light/Dark Theme"
        >
          {darkMode ? <FiSun size={17} /> : <FiMoon size={17} />}
        </button>

        {/* Notifications dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900 rounded-lg transition-colors relative"
            title="Compliance Notifications"
          >
            <FiBell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-950" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xl py-2 z-[99]">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-800 dark:text-white">Active Compliance Alerts</span>
                <span className="text-[9px] font-bold bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 px-2 py-0.5 rounded">
                  3 active
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/60 flex flex-col gap-1 border-b last:border-0 border-slate-100 dark:border-slate-850"
                  >
                    <div className="flex justify-between items-center">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        alert.type === 'danger' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">{alert.time}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-normal">{alert.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-150 dark:hover:border-slate-800"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
              alt={currentUser?.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
            <div className="flex flex-col text-left max-sm:hidden">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-205 leading-none">{currentUser?.name}</span>
            </div>
            <FiChevronDown size={12} className="text-slate-455 max-sm:hidden" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-56 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xl py-2 z-[99]">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{currentUser?.email}</p>
              </div>

              <div className="px-1.5 py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                >
                  <FiLogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
