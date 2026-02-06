'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/lib/axios';
import { useCart } from '@/context/cartContext';
import toast from 'react-hot-toast';
import { FiMinus, FiPlus, FiShoppingBag, FiStar, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function SingleProductPage() {
  const params = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${params.slug}`);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  if (loading) return <div className="h-screen flex items-center justify-center text-sm tracking-widest uppercase">Loading Piece...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center text-sm tracking-widest uppercase">Product not found.</div>;

  const stock = Number(product.quantity) || 0;

  // Images Array (Default + Additional)
  const images = product.images?.length > 0
    ? product.images.map(img => img.url)
    : [product.image?.url].filter(Boolean);

  // Fallback if no images
  if (images.length === 0) images.push('https://placehold.co/600x800/111827/FBBC05?text=STUDIO+AMINA');

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="w-full bg-white pt-24 lg:pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* LEFT: IMAGE GALLERY (2x2 Grid) */}
          <div className="w-full lg:w-[60%]">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setShowOverlay(true);
                  }}
                  className="w-full aspect-square bg-gray-50 relative overflow-hidden group border-2 border-gray-200 hover:border-dark transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`${product.name} - View ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: STICKY DETAILS PANEL */}
          <div className="w-full lg:w-[40%]">
            <div className="sticky top-32 flex flex-col gap-8">

              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <span className="text-gray-400 ml-2 text-xs tracking-wide">(No reviews yet)</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-dark leading-[1.1]">
                  {product.name}
                </h1>

                <p className="text-xl md:text-2xl font-medium text-gray-900">
                  Rs. {(+product.price).toLocaleString("en-IN")}
                </p>
              </div>

              {/* Description */}
              <div className="prose prose-sm text-gray-600 leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Controls */}
              <div className="space-y-6 pt-6 border-t border-gray-100">
                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium uppercase tracking-wider text-gray-500">Quantity</span>
                  <div className="flex items-center border border-gray-200 rounded-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition cursor-pointer"
                      disabled={quantity <= 1}
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition cursor-pointer"
                      disabled={quantity >= stock}
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    const result = addToCart(product, quantity);
                    if (result.success) {
                      toast.success(`Added to cart`, {
                        style: {
                          background: '#333',
                          color: '#fff',
                          borderRadius: '0px'
                        }
                      });
                    } else {
                      toast.error(`Only ${result.limit} available in stock`, {
                        style: {
                          background: '#f59e0b',
                          color: '#fff',
                          borderRadius: '0px'
                        }
                      });
                    }
                  }}
                  disabled={stock === 0}
                  className="w-full py-4 text-white hover:text-white bg-dark flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {stock > 0 ? (
                      <><FiShoppingBag className="mb-1" /> Add to Cart</>
                    ) : 'Out of Stock'}
                  </span>
                </button>

                {/* Additional Info */}
                <div className="text-xs text-gray-500 space-y-2 pt-4">
                  <p>• Free shipping on orders over Rs. 5,000</p>
                  <p>• 14-day easy return policy</p>
                  <p>• Secure checkout guaranteed</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* IMAGE OVERLAY */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          {/* Close Button */}
          <button
            onClick={() => setShowOverlay(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10 cursor-pointer"
          >
            <FiX size={32} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 text-white text-sm font-bold tracking-widest uppercase z-10">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 cursor-pointer"
            >
              <FiChevronLeft size={48} />
            </button>
          )}

          {/* Current Image */}
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={images[currentImageIndex]}
              alt={`${product.name} - View ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 cursor-pointer"
            >
              <FiChevronRight size={48} />
            </button>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border-2 transition-all cursor-pointer ${idx === currentImageIndex ? 'border-white scale-110' : 'border-gray-600 opacity-60 hover:opacity-100'
                    }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}


    </main>
  );
}
