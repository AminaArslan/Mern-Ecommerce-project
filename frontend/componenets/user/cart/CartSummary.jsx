export default function CartSummary({ cart, totalPrice }) {
  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      {cart.map(item => (
        <div key={item._id} className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold">{item.title}</h2>
            <p>Qty: {item.quantity}</p>
          </div>
          <p>${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      ))}
      <div className="flex justify-between items-center border-t pt-2 mt-2">
        <span className="font-bold text-lg">Total</span>
        <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}
