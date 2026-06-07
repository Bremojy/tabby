import React, { useState, useEffect } from "react";

import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Sales from "./components/Sales";
import Summary from "./components/Summary";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Accounts from "./components/Accounts";

function App() {
  const [page, setPage] = useState("dashboard");
  const [showProfile, setShowProfile] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const [loggedInUser, setLoggedInUser] = useState(() =>
    localStorage.getItem("loggedInUser")
  );

  const [role, setRole] = useState(() =>
    localStorage.getItem("auth_role") || "staff"
  );

  /* ================= SYNC AUTH ================= */
  useEffect(() => {
    const syncAuth = () => {
      setLoggedInUser(localStorage.getItem("loggedInUser"));
      setRole(localStorage.getItem("auth_role") || "staff");
    };

    window.addEventListener("storage", syncAuth);
    syncAuth();

    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  /* ================= ACTIVITY TRACKING ================= */
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);
    window.addEventListener("touchstart", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("touchstart", updateActivity);
    };
  }, []);

  /* ================= AUTO LOGOUT ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Date.now() - lastActivity;
      const TIMEOUT = 10 * 60 * 1000;

      if (loggedInUser && diff > TIMEOUT) {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("auth_role");

        setLoggedInUser(null);
        setRole("staff");

        alert("⏰ Logged out due to inactivity");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [lastActivity, loggedInUser]);

  /* ================= NAV ITEMS ================= */
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "products", label: "Products" },
    { id: "sales", label: "Sales" },
    { id: "summary", label: "Monthly Summary" },

    ...(role === "admin"
      ? [
          { id: "signup", label: "Create Staff" },
          { id: "accounts", label: "Accounts" },
        ]
      : []),
  ];

  /* ================= PAGE ROUTER ================= */
  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products role={role} />;
      case "sales":
        return <Sales role={role} />;
      case "summary":
        return <Summary role={role} />;
      case "signup":
        return role === "admin" ? <Signup /> : <Dashboard />;
      case "accounts":
        return role === "admin" ? <Accounts /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  const btnStyle = (active) => ({
    padding: "10px 14px",
    border: "none",
    borderRadius: 20,
    cursor: "pointer",
    background: active ? "#2563eb" : "transparent",
    color: active ? "white" : "#d1d5db",
    fontWeight: "600",
  });

  /* ================= AUTH SCREEN ================= */
  if (!loggedInUser) {
    return (
      <div style={{ fontFamily: "Arial" }}>
        <header style={{ padding: 20, background: "#111827", color: "white" }}>
          <h1>📊 TABBY SHOP POS</h1>
        </header>

        <div style={{ padding: 20 }}>
          <Login />
        </div>
      </div>
    );
  }

  /* ================= MAIN APP ================= */
  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh" }}>
      {/* NAVBAR */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 15,
          background: "#111827",
          color: "white",
          position: "relative",
        }}
      >
        <div style={{ fontWeight: "bold" }}>📊 Tabby POS</div>

        <nav style={{ display: "flex", gap: 10 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              style={btnStyle(page === item.id)}
              onClick={() => {
                setPage(item.id);
                setShowProfile(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* PROFILE */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setShowProfile(!showProfile)}
            style={styles.avatar}
          >
            {loggedInUser?.charAt(0).toUpperCase()}
          </div>

          {showProfile && (
            <div style={styles.profileCard}>
              <h4>👤 Profile</h4>

              <p>
                <b>User:</b> {loggedInUser}
              </p>

              <p>
                <b>Role:</b>{" "}
                <span
                  style={{
                    color: role === "admin" ? "#a855f7" : "#22c55e",
                  }}
                >
                  {role.toUpperCase()}
                </span>
              </p>

              <button
                style={styles.logout}
                onClick={() => {
                  localStorage.removeItem("loggedInUser");
                  localStorage.removeItem("auth_role");

                  setLoggedInUser(null);
                  setRole("staff");
                  setShowProfile(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main style={{ padding: 20 }}>{renderPage()}</main>
    </div>
  );
}

export default App;

/* ================= STYLES ================= */
const styles = {
  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  },

  profileCard: {
    position: "absolute",
    right: 0,
    top: 50,
    width: 230,
    background: "rgba(17,24,39,0.95)",
    color: "white",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
    zIndex: 999,
  },

  logout: {
    marginTop: 10,
    width: "100%",
    padding: "8px 12px",
    border: "none",
    borderRadius: 8,
    background: "red",
    color: "white",
    cursor: "pointer",
  },
};