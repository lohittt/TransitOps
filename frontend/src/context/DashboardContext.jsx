import React, { createContext, useContext, useState, useCallback } from 'react';
import dashboardApi from '../api/dashboard';

const DashboardContext = createContext(null);

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.get();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider value={{ dashboardData, loading, error, fetchDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;
