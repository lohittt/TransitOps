import React, { useState, useEffect } from 'react';
import { useMockData } from '../context/MockDataContext';
import { useDashboard } from '../context/DashboardContext';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import TiltedCard from '../components/reactbits/TiltedCard';
import BlurText from '../components/reactbits/BlurText';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  FiTruck,
  FiMapPin,
  FiTool,
  FiUsers,
  FiActivity,
  FiLayers,
  FiGlobe,
  FiDollarSign,
  FiAlertCircle
} from 'react-icons/fi';

export const Dashboard = () => {
  const {
    vehicles,
    drivers,
    trips,
    maintenance,
    fuelLogs,
    expenses,
    currentUser
  } = useMockData();

  const { fetchDashboardData } = useDashboard();

  useEffect(() => {
    if (fetchDashboardData) {
      fetchDashboardData();
    }
  }, [fetchDashboardData]);

  // Filter States
  const [filterType, setFilterType] = useState('All');
  const [filterRegion, setFilterRegion] = useState('All');

  // Filter vehicles according to selected filters
  const filteredVehicles = vehicles.filter(v => {
    const matchType = filterType === 'All' || v.vehicleType === filterType;
    const matchRegion = filterRegion === 'All' || v.region === filterRegion;
    return matchType && matchRegion;
  });

  // KPI Calculations (Based on filtered vehicles to feel extremely dynamic!)
  const totalVehiclesCount = filteredVehicles.length;
  const activeVehiclesCount = filteredVehicles.filter(v => v.status === 'ON_TRIP').length;
  const availableVehiclesCount = filteredVehicles.filter(v => v.status === 'AVAILABLE').length;
  const shopVehiclesCount = filteredVehicles.filter(v => v.status === 'IN_SHOP').length;

  // Trips calculation (all trips or filtered vehicles trips)
  const activeTripsCount = trips.filter(t => t.status === 'DISPATCHED').length;
  const pendingTripsCount = trips.filter(t => t.status === 'DRAFT').length;
  const driversOnDutyCount = drivers.filter(d => d.status === 'AVAILABLE' || d.status === 'ON_TRIP').length;

  const fleetUtilization = totalVehiclesCount > 0 
    ? Math.round((activeVehiclesCount / totalVehiclesCount) * 100) 
    : 0;

  // Driver License Expiry warning for Safety Officers
  const expiredDriversCount = drivers.filter(d => {
    const today = new Date('2026-07-12');
    return new Date(d.expiryDate) < today;
  }).length;

  const suspendedDriversCount = drivers.filter(d => d.status === 'SUSPENDED').length;

  // --- Financial Aggregations ---
  const totalFuelCost = fuelLogs.reduce((sum, item) => sum + item.cost, 0);
  const totalMaintCost = maintenance.reduce((sum, item) => sum + item.cost, 0);
  const totalOtherExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalOperatingCosts = totalFuelCost + totalMaintCost + totalOtherExpenses;

  // Cost Allocation categories (for financial analyst pie chart)
  const costDistribution = [
    { name: 'Fuel', value: totalFuelCost, color: '#2563EB' },
    { name: 'Maintenance', value: totalMaintCost, color: '#F59E0B' },
    { name: 'Ancillary/Tolls', value: totalOtherExpenses, color: '#10B981' }
  ].filter(item => item.value > 0);

  // --- Recharts Aggregations ---

  // 1. Trips Over Time (Area Chart)
  const tripsTrendData = [
    { name: 'Jul 06', Completed: 3, Active: 1 },
    { name: 'Jul 07', Completed: 5, Active: 2 },
    { name: 'Jul 08', Completed: 4, Active: 1 },
    { name: 'Jul 09', Completed: 7, Active: 3 },
    { name: 'Jul 10', Completed: 8, Active: 2 },
    { name: 'Jul 11', Completed: 9, Active: 4 },
    { name: 'Jul 12', Completed: trips.filter(t => t.status === 'COMPLETED').length, Active: activeTripsCount }
  ];

  // 2. Fuel Log Cost per Vehicle (Bar Chart)
  const fuelCostByVehicle = vehicles.map(v => {
    const cost = fuelLogs
      .filter(f => f.vehicleId === v.id)
      .reduce((sum, item) => sum + item.cost, 0);
    return { name: v.registrationNumber, Cost: cost };
  }).filter(item => item.Cost > 0);

  // 3. Maintenance Cost per Vehicle (Line Chart)
  const maintenanceCostByVehicle = vehicles.map(v => {
    const cost = maintenance
      .filter(m => m.vehicleId === v.id)
      .reduce((sum, item) => sum + item.cost, 0);
    return { name: v.registrationNumber, Cost: cost };
  }).filter(item => item.Cost > 0);

  // 4. Vehicle Status Breakdown (Pie Chart)
  const pieData = [
    { name: 'Available', value: availableVehiclesCount, color: '#10B981' },
    { name: 'On Trip', value: activeVehiclesCount, color: '#2563EB' },
    { name: 'In Shop', value: shopVehiclesCount, color: '#F59E0B' },
    { name: 'Retired', value: vehicles.filter(v => v.status === 'RETIRED').length, color: '#EF4444' }
  ].filter(d => d.value > 0);

  // Recent Trips Limit 5
  const recentTrips = [...trips]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  // Recent Maintenance Limit 5
  const recentMaintenance = [...maintenance]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  // Recent Expenses Limit 5
  const recentExpenses = [...expenses]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  // Role verification helper
  const role = currentUser?.role || 'Fleet Manager';
  const isManager = role === 'Fleet Manager';
  const isDispatcher = role === 'Dispatcher';
  const isSafety = role === 'Safety Officer';
  const isFinance = role === 'Financial Analyst';

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 120, damping: 14 } 
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <BlurText text={`${role} Dashboard`} className="text-xl font-bold text-slate-800 dark:text-white" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isDispatcher && 'Operational route schedules, dispatch timelines, and live operator status logs'}
            {isSafety && 'Safety score breakdowns, operator credentials auditing, and compliance logs'}
            {isFinance && 'Fleet cumulative expenditures, refuel cost tracking, and parts maintenance ROI'}
            {isManager && 'Manage fleet inventory, schedule workshop repairs, and inspect active driver categories'}
          </p>
        </div>

        {/* Dashboard Quick Filters (Not relevant for Financial Analysts) */}
        {!isFinance && (
          <div className="flex flex-wrap items-center gap-3 bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 p-2 rounded-xl shadow-xs backdrop-blur-md">
            <div className="flex items-center gap-1.5 px-2 py-1 text-slate-400 dark:text-slate-500">
              <FiActivity size={13} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Filters:</span>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 rounded-lg text-xs font-semibold px-2.5 py-1 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Van">Vans</option>
              <option value="Heavy Truck">Heavy Trucks</option>
              <option value="Semi-Trailer">Semi-Trailers</option>
              <option value="Pickup">Pickups</option>
            </select>

            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 rounded-lg text-xs font-semibold px-2.5 py-1 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Regions</option>
              <option value="North">North Region</option>
              <option value="South">South Region</option>
              <option value="East">East Region</option>
              <option value="West">West Region</option>
            </select>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Dispatcher only */}
        {isDispatcher && (
          <>
            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">Available Fleet</span>
                  <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">{availableVehiclesCount}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">Ready for dispatch ({totalVehiclesCount} total)</span>
                </div>
                <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-xl flex items-center justify-center shrink-0">
                  <FiTruck size={20} />
                </div>
              </TiltedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">Active Dispatches</span>
                  <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">{activeTripsCount}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">{pendingTripsCount} pending draft routes</span>
                </div>
                <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 rounded-xl flex items-center justify-center shrink-0">
                  <FiMapPin size={20} />
                </div>
              </TiltedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">In Shop (Maintenance)</span>
                  <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">{shopVehiclesCount}</span>
                  <span className="text-[9px] text-slate-455 dark:text-slate-550 mt-1">Removed from dispatch selector</span>
                </div>
                <div className="h-10 w-10 bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-455 rounded-xl flex items-center justify-center shrink-0">
                  <FiTool size={20} />
                </div>
              </TiltedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">Fleet Utilization</span>
                  <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">{fleetUtilization}%</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">{driversOnDutyCount} active operators duty</span>
                </div>
                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-455 rounded-xl flex items-center justify-center shrink-0">
                  <FiActivity size={20} />
                </div>
              </TiltedCard>
            </motion.div>
          </>
        )}

        {/* Safety Officer only */}
        {isSafety && (
          <>
            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">Registered Drivers</span>
                  <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">{drivers.length}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">{driversOnDutyCount} active operators duty</span>
                </div>
                <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 rounded-xl flex items-center justify-center shrink-0">
                  <FiUsers size={20} />
                </div>
              </TiltedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">Active Dispatches</span>
                  <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">{activeTripsCount}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">{pendingTripsCount} pending draft routes</span>
                </div>
                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-455 rounded-xl flex items-center justify-center shrink-0">
                  <FiMapPin size={20} />
                </div>
              </TiltedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">License Violations</span>
                  <span className="text-2xl font-black text-red-650 dark:text-red-400 mt-1.5">{expiredDriversCount}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-555 mt-1">Expired operator cards</span>
                </div>
                <div className="h-10 w-10 bg-red-50 dark:bg-red-955/20 text-red-650 dark:text-red-400 rounded-xl flex items-center justify-center shrink-0">
                  <FiAlertCircle size={20} />
                </div>
              </TiltedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">Suspended Drivers</span>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1.5">{suspendedDriversCount}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">Temporarily blocked profiles</span>
                </div>
                <div className="h-10 w-10 bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-455 rounded-xl flex items-center justify-center shrink-0">
                  <FiAlertCircle size={20} />
                </div>
              </TiltedCard>
            </motion.div>
          </>
        )}

        {/* Fleet Manager */}
        {isManager && (
          <>
            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-955/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">Available Fleet</span>
                  <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">{availableVehiclesCount}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">Ready for dispatch ({totalVehiclesCount} total)</span>
                </div>
                <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-xl flex items-center justify-center shrink-0">
                  <FiTruck size={20} />
                </div>
              </TiltedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-955/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">In Shop (Maintenance)</span>
                  <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">{shopVehiclesCount}</span>
                  <span className="text-[9px] text-slate-455 dark:text-slate-550 mt-1">Removed from dispatch selector</span>
                </div>
                <div className="h-10 w-10 bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-455 rounded-xl flex items-center justify-center shrink-0">
                  <FiTool size={20} />
                </div>
              </TiltedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-955/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">Registered Drivers</span>
                  <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">{drivers.length}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">{driversOnDutyCount} active operators duty</span>
                </div>
                <div className="h-10 w-10 bg-blue-50 dark:bg-blue-955/20 text-blue-600 dark:text-blue-450 rounded-xl flex items-center justify-center shrink-0">
                  <FiUsers size={20} />
                </div>
              </TiltedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-955/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">Fleet Ratio</span>
                  <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">{fleetUtilization}%</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">Active vs offline ratio</span>
                </div>
                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-455 rounded-xl flex items-center justify-center shrink-0">
                  <FiActivity size={20} />
                </div>
              </TiltedCard>
            </motion.div>
          </>
        )}

        {/* Financial Analyst */}
        {isFinance && (
          <>
            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">Operating Expenses</span>
                  <span className="text-xl font-black text-slate-850 dark:text-white mt-1.5">${totalOperatingCosts.toFixed(2)}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">Refuels + Maintenance + Tolls</span>
                </div>
                <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-455 rounded-xl flex items-center justify-center shrink-0">
                  <FiDollarSign size={20} />
                </div>
              </TiltedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">Refuels Expense</span>
                  <span className="text-xl font-black text-slate-850 dark:text-white mt-1.5">${totalFuelCost.toFixed(2)}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">Logged fuel pump receipts</span>
                </div>
                <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-455 rounded-xl flex items-center justify-center shrink-0">
                  <FiDollarSign size={20} />
                </div>
              </TiltedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">Workshop Repairs</span>
                  <span className="text-xl font-black text-slate-850 dark:text-white mt-1.5">${totalMaintCost.toFixed(2)}</span>
                  <span className="text-[9px] text-slate-455 dark:text-slate-550 mt-1">Cumulative service order costs</span>
                </div>
                <div className="h-10 w-10 bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-455 rounded-xl flex items-center justify-center shrink-0">
                  <FiTool size={20} />
                </div>
              </TiltedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltedCard className="p-5 flex items-center justify-between border-slate-200/85 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md shadow-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-widest">Active Fleet Ratio</span>
                  <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">{fleetUtilization}%</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">{shopVehiclesCount} assets offline</span>
                </div>
                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-955/20 text-indigo-600 dark:text-indigo-455 rounded-xl flex items-center justify-center shrink-0">
                  <FiActivity size={20} />
                </div>
              </TiltedCard>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Analytics Charts Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* CHART 1: DISPATCH / SAFETY ONLY (Trips Area Chart) */}
        {(isDispatcher || isSafety) && (
          <motion.div variants={itemVariants} className="lg:col-span-2 border border-slate-200/50 bg-white/70 dark:border-slate-800/40 dark:bg-slate-950/40 p-5 rounded-xl flex flex-col gap-4 shadow-md backdrop-blur-md hover:border-slate-350 dark:hover:border-slate-700/80 transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Trips Overview (7 Days)</span>
            </div>
            <div className="h-72 w-full text-xs font-semibold">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tripsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800/60" />
                  <XAxis dataKey="name" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px', color: '#FFF' }} />
                  <Legend />
                  <Area type="monotone" dataKey="Completed" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                  <Area type="monotone" dataKey="Active" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* CHART 2: VEHICLE BREAKDOWN PIE CHART (Dispatcher, Fleet Manager) */}
        {(isDispatcher || isManager) && (
          <motion.div variants={itemVariants} className={`${isManager ? 'lg:col-span-1' : ''} border border-slate-200/50 bg-white/70 dark:border-slate-800/40 dark:bg-slate-950/40 p-5 rounded-xl flex flex-col gap-4 shadow-md backdrop-blur-md hover:border-slate-350 dark:hover:border-slate-700/80 transition-all duration-300`}>
            <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Vehicle Status Allocation</span>
            {pieData.length > 0 ? (
              <div className="h-72 w-full flex flex-col items-center justify-center relative text-xs">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2 font-bold text-[10px]">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-slate-600 dark:text-slate-400">{entry.name} ({entry.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-xs text-slate-400">
                No vehicles matching selected filters.
              </div>
            )}
          </motion.div>
        )}

        {/* FINANCIAL ANALYST SPECIFIC PIE CHART */}
        {isFinance && (
          <motion.div variants={itemVariants} className="border border-slate-200/50 bg-white/70 dark:border-slate-800/40 dark:bg-slate-950/40 p-5 rounded-xl flex flex-col gap-4 shadow-md backdrop-blur-md hover:border-slate-350 dark:hover:border-slate-700/80 transition-all duration-300">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Cost Allocation Structure</span>
            {costDistribution.length > 0 ? (
              <div className="h-72 w-full flex flex-col items-center justify-center relative text-xs">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={costDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {costDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2 font-bold text-[10px]">
                  {costDistribution.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-slate-600 dark:text-slate-400">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-xs text-slate-400">
                No operating costs logged yet.
              </div>
            )}
          </motion.div>
        )}

        {/* FUEL EXPENDITURE BAR CHART (Finance only) */}
        {isFinance && (
          <motion.div variants={itemVariants} className="border border-slate-200/50 bg-white/70 dark:border-slate-800/40 dark:bg-slate-950/40 p-5 rounded-xl flex flex-col gap-4 shadow-md backdrop-blur-md hover:border-slate-350 dark:hover:border-slate-700/80 transition-all duration-300">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Fuel Expenditure ($)</span>
            {fuelCostByVehicle.length > 0 ? (
              <div className="h-72 w-full text-xs font-semibold">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fuelCostByVehicle} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800/60" />
                    <XAxis dataKey="name" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px', color: '#FFF' }} formatter={(value) => `$${Number(value).toFixed(2)}`} />
                    <Bar dataKey="Cost" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-xs text-slate-400">
                No logged fuel expenses yet.
              </div>
            )}
          </motion.div>
        )}

        {/* MAINTENANCE REPAIR COSTS TRENDS (Manager & Finance only) */}
        {(isManager || isFinance) && (
          <motion.div variants={itemVariants} className="border border-slate-200/50 bg-white/70 dark:border-slate-800/40 dark:bg-slate-950/40 p-5 rounded-xl flex flex-col gap-4 shadow-md backdrop-blur-md hover:border-slate-350 dark:hover:border-slate-700/80 transition-all duration-300 lg:col-span-2">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Maintenance Cumulative Cost ($)</span>
            {maintenanceCostByVehicle.length > 0 ? (
              <div className="h-72 w-full text-xs font-semibold">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={maintenanceCostByVehicle} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800/60" />
                    <XAxis dataKey="name" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px', color: '#FFF' }} formatter={(value) => `$${Number(value).toFixed(2)}`} />
                    <Line type="monotone" dataKey="Cost" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-xs text-slate-400">
                No maintenance charges recorded yet.
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Lists & Logs Tables Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-2 gap-6"
      >
        {/* TABLE 1: RECENT TRIPS (Operations only: Dispatcher, Safety) */}
        {(isDispatcher || isSafety) && (
          <motion.div variants={itemVariants} className="border border-slate-200/50 bg-white/70 dark:border-slate-800/40 dark:bg-slate-950/40 p-5 rounded-xl flex flex-col gap-4 shadow-md backdrop-blur-md hover:border-slate-350 dark:hover:border-slate-700/80 transition-all duration-300 col-span-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Recent Dispatched Trips</span>
            </div>
            <Table headers={['Trip ID', 'Route', 'Vehicle', 'Driver', 'Status']}>
              {recentTrips.map((trip) => {
                const vehicle = vehicles.find(v => v.id === trip.vehicleId);
                const driver = drivers.find(d => d.id === trip.driverId);
                return (
                  <tr key={trip.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="px-5 py-3 font-bold text-xs text-slate-800 dark:text-white">#{trip.id}</td>
                    <td className="px-5 py-3 text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{trip.source}</span>
                      <span className="mx-1 text-slate-400">&rarr;</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{trip.destination}</span>
                    </td>
                    <td className="px-5 py-3 text-xs font-semibold">{vehicle?.registrationNumber || 'N/A'}</td>
                    <td className="px-5 py-3 text-xs font-semibold">{driver?.name || 'N/A'}</td>
                    <td className="px-5 py-3 text-xs">
                      <Badge variant={
                        trip.status === 'COMPLETED' ? 'success' :
                        trip.status === 'DISPATCHED' ? 'primary' :
                        trip.status === 'CANCELLED' ? 'danger' : 'secondary'
                      }>
                        {trip.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </Table>
          </motion.div>
        )}

        {/* TABLE 2: RECENT MAINTENANCE (Manager, Finance only) */}
        {(isManager || isFinance) && (
          <motion.div variants={itemVariants} className={`border border-slate-200/50 bg-white/70 dark:border-slate-800/40 dark:bg-slate-950/40 p-5 rounded-xl flex flex-col gap-4 shadow-md backdrop-blur-md hover:border-slate-350 dark:hover:border-slate-700/80 transition-all duration-300 ${isManager ? 'col-span-2' : ''}`}>
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Recent Workshop Logs</span>
            </div>
            <Table headers={['Log ID', 'Vehicle', 'Description', 'Cost ($)', 'Status']}>
              {recentMaintenance.map((log) => {
                const vehicle = vehicles.find(v => v.id === log.vehicleId);
                return (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="px-5 py-3 font-bold text-xs text-slate-800 dark:text-white">#{log.id}</td>
                    <td className="px-5 py-3 text-xs font-semibold">{vehicle?.registrationNumber || 'N/A'}</td>
                    <td className="px-5 py-3 text-xs truncate max-w-[200px] font-semibold" title={log.description}>{log.description}</td>
                    <td className="px-5 py-3 text-xs font-black text-slate-850 dark:text-slate-100">${log.cost}</td>
                    <td className="px-5 py-3 text-xs">
                      <Badge variant={log.status === 'ACTIVE' ? 'warning' : 'success'}>
                        {log.status === 'ACTIVE' ? 'In Shop' : 'Closed'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </Table>
          </motion.div>
        )}

        {/* TABLE 3: RECENT EXPENSES LEDGER (Financial Analyst only) */}
        {isFinance && (
          <motion.div variants={itemVariants} className="border border-slate-200/50 bg-white/70 dark:border-slate-800/40 dark:bg-slate-950/40 p-5 rounded-xl flex flex-col gap-4 shadow-md backdrop-blur-md hover:border-slate-350 dark:hover:border-slate-700/80 transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Recent Ledger Expenses</span>
            </div>
            <Table headers={['Ledger ID', 'Vehicle', 'Category', 'Cost ($)', 'Log Date']}>
              {recentExpenses.map((exp) => {
                const vehicle = vehicles.find(v => v.id === exp.vehicleId);
                return (
                  <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="px-5 py-3 font-bold text-xs text-slate-800 dark:text-white">#{exp.id}</td>
                    <td className="px-5 py-3 text-xs font-semibold">{vehicle?.registrationNumber || 'N/A'}</td>
                    <td className="px-5 py-3 text-xs">
                      <Badge variant={
                        exp.expenseType === 'MAINTENANCE' ? 'warning' :
                        exp.expenseType === 'TOLL' ? 'primary' :
                        exp.expenseType === 'OTHER' ? 'danger' : 'secondary'
                      }>
                        {exp.expenseType}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-xs font-black text-slate-850 dark:text-slate-100">${Number(exp.amount).toFixed(2)}</td>
                    <td className="px-5 py-3 text-xs font-semibold text-slate-550 dark:text-slate-450">{exp.expenseDate}</td>
                  </tr>
                );
              })}
            </Table>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
