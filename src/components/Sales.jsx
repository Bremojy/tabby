import React, { useState, useEffect } from "react";
import { getData, saveData } from "../utils/storage";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [summaries, setSummaries] = useState([]);

  const [role, setRole] = useState("staff");

  const [selected, setSelected] = useState("");
  const [qty, setQty] = useState("");

  const today = new Date().toLocaleDateString();

  useEffect(() => {
    setProducts(getData("products") || []);
    setSales(getData("sales") || []);
    setSummaries(getData("dailySummary") || []);
  }, []);

  const alreadyClosed = summaries.some((s) => s.date === today);

  const addSale = () => {
    if (alreadyClosed) return alert("⚠️ Shift already closed for today");

    const product = products.find((p) => p.id === Number(selected));
    const quantity = Number(qty);

    if (!product) return alert("Select product");
    if (!quantity) return alert("Enter quantity");
    if (product.stock < quantity) return alert("Not enough stock");

    const total = product.price * quantity;
    const profit = (product.price - product.cost) * quantity;

    const sale = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      qty: quantity,
      total,
      profit,
      date: today,
    };

    const updatedProducts = products.map((p) =>
      p.id === product.id ? { ...p, stock: p.stock - quantity } : p
    );

    const updatedSales = [...sales, sale];

    setProducts(updatedProducts);
    setSales(updatedSales);

    saveData("products", updatedProducts);
    saveData("sales", updatedSales);

    setQty("");
    setSelected("");
  };

  // 🔒 CLOSE SHIFT
  const closeShift = () => {
    if (role !== "staff") return alert("Only staff can close shift");

    const todaySales = sales.filter((s) => s.date === today);

    const totalSales = todaySales.reduce((sum, s) => sum + s.total, 0);
    const totalProfit = todaySales.reduce((sum, s) => sum + s.profit, 0);
    const itemsSold = todaySales.reduce((sum, s) => sum + s.qty, 0);

    const summary = {
      date: today,
      totalSales,
      totalProfit,
      itemsSold,
    };

    const updated = [...summaries, summary];

    setSummaries(updated);
    saveData("dailySummary", updated);

    alert("✅ Shift closed successfully!");
    setSales([]);
    saveData("sales", []);
  };

  // 🔓 ADMIN REOPEN SHIFT
  const reopenShift = () => {
    if (role !== "admin") return alert("Only admin can reopen shift");

    const password = prompt("Enter admin password:");
    if (password !== "nimda") return alert("❌ Wrong password");

    const updated = summaries.filter((s) => s.date !== today);

    setSummaries(updated);
    saveData("dailySummary", updated);

    alert("🔓 Shift reopened successfully!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💰 Sales</h2>

      {/* ROLE SWITCH */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setRole(role === "staff" ? "admin" : "staff")}>
          Switch Role (Current: {role})
        </button>
      </div>

      {/* PRODUCT SELECT */}
      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} (Stock: {p.stock})
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Qty"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />

      <button onClick={addSale}>Add Sale</button>

      {/* CLOSE SHIFT */}
      {role === "staff" && (
        <div style={{ marginTop: 20 }}>
          <button
            onClick={closeShift}
            disabled={alreadyClosed}
            style={{
              background: alreadyClosed ? "#ccc" : "#ef4444",
              color: "white",
              padding: 10,
              border: "none",
              borderRadius: 6,
              cursor: alreadyClosed ? "not-allowed" : "pointer",
            }}
          >
            🔒 Close Day Shift
          </button>

          {alreadyClosed && (
            <p style={{ color: "green" }}>
              ✅ Shift already closed for today
            </p>
          )}
        </div>
      )}

      {/* ADMIN REOPEN BUTTON */}
      {role === "admin" && alreadyClosed && (
        <div style={{ marginTop: 20 }}>
          <button
            onClick={reopenShift}
            style={{
              background: "#10b981",
              color: "white",
              padding: 10,
              border: "none",
              borderRadius: 6,
            }}
          >
            🔓 Reopen Closed Shift
          </button>
        </div>
      )}

      {/* SALES LIST */}
      <ul>
        {sales.map((s) => (
          <li key={s.id}>
            {s.name} | Qty: {s.qty} | Ksh {s.total} | Profit {s.profit}
          </li>
        ))}
      </ul>
    </div>
  );
}