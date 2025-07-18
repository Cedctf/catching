import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Crown, 
  Shield, 
  User,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Key,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  Search,
  Filter,
  X
} from 'lucide-react';

export default function TeamManagement({ businessData, onDataUpdate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mock team data
  const teamMembers = [
    {
      id: 'user_001',
      name: 'Ahmad Bin Hassan',
      email: 'ahmad.hassan@techsolutions.com.my',
      phone: '+60 12-345-6789',
      role: 'owner',
      status: 'active',
      lastLogin: '2024-01-20T14:30:00Z',
      joinedDate: '2024-01-01',
      permissions: ['all'],
      avatar: null
    },
    {
      id: 'user_002',
      name: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@techsolutions.com.my',
      phone: '+60 12-987-6543',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-01-20T13:15:00Z',
      joinedDate: '2024-01-05',
      permissions: ['invoicing', 'payments', 'analytics'],
      avatar: null
    },
    {
      id: 'user_003',
      name: 'Lim Wei Ming',
      email: 'lim.weiming@techsolutions.com.my',
      phone: '+60 12-456-7890',
      role: 'clerk',
      status: 'active',
      lastLogin: '2024-01-20T11:45:00Z',
      joinedDate: '2024-01-10',
      permissions: ['invoicing'],
      avatar: null
    },
    {
      id: 'user_004',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@techsolutions.com.my',
      phone: '+60 12-765-4321',
      role: 'clerk',
      status: 'inactive',
      lastLogin: '2024-01-18T16:20:00Z',
      joinedDate: '2024-01-15',
      permissions: ['analytics'],
      avatar: null
    }
  ];

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'clerk',
    permissions: []
  });

  const roleConfig = {
    owner: {
      label: 'Owner',
      icon: Crown,
      color: 'text-yellow-600 bg-yellow-100',
      description: 'Full access to all features and settings',
      permissions: ['all']
    },
    manager: {
      label: 'Manager',
      icon: Shield,
      color: 'text-blue-600 bg-blue-100',
      description: 'Access to most features except sensitive settings',
      permissions: ['invoicing', 'payments', 'analytics', 'team_view']
    },
    clerk: {
      label: 'Clerk',
      icon: User,
      color: 'text-green-600 bg-green-100',
      description: 'Limited access to specific features',
      permissions: ['invoicing']
    }
  };

  const availablePermissions = [
    { id: 'invoicing', label: 'Invoicing', description: 'Create and manage invoices' },
    { id: 'payments', label: 'Payments', description: 'View and manage payments' },
    { id: 'analytics', label: 'Analytics', description: 'View business analytics' },
    { id: 'team_view', label: 'Team View', description: 'View team members' },
    { id: 'team_manage', label: 'Team Management', description: 'Add and remove team members' },
    { id: 'settings', label: 'Settings', description: 'Manage business settings' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'inactive': return 'bg-red-100 text-red-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    console.log('Adding user:', newUser);
    setShowAddUserModal(false);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'clerk',
      permissions: []
    });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log('Deleting user:', selectedUser);
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600">Manage your team members and their permissions</p>
        </div>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Team Member
        </button>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.filter(m => m.status === 'active').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Crown className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Owners</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.filter(m => m.role === 'owner').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Managers</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.filter(m => m.role === 'manager').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="owner">Owner</option>
            <option value="manager">Manager</option>
            <option value="clerk">Clerk</option>
          </select>
        </div>
      </motion.div>

      {/* Team Members List */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Members</h3>
          <div className="space-y-4">
            {filteredMembers.map((member) => {
              const roleInfo = roleConfig[member.role];
              const RoleIcon = roleInfo.icon;
              
              return (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#002fa7] rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                          <RoleIcon className="h-3 w-3" />
                          {roleInfo.label}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <p className="text-sm text-gray-500">
                        Last login: {formatDateTime(member.lastLogin)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {getStatusIcon(member.status)}
                        <span className="capitalize">{member.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Joined: {formatDate(member.joinedDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditUser(member)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      {member.role !== 'owner' && (
                        <button
                          onClick={() => handleDeleteUser(member)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Role Permissions Guide */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Role Permissions</h3>
          <div className="space-y-4">
            {Object.entries(roleConfig).map(([role, config]) => {
              const Icon = config.icon;
              return (
                <div key={role} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{config.label}</h4>
                      <p className="text-sm text-gray-600">{config.description}</p>
                    </div>
                  </div>
                  <div className="ml-10">
                    <p className="text-sm text-gray-600 mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-2">
                      {config.permissions.map(perm => (
                        <span key={perm} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {perm === 'all' ? 'All Permissions' : perm.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add Team Member</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                  >
                    <option value="clerk">Clerk</option>
                    <option value="manager">Manager</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Remove Team Member</h3>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="text-center">
                <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <UserMinus className="h-8 w-8 text-red-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Remove {selectedUser.name}?</h4>
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. {selectedUser.name} will lose access to the dashboard immediately.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Remove Member
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 