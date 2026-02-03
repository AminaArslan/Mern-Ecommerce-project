export default function CartSummary({ cart = [], totalPrice = 0 }) {
  if (!Array.isArray(cart)) cart = [];

  return (
    <div className="bg-white p-4 sm:p-6 rounded shadow space-y-4">
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty</p>
      ) : (
        cart.map(item => {
          const itemName = item.name || "Product";
          const itemQty = item.quantity || 1;
          const itemPrice = item.price || 0;
          const subtotal = (itemPrice * itemQty || 0).toLocaleString("en-IN");

          return (
            <div key={item._id} className=" sm:flex justify-between items-center ">
              <div>
                <h2 className="font-semibold truncate">{itemName}</h2>
                <p className="text-sm">Qty: {itemQty}</p>
              </div>
              <p className="font-medium">Rs.{subtotal}</p>
            </div>
          );
        })
      )}

      <div className="flex justify-between items-center border-t pt-2 mt-2">
        <span className="font-bold text-lg">Total</span>
        <span className="font-bold text-lg">Rs.{totalPrice.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
