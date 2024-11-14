import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string;
  signUp: (name: string, email: string, password: string) => Promise<any>;
  logIn: (email: string, password: string) => Promise<any>;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );
  const [user, setUser] = useState<User | null>(getUser(token));

  const apiUrl = "https://localhost:7091/api/Authentication";

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${apiUrl}/signup`, {
        name,
        email,
        password,
        role: 0,
      });

      const respData = response.data.value;
      localStorage.setItem("token", respData.jwt);
      setToken(respData.jwt);
      setUser({
        id: respData.userId,
        role: respData.role,
      });
      return respData;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new Error("A user with this email already exists.");
      }
      if (
        axios.isAxiosError(error) &&
        error.response?.data.errors.Password[0]
      ) {
        throw new Error(error.response.data.errors.Password[0]);
      }
      throw new Error("Sign-up failed. Please try again.");
    }
  };

  const logIn = async (email: string, password: string) => {
    try {
      const response = await axios.get(
        `${apiUrl}/login?UserName=${email}&Password=${password}`
      );

      const respData = response.data.value;
      localStorage.setItem("token", respData.jwt);
      setToken(respData.jwt);
      setUser({
        id: respData.userId,
        role: respData.role,
      });
      return respData;
    } catch (error) {
      throw new Error("Invalid login credentials.");
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function getUser(token: string) {
  if (!token) return null;
  const decoded: { userId: string; role: string } = jwtDecode(token);
  return { id: Number(decoded.userId), role: decoded.role };
}
