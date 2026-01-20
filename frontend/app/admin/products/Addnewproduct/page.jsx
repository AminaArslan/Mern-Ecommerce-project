'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/axios';
import { toast } from 'react-hot-toast';

export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]); // all categories
  const [parentCategories, setParentCategories] = useState([]); // only top-level parents
  const [subCategories, setSubCategories] = useState([]); // filtered subcategories
  const [images, setImages] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(true);

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
    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);
  };

  // ---------------- Submit handler ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error('Product name is required');
    if (!formData.parentCategory) return toast.error('Select parent category');
    if (!formData.subCategory) return toast.error('Select subcategory');

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('price', formData.price);
    fd.append('quantity', formData.quantity);
    fd.append('category', formData.subCategory); // backend expects subcategory ID
    fd.append('isActive', formData.isActive);

    images.forEach(img => {
      if (img) fd.append('images', img);
    });

    try {
      await API.post('/products/admin/create', fd);
      toast.success('Product added successfully!');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to add product');
    }
  };

  if (loading) return <p className="text-dark text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-light rounded-lg shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-dark text-center">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Name */}
        <input
          type="text"
          placeholder="Product Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full border border-dark rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {/* Description */}
        <textarea
          placeholder="Product Description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          required
          className="w-full border border-dark rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {/* Price & Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            required
            className="w-full border border-dark rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
            required
            className="w-full border border-dark rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent "
          />
        </div>

        {/* Parent & Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={formData.parentCategory}
            onChange={e => setFormData({ ...formData, parentCategory: e.target.value })}
            required
            className="w-full border border-dark rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
          >
            <option value="">Select Parent Category</option>
            {parentCategories.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

          <select
            value={formData.subCategory}
            onChange={e => setFormData({ ...formData, subCategory: e.target.value })}
            required
            disabled={!subCategories.length}
            className="w-full border border-dark rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
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
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover rounded"
                />
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
          className="w-full border border-dark rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-5 py-2 border border-dark rounded hover:bg-dark hover:text-light transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded bg-accent text-light hover:bg-dark transition cursor-pointer"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
