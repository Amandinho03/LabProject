import { useState, useEffect, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthHeroPanel from "../components/AuthHeroPanel";
import StatusMessage from "../components/StatusMessage";
import logo from "../assets/logo.svg";

interface StatusState {
  variant: "success" | "error";
  message?: string;
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<StatusState | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("lab_token")) {
      navigate("/manage", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ variant: "success" });
        setUsername("");
        setPassword("");
      } else {
        let errorText = "Registration invalid.";
        if (data.errors && Array.isArray(data.errors)) {
          errorText = data.errors.map((err: any) => err.message).join(" ");
        } else {
          errorText = data.error || data.message || errorText;
        }
        setStatus({ variant: "error", message: errorText });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setStatus({
        variant: "error",
        message: "Network error. Is the server running?",
      });
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

          <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">
            Create your account
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                autoComplete="username"
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
                autoComplete="new-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          {status?.variant === "success" ? (
            <StatusMessage variant="success">
              Account created.{" "}
              <Link to="/login" className="underline font-bold">
                Sign in now
              </Link>
              .
            </StatusMessage>
          ) : (
            <StatusMessage variant="error" text={status?.message} />
          )}

          <p className="mt-6 text-sm text-center text-gray-500">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}