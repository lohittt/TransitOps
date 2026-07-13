import React from 'react';
import { useMockData } from '../context/MockDataContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

export const Profile = () => {
  const { currentUser, addToast } = useMockData();

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Profile configuration and preferences updated successfully.', 'success');
  };

  const languageOptions = [
    { value: 'en', label: 'English (United States)' },
    { value: 'es', label: 'Spanish (Español)' },
    { value: 'de', label: 'German (Deutsch)' },
    { value: 'fr', label: 'French (Français)' }
  ];

  const regionOptions = [
    { value: 'North', label: 'North Hub (Main terminal)' },
    { value: 'South', label: 'South Hub' },
    { value: 'East', label: 'East Hub' },
    { value: 'West', label: 'West Hub' }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      {/* Header Info */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Operator Profile</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage account details, active permission role, and regional configurations</p>
      </div>

      <form onSubmit={handleSave}>
        <Card className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-100 dark:border-slate-800/80 pb-6">
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser?.name}
                className="w-20 h-20 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="absolute bottom-0 right-0 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" title="Active Session" />
            </div>
            <div className="flex flex-col text-center sm:text-left gap-1">
              <h3 className="text-lg font-bold text-slate-850 dark:text-white">{currentUser?.name || 'Operator'}</h3>
              <span className="text-xs text-slate-550 dark:text-slate-400">{currentUser?.email || 'operator@transitops.com'}</span>
              <div className="mt-2 flex items-center justify-center sm:justify-start gap-1.5">
                <Badge variant="primary">{currentUser?.role || 'Fleet Operator'}</Badge>
                <Badge variant="secondary">Active operator</Badge>
              </div>
            </div>
          </div>

          {/* Credentials Grid */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-550 uppercase tracking-widest">
              Account parameters
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={currentUser?.name || ''}
                disabled
                className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200/60 text-slate-500 cursor-not-allowed"
              />
              <Input
                label="Account Email Address"
                value={currentUser?.email || ''}
                disabled
                className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200/60 text-slate-500 cursor-not-allowed"
              />
              <Input
                label="Assigned Operational Role"
                value={currentUser?.role || ''}
                disabled
                className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200/60 text-slate-500 cursor-not-allowed md:col-span-2"
              />
            </div>
          </div>

          {/* Preferences Grid */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-555 uppercase tracking-widest">
              Regional Parameters
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Operating Language"
                options={languageOptions}
                defaultValue="en"
              />
              <Select
                label="Primary Hub Region"
                options={regionOptions}
                defaultValue="North"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" type="button">
              Reset Preferences
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Configuration
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default Profile;
