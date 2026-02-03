'use client';

import { useCart } from '@/context/cartContext';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createOrder, createCheckoutSession } from '@/lib/axios';
import CartSummary from '@/componenets/user/cart/CartSummary';
import { stripePromise } from '@/lib/stripe';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' }); // ✅ notification state
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
  const [paymentMethod, setPaymentMethod] = useState('Stripe'); // default Stripe

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
    setError('Your cart is empty.');
    return;
  }

  // Validate shipping fields...
  const requiredFields = ['firstName','lastName','email','phone','address','city','postalCode','country'];
  for (let field of requiredFields) {
    if (!shipping[field]) {
      setError('Please fill in all shipping details.');
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
        image: typeof item.image === 'string' ? item.image : item.image?.url || '',
      })),
      shippingAddress: shipping,
      paymentMethod,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: Number(totalPrice),
    };

    const order = await createOrder(orderData);
    if (!order?._id) throw new Error("Failed to create order.");

    if (paymentMethod === 'Stripe') {
      // ✅ Get Stripe-hosted checkout URL
      const url = await createCheckoutSession(order._id); // returns session.url
      if (!url) throw new Error("Stripe checkout URL not returned");

      // ✅ Redirect user to Stripe-hosted checkout page
      window.location.href = url;

    } else {
      // COD
      alert('Order placed successfully! Payment will be collected on delivery.');
      clearCart();
      router.push('/orders');
    }

  } catch (err) {
    console.error('Checkout error:', err.response?.data || err.message || err);
    setError(err.response?.data?.message || err.message || "Checkout failed. Please try again.");
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
    <div className="max-w-6xl mx-auto p-4 flex flex-col lg:flex-row gap-8">
      {/* Left: Shipping Form */}
      <div className="flex-1 bg-white dark:bg-dark p-6 rounded shadow space-y-6">
        <h1 className="text-3xl font-bold text-dark dark:text-light">Checkout</h1>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-dark dark:text-light">Shipping Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'firstName', placeholder: 'First Name', type: 'text' },
              { name: 'lastName', placeholder: 'Last Name', type: 'text' },
              { name: 'email', placeholder: 'Email Address', type: 'email' },
              { name: 'phone', placeholder: 'Phone Number', type: 'tel' },
              { name: 'address', placeholder: 'Address', type: 'text', full: true },
              { name: 'city', placeholder: 'City', type: 'text' },
              { name: 'postalCode', placeholder: 'Postal Code', type: 'text' },
              { name: 'country', placeholder: 'Country', type: 'text' },
            ].map(field => (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={shipping[field.name]}
                onChange={handleInputChange}
                className={`border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent dark:bg-secondary dark:text-light ${field.full ? 'col-span-1' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="mt-4">
          <h2 className="sm:text-xl font-semibold text-dark dark:text-light">Payment Method</h2>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="Stripe" checked={paymentMethod==='Stripe'} onChange={(e)=>setPaymentMethod(e.target.value)} />
              Stripe
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="COD" checked={paymentMethod==='COD'} onChange={(e)=>setPaymentMethod(e.target.value)} />
              Cash on Delivery
            </label>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-accent text-light py-3 px-4 rounded hover:bg-dark disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Processing...' : paymentMethod === 'Stripe' ? 'Pay with Stripe' : 'Place Order (COD)'}
        </button>
      </div>

      {/* Right: Cart Summary */}
      <div className="lg:w-1/3 flex-shrink-0">
        <div className="sticky top-24">
          <CartSummary cart={cart} totalPrice={totalPrice} />
        </div>
      </div>
    </div>
  );
}
