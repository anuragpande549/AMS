import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Building2, User, Mail, Lock, CheckCircle2, Clock } from 'lucide-react';
import { useRegisterMutation } from '../authApi.js';
import { Button } from '../../../components/common/Button.jsx';
import { ROLES } from '../../../constants/index.js';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.EMPLOYEE);
  const [department, setDepartment] = useState('Operations');
  const [isSuccessSubmitted, setIsSuccessSubmitted] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const res = await register({
        name,
        email,
        password,
        role,
        department
      }).unwrap();

      toast.success(res.message || 'Registration submitted for administrator approval!');
      setIsSuccessSubmitted(true);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-lg bg-[#1E293B] text-white flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6 text-[#3B82F6]" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#1E293B]">
          Register New Account
        </h2>
        <p className="mt-1 text-center text-xs text-[#64748B]">
          Join the enterprise attendance tracking and compliance network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 border border-[#E2E8F0] rounded-lg shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
          {isSuccessSubmitted ? (
            /* Pending Admin Approval Confirmation Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  Registration Pending Approval
                </h3>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Your account has been registered for <span className="font-semibold text-[#1E293B]">{email}</span>. An administrator must review and approve your profile before you can access the command center.
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[11px] text-[#475569] text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Name:</span>
                  <span className="font-medium text-[#1E293B]">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Role:</span>
                  <span className="font-medium text-[#1E293B] capitalize">{role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Status:</span>
                  <span className="font-medium text-[#D97706]">Pending Admin Review</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Go to Sign In Screen
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                  Full Legal Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none text-[#1E293B]"
                  />
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                </div>
              </div>

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
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none text-[#1E293B]"
                  />
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                    Access Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full py-2 px-3 text-sm rounded border border-[#E2E8F0] bg-white text-[#1E293B] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none"
                  >
                    <option value={ROLES.EMPLOYEE}>Employee</option>
                    <option value={ROLES.MANAGER}>Manager</option>
                    <option value={ROLES.ADMIN}>Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full py-2 px-3 text-sm rounded border border-[#E2E8F0] bg-white text-[#1E293B] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Field Support">Field Support</option>
                    <option value="Human Resources">HR</option>
                    <option value="Executive Administration">Administration</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 bg-[#FFFBEB] border border-[#FDE68A] rounded text-[11px] text-[#92400E] flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-[#D97706]" />
                <span>Accounts require Administrator approval before first login.</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Submit Registration
              </Button>

              <div className="text-center text-xs text-[#64748B] pt-4 border-t border-[#E2E8F0]">
                Already have an approved account?{' '}
                <Link to="/login" className="text-[#3B82F6] hover:underline font-semibold">
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
