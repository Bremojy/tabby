import React, { useState, useEffect } from "react";

import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Sales from "./components/Sales";
import Summary from "./components/Summary";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [page, setPage] = useState("dashboard");
  const [authPage, setAuthPage] = useState("login");
  const [showProfile, setShowProfile] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState(() =>
    localStorage.getItem("loggedInUser")
  );

  const [role, setRole] = useState(() =>
    localStorage.getItem("auth_role") || "staff"
  );

  useEffect(() => {
    const syncAuth = () => {
      setLoggedInUser(localStorage.getItem("loggedInUser"));
      setRole(localStorage.getItem("auth_role") || "staff");
    };

    window.addEventListener("storage", syncAuth);
    syncAuth();

    return () => window.removeEventListener("storage", syncAuth);
  }, []);

 const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "products", label: "Products" },
  { id: "sales", label: "Sales" },
  { id: "summary", label: "Monthly Summary" },


  ...(role === "admin"
    ? [{ id: "signup", label: "Create Staff" }]
    : []),
];

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
  return role === "admin" ? <Signup /> : null;
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

  // AUTH SCREEN
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

        {/* NAV */}
        <nav style={{ display: "flex", gap: 10 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              style={btnStyle(page === item.id)}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* PROFILE SECTION */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setShowProfile(!showProfile)}
            style={styles.avatar}
          >
            {loggedInUser?.charAt(0).toUpperCase()}
          </div>

          {/* PROFILE CARD */}
          {showProfile && (
            <div style={styles.profileCard}>
              <h4 style={{ marginBottom: 10 }}>👤 Profile</h4>

              <p><b>User:</b> {loggedInUser}</p>

              <p>
                <b>Role:</b>{" "}
                <span style={{ color: role === "admin" ? "#a855f7" : "#22c55e" }}>
                  {role.toUpperCase()}
                </span>
              </p>

              <p>
                <b>Status:</b>{" "}
                <span style={{ color: "#16a34a" }}>Online</span>
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

      {/* MAIN */}
      <main style={{ padding: 20 }}>{renderPage()}</main>
    </div>
  );
}

export default App;

/* STYLES */
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
    backdropFilter: "blur(10px)",
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