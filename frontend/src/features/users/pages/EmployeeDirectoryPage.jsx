import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, UserPlus, CheckCircle, XCircle, Shield, Building2, Clock, MapPin } from 'lucide-react';
import { DataTable } from '../../../components/common/DataTable.jsx';
import { Badge } from '../../../components/common/Badge.jsx';
import { Button } from '../../../components/common/Button.jsx';
import { Modal } from '../../../components/common/Modal.jsx';
import {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useApproveUserMutation,
  useRejectUserMutation,
  useGetManagersQuery,
  useUpdateRoleMutation,
  useAssignManagerMutation
} from '../usersApi.js';
import { formatDate } from '../../../utils/formatTime.js';
import { ROLES, APPROVAL_STATUS } from '../../../constants/index.js';

export const EmployeeDirectoryPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Role edit modal state
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(ROLES.EMPLOYEE);

  // Supervisor assignment modal state
  const [managerModalUser, setManagerModalUser] = useState(null);
  const [selectedManagerId, setSelectedManagerId] = useState('');

  // Create new user modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.EMPLOYEE,
    department: 'Operations',
    managerId: ''
  });

  const { data: usersRes, isLoading } = useGetAllUsersQuery({
    page,
    limit: 10,
    role: roleFilter,
    approvalStatus: statusFilter,
    search
  });

  const { data: managersRes } = useGetManagersQuery();
  const eligibleManagers = managersRes?.data || [];

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [approveUser, { isLoading: isApproving }] = useApproveUserMutation();
  const [rejectUser, { isLoading: isRejecting }] = useRejectUserMutation();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateRoleMutation();
  const [assignManager, { isLoading: isAssigningManager }] = useAssignManagerMutation();

  const users = usersRes?.data?.users || [];
  const counts = usersRes?.data?.counts || { total: 0, pending: 0, approved: 0, rejected: 0 };
  const pagination = usersRes?.data?.pagination;

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      toast.error('Please enter name, email, and password.');
      return;
    }

    try {
      await createUser({
        ...newUserData,
        managerId: newUserData.managerId || null
      }).unwrap();

      toast.success(`Account for ${newUserData.name} created and activated!`);
      setIsCreateModalOpen(false);
      setNewUserData({
        name: '',
        email: '',
        password: '',
        role: ROLES.EMPLOYEE,
        department: 'Operations',
        managerId: ''
      });
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to create user account');
    }
  };

  const handleApprove = async (user) => {
    try {
      await approveUser(user._id).unwrap();
      toast.success(`Account for ${user.name} approved and activated!`);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to approve user');
    }
  };

  const handleReject = async (user) => {
    try {
      await rejectUser(user._id).unwrap();
      toast.success(`Registration for ${user.name} rejected`);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to reject user');
    }
  };

  const handleUpdateRole = async () => {
    if (!roleModalUser) return;
    try {
      await updateRole({ id: roleModalUser._id, role: selectedRole }).unwrap();
      toast.success(`Role for ${roleModalUser.name} updated to ${selectedRole}`);
      setRoleModalUser(null);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to update role');
    }
  };

  const handleAssignManager = async () => {
    if (!managerModalUser || !selectedManagerId) return;
    try {
      await assignManager({ id: managerModalUser._id, managerId: selectedManagerId }).unwrap();
      toast.success(`Supervisor assigned for ${managerModalUser.name}`);
      setManagerModalUser(null);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to assign supervisor');
    }
  };

  const columns = [
    {
      header: 'Employee Name',
      render: (u) => (
        <div>
          <span className="font-semibold text-xs text-[#1E293B] block">{u.name}</span>
          <span className="text-[11px] text-[#64748B]">{u.email}</span>
        </div>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      cellClassName: 'text-xs text-[#475569]'
    },
    {
      header: 'Role',
      render: (u) => <Badge variant={u.role}>{u.role}</Badge>
    },
    {
      header: 'Account Status',
      render: (u) => {
        const status = u.approvalStatus || 'Approved';
        if (status === 'Approved') {
          return <Badge variant="completed">Active</Badge>;
        }
        if (status === 'Pending') {
          return <Badge variant="pending">Pending Approval</Badge>;
        }
        return <Badge variant="incomplete">Rejected</Badge>;
      }
    },
    {
      header: 'Supervisor',
      render: (u) => (
        <span className="text-xs text-[#1E293B]">
          {u.managerId ? u.managerId.name : <span className="text-[#94A3B8] italic">Unassigned</span>}
        </span>
      )
    },
    {
      header: 'Joined Date',
      accessor: 'createdAt',
      cellClassName: 'font-mono text-xs tabular-nums text-[#64748B]',
      render: (u) => formatDate(u.createdAt)
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (u) => {
        const isPending = u.approvalStatus === 'Pending';

        if (isPending) {
          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="text-[11px] h-7 px-2 text-[#065F46] hover:bg-[#ECFDF5] border border-[#A7F3D0]"
                icon={CheckCircle}
                isLoading={isApproving}
                onClick={() => handleApprove(u)}
              >
                Approve
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[11px] h-7 px-2 text-[#991B1B] hover:bg-[#FEF2F2] border border-[#FECACA]"
                icon={XCircle}
                isLoading={isRejecting}
                onClick={() => handleReject(u)}
              >
                Reject
              </Button>
            </div>
          );
        }

        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              className="text-[11px] h-7 px-2"
              onClick={() => {
                setRoleModalUser(u);
                setSelectedRole(u.role);
              }}
            >
              Role
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="text-[11px] h-7 px-2"
              onClick={() => {
                setManagerModalUser(u);
                setSelectedManagerId(u.managerId?._id || '');
              }}
            >
              Supervisor
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] tracking-tight">
            Employee Directory & Roles
          </h1>
          <p className="text-xs text-[#64748B]">
            System-wide user administration, account approval queue, and supervisor hierarchy
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Link
            to="/settings"
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#1E293B] rounded text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>Geofence Settings</span>
          </Link>
          <Button
            variant="primary"
            size="md"
            icon={UserPlus}
            className="w-full sm:w-auto justify-center"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add New Employee
          </Button>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 border border-[#E2E8F0] rounded-lg">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Users', count: counts.total },
            { id: 'Approved', label: 'Active Staff', count: counts.approved },
            { id: 'Pending', label: 'Pending Approval', count: counts.pending, alert: counts.pending > 0 },
            { id: 'Rejected', label: 'Rejected', count: counts.rejected }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-[#1E293B] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.alert ? (
                <span className="w-4 h-4 rounded-full bg-[#F59E0B] text-white text-[10px] font-bold flex items-center justify-center">
                  {tab.count}
                </span>
              ) : (
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${statusFilter === tab.id ? 'bg-white/20' : 'bg-[#E2E8F0]'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        emptyMessage="No employees found matching the current filters."
        pagination={pagination}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Admin: Create New Employee Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Employee Account"
          subtitle="Admin-created accounts are instantly approved and authorized for login."
          maxWidth="max-w-md"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                placeholder="Jane Smith"
                className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Corporate Email Address
              </label>
              <input
                type="email"
                required
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                placeholder="jsmith@company.com"
                className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Initial Password (min 6 chars)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                  Access Role
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-[#E2E8F0] bg-white text-[#1E293B]"
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
                  value={newUserData.department}
                  onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-[#E2E8F0] bg-white text-[#1E293B]"
                >
                  <option value="Operations">Operations</option>
                  <option value="Field Engineering">Field Engineering</option>
                  <option value="Executive Administration">Administration</option>
                  <option value="Human Resources">HR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Assign Supervisor (Optional)
              </label>
              <select
                value={newUserData.managerId}
                onChange={(e) => setNewUserData({ ...newUserData, managerId: e.target.value })}
                className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] bg-white text-[#1E293B]"
              >
                <option value="">-- No Direct Supervisor --</option>
                {eligibleManagers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.role}) - {m.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(false)} className="w-full sm:w-auto justify-center">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isCreating} className="w-full sm:w-auto justify-center">
                Create & Activate
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Role Change Modal */}
      {roleModalUser && (
        <Modal
          isOpen={Boolean(roleModalUser)}
          onClose={() => setRoleModalUser(null)}
          title={`Update Access Role: ${roleModalUser.name}`}
          subtitle="Modifying role alters system authorization and visibility permissions."
          maxWidth="max-w-sm"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] bg-white text-[#1E293B] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
              >
                <option value={ROLES.EMPLOYEE}>Employee</option>
                <option value={ROLES.MANAGER}>Manager</option>
                <option value={ROLES.ADMIN}>Admin</option>
              </select>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <Button variant="secondary" size="sm" onClick={() => setRoleModalUser(null)} className="w-full sm:w-auto justify-center">
                Cancel
              </Button>
              <Button variant="primary" size="sm" isLoading={isUpdatingRole} onClick={handleUpdateRole} className="w-full sm:w-auto justify-center">
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Assign Supervisor Modal */}
      {managerModalUser && (
        <Modal
          isOpen={Boolean(managerModalUser)}
          onClose={() => setManagerModalUser(null)}
          title={`Assign Supervisor: ${managerModalUser.name}`}
          subtitle="Select the manager responsible for validating shifts and overtime."
          maxWidth="max-w-sm"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                Select Supervisor
              </label>
              <select
                value={selectedManagerId}
                onChange={(e) => setSelectedManagerId(e.target.value)}
                className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] bg-white text-[#1E293B] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
              >
                <option value="">-- Choose Supervisor --</option>
                {eligibleManagers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.role}) - {m.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <Button variant="secondary" size="sm" onClick={() => setManagerModalUser(null)} className="w-full sm:w-auto justify-center">
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!selectedManagerId}
                isLoading={isAssigningManager}
                onClick={handleAssignManager}
                className="w-full sm:w-auto justify-center"
              >
                Assign
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
