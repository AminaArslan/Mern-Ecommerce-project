'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { FiX, FiUpload, FiTrash } from 'react-icons/fi';

export default function EditProductModal({ product, categories, parentCategories, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    parentCategoryId: '',
    subCategoryId: '',
    isActive: true,
  });

  const [subCategories, setSubCategories] = useState([]);
  const [images, setImages] = useState([null, null, null, null]);
  const [removedImages, setRemovedImages] = useState([]);
  const [updating, setUpdating] = useState(false);

  // ---------------- Initialize form ----------------
  useEffect(() => {
    if (!product || !categories.length) return;

    // Handle both populated object and direct ID
    const categoryId = product.category?._id || product.category;

    const subCat = categories.find(c => c._id === categoryId);
    // If not found in active categories, maybe it's inactive? 
    // But we only have active ones passed in. 
    // Ideally we should show it even if inactive, but for now let's stick to what we have.

    const parentCat = subCat?.parentId
      ? categories.find(c => c._id === subCat.parentId)
      : null;

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity || 0,
      parentCategoryId: parentCat?._id || '',
      subCategoryId: subCat?._id || '',
      isActive: product.isActive,
    });

    if (parentCat) {
      const filteredSubs = categories.filter(c => c.parentId === parentCat._id && c.isActive);
      setSubCategories(filteredSubs);
    }

    const imgArr = [null, null, null, null];
    (product.images || []).slice(0, 4).forEach((img, idx) => (imgArr[idx] = img));
    setImages(imgArr);
  }, [product, categories]);

  // ---------------- Parent category change (User Interaction) ----------------
  // We use a flag or check if the parentId actually changed from the initialized value to avoid resetting on init.
  // Actually, simpler: Only clear subCategory if the current subCategory is NOT valid for the new parent.
  useEffect(() => {
    if (!formData.parentCategoryId) {
      setSubCategories([]);
      // Only clear if it was set
      if (formData.subCategoryId) {
        setFormData(prev => ({ ...prev, subCategoryId: '' }));
      }
      return;
    }

    const filteredSubs = categories.filter(
      c => c.parentId === formData.parentCategoryId && c.isActive
    );
    setSubCategories(filteredSubs);

    // If the currently selected subCategory is NOT in the new list, clear it.
    // However, during initialization, the state might not be synced yet if batched? 
    // But useEffect runs after render. If parentId matches, subId should be in list.

    // Safety check: don't clear if it's already valid (which happens on init)
    const isValid = filteredSubs.some(c => c._id === formData.subCategoryId);
    if (formData.subCategoryId && !isValid) {
      setFormData(prev => ({ ...prev, subCategoryId: '' }));
    }
  }, [formData.parentCategoryId, categories]); // Removed formData.subCategoryId from deps to avoid loops, though it wasn't there.

  // ---------------- Image change ----------------
  const handleImageChange = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;

    setImages(prevImages => {
      const newImages = [...prevImages];
      if (newImages[idx] && newImages[idx].public_id) {
        setRemovedImages(prev => [...prev, newImages[idx].public_id]);
      }
      newImages[idx] = file;
      return newImages;
    });
  };

  const removeImage = (idx) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      if (newImages[idx] && newImages[idx].public_id) {
        setRemovedImages(prev => [...prev, newImages[idx].public_id]);
      }
      newImages[idx] = null;
      return newImages;
    });
  }


  // ---------------- Submit ----------------
  const handleSubmit = async e => {
    e.preventDefault();
    setUpdating(true);

    if (!formData.parentCategoryId || !formData.subCategoryId) {
      setUpdating(false);
      return toast.error('Please select both category levels');
    }


    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('price', formData.price);
    fd.append('quantity', formData.quantity);
    fd.append('category', formData.subCategoryId);
    fd.append('isActive', formData.isActive ? 'true' : 'false');
    fd.append('removedImages', JSON.stringify(removedImages.filter(id => id)));


    // Send new images with their slot index
    images.forEach((img, index) => {
      if (img instanceof File) {
        fd.append('images', img);
        fd.append('imageIndexes', index);
      }
    });

    try {
      await axios.put(`/products/admin/update/${product._id}`, fd);
      toast.success('Product updated successfully');
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-serif font-bold text-dark">Edit Product</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Update Inventory Details</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-dark transition cursor-pointer">
            <FiX size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name..."
                  className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description..."
                  rows="4"
                  className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Price (PKR)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Stock Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors"
                  required
                />
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Parent Category</label>
                <div className="relative">
                  <select
                    value={formData.parentCategoryId}
                    onChange={e => setFormData({ ...formData, parentCategoryId: e.target.value })}
                    className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">Select Parent</option>
                    {parentCategories.filter(c => c.isActive).map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Subcategory</label>
                <div className="relative">
                  <select
                    value={formData.subCategoryId}
                    onChange={e => setFormData({ ...formData, subCategoryId: e.target.value })}
                    disabled={!subCategories.length}
                    className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors appearance-none bg-white disabled:bg-gray-50 cursor-pointer"
                    required
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

            {/* Images */}
            <div>
              <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-3">Product Images (Max 4)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <label className={`border-2 border-dashed ${img ? 'border-gray-200' : 'border-gray-300 hover:border-amber-400'} rounded-sm h-32 flex flex-col items-center justify-center cursor-pointer relative bg-gray-50 hover:bg-white transition-colors overflow-hidden`}>
                      {img ? (
                        img.url ? (
                          <Image src={img.url} alt="" fill className="object-cover" />
                        ) : (
                          <Image src={URL.createObjectURL(img)} alt="" fill className="object-cover" />
                        )
                      ) : (
                        <div className="text-center p-2">
                          <FiUpload className="mx-auto text-gray-400 mb-2" />
                          <span className="text-[9px] font-bold text-gray-400 uppercase">Upload</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" hidden onChange={e => handleImageChange(e, idx)} />
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
            <div>
              <label className="text-[11px] font-bold text-dark uppercase tracking-wider block mb-2">Visibility Status</label>
              <div className="relative">
                <select
                  value={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:outline-none focus:border-dark transition-colors appearance-none bg-white cursor-pointer"
                >
                  <option value="true">Active (Visible)</option>
                  <option value="false">Hidden (Draft)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition rounded-sm cursor-pointer">
            Discard
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`px-6 py-2.5 bg-dark text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition shadow-lg shadow-dark/20 disabled:opacity-50 cursor-pointer rounded-sm flex items-center gap-2 ${updating ? 'cursor-not-allowed opacity-70' : ''
              }`}
            disabled={updating}
          >
            {updating ? (
              <>
                <span className="w-3 h-3 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                <span>Saving...</span>
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
