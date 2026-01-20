'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/lib/axios';
import { useCart } from '@/context/cartContext';

export default function SingleProductPage() {
  const params = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${params.slug}`);
        setProduct(data);

        // Set initial selected image: first in images array
        const allImages = [
          ...(data.images?.map((img) => img.url) || []),
          data.image?.url, // optional legacy single image
        ].filter(Boolean);

        setSelectedImage(allImages[0] || '/placeholder.png');
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  if (loading) return <p className="text-center mt-12">Loading product...</p>;
  if (!product) return <p className="text-center mt-12">Product not found.</p>;

  const stock = Number(product.quantity) || 0;

  // All images array
  const images = [
    ...(product.images?.map((img) => img.url) || []),
    product.image?.url, // include single image if present
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-6">
      {/* Images */}
      <div>
        {/* Main image */}
        <div className="border rounded shadow overflow-hidden">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-100 object-contain bg-gray-100"
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex space-x-2 mt-2 overflow-x-auto">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name}-${idx}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                  selectedImage === img ? 'border-blue-500' : 'border-gray-300'
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl text-blue-500 font-semibold">${product.price}</p>
        <p>{product.description}</p>

        <p className="font-medium">
          Stock: {stock > 0 ? stock : 'Out of Stock'}
        </p>

        {/* Quantity */}
        <div className="flex items-center space-x-2">
          <label className="font-medium">Quantity:</label>
          <input
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.min(Number(e.target.value), stock))
            }
            className="border p-1 w-20 rounded"
            disabled={stock === 0}
          />
        </div>

        {/* Add to Cart */}
        <button
          disabled={stock === 0}
          onClick={() => addToCart({ ...product, quantity })}
          className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition ${
            stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
