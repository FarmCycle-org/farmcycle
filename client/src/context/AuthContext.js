import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: "", user: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore from localStorage once on mount
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        setAuth({
          token,
          user: JSON.parse(user),
        });
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }
    setLoading(false); // Done loading, allow rendering
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuth({ token: data.token, user: data.user });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: "", user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
