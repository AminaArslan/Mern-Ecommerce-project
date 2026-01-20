// controllers/adminController.js

import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

export const getAdminStats = async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const categories = await Category.countDocuments();
    const orders = await Order.countDocuments();
    const customers = await User.countDocuments({ role: 'customer' });

    res.json({ products, categories, orders, customers });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
