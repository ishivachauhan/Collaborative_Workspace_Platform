import { useState, createContext, useContext, ReactNode } from "react";
import axios from "axios";

// Define the shape of the user object
interface User {
  id: string;
  username: string;
  email: string;
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with an initial value of `null`
const AuthContext = createContext<AuthContextType | null>(null);

// Define the props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

const API_URL =
  "https://collaborative-workspace-platform-backend.onrender.com/api";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user); // Assuming the backend returns a `user` object
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user); // Assuming the backend returns a `user` object
    } catch (error) {
      throw new Error("Signup failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
