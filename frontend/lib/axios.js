
    import axios from "axios";

    // ------------------ Axios Instance ------------------
    const API = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    });


    // Automatically attach token to all requests
    API.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    // ================= AUTH =================
export const loginUser = async ({ email, password }) => {
  const { data } = await API.post("/auth/login", { email, password });
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data; // ✅ return full object { token, user }
};

export const registerUser = async ({ name, email, password }) => {
  const { data } = await API.post("/auth/register", { name, email, password });
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data; // ✅ return full object { token, user }
};


    export const logoutUser = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    };

    // ================= USERS (Admin Only) =================
    export const getAllUsers = async () => {
      try {
        const { data } = await API.get("/auth/users");
        return data; // array of users
      } catch (err) {
        console.error("Error fetching users:", err.response?.data || err.message);
        throw err.response?.data || { message: "Failed to fetch users" };
      }
    };

    // Delete a user (Admin only, customer only)
    export const deleteUser = async (id) => {
      try {
        const { data } = await API.delete(`/auth/users/${id}`);
        return data; // { message: "User deleted successfully" }
      } catch (err) {
        console.error("Error deleting user:", err.response?.data || err.message);
        throw err.response?.data || { message: "Failed to delete user" };
      }
    };

    // =================== CATEGORY ===================

  // ---------------- User: Get Categories ----------------
  export const getUserCategories = async () => {
    try {
      const { data } = await API.get("/categories"); // public endpoint

      // Structure categories by parentId
      const grouped = data.reduce(
        (acc, parent) => {
          // parent object already has subCategories array
          acc.parents.push(parent);
          acc.children[parent.name] = parent.subCategories || [];
          return acc;
        },
        { parents: [], children: {} }
      );

      return grouped;
      // Format:
      // {
      //   parents: [{ _id, name, ... , subCategories: [...] }],
      //   children: { "Women": [...], "Men": [...], "Kids": [...] }
      // }
    } catch (err) {
      console.error("Error fetching user categories:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to fetch user categories" };
    }
  };

  // ---------------- Admin: Get All Categories ----------------
  export const getAllCategories = async () => {
    try {
      const { data } = await API.get("/categories/all"); // admin endpoint

      // Structure parents and children
      const parents = data.filter(c => !c.parentId);
      const children = data.filter(c => c.parentId);

      return { parents, children, raw: data };
    } catch (err) {
      console.error("Error fetching all categories:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to fetch all categories" };
    }
  };
