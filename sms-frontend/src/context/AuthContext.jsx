import { createContext, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Simplified auth context - no login required
  const value = {
    user: { name: "Admin", email: "admin@school.com", role: "admin" },
    login: () => {},
    register: () => {},
    logout: () => {},
    loading: false,
    isAuthenticated: true,
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
