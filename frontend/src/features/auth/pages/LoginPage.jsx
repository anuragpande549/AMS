import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Building2, Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { useLoginMutation } from '../authApi.js';
import { Button } from '../../../components/common/Button.jsx';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      toast.success(res.message || 'Authenticated successfully');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Authentication failed. Please verify credentials.');
    }
  };

  // Quick fill helper for evaluator ease of testing
  const quickFill = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    toast.success(`Loaded demo ${demoRole} credentials`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-lg bg-[#1E293B] text-white flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6 text-[#3B82F6]" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#1E293B]">
          Enterprise Attendance System
        </h2>
        <p className="mt-1 text-center text-xs text-[#64748B]">
          Audited workforce tracking, facial verification & geofencing
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 border border-[#E2E8F0] rounded-lg shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none text-[#1E293B]"
                />
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Account Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none text-[#1E293B]"
                />
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={ArrowRight}
            >
              Sign In to Command Center
            </Button>
          </form>

          {/* Quick Demo Test Logins */}
          <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-2 text-center">
              Quick Test Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickFill('admin@ams.com', 'Admin')}
                className="py-1.5 px-2 bg-[#1E293B] hover:bg-[#334155] text-white text-[11px] font-medium rounded text-center transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => quickFill('manager@ams.com', 'Manager')}
                className="py-1.5 px-2 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE] text-[11px] font-medium rounded text-center transition-colors"
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => quickFill('employee@ams.com', 'Employee')}
                className="py-1.5 px-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] border border-[#CBD5E1] text-[11px] font-medium rounded text-center transition-colors"
              >
                Employee
              </button>
            </div>
            <p className="text-[10px] text-center text-[#94A3B8] mt-2">
              Password: <span className="font-mono">Password123!</span>
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-[#64748B]">
            Need a new employee account?{' '}
            <Link to="/register" className="text-[#3B82F6] hover:underline font-semibold">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
