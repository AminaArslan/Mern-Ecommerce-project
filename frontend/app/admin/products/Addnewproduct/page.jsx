'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { FiUpload, FiX, FiArrowLeft } from 'react-icons/fi';
import Image from 'next/image';

export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]); // all categories
  const [parentCategories, setParentCategories] = useState([]); // only top-level parents
  const [subCategories, setSubCategories] = useState([]); // filtered subcategories
  const [images, setImages] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    parentCategory: '',
    subCategory: '',
    isActive: true,
  });

  // ---------------- Fetch all categories ----------------
  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories/all');
      setCategories(data);

      // Extract top-level categories (no parentId)
      const parents = data.filter(c => !c.parentId && c.isActive);
      setParentCategories(parents);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------- Update subcategories when parent changes ----------------
  useEffect(() => {
    if (!formData.parentCategory) {
      setSubCategories([]);
      setFormData(prev => ({ ...prev, subCategory: '' }));
      return;
    }

    const subs = categories.filter(
      c => c.parentId === formData.parentCategory && c.isActive
    );
    setSubCategories(subs);
    setFormData(prev => ({ ...prev, subCategory: '' }));
  }, [formData.parentCategory, categories]);

  // ---------------- Image change handler ----------------
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setImages(prevImages => {
      const newImages = [...prevImages];
      if (index < 4) {
        newImages[index] = file;
      } else {
        newImages.shift();
        newImages.push(file);
      }
      return newImages;
    });
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
  };


  // ---------------- Submit handler ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      setSubmitting(false);
      return;
    }
    if (!formData.parentCategory) {
      toast.error('Select parent category');
      setSubmitting(false);
      return;
    }
    if (!formData.subCategory) {
      toast.error('Select subcategory');
      setSubmitting(false);
      return;
    }

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('price', formData.price);
    fd.append('quantity', formData.quantity);
    fd.append('category', formData.subCategory);
    fd.append('isActive', formData.isActive);

    images.forEach((img, idx) => {
      if (img) {
        fd.append('images', img);
        fd.append('imageIndexes', idx);
      }
    });

    try {
      await API.post('/products/admin/create', fd);
      toast.success('Product added successfully!');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="w-full h-96 flex items-center justify-center">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 animate-pulse">Loading Form...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white border border-gray-200 rounded-sm text-gray-500 hover:text-dark hover:border-dark transition-colors"
          title="Go Back"
        >
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-dark">Add New Product</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Create Inventory Item</p>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-xl border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Basic Details</h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Product Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="Enter product name..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Description <span className="text-rose-500">*</span></label>
                <textarea
                  placeholder="Enter detailed description..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="4"
                  className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Price (PKR) <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="0.00"
                  value={formData.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  onChange={e => {
                    const value = e.target.value.replace(/,/g, '');
                    if (!isNaN(value)) {
                      setFormData({ ...formData, price: value });
                    }
                  }}
                  required
                  className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Stock Quantity <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Categorization */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Categorization</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Parent Category <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <select
                    value={formData.parentCategory}
                    onChange={e => setFormData({ ...formData, parentCategory: e.target.value })}
                    required
                    className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Select Parent Category</option>
                    {parentCategories.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Subcategory <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <select
                    value={formData.subCategory}
                    onChange={e => setFormData({ ...formData, subCategory: e.target.value })}
                    required
                    disabled={!subCategories.length}
                    className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors appearance-none bg-white disabled:bg-gray-50 cursor-pointer"
                  >
                    <option value="">Select Subcategory</option>
                    {subCategories.map(sc => (
                      <option key={sc._id} value={sc._id}>{sc.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visuals */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Product Visuals</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <label className={`border-2 border-dashed ${img ? 'border-gray-200' : 'border-gray-300 hover:border-amber-400'} rounded-sm h-32 flex flex-col items-center justify-center cursor-pointer relative bg-gray-50 hover:bg-white transition-colors overflow-hidden`}>
                    {img ? (
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <FiUpload className="mx-auto text-gray-400 mb-2" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Upload</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleImageChange(e, idx)}
                    />
                  </label>
                  {img && (
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-white text-rose-500 p-1 rounded-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Availability</h3>
            <div className="relative">
              <select
                value={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="true">Active (Visible in Store)</option>
                <option value="false">Inactive (Hidden Draft)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
            </div>
          </div>


          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition rounded-sm cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-8 py-3 bg-dark text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition shadow-lg shadow-dark/20 disabled:opacity-50 cursor-pointer rounded-sm flex items-center gap-2 ${submitting ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                }`}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Creating...
                </>
              ) : (
                'Create Product'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
