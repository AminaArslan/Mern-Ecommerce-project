  import Order from "../models/Order.js";

  /* ========== Create New Order ========== */
  export const createOrder = async (req, res) => {
    try {
      const {
        orderItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = req.body;

      if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: "No order items" });
      }

      // Use the name directly from the cart item
      const itemsForOrder = orderItems.map(item => ({
        product: item.product,  // ObjectId
        name: item.name,        // already in cart
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      }));

      const order = new Order({
        user: req.user._id,
        orderItems: itemsForOrder,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } catch (err) {
      console.error("Create order error:", err);
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  };


  /* ========== Get Single Order (Customer / Admin) ========== */
  import mongoose from "mongoose";

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
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;

    if (status === "paid") {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    if (status === "delivered") {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
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
    const orders = await Order.find({ status: "pending" })
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
    const count = await Order.countDocuments({ status: "pending" });
    res.json({ count });
  } catch (err) {
    console.error("Error fetching pending orders count:", err);
    res.status(500).json({ message: "Server error" });
  }
};
