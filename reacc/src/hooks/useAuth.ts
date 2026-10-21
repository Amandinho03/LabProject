import { useState, useEffect } from "react";
import { AUTH_CHANGE_EVENT, clearSession } from "../lib/api"; 

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

function parseJwt(token: string): AuthUser | null {
  try {
    return JSON.parse(
      window.atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
  } catch {
    return null;
  }
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("lab_token"));

  useEffect(() => {
    function sync() {
      setToken(localStorage.getItem("lab_token"));
    }
    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_CHANGE_EVENT, sync);
    };
  }, []);

  const user = token ? parseJwt(token) : null;

  async function logout(): Promise<void> {
    try {
      await fetch("/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed", err);
    }
    clearSession();
  }

  return { token, user, logout };
}