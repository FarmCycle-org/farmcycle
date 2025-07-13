import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: "", user: null });
  const [loading, setLoading] = useState(true); // Keep loading state for initial read

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        setAuth({
          token,
          user: JSON.parse(user),
        });
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        // Clear storage if parsing fails to prevent infinite loop or bad state
        localStorage.clear();
      }
    }
    setLoading(false); // Set loading to false once the initial check is done
  }, []); // Empty dependency array ensures this runs once on mount

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
      {children} {/* <-- ALWAYS RENDER CHILDREN HERE */}
    </AuthContext.Provider>
  );
};

export default AuthProvider;