import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMockData } from '../context/MockDataContext';
import Button from '../components/ui/Button';
import ShinyButton from '../components/reactbits/ShinyButton';
import BlurText from '../components/reactbits/BlurText';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { FiDroplet, FiPlus, FiSearch } from 'react-icons/fi';

export const FuelLogs = () => {
  const {
    fuelLogs,
    vehicles,
    addFuelLog,
    currentUser
  } = useMockData();

  // Search, Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form setup
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleOpenForm = () => {
    reset({
      vehicleId: '',
      liters: '',
      cost: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsFormOpen(true);
  };

  const onSubmit = async (data) => {
    const success = await addFuelLog(data);
    if (success) {
      setIsFormOpen(false);
    }
  };

  // Filter logs based on search query (Vehicle Reg No)
  const filteredLogs = fuelLogs.filter(log => {
    const vehicle = vehicles.find(v => v.id === log.vehicleId);
    return vehicle?.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentItems = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const isWriteAuthorized = currentUser?.role === 'Financial Analyst';

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <BlurText text="Fuel Logs" className="text-xl font-bold text-slate-800 dark:text-white" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Record fuel consumption, log refill invoices, and monitor liters consumed</p>
        </div>
        {isWriteAuthorized && (
          <ShinyButton size="sm" onClick={handleOpenForm}>
            <FiPlus size={16} />
            <span>Refuel Log</span>
          </ShinyButton>
        )}
      </div>

      {/* Filters Box */}
      <Card className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <FiSearch size={15} />
          </span>
          <input
            type="text"
            placeholder="Search by registration number..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </Card>

      {/* Table Listing */}
      {currentItems.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <Table headers={['Log ID', 'Vehicle', 'Fuel (Liters)', 'Cost ($)', 'Refuel Date']}>
            {currentItems.map((log) => {
              const vehicle = vehicles.find(v => v.id === log.vehicleId);
              return (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="px-5 py-4 font-bold text-xs text-slate-800 dark:text-white">FL-{log.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col text-xs font-semibold">
                      <span className="text-slate-850 dark:text-slate-200">{vehicle?.registrationNumber || 'Deleted'}</span>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5">{vehicle?.vehicleName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-bold">{log.liters} L</td>
                  <td className="px-5 py-4 text-xs font-bold">${log.cost}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400">{log.date}</td>
                </tr>
              );
            })}
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Card>
      ) : (
        <EmptyState
          title="No Fuel Logs Found"
          description="Try logging a refill slip or complete a dispatched trip to register fuel consumption."
          icon={FiDroplet}
        />
      )}

      {/* NEW FUEL RECORD MODAL */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Log Refuel Receipt">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Select
            label="Select Refueled Vehicle"
            placeholder="Choose vehicle..."
            options={vehicles.map(v => ({
              value: v.id,
              label: `${v.registrationNumber} (${v.vehicleName})`
            }))}
            error={errors.vehicleId}
            {...register('vehicleId', { required: 'Vehicle selection is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fuel Volume (Liters)"
              type="number"
              placeholder="e.g. 50"
              error={errors.liters}
              {...register('liters', {
                required: 'Fuel liters is required',
                min: { value: 1, message: 'Must be positive' }
              })}
            />
            <Input
              label="Total Cost ($)"
              type="number"
              placeholder="e.g. 100"
              error={errors.cost}
              {...register('cost', {
                required: 'Cost is required',
                min: { value: 1, message: 'Must be positive' }
              })}
            />
          </div>

          <Input
            label="Refuel Date"
            type="date"
            error={errors.date}
            {...register('date', { required: 'Date is required' })}
          />

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Log Refuel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FuelLogs;
