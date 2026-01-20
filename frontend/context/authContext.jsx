// context/authContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser, logoutUser } from "@/lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Logged-in user info
  const [token, setToken] = useState(null); // JWT token
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safe

    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (err) {
      console.error("AuthProvider localStorage error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, password, role = "customer" }) => {
    try {
      const userData = await loginUser({ email, password, role });
      setUser(userData);
      setToken(localStorage.getItem("token"));
      return userData;
    } catch (err) {
      throw err.message || "Login failed";
    }
  };

  const register = async ({ name, email, password, role = "customer" }) => {
    try {
      const userData = await registerUser({ name, email, password, role });
      setUser(userData);
      setToken(localStorage.getItem("token"));
      return userData;
    } catch (err) {
      throw err.message || "Registration failed";
    }
  };

  const logout = async () => {
    logoutUser();
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
