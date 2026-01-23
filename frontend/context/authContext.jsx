'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { loginUser, registerUser, logoutUser } from "@/lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Load user from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    console.log("AuthContext mount: storedUser", storedUser, "storedToken", storedToken);

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);

      // ✅ Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      console.log("Axios header set on mount:", axios.defaults.headers.common["Authorization"]);
    }

    setLoading(false);
  }, []);

  // ================= LOGIN =================
const login = async ({ email, password }) => {
  try {
    const res = await loginUser({ email, password });

    if (!res?.token || !res?.user) throw new Error("Login failed");

    const jwtToken = res.token;
    const userData = res.user;

    setUser(userData);
    setToken(jwtToken);

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);

    // Set axios header
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;

    return userData;
  } catch (err) {
    console.error("Login error:", err);
    throw err.message || "Login failed";
  }
};

  // ================= REGISTER =================
  const register = async ({ name, email, password, role = "customer" }) => {
    console.log("Register called with:", { name, email, password, role });

    try {
      const res = await registerUser({ name, email, password, role });
      console.log("RegisterUser response:", res);

      if (!res?.token || !res?.user) {
        console.error("Register failed: token or user missing", res);
        throw new Error("Registration failed: invalid response from server");
      }

      const jwtToken = res.token;
      const userData = res.user;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", jwtToken);

      setUser(userData);
      setToken(jwtToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
      console.log("Axios header set after register:", axios.defaults.headers.common["Authorization"]);

      return userData;
    } catch (err) {
      console.error("Register error caught:", err);
      throw err.message || "Registration failed";
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    console.log("Logout called");
    try {
      await logoutUser();

      setUser(null);
      setToken(null);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      delete axios.defaults.headers.common["Authorization"];
      console.log("Axios header cleared");

      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
