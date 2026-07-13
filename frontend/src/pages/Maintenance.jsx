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
import { FiTool, FiPlus, FiCheckCircle, FiFileText } from 'react-icons/fi';

export const Maintenance = () => {
  const {
    maintenance,
    vehicles,
    createMaintenance,
    closeMaintenance,
    currentUser
  } = useMockData();

  // Tabs: 'all', 'open', 'closed'
  const [activeTab, setActiveTab] = useState('all');

  // Modal states
  const [isOpenFormOpen, setIsOpenFormOpen] = useState(false);
  const [isCloseFormOpen, setIsCloseFormOpen] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);

  // Forms setup
  const { register: registerOpen, handleSubmit: handleSubmitOpen, reset: resetOpen, formState: { errors: errorsOpen } } = useForm();
  const { register: registerClose, handleSubmit: handleSubmitClose, reset: resetClose, formState: { errors: errorsClose } } = useForm();

  // Filter vehicles: can only perform maintenance if vehicle is NOT 'On Trip' and NOT 'Retired' (Retired is retired, On Trip must finish first)
  const maintainableVehicles = vehicles.filter(v => v.status !== 'On Trip' && v.status !== 'Retired');

  const handleOpenOrder = () => {
    resetOpen({
      vehicleId: '',
      description: '',
      cost: '',
      startDate: new Date().toISOString().split('T')[0]
    });
    setIsOpenFormOpen(true);
  };

  const onSubmitOpen = async (data) => {
    const success = await createMaintenance(data);
    if (success) {
      setIsOpenFormOpen(false);
    }
  };

  const handleCloseOrderClick = (logId) => {
    const log = maintenance.find(m => m.id === logId);
    if (!log) return;

    setSelectedLogId(logId);
    resetClose({
      finalCost: log.cost
    });
    setIsCloseFormOpen(true);
  };

  const onSubmitClose = async (data) => {
    const success = await closeMaintenance(selectedLogId, data.finalCost);
    if (success) {
      setIsCloseFormOpen(false);
      setSelectedLogId(null);
    }
  };

  // Tab Filtering
  const filteredLogs = maintenance.filter(log => {
    if (activeTab === 'open') return log.status === 'Open';
    if (activeTab === 'closed') return log.status === 'Closed';
    return true;
  });

  const isWriteAuthorized = currentUser?.role === 'Fleet Manager';

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <BlurText text="Maintenance Workshop" className="text-xl font-bold text-slate-800 dark:text-white" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Schedule vehicle repairs, inspect active work orders, and review service costs</p>
        </div>
        {isWriteAuthorized && (
          <ShinyButton size="sm" onClick={handleOpenOrder}>
            <FiPlus size={16} />
            <span>Open Work Order</span>
          </ShinyButton>
        )}
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 dark:border-slate-850 gap-6 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-250'
          }`}
        >
          All Logs ({maintenance.length})
        </button>
        <button
          onClick={() => setActiveTab('open')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'open'
              ? 'border-amber-500 text-amber-500 dark:border-amber-450'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-250'
          }`}
        >
          Active in Shop ({maintenance.filter(m => m.status === 'Open').length})
        </button>
        <button
          onClick={() => setActiveTab('closed')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'closed'
              ? 'border-emerald-500 text-emerald-500 dark:border-emerald-450'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-250'
          }`}
        >
          Workshop Archives ({maintenance.filter(m => m.status === 'Closed').length})
        </button>
      </div>

      {/* Table Listing */}
      {filteredLogs.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <Table headers={['Order ID', 'Vehicle', 'Description', 'Cost ($)', 'Dates', 'Status', 'Workflow']}>
            {filteredLogs.map((log) => {
              const vehicle = vehicles.find(v => v.id === log.vehicleId);
              return (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="px-5 py-4 font-bold text-xs text-slate-800 dark:text-white">MN-{log.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col text-xs font-semibold">
                      <span className="text-slate-850 dark:text-slate-200">{vehicle?.registrationNumber || 'Deleted'}</span>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5">{vehicle?.vehicleName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[200px] truncate" title={log.description}>
                    {log.description}
                  </td>
                  <td className="px-5 py-4 text-xs font-bold">${log.cost}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col text-[10px] font-semibold text-slate-500 dark:text-slate-450 gap-0.5">
                      <span>Opened: {log.startDate}</span>
                      {log.endDate && <span>Closed: {log.endDate}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <Badge variant={log.status === 'Open' ? 'warning' : 'success'}>
                      {log.status === 'Open' ? 'In Shop' : 'Closed'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-xs" onClick={(e) => e.stopPropagation()}>
                    {log.status === 'Open' && isWriteAuthorized ? (
                      <Button
                        variant="success"
                        size="sm"
                        className="px-2 py-1 text-[10px] gap-1"
                        onClick={() => handleCloseOrderClick(log.id)}
                      >
                        <FiCheckCircle size={11} />
                        <span>Close Order</span>
                      </Button>
                    ) : (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold italic">No actions available</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </Table>
        </Card>
      ) : (
        <EmptyState
          title="No Workshop Logs Found"
          description="Try creating an active maintenance record to put a vehicle in repair shop."
          icon={FiTool}
        />
      )}

      {/* CREATE MAINTENANCE ORDER MODAL */}
      <Modal isOpen={isOpenFormOpen} onClose={() => setIsOpenFormOpen(false)} title="Open Workshop Order">
        <form onSubmit={handleSubmitOpen(onSubmitOpen)} className="flex flex-col gap-4">
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-normal mb-1">
            Placing a vehicle in maintenance will change its status to <strong>In Shop</strong>, removing it from trip dispatches.
          </p>

          <Select
            label="Select Vehicle to Service"
            placeholder="Choose vehicle..."
            options={maintainableVehicles.map(v => ({
              value: v.id,
              label: `${v.registrationNumber} (${v.vehicleName} - Status: ${v.status})`
            }))}
            error={errorsOpen.vehicleId}
            {...registerOpen('vehicleId', { required: 'Vehicle selection is required' })}
          />

          <Select
            label="Maintenance Type"
            options={[
              { value: 'Preventive', label: 'Preventive / Routine' },
              { value: 'Corrective', label: 'Corrective / Repair' },
              { value: 'Inspection', label: 'Inspection' }
            ]}
            error={errorsOpen.maintenanceType}
            {...registerOpen('maintenanceType', { required: 'Maintenance type is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estimated Cost ($)"
              type="number"
              placeholder="e.g. 150"
              error={errorsOpen.cost}
              {...registerOpen('cost', {
                required: 'Cost is required',
                min: { value: 0, message: 'Cannot be negative' }
              })}
            />
            <Input
              label="Start Date"
              type="date"
              error={errorsOpen.startDate}
              {...registerOpen('startDate', { required: 'Start date is required' })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-650 dark:text-slate-455">
              Service Description / Issue Details
            </label>
            <textarea
              placeholder="Describe repairs needed (e.g. Oil change and front brake pads replacement)"
              className="w-full h-24 rounded-lg border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950 px-3 py-2 text-xs text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              error={errorsOpen.description}
              {...registerOpen('description', { required: 'Service description is required' })}
            />
            {errorsOpen.description && <span className="text-xs text-red-500 font-medium">{errorsOpen.description.message}</span>}
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsOpenFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={maintainableVehicles.length === 0}>
              Open Order
            </Button>
          </div>
        </form>
      </Modal>

      {/* CLOSE WORKSHOP ORDER MODAL */}
      <Modal isOpen={isCloseFormOpen} onClose={() => setIsCloseFormOpen(false)} title="Close Maintenance Order">
        <form onSubmit={handleSubmitClose(onSubmitClose)} className="flex flex-col gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
            Verify final cost to complete the repair order. The vehicle status will revert to <strong>Available</strong>, and cost logged.
          </p>

          <Input
            label="Final Invoice Cost ($)"
            type="number"
            error={errorsClose.finalCost}
            {...registerClose('finalCost', {
              required: 'Final cost is required',
              min: { value: 0, message: 'Cannot be negative' }
            })}
          />

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsCloseFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success" size="sm">
              Close Order & Log Invoice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Maintenance;
