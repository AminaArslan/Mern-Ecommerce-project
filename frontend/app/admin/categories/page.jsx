'use client';
import { useState, useEffect } from 'react';
import API from '@/lib/axios';
import CategoryForm from '@/componenets/admin/category/categoryForm';
import CategoryTable from '@/componenets/admin/category/categoryTable';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

// ---------------- Build nested category tree using parentId ----------------
const buildCategoryTree = (categories) => {
  const map = {};
  const roots = [];

  // Deep clone to avoid mutating state directly if referenced elsewhere
  categories.forEach((c) => (map[c._id] = { ...c, children: [] }));

  categories.forEach((c) => {
    if (c.parentId) {
      const parent = map[c.parentId];
      if (parent) parent.children.push(map[c._id]);
      else roots.push(map[c._id]); // fallback if parent missing
    } else {
      roots.push(map[c._id]); // top-level parent
    }
  });

  return roots;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openDeleteModal = (id) => {
    setSelectedCategoryId(id);
    setShowDeleteModal(true);
  };

  // ---------------- Fetch categories from backend ----------------
  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories/all');
      setCategories(data);

      // Only top-level parents for dropdown
      const parents = data.filter(c => !c.parentId);
      setParentCategories(parents);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error("Failed to load categories")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------- Delete category ----------------
  const confirmDelete = async () => {
    if (!selectedCategoryId) return;

    try {
      setDeleting(true);
      await API.delete(`/categories/${selectedCategoryId}`);
      toast.success("Category deleted successfully");
      setShowDeleteModal(false);
      setSelectedCategoryId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  // ---------------- Build nested categories ----------------
  const nestedCategories = buildCategoryTree(categories);

  if (loading)
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 animate-pulse">Loading Categories...</p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-dark">Manage Categories</h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Organize Inventory Structure
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => { setEditingCategory(null); setShowForm(true); }}
            className="px-6 py-3 bg-dark text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition shadow-lg shadow-dark/20 rounded-sm flex items-center gap-2 cursor-pointer"
          >
            <FiPlus size={16} />
            Add Category
          </button>
        )}
      </div>

      {/* Category Form - Conditional Render or above Table */}
      {showForm && (
        <CategoryForm
          parentCategories={parentCategories} // only top-level parents
          editingCategory={editingCategory}
          onSuccess={() => { setShowForm(false); fetchCategories(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Category Table */}
      <div className="bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest min-w-[200px]">Category Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parent Group</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <CategoryTable
                categories={nestedCategories}
                onEdit={(cat) => { setEditingCategory(cat); setShowForm(true); }}
                onDelete={openDeleteModal}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
          <div className="bg-white w-full max-w-sm rounded-sm shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-serif font-bold text-dark mb-2">Delete Category</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to remove this category? <br /><span className="text-rose-500 font-bold">Warning:</span> All subcategories may also be affected.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition rounded-sm cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-6 py-2.5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-rose-700 transition shadow-lg shadow-rose-200 disabled:opacity-50 cursor-pointer rounded-sm"
              >
                {deleting ? 'Devouring...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
