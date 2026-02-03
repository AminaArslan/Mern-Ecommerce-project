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
  const [removedImages, setRemovedImages] = useState([]);
    const [updating, setUpdating] = useState(false);

  // ---------------- Initialize form ----------------
  useEffect(() => {
    if (!product || !categories.length) return;

    const subCat = categories.find(c => c._id === product.category?._id && c.isActive);
    const parentCat = subCat?.parentId
      ? categories.find(c => c._id === subCat.parentId && c.isActive)
      : null;

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      parentCategoryId: parentCat?._id || '',
      subCategoryId: subCat?._id || '',
      isActive: product.isActive,
    });

    const filteredSubs = parentCat
      ? categories.filter(c => c.parentId === parentCat._id && c.isActive)
      : [];
    setSubCategories(filteredSubs);

    const imgArr = [null, null, null, null];
    (product.images || []).slice(0, 4).forEach((img, idx) => (imgArr[idx] = img));
    setImages(imgArr);
  }, [product, categories]);

  // ---------------- Parent category change ----------------
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

    if (!filteredSubs.some(c => c._id === formData.subCategoryId)) {
      setFormData(prev => ({ ...prev, subCategoryId: '' }));
    }
  }, [formData.parentCategoryId, categories]);

  // ---------------- Image change ----------------
 const handleImageChange = (e, idx) => {
  const file = e.target.files[0];
  if (!file) return;

  setImages(prevImages => {
    const newImages = [...prevImages];

    // Only push old images that have a valid public_id
    if (newImages[idx] && newImages[idx].public_id) {
      setRemovedImages(prev => [...prev, newImages[idx].public_id]);
    }

    newImages[idx] = file;
    return newImages;
  });
};


  // ---------------- Submit ----------------
  const handleSubmit = async e => {
    e.preventDefault();
     setUpdating(true);

    if (!formData.parentCategoryId || !formData.subCategoryId) {
            return toast.error('Please select parent and subcategory');
            setUpdating(false);
    }


    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('price', formData.price);
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
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4 text-dark text-center">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Product Name"
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description"
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            placeholder="Price"
            className="w-full border p-2 rounded"
            required
          />

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.parentCategoryId}
              onChange={e => setFormData({ ...formData, parentCategoryId: e.target.value })}
              className="w-full border p-2 rounded"
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
              className="w-full border p-2 rounded"
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
              <label key={idx} className="border rounded-lg h-32 flex items-center justify-center cursor-pointer relative">
                {img ? (
                  img.url ? (
                    <Image src={img.url} alt="" fill className="object-cover rounded" />
                  ) : (
                    <Image src={URL.createObjectURL(img)} alt="" fill className="object-cover rounded" />
                  )
                ) : (
                  <span>Click to add image</span>
                )}
                <input type="file" accept="image/*" hidden onChange={e => handleImageChange(e, idx)} />
              </label>
            ))}
          </div>

          <select
            value={formData.isActive}
            onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
            className="w-full border p-2 rounded"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            
           <button
  type="submit"
  className={`px-5 py-2 rounded bg-accent text-light hover:bg-dark transition flex items-center justify-center gap-2 ${
    updating ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
  }`}
  disabled={updating}
>
  {updating ? (
    <>
      <span className="w-5 h-5 border-2 border-t-white border-white border-solid rounded-full animate-spin"></span>
      updating...
    </>
  ) : (
    'Update '
  )}
</button>
          </div>
        </form>
      </div>
    </div>
  );
}
