import React, { useState } from "react";
import "./App.css";

import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Sales from "./components/Sales";
import Summary from "./components/Summary";

function App() {
  const [page, setPage] = useState("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "products", label: "Products" },
    { id: "sales", label: "Sales" },
    { id: "summary", label: "Monthly Summary" },
  ];

  // 🎨 Button styling
  const btnStyle = (active) => ({
    padding: "10px 18px",
    margin: "5px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    background: active ? "#2563eb" : "#e5e7eb",
    color: active ? "white" : "#111",
    fontWeight: "bold",
    transition: "0.2s",
  });

  // 🔥 SAFE COMPONENT WRAPPER (prevents blank screen crash)
  const SafeRender = ({ children }) => {
    try {
      return children;
    } catch (err) {
      console.error("Page crashed:", err);
      return (
        <div style={{ padding: 20, color: "red" }}>
          ⚠️ Error loading this section. Check console.
        </div>
      );
    }
  };

  // 🔥 PAGE RENDERER
  const renderPage = () => {
    const pages = {
      dashboard: <Dashboard />,
      products: <Products />,
      sales: <Sales />,
      summary: <Summary />,
    };

    return (
      <SafeRender>
        {pages[page] || <h3>Page not found</h3>}
      </SafeRender>
    );
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>📊 TABBY SHOP POS SYSTEM</h1>

        <nav style={styles.nav}>
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
      </header>

      {/* MAIN CONTENT */}
      <main style={styles.main}>{renderPage()}</main>
    </div>
  );
}

export default App;

// 🎨 STYLES
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: 20,
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    marginBottom: 10,
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  main: {
    background: "#f9fafb",
    padding: 20,
    borderRadius: 12,
    minHeight: "70vh",
  },
};