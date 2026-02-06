import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

/* ========== Create New Order ========== */
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // 1. Check stock for all items before creating order
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.quantity}` });
      }
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      orderStatus: "pending",
      paymentStatus: "pending",
    });

    const createdOrder = await order.save();

    // 2. Decrement stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }

    res.status(201).json(createdOrder);

  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/* ========== Get Single Order (Customer / Admin) ========== */
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  try {
    const order = await Order.findById(id).populate("user", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      req.user.role === "customer" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ========== Get Orders (Customer) ========== */
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("orderItems.product", "images name slug")
    .sort({ createdAt: -1 });
  res.json(orders);
};

/* ========== Get All Orders (Admin) ========== */
export const getAllOrdersAdmin = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "id name email")
    .populate("orderItems.product", "images name slug")
    .sort({ createdAt: -1 });

  res.json(orders);
};

/* ========== Update Order Status (Admin) ========== */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const previousStatus = order.orderStatus;

    if (order.orderStatus === "delivered" && orderStatus !== "delivered") {
      return res.status(400).json({ message: "Delivered orders cannot be undone" });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "paid";
      order.paidAt = new Date();
    }

    // Restore stock if order is canceled (and wasn't already canceled)
    if (orderStatus === "canceled" && previousStatus !== "canceled") {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: item.quantity },
        });
      }
    }

    await order.save();
    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===== Get Orders Weekly Stats (Admin) ===== */
export const getOrdersWeeklyStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: { $week: "$createdAt" },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const formatted = stats.map(item => ({
      week: `Week ${item._id}`,
      totalOrders: item.totalOrders,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Weekly orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ========== Get Pending Orders (Admin) ========== */
export const getPendingOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: "pending" })
      .populate("user", "id name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching pending orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ========== Get Pending Orders Count (Admin) ====== */
export const getPendingOrdersCountAdmin = async (req, res) => {
  try {
    const count = await Order.countDocuments({ orderStatus: "pending" });
    res.json({ count });
  } catch (err) {
    console.error("Error fetching pending orders count:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Customer cancel order status update
export const updateOrderStatusCustomer = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (order.orderStatus !== "pending" || order.paymentMethod !== "COD") {
    return res.status(400).json({ message: "Order cannot be cancelled" });
  }

  const previousStatus = order.orderStatus;
  order.orderStatus = "canceled";
  order.cancelledBy = "user";

  if (previousStatus !== "canceled") {
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: item.quantity },
      });
    }
  }

  await order.save();
  res.json(order);
};

