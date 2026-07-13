import React, { useState, useEffect } from 'react';
import { useMockData } from '../context/MockDataContext';
import reportApi from '../api/report';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import ShinyButton from '../components/reactbits/ShinyButton';
import BlurText from '../components/reactbits/BlurText';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { FiDownload, FiDollarSign, FiTrendingUp, FiActivity, FiDroplet } from 'react-icons/fi';

export const Reports = () => {
  const {
    vehicles,
    trips,
    fuelLogs,
    maintenance,
    expenses,
    getVehicleOperationalCost,
    addToast
  } = useMockData();



  const handleExport = async () => {
    try {
      const response = await reportApi.exportCsv();
      const csvData = response.csvData;
      const filename = response.filename;
      
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename || 'fleet_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addToast('TransitOps Fleet Financial Report exported as CSV successfully.', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to export report.', 'danger');
    }
  };

  // --- Dynamic Financial Calculations ---
  
  // Total Distance from Completed Trips
  const totalDistance = trips
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, item) => sum + item.distance, 0);

  // Total Fuel consumed
  const totalFuelLiters = fuelLogs
    .reduce((sum, item) => sum + item.liters, 0);

  // Fuel Efficiency (km/L)
  const averageFuelEfficiency = totalFuelLiters > 0
    ? (totalDistance / totalFuelLiters).toFixed(2)
    : '0.00';

  // Total Fuel cost
  const totalFuelCost = fuelLogs.reduce((sum, item) => sum + item.cost, 0);
  
  // Total Maintenance cost
  const totalMaintCost = maintenance.reduce((sum, item) => sum + item.cost, 0);

  // Total other expenses
  const totalOtherExpenses = expenses
    .filter(e => e.type !== 'Maintenance')
    .reduce((sum, item) => sum + item.cost, 0);

  const totalOperationalCost = totalFuelCost + totalMaintCost + totalOtherExpenses;

  // Compile detailed vehicle statistics list
  const vehicleStats = vehicles.map(v => {
    // Operations costs
    const fuelCost = fuelLogs.filter(f => f.vehicleId === v.id).reduce((sum, item) => sum + item.cost, 0);
    const maintCost = maintenance.filter(m => m.vehicleId === v.id).reduce((sum, item) => sum + item.cost, 0);
    const otherCost = expenses.filter(e => e.vehicleId === v.id && e.type !== 'Maintenance').reduce((sum, item) => sum + item.cost, 0);
    const totalCost = fuelCost + maintCost + otherCost;

    // Simulated revenue based on total odometer (e.g. $1.5/km)
    const simulatedRevenue = v.odometer * 1.5;
    
    // ROI = (Revenue - Operating Cost) / Acquisition Cost
    const roi = v.acquisitionCost > 0
      ? ((simulatedRevenue - totalCost) / v.acquisitionCost) * 100
      : 0;

    return {
      ...v,
      fuelCost,
      maintCost,
      otherCost,
      totalCost,
      simulatedRevenue,
      roi: parseFloat(roi.toFixed(1))
    };
  });

  // Calculate Avg Fleet ROI
  const validAcquisitions = vehicleStats.filter(v => v.acquisitionCost > 0);
  const avgFleetRoi = validAcquisitions.length > 0
    ? (validAcquisitions.reduce((sum, v) => sum + v.roi, 0) / validAcquisitions.length).toFixed(1)
    : '0.0';

  // --- Recharts Layout Structures ---

  // 1. Cost Allocation Categories (Pie Chart)
  const costDistribution = [
    { name: 'Fuel', value: totalFuelCost, color: '#2563EB' },
    { name: 'Maintenance', value: totalMaintCost, color: '#F59E0B' },
    { name: 'Ancillary/Tolls', value: totalOtherExpenses, color: '#10B981' }
  ].filter(item => item.value > 0);

  // 2. Vehicles ROI Comparisons (Bar Chart)
  const roiChartData = vehicleStats.map(v => ({
    name: v.regNo,
    ROI: v.roi
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <BlurText text="Reports & Financial Analytics" className="text-xl font-bold text-slate-800 dark:text-white" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Review vehicle ROI matrices, resource fuel efficiency, and export csv records</p>
        </div>
        <ShinyButton size="sm" onClick={handleExport}>
          <FiDownload size={15} />
          <span>Export CSV Summary</span>
        </ShinyButton>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: Fuel Efficiency */}
        <Card className="p-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Fuel Efficiency</span>
            <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">{averageFuelEfficiency} km/L</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">Based on {totalDistance} km logged</span>
          </div>
          <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/20 text-blue-655 dark:text-blue-450 rounded-xl flex items-center justify-center shrink-0">
            <FiDroplet size={20} />
          </div>
        </Card>

        {/* KPI: Total Operating Cost */}
        <Card className="p-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Total Operating Cost</span>
            <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">${totalOperationalCost.toLocaleString()}</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1">Refills, workshop logs, and tolls</span>
          </div>
          <div className="h-10 w-10 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 rounded-xl flex items-center justify-center shrink-0">
            <FiDollarSign size={20} />
          </div>
        </Card>

        {/* KPI: Average ROI */}
        <Card className="p-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-widest">Average Asset ROI</span>
            <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">{avgFleetRoi}%</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-555 mt-1">Revenue margin vs investment</span>
          </div>
          <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-xl flex items-center justify-center shrink-0">
            <FiTrendingUp size={20} />
          </div>
        </Card>

        {/* KPI: Total Dispatched Distance */}
        <Card className="p-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-widest">Total Fleet Odo</span>
            <span className="text-2xl font-black text-slate-850 dark:text-white mt-1.5">
              {vehicles.reduce((sum, v) => sum + v.odometer, 0).toLocaleString()} km
            </span>
            <span className="text-[9px] text-slate-400 dark:text-slate-555 mt-1">Cumulative distance of registry</span>
          </div>
          <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-455 rounded-xl flex items-center justify-center shrink-0">
            <FiActivity size={20} />
          </div>
        </Card>
      </div>

      {/* Reports Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Vehicle ROI comparisons */}
        <Card className="lg:col-span-2 p-5 flex flex-col gap-4">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Asset Yield Comparison (ROI %)</span>
          <div className="h-72 w-full text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" className="dark:stroke-slate-800/60" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px', color: '#FFF' }} />
                <Bar dataKey="ROI" fill="#2563EB">
                  {roiChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.ROI >= 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Cost allocation */}
        <Card className="p-5 flex flex-col gap-4">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Expense Allocation Breakdown</span>
          {costDistribution.length > 0 ? (
            <div className="h-72 w-full flex flex-col items-center justify-center relative text-xs">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={costDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {costDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2 font-bold text-[10px]">
                {costDistribution.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-slate-600 dark:text-slate-400">
                      {entry.name} (${entry.value.toLocaleString()})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-xs text-slate-400">
              No logged expenses to classify.
            </div>
          )}
        </Card>
      </div>

      {/* ROI Breakdown Table Details */}
      <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Asset Yield Detail Matrix</span>
      <Card className="p-0 overflow-hidden">
        <Table headers={['Vehicle', 'Classification', 'Fuel Fees', 'Workshop Fees', 'Operating Cost', 'Acquisition', 'Dynamic ROI']}>
          {vehicleStats.map((stat) => (
            <tr key={stat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
              <td className="px-5 py-4 font-bold text-xs text-slate-800 dark:text-white">{stat.regNo}</td>
              <td className="px-5 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">{stat.type}</td>
              <td className="px-5 py-4 text-xs font-semibold">${stat.fuelCost.toLocaleString()}</td>
              <td className="px-5 py-4 text-xs font-semibold">${stat.maintCost.toLocaleString()}</td>
              <td className="px-5 py-4 text-xs font-bold text-slate-805 dark:text-slate-200">${stat.totalCost.toLocaleString()}</td>
              <td className="px-5 py-4 text-xs font-bold text-slate-805 dark:text-slate-200">${stat.acquisitionCost.toLocaleString()}</td>
              <td className="px-5 py-4 text-xs">
                <Badge variant={stat.roi >= 0 ? 'success' : 'danger'}>
                  {stat.roi >= 0 ? '+' : ''}{stat.roi}%
                </Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};

export default Reports;
