import { useState, useEffect } from "react";


function parseJwt(token) {
  try {
    return JSON.parse(
      window.atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
  } catch {
    return {};
  }
}


export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem("lab_token"));


  useEffect(() => {
    function handleStorageChange() {
      setToken(localStorage.getItem("lab_token"));
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const user = token ? parseJwt(token) : null;

  async function logout() {
    try {
      await fetch("/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed", err);
    }
    localStorage.removeItem("lab_token");

    setToken(null);
  }

  return { token, user, logout };
}
