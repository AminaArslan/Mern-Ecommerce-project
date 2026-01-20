'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

export default function EditProductModal({ product, categories, parentCategories, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    parentCategoryId: '',
    subCategoryId: '',
    isActive: true,
  });

  const [subCategories, setSubCategories] = useState([]);
  const [images, setImages] = useState([null, null, null, null]);

  // ---------------- Initialize form ----------------
  useEffect(() => {
    if (!product || !categories.length) return;

    // Find active subcategory
    const subCat = categories.find(c => c._id === product.category?._id && c.isActive);

    // Determine parent category (active)
    const parentCat = subCat?.parentId
      ? categories.find(c => c._id === subCat.parentId && c.isActive)
      : null;

    // Set form data
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      parentCategoryId: parentCat?._id || '',
      subCategoryId: subCat?._id || '',
      isActive: product.isActive,
    });

    // Populate subcategories for this parent
    const filteredSubs = parentCat
      ? categories.filter(c => c.parentId === parentCat._id && c.isActive)
      : [];
    setSubCategories(filteredSubs);

    // Set images
    const imgArr = [null, null, null, null];
    (product.images || []).slice(0, 4).forEach((img, idx) => (imgArr[idx] = img));
    setImages(imgArr);
  }, [product, categories]);

  // ---------------- Update subcategories when parent changes ----------------
  useEffect(() => {
    if (!formData.parentCategoryId) {
      setSubCategories([]);
      setFormData(prev => ({ ...prev, subCategoryId: '' }));
      return;
    }

    const filteredSubs = categories.filter(
      c => c.parentId === formData.parentCategoryId && c.isActive
    );
    setSubCategories(filteredSubs);

    // Reset subcategory only if it doesn't belong to the new parent
    if (!filteredSubs.some(c => c._id === formData.subCategoryId)) {
      setFormData(prev => ({ ...prev, subCategoryId: '' }));
    }
  }, [formData.parentCategoryId, categories]);

  // ---------------- Image change ----------------
  const handleImageChange = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const updatedImages = [...images];
    updatedImages[idx] = file;
    setImages(updatedImages);
  };

  // ---------------- Submit ----------------
  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.parentCategoryId || !formData.subCategoryId) {
      return toast.error('Please select parent and subcategory');
    }

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('price', formData.price);
    fd.append('category', formData.subCategoryId); // backend expects subcategory id
    fd.append('isActive', formData.isActive);

    images.forEach(img => {
      if (img instanceof File) fd.append('images', img);
    });

    try {
      await axios.put(`/products/admin/update/${product._id}`, fd);
      toast.success('Product updated successfully');
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4 text-dark text-center">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Product Name"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />

          {/* Description */}
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />

          {/* Price */}
          <input
            type="number"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            placeholder="Price"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />

          {/* Parent & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.parentCategoryId}
              onChange={e => setFormData({ ...formData, parentCategoryId: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              required
            >
              <option value="">Select Parent Category</option>
              {parentCategories.filter(c => c.isActive).map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <select
              value={formData.subCategoryId}
              onChange={e => setFormData({ ...formData, subCategoryId: e.target.value })}
              disabled={!subCategories.length}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              required 
            >
              <option value="">Select Subcategory</option>
              {subCategories.map(sc => (
                <option key={sc._id} value={sc._id}>{sc.name}</option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <label
                key={idx}
                className="border border-dark rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary transition relative"
              >
                {img ? (
                  img.url ? (
                    <Image
                      src={img.url}
                      alt={`Image ${idx + 1}`}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full rounded"
                    />
                  ) : (
                    <Image
                      src={URL.createObjectURL(img)}
                      alt={`Image ${idx + 1}`}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full rounded"
                    />
                  )
                ) : (
                  <span className="text-dark text-center">Click to add image</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleImageChange(e, idx)}
                />
              </label>
            ))}
          </div>

          {/* Status */}
          <select
            value={formData.isActive}
            onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4 flex-wrap">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-100 w-full sm:w-auto cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-accent text-light hover:bg-deep w-full sm:w-auto cursor-pointer"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
