  import Order from "../models/Order.js";
  import mongoose from "mongoose";
  /* ========== Create New Order ========== */
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,

      // New system
      orderStatus: "pending",
      paymentStatus: "pending",
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
  /* ========== Get Single Order (Customer / Admin) ========== */


  export const getOrderById = async (req, res) => {
    const { id } = req.params;

    // Check if id exists and is valid
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    try {
      const order = await Order.findById(id).populate("user", "name email");

      if (!order) return res.status(404).json({ message: "Order not found" });

      // Customer can see only their order
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
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  };

  /* ========== Get All Orders (Admin) ========== */
  export const getAllOrdersAdmin = async (req, res) => {
    const orders = await Order.find()
      .populate("user", "id name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  };

  /* ========== Update Order Status (Admin) ========== */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body; // pending, shipped, delivered, canceled
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Prevent changing delivered orders back
    if (order.orderStatus === "delivered" && orderStatus !== "delivered") {
      return res.status(400).json({ message: "Delivered orders cannot be undone" });
    }

    order.orderStatus = orderStatus;

    // Handle COD payment on delivery
    if (orderStatus === "delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "paid";
      order.paidAt = new Date();
    }

    // Optional: handle canceled orders
    if (orderStatus === "canceled") {
      if (order.paymentStatus === "paid" && order.paymentMethod === "Stripe") {
        // TODO: trigger Stripe refund here
        order.paymentStatus = "refunded"; // frontend knows
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
            _id: { $week: "$createdAt" },  // MongoDB week number
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]);

      // Format for frontend
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

// controllers/ordercontroller.js
export const updateOrderStatusCustomer = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  // Make sure the logged-in user owns the order
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Only allow cancel for pending COD orders
  if (order.orderStatus !== "pending" || order.paymentMethod !== "COD") {
    return res.status(400).json({ message: "Order cannot be cancelled" });
  }

  // Mark order as canceled and record who canceled
  order.orderStatus = "canceled";       // matches enum in schema
  order.cancelledBy = "user";           // record user canceled
  await order.save();

  res.json(order);
};

