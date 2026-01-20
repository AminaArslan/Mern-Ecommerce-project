'use client';
import { useState, useEffect } from 'react';
import API from '@/lib/axios';
import CategoryForm from '@/componenets/admin/category/categoryForm';
import CategoryTable from '@/componenets/admin/category/categoryTable';

// ---------------- Build nested category tree using parentId ----------------
const buildCategoryTree = (categories) => {
  const map = {};
  const roots = [];

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

  // ---------------- Fetch categories from backend ----------------
  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories/all'); // admin endpoint
      console.log('Fetched categories from backend:', data);

      setCategories(data);

      // Only top-level parents for dropdown
      const parents = data.filter(c => !c.parentId);
      console.log('Top-level parent categories:', parents);
      setParentCategories(parents);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------- Build category map for parent name lookup ----------------
  const categoryMap = categories.reduce((acc, c) => {
    acc[c._id] = c.name;
    return acc;
  }, {});
  console.log('Category map (_id -> name):', categoryMap);

  // ---------------- Delete category ----------------
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- Build nested categories ----------------
  const nestedCategories = buildCategoryTree(categories);
  console.log('Nested category tree:', nestedCategories);

  if (loading)
    return (
      <p className="text-dark text-center mt-12 text-lg animate-pulse">
        Loading categories...
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6 bg-light rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark">Manage Categories</h1>
        <button
          onClick={() => { setEditingCategory(null); setShowForm(true); }}
          className="bg-accent text-light px-4 py-2 rounded hover:bg-dark transition hover:scale-105 cursor-pointer"
        >
          Add Subcategory
        </button>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="mt-4 bg-primary/10 p-4 rounded-lg shadow-inner border border-accent">
          <CategoryForm
            parentCategories={parentCategories} // only top-level parents
            editingCategory={editingCategory}
            onSuccess={() => { setShowForm(false); fetchCategories(); }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Category Table */}
      <div className="overflow-x-auto mt-4 rounded-lg shadow border border-dark">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-secondary text-light">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Parent</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-primary/20 divide-y divide-dark">
            <CategoryTable
              categories={nestedCategories}
              parentMap={categoryMap} // pass map for parent name display
              onEdit={(cat) => { setEditingCategory(cat); setShowForm(true); }}
              onDelete={handleDelete}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
