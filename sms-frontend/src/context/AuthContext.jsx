import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Default user to bypass authentication
  const defaultUser = {
    id: 1,
    email: "admin@school.com",
    name: "Admin User",
    role: "admin",
  };

  const [user, setUser] = useState(defaultUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-authenticate with default user for demo purposes
    // This bypasses the login/register step
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("user", JSON.stringify(defaultUser));
    setUser(defaultUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.msg || "Login failed" };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || "Login failed",
      };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const data = await authService.register(name, email, password, role);
      if (data.user) {
        return { success: true };
      }
      return { success: false, error: data.msg || "Registration failed" };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    // Helper to check roles
    hasRole: (roles) => {
      if (!user) return false;
      if (Array.isArray(roles)) {
        return roles.includes(user.role);
      }
      return user.role === roles;
    },
    isAdmin: user?.role === "admin",
    isTeacher: user?.role === "teacher",
    isStudent: user?.role === "student",
    isParent: user?.role === "parent",
    isAccountant: user?.role === "accountant",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
