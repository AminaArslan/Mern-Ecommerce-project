'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '@/lib/axios';

export default function CustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.message || 'Failed to delete user');
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
                        onClick={() => handleDelete(user._id)}
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
    </div>
  );
}
