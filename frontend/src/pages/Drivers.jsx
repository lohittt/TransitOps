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
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiUsers, FiAward, FiAlertTriangle, FiPhone } from 'react-icons/fi';

export const Drivers = () => {
  const {
    drivers,
    addDriver,
    updateDriver,
    deleteDriver,
    isLicenseExpired,
    currentUser
  } = useMockData();

  // Search, Filter, Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [complianceFilter, setComplianceFilter] = useState('All'); // All, Expired, Suspended, Compliant
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Form setup
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Handle Form Modal Open
  const handleOpenForm = (driver = null) => {
    setEditingDriver(driver);
    if (driver) {
      reset(driver);
    } else {
      reset({
        name: '',
        licenseNumber: '',
        licenseCategory: 'Class A',
        licenseExpiryDate: '',
        email: '',
        contactNumber: '',
        safetyScore: 10,
        status: 'Available'
      });
    }
    setIsFormOpen(true);
  };

  const onSubmitForm = async (data) => {
    let success = false;
    if (editingDriver) {
      success = await updateDriver({ ...editingDriver, ...data });
    } else {
      success = await addDriver(data);
    }
    if (success) {
      setIsFormOpen(false);
      reset();
    }
  };

  // Delete driver
  const handleDeleteClick = (driver) => {
    setSelectedDriver(driver);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedDriver) {
      await deleteDriver(selectedDriver.id);
      setIsDeleteOpen(false);
    }
  };

  // Filter Logic
  const filtered = drivers.filter(d => {
    const matchesSearch = d.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    
    let matchesCompliance = true;
    if (complianceFilter === 'Expired') {
      matchesCompliance = isLicenseExpired(d.licenseExpiryDate);
    } else if (complianceFilter === 'Suspended') {
      matchesCompliance = d.status === 'Suspended';
    } else if (complianceFilter === 'Compliant') {
      matchesCompliance = !isLicenseExpired(d.licenseExpiryDate) && d.status !== 'Suspended';
    }

    return matchesSearch && matchesStatus && matchesCompliance;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Helpers
  const statusVariants = {
    Available: 'success',
    'On Trip': 'primary',
    'Off Duty': 'secondary',
    Suspended: 'danger'
  };

  const getSafetyScoreColor = (score) => {
    if (score >= 8.5) return 'bg-emerald-500';
    if (score >= 7.0) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getSafetyScoreText = (score) => {
    if (score >= 8.5) return 'Excellent';
    if (score >= 7.0) return 'Satisfactory';
    return 'Critical';
  };

  const isWriteAuthorized = currentUser?.role === 'Fleet Manager' || currentUser?.role === 'Safety Officer';

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <BlurText text="Driver Profiles" className="text-xl font-bold text-slate-800 dark:text-white" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage credentials, contact directories, compliance records, and driver safety scoring</p>
        </div>
        {isWriteAuthorized && (
          <ShinyButton size="sm" onClick={() => handleOpenForm(null)}>
            <FiPlus size={16} />
            <span>Add Driver</span>
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
            placeholder="Search by operator name or license..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50/50 dark:bg-slate-955 border border-slate-205 dark:border-slate-850 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status filter */}
          <Select
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Available', label: 'Available' },
              { value: 'On Trip', label: 'On Trip' },
              { value: 'Off Duty', label: 'Off Duty' },
              { value: 'Suspended', label: 'Suspended' }
            ]}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 dark:bg-slate-950 border-slate-205 py-1.5 min-w-[130px]"
          />

          {/* Compliance Filter */}
          <Select
            options={[
              { value: 'All', label: 'Compliance (All)' },
              { value: 'Compliant', label: 'Compliant' },
              { value: 'Expired', label: 'Expired License' },
              { value: 'Suspended', label: 'Suspended Drivers' }
            ]}
            value={complianceFilter}
            onChange={(e) => { setComplianceFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 dark:bg-slate-955 border-slate-205 py-1.5 min-w-[150px]"
          />
        </div>
      </Card>

      {/* Drivers List View */}
      {currentItems.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <Table headers={['Operator', 'License Details', 'Contact', 'Safety Score', 'Status', 'Actions']}>
            {currentItems.map((driver) => {
              const expired = isLicenseExpired(driver.licenseExpiryDate);
              return (
                <tr key={driver.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                        {driver.name?.split(' ').map(n => n[0]).join('') || '?'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{driver.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">ID: {driver.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {driver.licenseNumber} <span className="text-[10px] text-slate-400">({driver.licenseCategory})</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] font-semibold ${expired ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
                          Expires: {driver.licenseExpiryDate}
                        </span>
                        {expired && <FiAlertTriangle size={12} className="text-red-500 shrink-0" title="License Expired!" />}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <FiPhone size={12} className="text-slate-400" />
                        <span>{driver.contactNumber}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{driver.email}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getSafetyScoreColor(driver.safetyScore)}`}
                            style={{ width: `${(driver.safetyScore || 0) * 10}%` }}
                          />
                        </div>
                        <div className="flex flex-col text-right shrink-0">
                          <span className="text-xs font-bold text-slate-850 dark:text-slate-105">{driver.safetyScore}/10</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{getSafetyScoreText(driver.safetyScore)}</span>
                        </div>
                      </div>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <Badge variant={statusVariants[driver.status]}>
                      {driver.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <div className="flex items-center gap-2">
                      {isWriteAuthorized && (
                        <>
                          <button
                            onClick={() => handleOpenForm(driver)}
                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                            title="Edit Profile"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(driver)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                            title="Delete Profile"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
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
          title="No Operators Found"
          description="We couldn't find any driver profiles matching your current filters. Add a new profile to begin."
          icon={FiUsers}
        />
      )}

      {/* CREATE/EDIT FORM MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingDriver ? `Edit Operator Profile: ${editingDriver.name}` : 'Create Driver Profile'}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Alex Johnson"
              error={errors.name}
              {...register('name', { required: 'Required' })}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. alex@example.com"
              error={errors.email}
              {...register('email', { required: 'Required' })}
            />
            <Input
              label="Contact Number"
              placeholder="e.g. +1 555-0192"
              error={errors.contactNumber}
              {...register('contactNumber', { required: 'Required' })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="License Number"
              placeholder="e.g. DL-88492"
              error={errors.licenseNumber}
              {...register('licenseNumber', { required: 'Required' })}
            />
            <Select
              label="License Class"
              options={[
                { value: 'Class A', label: 'Class A (Heavy Duty)' },
                { value: 'Class B', label: 'Class B (Light Truck)' },
                { value: 'Class C', label: 'Class C (Standard Car)' }
              ]}
              {...register('licenseCategory')}
            />
            <Input
              label="License Expiry"
              type="date"
              error={errors.licenseExpiryDate}
              {...register('licenseExpiryDate', { required: 'Required' })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Safety compliance Score (0-10)"
              type="number"
              placeholder="10"
              step="0.1"
              error={errors.safetyScore}
              {...register('safetyScore', {
                required: 'Safety score is required',
                min: { value: 0, message: 'Minimum score is 0' },
                max: { value: 10, message: 'Maximum score is 10' }
              })}
            />
            <Select
              label="Operator Duty Status"
              options={[
                { value: 'Available', label: 'Available' },
                { value: 'On Trip', label: 'On Trip' },
                { value: 'Off Duty', label: 'Off Duty' },
                { value: 'Suspended', label: 'Suspended' }
              ]}
              disabled={editingDriver?.status === 'On Trip'} // Locked if on trip
              {...register('status')}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingDriver ? 'Save Profile' : 'Register Operator'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Operator Profile"
        message={selectedDriver ? `Are you sure you want to permanently delete profile and logs for "${selectedDriver.name}"? This action cannot be undone.` : ''}
        confirmText="Remove Operator"
      />
    </div>
  );
};

export default Drivers;
