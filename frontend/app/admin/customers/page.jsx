'use client';
import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '@/lib/axios';
import toast from 'react-hot-toast';
import { FiSearch, FiTrash2, FiUser } from 'react-icons/fi';

export default function CustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!selectedUserId) return;

    try {
      setDeleting(true);
      await deleteUser(selectedUserId);
      toast.success('User deleted successfully');
      setUsers((prev) => prev.filter((u) => u._id !== selectedUserId));
      setShowDeleteModal(false);
      setSelectedUserId(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedUserId(id);
    setShowDeleteModal(true);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-dark">Customers</h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Manage Registered Users
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-dark transition-all shadow-sm"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="w-full h-64 flex items-center justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 animate-pulse">Loading Users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiUser size={24} className="text-gray-300" />
            </div>
            <h3 className="text-dark font-bold mb-1">No Users Found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest min-w-[250px]">User Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-dark group-hover:text-amber-600 transition-colors">{user.name}</span>
                          <span className="text-xs text-gray-400 font-medium">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${user.role === 'admin'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 font-medium font-serif">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {user.role !== 'admin' ? (
                        <button
                          onClick={() => openDeleteModal(user._id)}
                          className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all"
                          title="Delete User"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      ) : (
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider cursor-not-allowed px-2">
                          Admin
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
          <div className="bg-white w-full max-w-sm rounded-sm shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-serif font-bold text-dark mb-2">Delete User</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to remove this user? <br /><span className="text-rose-500 font-bold">Warning:</span> This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition rounded-sm cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-2.5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-rose-700 transition shadow-lg shadow-rose-200 disabled:opacity-50 cursor-pointer rounded-sm"
              >
                {deleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
