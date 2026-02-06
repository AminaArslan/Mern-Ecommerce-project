'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Image from 'next/image';
import EditProductModal from '@/componenets/admin/products/Editproductform';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import { FaCircle } from 'react-icons/fa';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
  const openDeleteModal = (id) => {
    setSelectedProductId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProductId) return;

    try {
      setDeleting(true);
      await axios.delete(`/products/admin/delete/${selectedProductId}`);
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
      setSelectedProductId(null);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 animate-pulse">Loading Products...</p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-dark">Manage Products</h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Inventory Overview
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest min-w-15">Image</th>
                <th className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest min-w-37.5">Product Name</th>
                <th className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subcategory</th>
                <th className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map(p => (
                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                  {/* Product Image */}
                  <td className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4">
                    {p.images?.length > 0 ? (
                      <div className="w-10 h-10 lg:w-12 lg:h-12 overflow-hidden rounded-sm border border-gray-100
                       relative shadow-sm group-hover:scale-105 transition-transform">
                        <Image
                          src={p.images[0].url}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-sm flex items-center 
                      justify-center text-[9px] text-gray-400 uppercase">No Img</div>
                    )}
                  </td>

                  {/* Product Name */}
                  <td className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4 max-w-xs">
                    <p className="text-sm font-bold text-dark truncate group-hover:text-amber-600 transition-colors" title={p.name}>{p.name}</p>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4">
                    <span className="font-serif font-bold text-dark text-sm">Rs.{Number(p.price).toLocaleString("en-IN")}</span>
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4">
                    <span className={`text-xs font-bold ${p.quantity > 0 ? 'text-gray-600' : 'text-rose-500'}`}>
                      {p.quantity > 0 ? p.quantity : 'Out of Stock'}
                    </span>
                  </td>

                  {/* Parent Category */}
                  <td className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4 text-xs font-medium text-gray-500">{p.parentName}</td>

                  {/* Subcategory */}
                  <td className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4 text-xs font-medium text-gray-500">{p.subName}</td>

                  {/* Status */}
                  <td className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4">
                    <span
                      className={`flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase 
                        tracking-wider w-fit border ${p.isActive
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                    >
                      <FaCircle className="text-[5px]" />
                      {p.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 lg:px-4 lg:py-3 xl:px-6 xl:py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-sm transition-all cursor-pointer"
                        title="Edit Product"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(p._id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all cursor-pointer"
                        title="Delete Product"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400 text-xs uppercase tracking-widest">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
          <div className="bg-white w-full max-w-sm rounded-sm shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-serif font-bold text-dark mb-2">Delete Product</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to remove this product from the inventory? This action is irreversible.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition 
                rounded-sm cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-6 py-2.5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-rose-700
                 transition shadow-lg shadow-rose-200 disabled:opacity-50 cursor-pointer rounded-sm "
              >
                {deleting ? 'Removing...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
