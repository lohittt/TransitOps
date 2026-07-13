import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import ShinyText from '../components/reactbits/ShinyText';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import Iridescence from '../components/reactbits/Iridescence';
import BlurText from '../components/reactbits/BlurText';
import ShinyButton from '../components/reactbits/ShinyButton';
import logoImg from '../images/logo.png';

export const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'Fleet Manager',
    }
  });

  const onSubmit = async (data) => {
    const success = await registerUser(data.name, data.email, data.password, data.role);
    if (success) {
      navigate('/portal');
    }
  };

  const roleOptions = [
    { value: 'Fleet Manager', label: 'Fleet Manager' },
    { value: 'Dispatcher', label: 'Dispatcher' },
    { value: 'Safety Officer', label: 'Safety Officer' },
    { value: 'Financial Analyst', label: 'Financial Analyst' }
  ];

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-slate-900 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-955 to-slate-955 px-6 py-12 select-none relative overflow-hidden z-0">
      {/* Background WebGL shader backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <Iridescence color={[0.0, 0.85, 1.0]} speed={0.3} amplitude={0.05} mouseReact={true} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <img src={logoImg} alt="TransitOps Logo" className="h-11 w-11 object-contain mb-3 select-none" />
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            <BlurText text="Register on" className="text-white" />
            <ShinyText text="TransitOps" speed={6} className="font-extrabold text-xl" />
          </h2>
          <p className="mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Create Operational Profile
          </p>
        </div>

        {/* Register Form Container */}
        <SpotlightCard className="w-full p-8 border border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-xl rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Full Display Name"
              type="text"
              placeholder="e.g. Alex Johnson"
              className="bg-slate-950 border-slate-800 text-white focus:border-blue-500 placeholder-slate-600 focus:ring-1 focus:ring-blue-500"
              error={errors.name}
              {...register('name', { required: 'Name is required' })}
            />

            <Input
              label="Work Email Address"
              type="email"
              placeholder="name@transitops.com"
              className="bg-slate-950 border-slate-800 text-white focus:border-blue-500 placeholder-slate-600 focus:ring-1 focus:ring-blue-500"
              error={errors.email}
              {...register('email', { required: 'Email address is required' })}
            />

            <Input
              label="Security Password"
              type="password"
              placeholder="••••••••"
              className="bg-slate-950 border-slate-800 text-white focus:border-blue-500 placeholder-slate-600 focus:ring-1 focus:ring-blue-500"
              error={errors.password}
              {...register('password', { required: 'Password is required' })}
            />

            <Select
              label="Operational Role (RBAC)"
              options={roleOptions}
              className="bg-slate-950 border-slate-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              {...register('role')}
            />

            <ShinyButton
              type="submit"
              className="w-full mt-2 py-2.5 font-bold shadow-lg shadow-blue-600/10"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </ShinyButton>
          </form>

          {/* Connection back to Login */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <span className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                Sign In
              </Link>
            </span>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default Register;
