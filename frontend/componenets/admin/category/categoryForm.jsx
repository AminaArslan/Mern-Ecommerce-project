'use client';
import { useState, useEffect } from 'react';
import API from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { FiSave, FiX } from 'react-icons/fi';

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
        toast.success('Category created successfully');
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-sm shadow-xl p-6 mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-dark">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
            {editingCategory ? 'Update existing details' : 'Create a new inventory section'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-dark transition-colors"
        >
          <FiX size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Category Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer Collection"
              className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors"
            />
          </div>

          {/* Parent Dropdown */}
          <div>
            <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Parent Category (Optional)</label>
            <div className="relative">
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="">None (Top Level Category)</option>
                {parentCategories
                  .filter(
                    c => !editingCategory || (c._id !== editingCategory._id && !descendantIds.includes(c._id))
                  )
                  .map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))
                }
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
            </div>
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-sm border border-gray-100 w-fit pr-6">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            id="active"
            className="h-4 w-4 accent-dark cursor-pointer rounded-sm"
          />
          <label htmlFor="active" className="text-sm font-bold text-dark cursor-pointer select-none">Active / Visible</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition rounded-sm cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-2.5 bg-dark text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition shadow-lg shadow-dark/20 disabled:opacity-50 cursor-pointer rounded-sm flex items-center gap-2 ${loading ? 'cursor-not-allowed opacity-70' : ''
              }`}
          >
            {loading ? 'Saving...' : (
              <>
                <FiSave size={14} />
                {editingCategory ? 'Update Category' : 'Save Category'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
