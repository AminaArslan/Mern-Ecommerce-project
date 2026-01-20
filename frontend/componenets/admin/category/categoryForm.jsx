'use client';
import { useState, useEffect } from 'react';
import API from '@/lib/axios';
import { toast } from 'react-hot-toast';

export default function CategoryForm({
  parentCategories = [],
  editingCategory = null,
  onSuccess,
  onCancel
}) {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [descendantIds, setDescendantIds] = useState([]);

  // ---------------- Initialize form ----------------
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setParentId(editingCategory.parentId || '');
      setIsActive(editingCategory.isActive);

      // Collect all descendant IDs to prevent selecting as parent
      const getDescendants = (cat) => {
        let ids = [];
        if (cat.children && cat.children.length > 0) {
          cat.children.forEach((child) => {
            ids.push(child._id);
            ids = ids.concat(getDescendants(child));
          });
        }
        return ids;
      };
      setDescendantIds(getDescendants(editingCategory));
    } else {
      setName('');
      setParentId('');
      setIsActive(true);
      setDescendantIds([]);
    }
  }, [editingCategory]);

  // ---------------- Submit handler ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Category name is required');

    setLoading(true);
    try {
      const payload = { name, parentId: parentId || null, isActive };
      if (editingCategory) {
        await API.put(`/categories/${editingCategory._id}`, payload);
        toast.success('Category updated successfully');
      } else {
        await API.post('/categories', payload);
        toast.success('Subcategory created successfully');
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="bg-primary/10 border border-accent rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-2xl font-bold text-dark mb-6">
        {editingCategory ? 'Edit Category' : 'Add Subcategory'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-2 font-medium text-dark">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            className="w-full border border-dark rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Parent Dropdown */}
        <div>
          <label className="block mb-2 font-medium text-dark">Parent Category</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full border border-dark rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Select Parent Category</option>
            {parentCategories
              .filter(
                c => !editingCategory || (c._id !== editingCategory._id && !descendantIds.includes(c._id))
              )
              .map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))
            }
          </select>
        </div>

        {/* Active */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            id="active"
            className="h-5 w-5 accent-accent cursor-pointer "
          />
          <label htmlFor="active" className="font-medium text-dark">Active</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded text-light ${loading ? 'bg-gray-400' : 'bg-accent hover:bg-dark'} transition cursor-pointer`}
          >
            {editingCategory ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded border border-dark text-dark hover:bg-primary/20 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
