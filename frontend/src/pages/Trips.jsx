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
import EmptyState from '../components/ui/EmptyState';
import {
  FiMapPin,
  FiPlus,
  FiSend,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiCompass,
  FiAnchor,
  FiCalendar,
  FiActivity
} from 'react-icons/fi';

export const Trips = () => {
  const {
    trips,
    vehicles,
    drivers,
    createTrip,
    dispatchTrip,
    completeTrip,
    cancelTrip,
    isLicenseExpired,
    currentUser
  } = useMockData();

  // Selection state for sidebar timeline
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCompleteFormOpen, setIsCompleteFormOpen] = useState(false);
  const [completingTripId, setCompletingTripId] = useState(null);

  // Forms setup
  const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreate, formState: { errors: errorsCreate } } = useForm();
  const { register: registerComplete, handleSubmit: handleSubmitComplete, reset: resetComplete, formState: { errors: errorsComplete } } = useForm();

  // Find selected trip
  const selectedTrip = trips.find(t => t.id === selectedTripId);

  // --- FILTERS FOR DISPATCH SELECTORS (CRITICAL BUSINESS RULES) ---
  // Vehicles: Must be Available (cannot be Retired, In Shop, or On Trip)
  const dispatchableVehicles = vehicles.filter(v => v.status === 'AVAILABLE');

  // Drivers: Must be Available, not Suspended, and License NOT expired
  const dispatchableDrivers = drivers.filter(d => 
    d.status === 'AVAILABLE' && 
    !isLicenseExpired(d.expiryDate)
  );

  const handleOpenCreate = () => {
    resetCreate({
      source: '',
      destination: '',
      vehicleId: '',
      driverId: '',
      cargoWeight: '',
      plannedDistance: ''
    });
    setIsCreateOpen(true);
  };

  const onSubmitCreate = async (data) => {
    const success = await createTrip(data);
    if (success) {
      setIsCreateOpen(false);
    }
  };

  // Complete Trip Form open
  const handleOpenComplete = (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    
    setCompletingTripId(tripId);
    resetComplete({
      actualDistance: trip.plannedDistance,
      fuelConsumed: ''
    });
    setIsCompleteFormOpen(true);
  };

  const onSubmitComplete = async (data) => {
    const success = await completeTrip(completingTripId, data);
    if (success) {
      setIsCompleteFormOpen(false);
      setCompletingTripId(null);
    }
  };

  const statusColors = {
    DRAFT: 'secondary',
    DISPATCHED: 'primary',
    COMPLETED: 'success',
    CANCELLED: 'danger'
  };

  const isWriteAuthorized = currentUser?.role === 'Dispatcher' || currentUser?.role === 'Fleet Manager';

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <BlurText text="Trip Management" className="text-xl font-bold text-slate-800 dark:text-white" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Dispatch vehicles, schedule routes, and view active operator logs</p>
        </div>
        {isWriteAuthorized && (
          <ShinyButton size="sm" onClick={handleOpenCreate}>
            <FiPlus size={16} />
            <span>Create Trip Draft</span>
          </ShinyButton>
        )}
      </div>

      {/* Main Grid: Trip Log & Sidebar Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left: Trips Table List */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          {trips.length > 0 ? (
            <Card className="p-0 overflow-hidden">
              <Table headers={['Trip ID', 'Route Details', 'Cargo/Distance', 'Driver & Vehicle', 'Status', 'Workflow']}>
                {trips.map((trip) => {
                  const vehicle = vehicles.find(v => v.id === trip.vehicleId);
                  const driver = drivers.find(d => d.id === trip.driverId);
                  const isSelected = trip.id === selectedTripId;

                  return (
                    <tr
                      key={trip.id}
                      onClick={() => setSelectedTripId(trip.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-blue-50/40 dark:bg-blue-950/20' 
                          : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/20'
                      }`}
                    >
                      <td className="px-5 py-4 font-bold text-xs text-slate-800 dark:text-white">TRP-{trip.id}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col text-xs font-semibold">
                          <span className="text-slate-800 dark:text-slate-200">{trip.source}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-550 my-0.5">&rarr; in transit to</span>
                          <span className="text-slate-850 dark:text-slate-200">{trip.destination}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5 text-xs font-semibold text-slate-655 dark:text-slate-400">
                          <span>Weight: {trip.cargoWeight} kg</span>
                          <span className="text-[10px] text-slate-400 font-medium">Distance: {trip.plannedDistance} km</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5 text-xs font-semibold text-slate-655 dark:text-slate-400">
                          <span>Driver: {driver?.name || 'Deleted'}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Asset: {vehicle?.registrationNumber || 'Deleted'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        <Badge variant={statusColors[trip.status]}>
                          {trip.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-xs" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          {/* Dispatch Trigger */}
                          {trip.status === 'DRAFT' && isWriteAuthorized && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-2 py-1 text-[10px]"
                              onClick={async () => await dispatchTrip(trip.id)}
                            >
                              <FiSend size={11} />
                              <span>Dispatch</span>
                            </Button>
                          )}

                          {/* Complete Trigger */}
                          {trip.status === 'DISPATCHED' && isWriteAuthorized && (
                            <Button
                              variant="success"
                              size="sm"
                              className="w-full text-[10px]"
                              onClick={() => handleOpenComplete(trip.id)}
                            >
                              Log Delivery
                            </Button>
                          )}

                          {/* Cancel Trigger */}
                          {trip.status === 'DISPATCHED' && isWriteAuthorized && (
                            <button
                              onClick={async () => await cancelTrip(trip.id)}
                              className="text-xs text-red-500 hover:text-red-700 ml-1"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </Table>
            </Card>
          ) : (
            <EmptyState
              title="No Trips Registered"
              description="Deploy your fleet by scheduling a dispatch route draft."
              icon={FiMapPin}
            />
          )}
        </div>

        {/* Right: Selected Trip Timeline Card */}
        <div className="flex flex-col gap-4">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Route Tracker & Logs</span>
          {selectedTrip ? (() => {
            const vehicle = vehicles.find(v => v.id === selectedTrip.vehicleId);
            const driver = drivers.find(d => d.id === selectedTrip.driverId);
            
            return (
              <Card className="flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Route Dossier</span>
                    <span className="text-sm font-bold text-slate-805 dark:text-white mt-1">TRP-{selectedTrip.id}</span>
                  </div>
                  <Badge variant={statusColors[selectedTrip.status]}>{selectedTrip.status}</Badge>
                </div>

                {/* Timeline UI list */}
                <div className="flex flex-col gap-6 pl-2 relative before:content-[''] before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                  
                  {/* Step 1: Draft Created */}
                  <div className="flex gap-4 relative">
                    <span className="z-10 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-600 dark:text-slate-350">
                      1
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-205">Route Formulated</span>
                      <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">Start: {selectedTrip.startTime || 'Not started'}</span>
                    </div>
                  </div>

                  {/* Step 2: Dispatched */}
                  <div className="flex gap-4 relative">
                    <span className={`z-10 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                      ['DISPATCHED', 'COMPLETED'].includes(selectedTrip.status) 
                      ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      2
                    </span>
                    <div className="flex flex-col pb-6">
                      <span className="text-xs font-bold text-slate-850 dark:text-slate-205">Dispatched to Route</span>
                      {['DISPATCHED', 'COMPLETED'].includes(selectedTrip.status) ? (
                        <span className="text-[10px] text-blue-500 font-semibold mt-0.5">En route to {selectedTrip.destination}</span>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium mt-0.5">Awaiting dispatch</span>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Finished / Cancelled */}
                  <div className="flex gap-4 relative">
                    <span className={`z-10 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                      selectedTrip.status === 'COMPLETED' ? 'bg-emerald-500 text-white' :
                      selectedTrip.status === 'CANCELLED' ? 'bg-red-500 text-white' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      3
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-850 dark:text-slate-205">
                        {selectedTrip.status === 'CANCELLED' ? 'Dispatch Cancelled' : 'Operations Completed'}
                      </span>
                      {selectedTrip.status === 'COMPLETED' ? (
                        <div className="flex flex-col text-[10px] text-slate-550 dark:text-slate-450 font-semibold mt-1 gap-0.5">
                          <span>Actual Distance: {selectedTrip.actualDistance?.toLocaleString()} km</span>
                          <span>Fuel Logged: {selectedTrip.fuelConsumed} Liters</span>
                        </div>
                      ) : selectedTrip.status === 'CANCELLED' ? (
                        <span className="text-[10px] text-red-500 font-semibold mt-0.5">Operator & vehicle returned to available pool.</span>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium mt-0.5">Pending delivery closure</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })() : (
            <Card className="p-8 text-center text-xs text-slate-400">
              No trips to track.
            </Card>
          )}
        </div>
      </div>

      {/* CREATE TRIP MODAL WITH COMPLIANCE CHECKS */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Formulate Dispatch Route">
        <form onSubmit={handleSubmitCreate(onSubmitCreate)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Source City"
              placeholder="e.g. Chicago IL"
              error={errorsCreate.source}
              {...registerCreate('source', { required: 'Source is required' })}
            />
            <Input
              label="Destination City"
              placeholder="e.g. Detroit MI"
              error={errorsCreate.destination}
              {...registerCreate('destination', { required: 'Destination is required' })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Vehicle Selection: List only Available vehicles */}
            <Select
              label="Select Available Vehicle (Max capacity check)"
              placeholder="Choose vehicle..."
              options={dispatchableVehicles.map(v => ({
                value: v.id,
                label: `${v.registrationNumber} (${v.vehicleName} - Cap: ${v.maximumLoadCapacity}kg)`
              }))}
              error={errorsCreate.vehicleId}
              {...registerCreate('vehicleId', { required: 'Vehicle is required' })}
            />

            {/* Driver Selection: List only Available and Compliant drivers */}
            <Select
              label="Select Available Driver (License validation)"
              placeholder="Choose operator..."
              options={dispatchableDrivers.map(d => ({
                value: d.id,
                label: `${d.name} (${d.licenseCategory} - Safety Score: ${d.safetyScore})`
              }))}
              error={errorsCreate.driverId}
              {...registerCreate('driverId', { required: 'Driver is required' })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cargo Weight (kg)"
              type="number"
              placeholder="e.g. 450"
              error={errorsCreate.cargoWeight}
              {...registerCreate('cargoWeight', {
                required: 'Cargo weight is required',
                min: { value: 1, message: 'Must be positive' }
              })}
            />
            <Input
              label="Transit Distance (km)"
              type="number"
              placeholder="e.g. 280"
              error={errorsCreate.plannedDistance}
              {...registerCreate('plannedDistance', {
                required: 'Distance is required',
                min: { value: 1, message: 'Must be positive' }
              })}
            />
          </div>

          {dispatchableVehicles.length === 0 && (
            <p className="text-[10px] text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-lg">
              ⚠️ Warning: No vehicles are currently 'Available' in the fleet pool. Check vehicles page or complete active trips.
            </p>
          )}

          {dispatchableDrivers.length === 0 && (
            <p className="text-[10px] text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-lg">
              ⚠️ Warning: No operators are currently 'Available' with valid, unexpired licenses. Check operators directory.
            </p>
          )}

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={dispatchableVehicles.length === 0 || dispatchableDrivers.length === 0}>
              Create Draft
            </Button>
          </div>
        </form>
      </Modal>

      {/* COMPLETE TRIP MODAL FORM */}
      <Modal isOpen={isCompleteFormOpen} onClose={() => setIsCompleteFormOpen(false)} title="Close Dispatch Route">
        <form onSubmit={handleSubmitComplete(onSubmitComplete)} className="flex flex-col gap-4">
          <p className="text-xs text-slate-500 leading-normal">
            Enter the closing metrics to register vehicle odometer and logs.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Actual Distance (km)"
              type="number"
              error={errorsComplete.actualDistance}
              {...registerComplete('actualDistance', { required: 'Actual distance is required', valueAsNumber: true })}
            />
            <Input
              label="Fuel Consumed (Liters)"
              type="number"
              placeholder="e.g. 25"
              error={errorsComplete.fuelConsumed}
              {...registerComplete('fuelConsumed', {
                required: 'Fuel consumed is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Cannot be negative' }
              })}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsCompleteFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success" size="sm">
              Complete Trip
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Trips;
