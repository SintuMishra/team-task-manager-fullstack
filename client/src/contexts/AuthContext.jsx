import { createContext, useEffect, useState } from "react";
import { loginRequest, meRequest, signupRequest, updateProfileRequest } from "../api/auth";

const TOKEN_KEY = "team-task-manager-token";
const USER_KEY = "team-task-manager-user";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const persistSession = ({ token, user: nextUser }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { user: currentUser } = await meRequest();
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      setUser(currentUser);
    } catch (error) {
      clearSession();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (values) => {
    const response = await loginRequest(values);
    persistSession(response);
    return response;
  };

  const signup = async (values) => {
    const response = await signupRequest(values);
    persistSession(response);
    return response;
  };

  const logout = () => {
    clearSession();
  };

  const updateProfile = async (values) => {
    const { user: updatedUser } = await updateProfileRequest(values);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