// -------------- \\
  export const getNewSubcategoriesByParent = async () => {
try {
const { data } = await API.get("/categories/new-grouped"); // public endpoint


// Format is already grouped by parent in backend
// { parentName, parentSlug, subcategories: [...] }
return data;
} catch (err) {
console.error(
"Error fetching new subcategories:",
err.response?.data || err.message
);
throw err.response?.data || { message: "Failed to fetch new subcategories" };
}
};

  // ---------------- Admin: Create Subcategory ----------------
  export const createCategory = async ({ name, parentId, isActive = true }) => {
    try {
      const { data } = await API.post("/categories", { name, parentId, isActive });
      return data;
    } catch (err) {
      console.error("Error creating category:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to create category" };
    }
  };

  // ---------------- Admin: Update Category ----------------
  export const updateCategory = async ({ id, name, parentId, isActive = true }) => {
    try {
      const { data } = await API.put(`/categories/${id}`, { name, parentId, isActive });
      return data;
    } catch (err) {
      console.error("Error updating category:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to update category" };
    }
  };

  // ---------------- Admin: Delete Category ----------------
  export const deleteCategory = async (id) => {
    try {
      const { data } = await API.delete(`/categories/${id}`);
      return data;
    } catch (err) {
      console.error("Error deleting category:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to delete category" };
    }
  };

    // =================== PRODUCT ===================

    // Get all active products (public)
    export const getAllProducts = async () => {
      try {
        const { data } = await API.get("/products");
        return data;
      } catch (err) {
        console.error("Error fetching products:", err.response?.data || err.message);
        throw err.response?.data || { message: "Failed to fetch products" };
      }
    };

    // Get single product by slug
    export const getSingleProduct = async (slug) => {
      try {
        const { data } = await API.get(`/products/${slug}`);
        return data;
      } catch (err) {
        console.error("Error fetching product:", err.response?.data || err.message);
        throw err.response?.data || { message: "Failed to fetch product" };
      }
    };

    // Admin: Get all products
    export const getAllProductsAdmin = async () => {
      try {
        const { data } = await API.get("/products/admin");
        return data;
      } catch (err) {
        console.error("Error fetching admin products:", err.response?.data || err.message);
        throw err.response?.data || { message: "Failed to fetch products (admin)" };
      }
    };

    // Admin: Create product (with optional image)
  export const createProduct = async (formData) => {
    try {
      const { data } = await API.post("/products/admin/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err) {
      // Log full error for debugging
      console.error("Error creating product:", err.response || err);

      // Throw a consistent error object
      throw err.response?.data || { message: err.message || "Failed to create product" };
    }
  };



    // Admin: Update product by ID (with optional image)
  export const updateProduct = async (id, formData) => {
    try {
      const { data } = await API.put(
        `/products/admin/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    } catch (err) {
      console.error("Error updating product:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to update product" };
    }
  };



    // Admin: Delete product by ID
  export const deleteProduct = async (id) => {
    try {
      const { data } = await API.delete(`/products/admin/delete/${id}`);
      return data;
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to delete product" };
    }
  };


    // Top Products (Admin Dashboard Bar Chart)
  export const getTopProductsStats = async () => {
    try {
      const { data } = await API.get("/products/admin/top-products");
      return data;
    } catch (err) {
      console.error("Error fetching top products:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to fetch top products" };
    }
  };


    // Products by Category (Admin Dashboard Pie Chart)
    export const getProductsByParentCategoryStats = async () => {
      try {
        const { data } = await API.get("/products/admin/parent-category-stats");
        return data;
      } catch (err) {
        console.error("Error fetching products by parent category:", err.response?.data || err.message);
        throw err.response?.data || { message: "Failed to fetch products by parent category" };
      }
    };

//
export const getProductsByParentCategoryFrontend = async (slug) => {
  try {
    const { data } = await API.get(`/products/frontend/${slug}`);
    return data;
  } catch (err) {
    console.error("Fetch products by parent category error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to fetch products by parent category" };
  }
};


    // Admin: Toggle product active/inactive
  export const toggleProductStatus = async (id) => {
    try {
      const { data } = await API.patch(`/products/admin/toggle/${id}`);
      return data;
    } catch (err) {
      console.error("Error toggling product status:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to toggle product status" };
    }
  };


    // =================== ORDER ===================

    // Create a new order (Customer)
    export const createOrder = async (orderData) => {
      try {
        const { data } = await API.post("/orders", orderData);
        return data;
      } catch (err) {
        console.error("Error creating order:", err.response?.data || err.message);
        throw err.response?.data || { message: "Failed to create order" };
      }
    };

    // Get a single order by ID (Customer/Admin)
    export const getOrderById = async (orderId) => {
      try {
        const { data } = await API.get(`/orders/${orderId}`);
        return data;
      } catch (err) {
        console.error("Error fetching order:", err.response?.data || err.message);
        throw err.response?.data || { message: "Failed to fetch order" };
      }
    };

    // Get orders for logged-in customer
export const getMyOrders = async () => {
  try {
    const { data } = await API.get('/orders/myorders'); // API has baseURL '/api'
    return data;
  } catch (err) {
    console.error('Error fetching user orders:', err.response?.data || err.message);
    throw err.response?.data || { message: 'Failed to fetch orders' };
  }
};


    // Get all orders (Admin)
    export const getAllOrdersAdmin = async () => {
      try {
        const { data } = await API.get("/orders");
        return data;
      } catch (err) {
        console.error("Error fetching all orders:", err.response?.data || err.message);
        throw err.response?.data || { message: "Failed to fetch orders" };
      }
    };

    // Update order status (Admin)
export const updateOrderStatus = async (orderId, status) => {
  try {
    console.log("Updating order:", orderId, "to status:", status);
    const { data } = await API.patch(`/orders/admin/status/${orderId}`, { orderStatus: status });
    console.log("Patch response:", data);
    return data.order; // updated order
  } catch (err) {
    console.error("Error updating order status:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to update order status" };
  }
};


    // Get weekly orders stats (Admin) 🔥
  export const getOrdersWeeklyStats = async () => {
    try {
      const { data } = await API.get("/orders/admin/weekly");
      return data;
    } catch (err) {
      console.error("Error fetching weekly orders:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to fetch weekly orders" };
    }
  };


  // Get all pending orders
  export const getPendingOrdersAdmin = async () => {
    try {
      const { data } = await API.get("/orders/admin/pending");
      return data;
    } catch (err) {
      console.error("Error fetching pending orders:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to fetch pending orders" };
    }
  };

  // Get pending orders count (for Navbar badge)
  export const getPendingOrdersCountAdmin = async () => {
    try {
      const { data } = await API.get("/orders/admin/pending/count");
      return data.count || 0;
    } catch (err) {
      console.error("Error fetching pending orders count:", err.response?.data || err.message);
      throw err.response?.data || { message: "Failed to fetch pending orders count" };
    }
  };

    // =================== STRIPE ===================

    // Create Stripe Checkout Session
export const createCheckoutSession = async (orderId) => {
  try {
    const { data } = await API.post("/payments/create-session", { orderId });
    return data.url;  
  } catch (err) {
    console.error("Error creating Stripe checkout session:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to create Stripe session" };
  }
};

    // =================== CART ===================
// Generate or retrieve guestId
export const getGuestId = () => {
  if (typeof window === "undefined") return null;
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = crypto.randomUUID(); // create new guestId
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};

// ------------------ Fetch Cart ------------------
export const fetchCart = async () => {
  try {
    const guestId = getGuestId();
    const res = await API.get("/cart", { params: { guestId } });
    return res.data || { items: [] };
  } catch (err) {
    console.error("Error fetching cart:", err.response?.data || err.message);
    return { items: [] };
  }
};

// ------------------ Sync Entire Cart ------------------
export const syncCart = async (cart) => {
  try {
    if (!Array.isArray(cart)) cart = [];
    const guestId = getGuestId();
    const res = await API.post("/cart/sync", { cart, guestId });
    return res.data;
  } catch (err) {
    console.error("Error syncing cart:", err.response?.data || err.message);
    return null;
  }
};

// ------------------ Update Single Cart Item ------------------
export const updateCartItem = async (productId, quantity) => {
  try {
    const guestId = getGuestId();
    const res = await API.patch(`/cart/item/${productId}`, { quantity, guestId });
    return res.data;
  } catch (err) {
    console.error("Error updating cart item:", err.response?.data || err.message);
    return null;
  }
};

// ------------------ Remove Single Cart Item ------------------
export const removeCartItem = async (productId) => {
  try {
    const guestId = getGuestId();
    const res = await API.delete(`/cart/item/${productId}`, { data: { guestId } });
    return res.data;
  } catch (err) {
    console.error("Error removing cart item:", err.response?.data || err.message);
    return null;
  }
};

// ------------------ Clear Entire Cart ------------------
export const clearCartApi = async () => {
  try {
    const guestId = getGuestId();
    const res = await API.delete("/cart", { data: { guestId } });
    return res.data;
  } catch (err) {
    console.error("Error clearing cart:", err.response?.data || err.message);
    return null;
  }
};

    export default API;
