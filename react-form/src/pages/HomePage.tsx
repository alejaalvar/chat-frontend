import { useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100 bg-body-secondary">
      <nav className="navbar navbar-expand-md bg-body-secondary shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold">
            <i className="bi bi-chat-dots-fill text-primary me-2"></i>Chat App
          </span>
          <button
            className="navbar-toggler border-0"
            onClick={() => setNavOpen((o) => !o)}
            aria-expanded={navOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse${navOpen ? " show" : ""}`}>
            <div className="ms-auto d-flex gap-2 py-2 py-md-0">
              <Link to="/login" className="btn btn-outline-primary rounded-pill px-4">
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary rounded-pill px-4">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1 d-flex align-items-center py-5">
        <div className="container text-center">
          <h1 className="display-5 fw-bold mb-3">
            Welcome to{" "}
            <span className="badge bg-primary text-white rounded-pill px-3 py-2">
              Chat App
            </span>
          </h1>

          <p className="lead text-secondary col-md-8 mx-auto mb-4">
            Chat App started as a backend project for a web development class — a REST API for
            a messaging service. Over time it became a personal learning project to better
            understand fullstack development and sharpen my skills across the whole web stack,
            from database to UI.
          </p>

          <p className="text-muted col-md-8 mx-auto mb-5">
            This app is simple by design. It asks only for what it needs to work, it doesn't
            track you, and your information stays yours. No analytics, no ads, no noise — just
            a straightforward place to send messages.
          </p>

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/login" className="btn btn-outline-primary btn-lg rounded-pill px-5">
              Log In
            </Link>
            <Link to="/signup" className="btn btn-primary btn-lg rounded-pill px-5">
              Get Started
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center text-muted py-3 border-top small">
        © 2026 Alejandro Alvarado
      </footer>
    </div>
  );
}

export default HomePage;
