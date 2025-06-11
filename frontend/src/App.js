import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./styles/App.css";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TopArtists from "./pages/TopArtists";
import TopTracks from "./pages/TopTracks";

// Components
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  // Initialise state from localStorage if available
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true",
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuthStatus = async () => {
      try {
        console.log("Checking auth status...");
        const response = await fetch("http://127.0.0.1:5001/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("User authenticated:", userData);
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
        } else {
          console.log("Not authenticated, status:", response.status);
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        {isAuthenticated && (
          <Navbar
            onLogout={async () => {
              try {
                await fetch("http://127.0.0.1:5001/auth/logout", {
                  method: "POST",
                  credentials: "include",
                });
              } catch (error) {
                console.error("Logout failed:", error);
              }
              setIsAuthenticated(false);
              // cache buster to hard reload login page
              window.location.href = "/login?logout=" + new Date().getTime();
            }}
          />
        )}
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/top-artists"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <TopArtists />
              </PrivateRoute>
            }
          />
          <Route
            path="/top-tracks"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <TopTracks />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
