import { useState, useEffect, FormEvent } from "react";
import { saveToken } from "../lib/api";
import { useNavigate, Link } from "react-router-dom";
import AuthHeroPanel from "../components/AuthHeroPanel";
import StatusMessage from "../components/StatusMessage";
import logo from "../assets/logo.svg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("lab_token")) {
      navigate("/manage", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        saveToken(data.accesstoken);
        navigate("/manage");
      } else {
        setError(data.error || data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error. Is the server running?");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[45%_1fr]">
      <AuthHeroPanel />

      <div className="flex flex-col justify-center items-center p-8 w-full">
        <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-md border border-gray-100">
          <div className="flex justify-center mb-8">
            <Link to="/">
              <img
                src={logo}
                alt="Research Institute Logo"
                className="h-44 w-auto object-contain"
              />
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Sign in to Open Science
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email / User Id
              </label>
              <input
                type="text"
                id="username"
                autoComplete="username"
                placeholder="Please enter your email or ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                placeholder="Please enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center text-sm mt-2">
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Create an account
              </Link>
              <Link
                to="/forgot"
                className="text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <StatusMessage text={error} variant="error" />
        </div>
      </div>
    </div>
  );
}