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
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiTruck } from 'react-icons/fi';

export const Vehicles = () => {
  const {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleOperationalCost,
    currentUser
  } = useMockData();

  // Search, Filter, Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Form setup
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Handle open Form modal
  const handleOpenForm = (vehicle = null) => {
    setEditingVehicle(vehicle);
    if (vehicle) {
      // Prefill values
      reset(vehicle);
    } else {
      reset({
        registrationNumber: '',
        vehicleName: '',
        vehicleType: 'VAN',
        maximumLoadCapacity: '',
        odometer: '',
        acquisitionCost: '',
        status: 'AVAILABLE',
        region: 'North'
      });
    }
    setIsFormOpen(true);
  };

  const onSubmitForm = async (data) => {
    let success = false;
    if (editingVehicle) {
      success = await updateVehicle({ ...editingVehicle, ...data });
    } else {
      success = await addVehicle(data);
    }
    if (success) {
      setIsFormOpen(false);
      reset();
    }
  };

  // View details
  const handleView = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsViewOpen(true);
  };

  // Delete flow
  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedVehicle) {
      await deleteVehicle(selectedVehicle.id);
      setIsDeleteOpen(false);
    }
  };

  // Filters logic
  const filtered = vehicles.filter(v => {
    const matchesSearch = v.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.vehicleName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchesType = typeFilter === 'All' || v.vehicleType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
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
    'In Shop': 'warning',
    Retired: 'danger'
  };

  const isWriteAuthorized = currentUser?.role === 'Fleet Manager';

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <BlurText text="Vehicle Registry" className="text-xl font-bold text-slate-800 dark:text-white" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Master register of transportation assets and metadata</p>
        </div>
        
        {/* Create button, disabled for non-managers */}
        {isWriteAuthorized && (
          <ShinyButton size="sm" onClick={() => handleOpenForm(null)}>
            <FiPlus size={16} />
            <span>Add Vehicle</span>
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
            placeholder="Search by registration or model..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status filter */}
          <Select
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'AVAILABLE', label: 'Available' },
              { value: 'ON_TRIP', label: 'On Trip' },
              { value: 'IN_SHOP', label: 'In Shop' },
              { value: 'RETIRED', label: 'Retired' }
            ]}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 dark:bg-slate-950 border-slate-205 py-1.5 min-w-[130px]"
          />

          {/* Type filter */}
          <Select
            options={[
              { value: 'All', label: 'All Types' },
              { value: 'VAN', label: 'Van' },
              { value: 'TRUCK', label: 'Heavy Truck' },
              { value: 'TANKER', label: 'Semi-Trailer' },
              { value: 'PICKUP', label: 'Pickup' },
              { value: 'BUS', label: 'Bus' }
            ]}
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 dark:bg-slate-950 border-slate-205 py-1.5 min-w-[130px]"
          />
        </div>
      </Card>

      {/* Vehicles Table View */}
      {currentItems.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <Table headers={['Registration', 'Model/Name', 'Type', 'Max Load Capacity', 'Odometer', 'Region', 'Status', 'Actions']}>
            {currentItems.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                <td className="px-5 py-3.5 font-bold text-xs text-slate-800 dark:text-white">{vehicle.registrationNumber}</td>
                <td className="px-5 py-3.5 text-xs font-semibold">{vehicle.vehicleName}</td>
                <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">{vehicle.vehicleType}</td>
                <td className="px-5 py-3.5 text-xs font-semibold">{vehicle.maximumLoadCapacity} kg</td>
                <td className="px-5 py-3.5 text-xs font-semibold">{vehicle.odometer?.toLocaleString()} km</td>
                <td className="px-5 py-3.5 text-xs font-semibold">{vehicle.region}</td>
                <td className="px-5 py-3.5 text-xs">
                  <Badge variant={statusVariants[vehicle.status]}>
                    {vehicle.status}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(vehicle)}
                      className="p-1.5 text-slate-500 hover:text-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                      title="View Details & ROI"
                    >
                      <FiEye size={14} />
                    </button>
                    {isWriteAuthorized && (
                      <>
                        <button
                          onClick={() => handleOpenForm(vehicle)}
                          className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                          title="Edit Vehicle"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(vehicle)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                          title="Delete Vehicle"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Card>
      ) : (
        <EmptyState
          title="No Vehicles Found"
          description="We couldn't find any fleet assets matching your search query or filters. Register a new asset to get started."
          icon={FiTruck}
        />
      )}

      {/* CREATE/EDIT FORM MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingVehicle ? `Edit Vehicle ${editingVehicle.registrationNumber}` : 'Register New Fleet Vehicle'}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Registration Number"
              placeholder="e.g. XY-1234"
              error={errors.registrationNumber}
              {...register('registrationNumber', { required: 'Required' })}
            />
            <Input
              label="Vehicle Model/Name"
              placeholder="e.g. Ford Transit Cargo"
              error={errors.vehicleName}
              {...register('vehicleName', { required: 'Required' })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Vehicle Type"
              options={[
                { value: 'VAN', label: 'Cargo Van' },
                { value: 'TRUCK', label: 'Heavy Duty Truck' },
                { value: 'TANKER', label: 'Semi-Trailer' },
                { value: 'PICKUP', label: 'Pickup Truck' },
                { value: 'BUS', label: 'Bus' }
              ]}
              {...register('vehicleType')}
            />
            <Input
              label="Max Load Capacity (kg)"
              type="number"
              placeholder="e.g. 1500"
              error={errors.maximumLoadCapacity}
              {...register('maximumLoadCapacity', { 
                required: 'Required',
                valueAsNumber: true 
              })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Current Odometer (km)"
              type="number"
              placeholder="e.g. 12000"
              error={errors.odometer}
              {...register('odometer', {
                required: 'Odometer is required',
                min: { value: 0, message: 'Cannot be negative' }
              })}
            />
            <Input
              label="Acquisition Cost ($)"
              type="number"
              placeholder="e.g. 35000"
              error={errors.acquisitionCost}
              {...register('acquisitionCost', {
                required: 'Cost is required',
                min: { value: 1, message: 'Must be positive' }
              })}
            />
            <Select
              label="Region Assignment"
              options={[
                { value: 'North', label: 'North' },
                { value: 'South', label: 'South' },
                { value: 'East', label: 'East' },
                { value: 'West', label: 'West' }
              ]}
              {...register('region')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Operational Status"
              options={[
                { value: 'Available', label: 'Available' },
                { value: 'On Trip', label: 'On Trip' },
                { value: 'In Shop', label: 'In Shop' },
                { value: 'Retired', label: 'Retired' }
              ]}
              disabled={editingVehicle?.status === 'On Trip'} // Cannot change status directly if on trip
              {...register('status')}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingVehicle ? 'Update Vehicle' : 'Register Vehicle'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* VIEW DETAIL MODAL WITH ROI */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={selectedVehicle ? `${selectedVehicle.registrationNumber} Asset Dossier` : ''}
        size="lg"
      >
        {selectedVehicle && (() => {
          const operationalCost = getVehicleOperationalCost(selectedVehicle.id);
          
          // Simulated revenue: $2 per km of odometer traveled
          const simulatedRevenue = selectedVehicle.odometer * 1.5;
          const roi = selectedVehicle.acquisitionCost > 0
            ? ((simulatedRevenue - operationalCost) / selectedVehicle.acquisitionCost) * 100
            : 0;

          return (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Classification</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{selectedVehicle.vehicleType}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cargo Limit</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{selectedVehicle.maximumLoadCapacity} kg</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Odometer</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{selectedVehicle.odometer?.toLocaleString()} km</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Badge</span>
                  <div className="mt-1">
                    <Badge variant={statusVariants[selectedVehicle.status]}>{selectedVehicle.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown & ROI Card */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50/40 dark:bg-slate-900/10 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Financial Analytics & ROI</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-semibold">Acquisition Cost</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white mt-1">${selectedVehicle.acquisitionCost.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-semibold">Operating Cost (Fuel + Maintenance)</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white mt-1">${operationalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-semibold">Vehicle ROI %</span>
                    <span className={`text-sm font-black mt-1 ${roi >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {roi.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 italic font-semibold leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3 mt-1">
                  * ROI is dynamically computed using standard formula: (Revenue - Operating Cost) / Acquisition Cost. Revenue is simulated based on lifetime mileage ($1.5/km).
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" size="sm" onClick={() => setIsViewOpen(false)}>
                  Close dossier
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to permanently remove vehicle ${selectedVehicle?.registrationNumber}?`}
        confirmText="Remove Registration"
      />
    </div>
  );
};

export default Vehicles;
