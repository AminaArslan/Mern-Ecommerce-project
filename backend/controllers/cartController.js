import Cart from "../models/Cart.js";
import mongoose from "mongoose";

// ================= GET CART =================
export const getCart = async (req, res) => {
  try {
    const { guestId } = req.query; // for guests

    let cart;
    if (req.user && req.user._id) {
      // Logged-in user
      cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product",
        "name price image slug"
      );
    } else if (guestId) {
      // Guest user
      cart = await Cart.findOne({ guestId }).populate(
        "items.product",
        "name price image slug"
      );
    } else {
      return res.json({ items: [] });
    }

    if (!cart) cart = { items: [] };
    res.json(cart);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================= SYNC CART (ADD/SET CART) =================
export const syncCart = async (req, res) => {
  try {
    const frontendCart = req.body.cart || [];
    const guestId = req.body.guestId;

    const items = frontendCart
      .filter(item => item._id && item.name && item.price)
      .map(item => ({
        product: item._id,
        name: item.name,

        // 🔥 FIX: always store a STRING image URL
        image:
          item.images?.[0]?.url ||   // from product object
          item.image ||              // already saved snapshot
          "/placeholder.png",        // fallback

        quantity: item.quantity || 1,
        price: item.price,
      }));

    let filter;
    if (req.user && req.user._id) filter = { user: req.user._id };
    else if (guestId) filter = { guestId };
    else return res.status(400).json({ error: "No user or guestId provided" });

    let updatedCart = await Cart.findOneAndUpdate(
      filter,
      { items },
      { new: true, upsert: true }
    );

    // 🔥 FIX: product model uses IMAGES not IMAGE
    await updatedCart.populate("items.product", "name price images slug");

    res.json(updatedCart);
  } catch (err) {
    console.error("Sync cart error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// ================= UPDATE CART ITEM =================
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, guestId } = req.body;

    let cart;
    if (req.user && req.user._id) {
      cart = await Cart.findOne({ user: req.user._id });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
    } else return res.status(400).json({ error: "No user or guestId provided" });

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

// ================= REMOVE CART ITEM =================
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { guestId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ error: "Invalid product ID" });

    // Fetch cart (user or guest)
    let cart;
    if (req.user && req.user._id) {
      cart = await Cart.findOne({ user: req.user._id });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
    } else {
      return res.status(400).json({ error: "No user or guestId provided" });
    }

    if (!cart || !Array.isArray(cart.items)) {
      return res.status(404).json({ error: "Cart not found or empty" });
    }

    const index = cart.items.findIndex(i => i.product.toString() === productId);
    if (index === -1) return res.status(404).json({ error: "Item not in cart" });

    cart.items.splice(index, 1);

    await cart.save();

    // populate only if items exist
    const populated = cart.items.length
      ? await cart.populate("items.product", "name price image slug")
      : cart;

    res.json(populated);
  } catch (err) {
    console.error("Remove cart item error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================= CLEAR CART =================
export const clearCart = async (req, res) => {
  try {
   const { guestId } = req.body;

let cart;
if (req.user && req.user._id) 
    cart = await Cart.findOne({ user: req.user._id });
else if (guestId) 
    cart = await Cart.findOne({ guestId });
else 
    return res.status(400).json({ error: "No user or guestId provided" });

if (!cart) 
    return res.status(404).json({ error: "Cart not found" });

cart.items = [];
await cart.save();

res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
