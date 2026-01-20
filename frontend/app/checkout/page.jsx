'use client';

import { useCart } from '@/context/cartContext';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createOrder, createCheckoutSession } from '@/lib/axios';
import CartSummary from '@/componenets/CartSummary';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shipping, setShipping] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Redirect if not logged in
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
      setError('Your cart is empty.');
      return;
    }

    // Validate shipping
    if (!shipping.address || !shipping.city || !shipping.postalCode || !shipping.country) {
      setError('Please fill in all shipping details.');
      return;
    }

    setLoading(true);
    setError('');
 console.log('Cart before sending to createOrder:', cart);
    try {
      // 1️⃣ Create pending order
// 1️⃣ Create pending order
const orderData = {
  orderItems: cart.map(item => ({
    product: item._id,
    name: item.name, // <-- change from item.title to item.name
    quantity: item.quantity,
    price: item.price,
    image: typeof item.image === 'string' ? item.image : item.image?.url || '',
  })),
  shippingAddress: shipping,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice,
};


      const order = await createOrder(orderData);

      // 2️⃣ Create Stripe session
      const stripeUrl = await createCheckoutSession(order._id);

      // 3️⃣ Redirect to Stripe checkout
      window.location.href = stripeUrl;

      // ✅ Optional: cart will be cleared on payment-success page
    } catch (err) {
      console.error('Checkout error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Checkout failed.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center mt-12">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-gray-600">Add some products to proceed to checkout.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* Shipping Form */}
    <div className="bg-white p-6 rounded shadow space-y-4">
  <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* First Name */}
    <input
      type="text"
      name="firstName"
      placeholder="First Name"
      value={shipping.firstName}
      onChange={handleInputChange}
      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
      required
    />

    {/* Last Name */}
    <input
      type="text"
      name="lastName"
      placeholder="Last Name"
      value={shipping.lastName}
      onChange={handleInputChange}
      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
      required
    />

    {/* Email */}
    <input
      type="email"
      name="email"
      placeholder="Email Address"
      value={shipping.email}
      onChange={handleInputChange}
      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
      required
    />

    {/* Phone */}
    <input
      type="tel"
      name="phone"
      placeholder="Phone Number"
      value={shipping.phone}
      onChange={handleInputChange}
      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
      required
    />

    {/* Address */}
    <input
      type="text"
      name="address"
      placeholder="Address"
      value={shipping.address}
      onChange={handleInputChange}
      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent col-span-2"
      required
    />

    {/* City */}
    <input
      type="text"
      name="city"
      placeholder="City"
      value={shipping.city}
      onChange={handleInputChange}
      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
      required
    />

    {/* Postal Code */}
    <input
      type="text"
      name="postalCode"
      placeholder="Postal Code"
      value={shipping.postalCode}
      onChange={handleInputChange}
      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
      required
    />

    {/* Country */}
    <input
      type="text"
      name="country"
      placeholder="Country"
      value={shipping.country}
      onChange={handleInputChange}
      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
      required
    />
  </div>
</div>


      {/* Cart Summary */}
      <CartSummary cart={cart} totalPrice={totalPrice} />

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-green-500 text-white py-3 px-4 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay with Stripe'}
      </button>
    </div>
  );
}
