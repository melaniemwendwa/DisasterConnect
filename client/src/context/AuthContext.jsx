import React, { createContext, useState, useEffect, useContext } from "react";
import Api from "../Services/Api";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    try {
      const res = await Api.post(
        "/login",
        { email, password },
        { withCredentials: true } 
      );
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await Api.post("/logout", {}, { withCredentials: true }); 
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await Api.get("/check_session", { withCredentials: true });
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
