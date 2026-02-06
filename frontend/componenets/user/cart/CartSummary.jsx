export default function CartSummary({ cart = [], totalPrice = 0 }) {
  if (!Array.isArray(cart)) cart = [];

  return (
    <div className="bg-white p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-serif text-dark leading-none tracking-tight">Curation <span className="italic font-light text-gray-300">Summary</span></h2>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Review your selected artifacts</p>
      </div>

      <div className="space-y-6 pt-6 border-t border-gray-50">
        {cart.length === 0 ? (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center py-4">Your curation is empty</p>
        ) : (
          cart.map(item => {
            const itemName = item.name || "Product";
            const itemQty = item.quantity || 1;
            const itemPrice = item.price || 0;
            const subtotal = (itemPrice * itemQty || 0).toLocaleString();

            return (
              <div key={item._id} className="flex justify-between items-start group cursor-pointer hover:bg-gray-50/50 p-2 -m-2 transition-colors rounded-sm">
                <div className="space-y-1">
                  <h3 className="text-[11px] font-bold text-dark uppercase tracking-widest truncate max-w-[150px] sm:max-w-[180px] group-hover:text-gray-500 transition-colors">
                    {itemName}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Quantity: {itemQty}</p>
                </div>
                <p className="text-[11px] font-serif text-dark italic">Rs.{subtotal}</p>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-8 border-t border-gray-100 space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Total Value</span>
            <p className="text-[10px] font-bold text-dark uppercase tracking-widest italic">{cart.length} Pieces</p>
          </div>
          <span className="text-3xl font-serif text-dark tracking-tighter">
            Rs.{totalPrice.toLocaleString()}
          </span>
        </div>
        <p className="text-[9px] text-gray-300 uppercase tracking-[0.2em] text-center">Final taxes calculated at billing</p>
      </div>
    </div>
  );
}
