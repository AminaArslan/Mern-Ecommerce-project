import Cart from "../models/Cart.js";

// ================= GET CART =================
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image slug"
    );

    return res.json(cart || { items: [] });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================= SYNC CART =================
export const syncCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const frontendCart = req.body.cart || [];

    const items = frontendCart.map(item => ({
      product: item._id,
      name: item.name,            // <-- Add name here
      image: typeof item.image === 'string' ? item.image : item.image?.url || '',
      quantity: item.quantity,
      price: item.price,
    }));

    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { items },
      { new: true, upsert: true }
    ).populate('items.product', 'name price image slug');

    res.json(updatedCart);
  } catch (err) {
    console.error('Sync cart error:', err); // <-- this logs the 500 error
    res.status(500).json({ error: 'Server error' });
  }
};

// ================= UPDATE ITEM =================
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ error: "Item not in cart" });

    item.quantity = quantity;

    await cart.save();
    const populated = await cart.populate("items.product", "name price image slug");
    res.json(populated);
  } catch (err) {
    console.error("Update cart item error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================= REMOVE ITEM =================
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);

    await cart.save();
    const populated = await cart.populate("items.product", "name price image slug");
    res.json(populated);
  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================= CLEAR CART =================
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
