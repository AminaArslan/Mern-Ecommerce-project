'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Image from 'next/image';
import EditProductModal from '@/componenets/admin/products/Editproductform';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  // ---------------- Fetch categories ----------------
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/categories/all');
      const activeCategories = data.filter(c => c.isActive);
      setCategories(activeCategories);
      const parents = activeCategories.filter(c => !c.parentId);
      setParentCategories(parents);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Failed to load categories');
    }
  };

  // ---------------- Build category maps ----------------
  const buildCategoryMaps = (cats) => {
    const mapById = {};
    cats.forEach(c => (mapById[c._id] = c));
    return mapById;
  };

  // ---------------- Fetch products ----------------
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data: productsData } = await axios.get('/products/admin/all');
      const categoryMap = buildCategoryMaps(categories);

      const productsWithParent = productsData.map(p => {
        const subCat = categoryMap[p.category?._id];
        const parent = subCat?.parentId ? categoryMap[subCat.parentId] : null;
        return {
          ...p,
          parentName: parent?.name || '-',
          subName: subCat?.name || '-'
        };
      });

      setProducts(productsWithParent);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Initial fetch ----------------
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) fetchProducts();
  }, [categories]);

  // ---------------- Delete product ----------------
  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`/products/admin/delete/${id}`);
      fetchProducts();
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-lg animate-pulse">Loading products...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Manage Products</h1>

      <div className=" rounded-lg shadow border border-dark">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-primary text-light">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Parent Category</th>
              <th className="px-4 py-3 text-left">Subcategory</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-primary divide-y divide-dark">
            {products.map(p => (
              <tr key={p._id} className="hover:bg-secondary/20 transition-all">
                {/* Product Image */}
                <td className="px-4 py-2">
                  {p.images?.length > 0 ? (
                    <div className="w-16 h-16 overflow-hidden rounded">
                      <Image
                        src={p.images[0].url}
                        alt={p.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>

                {/* Product Name with wrap & tooltip */}
                <td className="px-4 py-2 max-w-50 whitespace-normal wrap-break-word relative group">
                  <span className="line-clamp-2">{p.name}</span>
                  <span className="absolute top-1 right-1 text-gray-400 text-sm cursor-pointer group-hover:visible hidden">&#9662;</span>
                  <div className="absolute z-10 bg-white p-2 border rounded shadow-lg w-max max-w-xs invisible group-hover:visible">
                    {p.name}
                  </div>
                </td>

                {/* Price */}
                <td className="px-4 py-2">${p.price}</td>

                {/* Parent Category */}
                <td className="px-4 py-2 max-w-30 truncate" title={p.parentName}>{p.parentName}</td>

                {/* Subcategory */}
                <td className="px-4 py-2 max-w-30 truncate" title={p.subName}>{p.subName}</td>

                {/* Status */}
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${p.isActive ? 'bg-accent text-light' : 'bg-dark text-light'}`}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-2 space-x-2 text-center">
                  <button onClick={() => setEditingProduct(p)} className="bg-accent text-light px-3 py-1 rounded text-sm cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="bg-dark text-light px-3 py-1 rounded text-sm cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          parentCategories={parentCategories}
          onClose={() => setEditingProduct(null)}
          onUpdated={fetchProducts}
        />
      )}
    </div>
  );
}
