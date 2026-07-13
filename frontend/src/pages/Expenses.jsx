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
import { FiDollarSign, FiPlus, FiSearch } from 'react-icons/fi';

export const Expenses = () => {
  const {
    expenses,
    vehicles,
    addExpense,
    currentUser
  } = useMockData();

  // Search, Filters, Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form setup
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleOpenForm = () => {
    reset({
      vehicleId: '',
      expenseType: 'Tolls',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setIsFormOpen(true);
  };

  const onSubmit = async (data) => {
    const success = await addExpense(data);
    if (success) {
      setIsFormOpen(false);
      reset();
    }
  };

  // Filter Expense Logs
  const filteredExpenses = expenses.filter(exp => {
    const vehicle = vehicles.find(v => v.id === exp.vehicleId);
    const regNo = vehicle?.registrationNumber || '';
    const description = exp.description || '';
    
    const matchesSearch = regNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || exp.expenseType === typeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const currentItems = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const isWriteAuthorized = currentUser?.role === 'Financial Analyst';

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <BlurText text="Operational Expenses" className="text-xl font-bold text-slate-800 dark:text-white" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Track ancillary transit fees including tolls, lodging, parts, and workshop invoices</p>
        </div>
        {isWriteAuthorized && (
          <ShinyButton size="sm" onClick={handleOpenForm}>
            <FiPlus size={16} />
            <span>Log Expense</span>
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
            placeholder="Search by vehicle or description..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <Select
          options={[
            { value: 'All', label: 'All Categories' },
            { value: 'Tolls', label: 'Tolls' },
            { value: 'Meal/Lodging', label: 'Meal & Lodging' },
            { value: 'Parts', label: 'Spare Parts' },
            { value: 'Maintenance', label: 'Maintenance Workshop' },
            { value: 'Other', label: 'Other Costs' }
          ]}
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
          className="bg-slate-50 dark:bg-slate-955 border-slate-205 py-1.5 min-w-[150px]"
        />
      </Card>

      {/* Table Listing */}
      {currentItems.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <Table headers={['Expense ID', 'Vehicle', 'Category', 'Description', 'Cost ($)', 'Log Date']}>
            {currentItems.map((exp) => {
              const vehicle = vehicles.find(v => v.id === exp.vehicleId);
              return (
                <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="px-5 py-4 font-bold text-xs text-slate-800 dark:text-white">EXP-{exp.id}</td>
                  <td className="px-5 py-4 text-xs font-semibold">{vehicle?.registrationNumber || 'Deleted'}</td>
                  <td className="px-5 py-4 text-xs">
                    <Badge variant={
                      exp.expenseType === 'Maintenance' ? 'warning' :
                      exp.expenseType === 'Tolls' ? 'primary' :
                      exp.expenseType === 'Parts' ? 'danger' : 'secondary'
                    }>
                      {exp.expenseType}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[220px] truncate" title={exp.description}>
                    {exp.description}
                  </td>
                  <td className="px-5 py-4 text-xs font-black text-slate-850 dark:text-slate-100">${Number(exp.amount).toFixed(2)}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-550 dark:text-slate-450">{exp.date}</td>
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
          title="No Expenses Logged"
          description="Try logging a toll charge, meals voucher, or invoice bill to register operational costs."
          icon={FiDollarSign}
        />
      )}

      {/* NEW EXPENSE MODAL */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Log Operating Expense">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Select
            label="Associate with Vehicle Asset"
            placeholder="Choose vehicle..."
            options={vehicles.map(v => ({
              value: v.id,
              label: `${v.registrationNumber} (${v.vehicleName})`
            }))}
            error={errors.vehicleId}
            {...register('vehicleId', { required: 'Vehicle selection is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Expense Classification"
              options={[
                { value: 'Tolls', label: 'Tolls' },
                { value: 'Meal/Lodging', label: 'Meal/Lodging' },
                { value: 'Parts', label: 'Spare Parts' },
                { value: 'Other', label: 'Other Costs' }
              ]}
              {...register('expenseType')}
            />
            <Input
              label="Amount Paid ($)"
              type="number"
              placeholder="e.g. 45"
              error={errors.amount}
              {...register('amount', {
                required: 'Expense amount is required',
                min: { value: 1, message: 'Must be positive' }
              })}
            />
          </div>

          <Input
            label="Transaction Date"
            type="date"
            error={errors.date}
            {...register('date', { required: 'Date is required' })}
          />

          <Input
            label="Additional Memo / Description"
            placeholder="Describe what was paid (e.g. I-95 Expressway bridge toll)"
            error={errors.description}
            {...register('description', { required: 'Description memo is required' })}
          />

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Log Expense
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
