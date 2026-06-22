import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, [token]);

  async function login(email, password, remember = true) {
    const response = await fetch("http://localhost:8080/api/auth/autenticar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al iniciar sesión");
    }

    setUser(data.user);
    setToken(data.token);

    
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    

    return data;
  }

  async function register(userData, remember = true) {
    const response = await fetch("http://localhost:8080/api/auth/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al registrarse");
    }

    setUser(data.user);
    setToken(data.token);

    
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
