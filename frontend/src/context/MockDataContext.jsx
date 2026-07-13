import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useDashboard } from './DashboardContext';
import { toast } from 'react-hot-toast';
import vehicleApi from '../api/vehicle';
import driverApi from '../api/driver';
import tripApi from '../api/trip';
import maintenanceApi from '../api/maintenance';
import fuelApi from '../api/fuel';
import expenseApi from '../api/expense';

const MockDataContext = createContext();

export const useMockData = () => useContext(MockDataContext);

export const MockDataProvider = ({ children }) => {
  const { currentUser, setCurrentUser } = useAuth() || {};
  const { fetchDashboardData } = useDashboard() || {};

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('to_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Sync dark mode
  useEffect(() => {
    localStorage.setItem('to_dark_mode', JSON.stringify(darkMode));
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Alert/Toast compatibility layer
  const addToast = useCallback((message, type = 'success') => {
    if (type === 'success') toast.success(message);
    else if (type === 'danger' || type === 'error') toast.error(message);
    else if (type === 'warning') toast(message, { icon: '⚠️' });
    else if (type === 'info') toast(message, { icon: 'ℹ️' });
    else toast(message);
  }, []);

  // Helper date checker for driving licenses
  const isLicenseExpired = (expiryDate) => {
    const today = new Date('2026-07-12'); // Fixed hackathon date
    return new Date(expiryDate) < today;
  };

  // Central function to fetch all lists
  const refreshAllData = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [v, d, t, m, f, e] = await Promise.all([
        vehicleApi.getAll().catch(() => []),
        driverApi.getAll().catch(() => []),
        tripApi.getAll().catch(() => []),
        maintenanceApi.getAll().catch(() => []),
        fuelApi.getAll().catch(() => []),
        expenseApi.getAll().catch(() => [])
      ]);

      setVehicles(v);
      setDrivers(d);
      setTrips(t);
      setMaintenance(m);
      setFuelLogs(f);
      setExpenses(e);

      if (fetchDashboardData) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to fetch data lists:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, fetchDashboardData]);

  // Refresh lists on login or profile reload
  useEffect(() => {
    if (currentUser) {
      refreshAllData();
    } else {
      setVehicles([]);
      setDrivers([]);
      setTrips([]);
      setMaintenance([]);
      setFuelLogs([]);
      setExpenses([]);
    }
  }, [currentUser, refreshAllData]);

  // --- VEHICLE ACTIONS ---
  const addVehicle = async (newVehicle) => {
    try {
      await vehicleApi.create({
        ...newVehicle,
        maximumLoadCapacity: Number(newVehicle.maximumLoadCapacity),
        odometer: Number(newVehicle.odometer),
        acquisitionCost: Number(newVehicle.acquisitionCost)
      });
      await refreshAllData();
      addToast(`Vehicle ${newVehicle.registrationNumber} registered successfully!`, 'success');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to register vehicle';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  const updateVehicle = async (updated) => {
    try {
      await vehicleApi.update(updated.id, {
        ...updated,
        maximumLoadCapacity: Number(updated.maximumLoadCapacity),
        odometer: Number(updated.odometer),
        acquisitionCost: Number(updated.acquisitionCost)
      });
      await refreshAllData();
      addToast(`Vehicle ${updated.registrationNumber} updated!`, 'success');
      return true;
    } catch (err) {
      console.error("Vehicle update error:", err.response?.data || err);
      const errMsg = err.response?.data?.message || 'Failed to update vehicle';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await vehicleApi.delete(id);
      await refreshAllData();
      addToast(`Vehicle removed from registry.`, 'warning');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to delete vehicle';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  // --- DRIVER ACTIONS ---
  const addDriver = async (newDriver) => {
    try {
      await driverApi.create({
        ...newDriver,
        safetyScore: Number(newDriver.safetyScore || 100)
      });
      await refreshAllData();
      addToast(`Driver ${newDriver.name} profile created!`, 'success');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create driver profile';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  const updateDriver = async (updated) => {
    try {
      await driverApi.update(updated.id, {
        ...updated,
        safetyScore: Number(updated.safetyScore)
      });
      await refreshAllData();
      addToast(`Driver ${updated.name} profile updated!`, 'success');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update driver profile';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  const deleteDriver = async (id) => {
    try {
      await driverApi.delete(id);
      await refreshAllData();
      addToast(`Driver profile removed.`, 'warning');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to delete driver profile';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  // --- TRIP ACTIONS ---
  const createTrip = async (tripForm) => {
    const vehicle = vehicles.find(v => v.id == tripForm.vehicleId);
    const driver = drivers.find(d => d.id == tripForm.driverId);

    if (!vehicle || !driver) {
      addToast("Invalid Vehicle or Driver selection", "danger");
      return false;
    }

    if (Number(tripForm.cargoWeight) > vehicle.maxCapacity) {
      addToast(`Cargo Weight (${tripForm.cargoWeight}kg) exceeds Vehicle Max Capacity (${vehicle.maxCapacity}kg)!`, 'danger');
      return false;
    }

    if (driver.status === 'SUSPENDED') {
      addToast(`Driver ${driver.name} is currently suspended and cannot take trips`, 'danger');
      return false;
    }
    if (isLicenseExpired(driver.expiryDate)) {
      addToast("Cannot assign a driver with an Expired license!", 'danger');
      return false;
    }
    if (driver.status === 'ON_TRIP') {
      addToast(`Driver ${driver.name} is already on an active trip`, 'danger');
      return false;
    }

    if (vehicle.status === 'ON_TRIP') {
      addToast(`Vehicle is currently ${vehicle.status} (must be Available)!`, 'danger');
      return false;
    }

    try {
      await tripApi.create({
        ...tripForm,
        cargoWeight: Number(tripForm.cargoWeight),
        distance: Number(tripForm.distance),
        date: new Date('2026-07-12').toISOString().split('T')[0]
      });
      await refreshAllData();
      addToast(`Trip draft created successfully!`, 'success');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create trip';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  const dispatchTrip = async (tripId) => {
    try {
      await tripApi.dispatchTrip(tripId);
      await refreshAllData();
      addToast(`Trip has been Dispatched! Vehicle & Driver status set to On Trip.`, 'success');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to dispatch trip';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  const completeTrip = async (tripId, data) => {
    try {
      await tripApi.completeTrip(tripId, {
        actualDistance: Number(data.actualDistance),
        fuelConsumed: Number(data.fuelConsumed)
      });
      await refreshAllData();
      addToast(`Trip marked Completed. Vehicle & Driver returned to Available.`, 'success');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to complete trip';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  const cancelTrip = async (tripId) => {
    try {
      await tripApi.cancelTrip(tripId);
      await refreshAllData();
      addToast(`Trip Cancelled. Vehicle and Driver status restored to Available.`, 'warning');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to cancel trip';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  // --- MAINTENANCE ACTIONS ---
  const createMaintenance = async (maintForm) => {
    const vehicle = vehicles.find(v => v.id == maintForm.vehicleId);
    if (!vehicle) return false;

    if (vehicle.status === 'ON_TRIP') {
      addToast(`Cannot put vehicle ${vehicle.registrationNumber} in shop while on active trip!`, 'danger');
      return false;
    }

    try {
      await maintenanceApi.create({
        ...maintForm,
        cost: Number(maintForm.cost || 0),
        startDate: maintForm.startDate || new Date().toISOString().split('T')[0]
      });
      await refreshAllData();
      addToast(`Maintenance file opened. Vehicle status changed to In Shop.`, 'warning');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create maintenance entry';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  const closeMaintenance = async (maintId, finalCost) => {
    try {
      await maintenanceApi.closeMaintenance(maintId, Number(finalCost));
      await refreshAllData();
      addToast(`Maintenance completed. Vehicle status restored.`, 'success');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to close maintenance';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  // --- FUEL ACTIONS ---
  const addFuelLog = async (log) => {
    try {
      await fuelApi.create({
        ...log,
        liters: Number(log.liters),
        cost: Number(log.cost),
        date: log.date || new Date().toISOString().split('T')[0]
      });
      await refreshAllData();
      addToast(`Fuel Log registered for vehicle.`, 'success');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to register fuel log';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  // --- EXPENSE ACTIONS ---
  const addExpense = async (exp) => {
    try {
      await expenseApi.create({
        ...exp,
        amount: Number(exp.amount),
        date: exp.date || new Date().toISOString().split('T')[0]
      });
      await refreshAllData();
      addToast(`Expense entry recorded.`, 'success');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to record expense';
      addToast(errMsg, 'danger');
      return false;
    }
  };

  // --- STATS / CALCULATIONS ---
  const getVehicleOperationalCost = (vehicleId) => {
    const fuelCost = fuelLogs
      .filter(f => f.vehicleId === vehicleId)
      .reduce((sum, item) => sum + item.cost, 0);

    const maintCost = maintenance
      .filter(m => m.vehicleId === vehicleId)
      .reduce((sum, item) => sum + item.cost, 0);

    const otherCost = expenses
      .filter(e => e.vehicleId === vehicleId && e.expenseType !== 'Maintenance')
      .reduce((sum, item) => sum + item.amount, 0);

    return fuelCost + maintCost + otherCost;
  };

  return (
    <MockDataContext.Provider value={{
      currentUser,
      setCurrentUser,
      vehicles,
      drivers,
      trips,
      maintenance,
      fuelLogs,
      expenses,
      darkMode,
      setDarkMode,
      toasts: [],
      addToast,
      isLicenseExpired,
      loading,
      refreshAllData,

      addVehicle,
      updateVehicle,
      deleteVehicle,

      addDriver,
      updateDriver,
      deleteDriver,

      createTrip,
      dispatchTrip,
      completeTrip,
      cancelTrip,

      createMaintenance,
      closeMaintenance,

      addFuelLog,
      addExpense,

      getVehicleOperationalCost
    }}>
      {children}
    </MockDataContext.Provider>
  );
};
