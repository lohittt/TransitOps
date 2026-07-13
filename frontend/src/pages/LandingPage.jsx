import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ShinyText from '../components/reactbits/ShinyText';
import Iridescence from '../components/reactbits/Iridescence';
import BlurText from '../components/reactbits/BlurText';
import ShinyButton from '../components/reactbits/ShinyButton';
import logoImg from '../images/logo.png';
import { 
  FiTruck, 
  FiUsers, 
  FiMapPin, 
  FiTool, 
  FiDollarSign, 
  FiPieChart, 
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiZap
} from 'react-icons/fi';

export const LandingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: FiTruck,
      title: 'Fleet Asset Registry',
      desc: 'Register and view vehicle assets (Vans, Heavy Trucks, Semi-Trailers, Pickups) with capacity boundaries, real-time status trackers, and odometer loggers.',
      color: 'text-blue-600 bg-blue-500/10'
    },
    {
      icon: FiUsers,
      title: 'Driver Profiles & Licensing',
      desc: 'Log crew contact info, track license classifications and expiry dates, and monitor safety scoring to enforce scheduling compliance.',
      color: 'text-emerald-600 bg-emerald-500/10'
    },
    {
      icon: FiMapPin,
      title: 'Trip Dispatch Routing',
      desc: 'Create trip drafts, perform cargo load validation limits, select active drivers, and dispatch routes with automatic status transitions.',
      color: 'text-indigo-600 bg-indigo-500/10'
    },
    {
      icon: FiTool,
      title: 'Workshop Maintenance',
      desc: 'Schedule vehicle repairs with work order logs and cost tracking. Placing vehicles in shop automatically deactivates them from dispatch lists.',
      color: 'text-amber-600 bg-amber-500/10'
    },
    {
      icon: FiDollarSign,
      title: 'Fuel Consumption Logs',
      desc: 'Record fuel refill events, liters pumped, and fuel invoice costs to track usage and fuel expenditures.',
      color: 'text-rose-600 bg-rose-500/10'
    },
    {
      icon: FiPieChart,
      title: 'Operational Expenses Ledger',
      desc: 'Track ancillary transit bills (tolls, lodging, parts, repairs, and miscellaneous fees) linked to specific fleet vehicles.',
      color: 'text-purple-600 bg-purple-500/10'
    }
  ];

  return (
    <div className="landing-page-root min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden relative select-none">
      {/* Iridescent background shader (Light Mode Full Spectrum) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <Iridescence color={[1.0, 1.0, 1.0]} speed={0.25} amplitude={0.04} mouseReact={true} />
      </div>

      {/* Header navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-200/60 bg-white/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="TransitOps Logo" className="h-8.5 w-8.5 object-contain shrink-0" />
          <span className="font-extrabold text-lg tracking-tight text-slate-900">TransitOps</span>
        </div>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <Link to="/portal">
              <ShinyButton size="sm">Get Started</ShinyButton>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link to="/register">
                <ShinyButton size="sm">Get Started</ShinyButton>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl text-center text-slate-900">
          <BlurText text="Revolutionize Your" className="text-slate-900 inline" />{' '}
          <span 
            className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-no-repeat bg-clip-text text-transparent font-black inline-block"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 5s linear infinite',
            }}
          >
            Transit Operations
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-base text-slate-600 max-w-2xl font-medium leading-relaxed">
          Centralize your transportation assets, log refuels and workshop invoices, audit compliance alerts, and manage role-based dispatching routing—all on one intelligent platform.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link to="/register">
            <ShinyButton className="px-8 py-3 text-sm font-bold flex items-center gap-2 group">
              <span>Get Started</span>
              <FiArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </ShinyButton>
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-200">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Modules & Capability</span>
          <p className="text-xs text-slate-550 mt-2 max-w-lg mx-auto leading-relaxed">
            A comprehensive suite of transport management modules designed to enforce business rules and automate dispatch workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index}
                className="p-6 border border-slate-200/70 bg-white/75 backdrop-blur-md shadow-sm rounded-2xl flex flex-col gap-4 text-left hover:shadow-md hover:border-slate-300/80 transition-all duration-300"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${feat.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-bold text-sm text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RBAC details section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-slate-200 bg-white/40 backdrop-blur-md rounded-3xl mb-20 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Enterprise Compliance</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Role-Based Access Control (RBAC) Built In
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              TransitOps enforces custom operational bounds for different organization roles, guaranteeing data integrity and safety:
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-start gap-2.5">
                <FiCheckCircle className="text-blue-600 mt-0.5 shrink-0" size={14} />
                <span className="text-xs text-slate-700 font-medium"><strong className="text-slate-900">Fleet Managers</strong> hold full inventory authority over vehicle assets and technician schedules.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <FiCheckCircle className="text-blue-600 mt-0.5 shrink-0" size={14} />
                <span className="text-xs text-slate-700 font-medium"><strong className="text-slate-900">Dispatchers</strong> focus strictly on trip routing, payload weight validation, and active tracking.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <FiCheckCircle className="text-blue-600 mt-0.5 shrink-0" size={14} />
                <span className="text-xs text-slate-700 font-medium"><strong className="text-slate-900">Safety Officers</strong> verify driver licensing dates, review safety scores, and inspect compliance alerts.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <FiCheckCircle className="text-blue-600 mt-0.5 shrink-0" size={14} />
                <span className="text-xs text-slate-700 font-medium"><strong className="text-slate-900">Financial Analysts</strong> review refuel invoices, calculate cumulative repair trends, and audit ancillary tolls ledger.</span>
              </div>
            </div>
          </div>

          {/* Graphical display */}
          <div className="border border-slate-205 bg-white/70 backdrop-blur-md p-8 rounded-2xl flex flex-col gap-6 shadow-md relative">
            <div className="absolute top-4 right-4 flex items-center gap-1 text-slate-400">
              <FiLock size={12} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Secured Access</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Test Sessions</span>
            </div>
            <div className="flex flex-col gap-4 text-xs font-semibold">
              <div className="p-3 bg-slate-50/50 border border-slate-200 rounded-lg flex justify-between items-center">
                <span className="text-slate-700">Fleet Manager View</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">All Paths Allowed</span>
              </div>
              <div className="p-3 bg-slate-50/50 border border-slate-200 rounded-lg flex justify-between items-center">
                <span className="text-slate-700">Dispatcher View</span>
                <span className="text-[10px] text-blue-600 font-bold bg-blue-500/10 px-2 py-0.5 rounded">Trips & Vehicles only</span>
              </div>
              <div className="p-3 bg-slate-50/50 border border-slate-200 rounded-lg flex justify-between items-center">
                <span className="text-slate-700">Safety View</span>
                <span className="text-[10px] text-indigo-600 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">Drivers & Active Logs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-200 py-8 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <span>&copy; 2026 TransitOps. Smart Transport Operations Platform.</span>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-blue-600 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-blue-600 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
