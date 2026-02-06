'use client';

import { useCart } from '@/context/cartContext';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createOrder, createCheckoutSession } from '@/lib/axios';
import CartSummary from '@/componenets/user/cart/CartSummary';
import { FiArrowRight, FiLock, FiInfo } from 'react-icons/fi';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
  };


  const handleCheckout = async () => {
    if (!user) return;

    if (cart.length === 0) {
      setError('Your curation is empty.');
      return;
    }

    // Validate stock availability for all cart items
    const outOfStockItems = cart.filter(item => {
      const stock = Number(item.quantity) || 0;
      return stock === 0;
    });

    if (outOfStockItems.length > 0) {
      setError(`Some items are out of stock: ${outOfStockItems.map(i => i.name).join(', ')}. Please remove them from your cart.`);
      return;
    }

    // Validate quantities don't exceed stock
    const exceededItems = cart.filter(item => {
      const stock = Number(item.quantity) || 0;
      return item.quantity > stock;
    });

    if (exceededItems.length > 0) {
      setError(`Some items exceed available stock. Please adjust quantities.`);
      return;
    }

    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode', 'country'];
    for (let field of requiredFields) {
      if (!shipping[field]) {
        setError('Please provide complete shipping architecture.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        orderItems: cart.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
          image: item.images?.[0]?.url || (typeof item.image === 'string' ? item.image : item.image?.url) || '',
        })),
        shippingAddress: shipping,
        paymentMethod,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: Number(totalPrice),
      };

      const order = await createOrder(orderData);
      if (!order?._id) throw new Error("Failed to finalize curation.");

      if (paymentMethod === 'Stripe') {
        const url = await createCheckoutSession(order._id);
        if (!url) throw new Error("Secure gateway unavailable");
        window.location.href = url;
      } else {
        clearCart();
        router.push('/orders');
      }

    } catch (err) {
      console.error('Checkout error:', err.response?.data || err.message || err);
      setError(err.response?.data?.message || err.message || "An internal error occurred during finalization.");
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="w-full bg-[#f0f0f0] min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-sm px-3 md:px-6">
          <h1 className="text-4xl font-serif text-dark italic font-light leading-tight text-gray-300">Your curation is currently empty.</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em]">Return to the collection to select items for checkout.</p>
          <button onClick={() => router.push('/products')}
            className="px-10 py-5 bg-dark text-white text-[10px] font-bold uppercase tracking-[0.3em]
           hover:bg-gray-800 transition-all cursor-pointer">
            Explore Artifacts
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-[#f0f0f0] pt-10 pb-10 md:pt-32 md:pb-32 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* EDITORIAL HEADER */}
        <div className="mb-12 sm:mb-20 space-y-3">
          <span className="text-[10px] font-bold tracking-[0.5em] text-gray-400 uppercase">
            Final Step
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-dark leading-none tracking-tighter">
            Finalize <span className="italic font-light text-gray-300 underline decoration-1 underline-offset-12">Curation.</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {/* LEFT: FORM SIDE */}
          <div className="flex-1 w-full space-y-12">

            {/* Shipping Form Card */}
            <div className="bg-white p-4 md:p-14 border border-gray-100 shadow-xl rounded-sm space-y-12">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-8">
                <div className="w-3 h-3 bg-dark rounded-full" />
                <h2 className="text-sm font-bold text-dark uppercase tracking-[0.4em]">Shipping Architecture</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
                {[
                  { name: 'firstName', placeholder: 'FIRST NAME', type: 'text' },
                  { name: 'lastName', placeholder: 'LAST NAME', type: 'text' },
                  { name: 'email', placeholder: 'EMAIL ARCHIVE', type: 'email' },
                  { name: 'phone', placeholder: 'CONTACT LINE', type: 'tel' },
                  { name: 'address', placeholder: 'PHYSICAL ADDRESS', type: 'text', full: true },
                  { name: 'city', placeholder: 'CITY / DISTRICT', type: 'text' },
                  { name: 'postalCode', placeholder: 'POSTAL CODE', type: 'text' },
                  { name: 'country', placeholder: 'COUNTRY / REGION', type: 'text', full: true },
                ].map(field => (
                  <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
                    <label className="text-[11px] font-bold text-dark uppercase tracking-[0.2em] mb-3 block">
                      {field.placeholder} <span className="text-gray-300 ml-1 font-normal">*</span>
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={shipping[field.name]}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-gray-100 focus:border-dark px-6 py-5 text-xs font-bold text-dark 
                      outline-none transition-all duration-300
                       placeholder:text-gray-300 tracking-widest rounded-sm focus:shadow-lg cursor-pointer focus:cursor-text"
                      placeholder={`Provide ${field.placeholder.toLowerCase()}...`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white p-10 md:p-14 border border-gray-100 shadow-sm space-y-10">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                <div className="w-2 h-2 bg-dark rounded-full" />
                <h2 className="text-xs font-bold text-dark uppercase tracking-[0.3em]">Secure Gateway</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'Stripe', label: 'DIGITAL GATEWAY (STRIPE)', icon: FiLock },
                  { id: 'COD', label: 'CASH ON DELIVERY', icon: FiInfo }
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center justify-between p-6 border transition-all duration-500 cursor-pointer
                       ${paymentMethod === method.id ? 'border-dark bg-dark text-white' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">{method.label}</span>
                    <method.icon size={14} className={paymentMethod === method.id ? 'text-white' : 'text-gray-200'} />
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-6 bg-rose-50 border border-rose-100 flex items-center 
              gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[10px] text-white">!</div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{error}</span>
              </div>
            )}
          </div>

          {/* RIGHT: SUMMARY SIDE */}
          <div className="w-full lg:w-100 sticky top-32 space-y-8">
            <CartSummary cart={cart} totalPrice={totalPrice} />

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="group w-full flex items-center justify-between bg-dark text-white px-10 py-7
               hover:bg-gray-800 disabled:opacity-50 transition-all active:scale-[0.98] duration-500 shadow-2xl shadow-dark/20 cursor-pointer"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.5em]">
                {loading ? 'PROCESSING ARCHIVE...' : 'FINALIZE PURCHASE'}
              </span>
              {!loading && <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-500" />}
            </button>

            <p className="text-[9px] text-gray-400 text-center uppercase tracking-[0.2em] leading-relaxed">
              By finalizing, you agree to our <span className="text-dark underline underline-offset-4 cursor-pointer hover:text-gray-500">Terms of Curation</span> and internal privacy protocols.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
