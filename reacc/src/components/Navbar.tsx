import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import sureLogo from "../assets/img/sure.png";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-base shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-2xl font-bold no-underline"
        >
          <img src={sureLogo} alt="Open Science Logo" className="h-24 w-auto" />
          <span>
            open <span className="font-light">science</span>
          </span>
        </Link>


        <nav className="flex items-center gap-6 text-sm font-semibold">
          {user ? (
            <>
              <Link
                to="/manage"
                className="text-ink-muted hover:text-primary transition-colors"
              >
                Manage requests
              </Link>
              <span className="text-ink-muted">
                Signed in as{" "}
                <strong className="text-ink">
                  {user.username || "Scientist"}
                </strong>
              </span>
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-800 font-semibold transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="text-ink-muted hover:text-primary transition-colors"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="bg-primary text-white px-5 py-2.5 rounded-md hover:bg-primary-dark transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
