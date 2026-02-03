'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '@/lib/axios';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
const [selectedUserId, setSelectedUserId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

const handleDelete = async () => {
  if (!selectedUserId) return;

  console.log("Deleting user with ID:", selectedUserId); // 👈 ADD THIS

  try {
    setDeleting(true);
    await deleteUser(selectedUserId);
    toast.success('User deleted successfully');
    setUsers((prev) => prev.filter((u) => u._id !== selectedUserId));
    setShowModal(false);
    setSelectedUserId(null);
  } catch (err) {
    console.error('Error deleting user:', err.response?.data || err.message);
    alert(err.response?.data?.message || 'Failed to delete user');
  } finally {
    setDeleting(false);
  }
};



  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-dark">Users</h1>

      {loading ? (
        <p className="text-dark text-center py-6 animate-pulse">Loading users...</p>
      ) : error ? (
        <p className="text-dark text-center py-6">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-dark text-center py-6">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md border border-dark/30">
          <table className="min-w-full border-collapse">
            <thead className="bg-secondary text-light">
              <tr>
                <th className="py-3 px-4 border-b border-dark text-left font-medium">Name</th>
                <th className="py-3 px-4 border-b border-dark text-left font-medium">Email</th>
                <th className="py-3 px-4 border-b border-dark text-left font-medium">Role</th>
                <th className="py-3 px-4 border-b border-dark text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="bg-light">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-primary/20 transition-all"
                >
                  <td className="py-3 px-4 border-b border-dark text-dark">{user.name}</td>
                  <td className="py-3 px-4 border-b border-dark text-dark">{user.email}</td>
                  <td className="py-3 px-4 border-b border-dark">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === 'admin'
                          ? 'bg-dark/20 text-dark'
                          : 'bg-accent/20 text-accent'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-dark flex space-x-2">
                    {user.role !== 'admin' ? (
                      <button
                        onClick={() => {
  setSelectedUserId(user._id);
  setShowModal(true);
}}
                        className="px-3 py-1 rounded bg-dark text-light hover:bg-deep transition hover:scale-105 cursor-pointer"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="px-3 py-1 rounded bg-primary/20 text-dark cursor-no-drop">
                        Protected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
    <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6 animate-scaleIn">
      <h2 className="text-xl font-bold text-dark mb-3">Confirm Deletion</h2>
      <p className="text-dark/80 mb-6">
        Are you sure you want to delete this customer? This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 rounded bg-accent text-white  transition disabled:opacity-50 cursor-pointer"
        >
          {deleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
