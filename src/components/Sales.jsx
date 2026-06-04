import React, { useState, useEffect } from "react";
import { getData, saveData } from "../utils/storage";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [summaries, setSummaries] = useState([]);

  // 🔐 FIXED ROLE DETECTION (STANDARDIZED)
  const role = localStorage.getItem("auth_role") || "staff";

  const [selected, setSelected] = useState("");
  const [qty, setQty] = useState("");
  const [editId, setEditId] = useState(null);

  const [reopened, setReopened] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setProducts(getData("products") || []);
    setSales(getData("sales") || []);
    setSummaries(getData("dailySummary") || []);
  }, []);

  const alreadyClosed =
    summaries.some((s) => s.date === today) && !reopened;

  /* ================= ADD / UPDATE SALE ================= */

  const addSale = () => {
    if (alreadyClosed) return alert("⚠️ Shift is closed");

    const product = products.find((p) => p.id === Number(selected));
    const quantity = Number(qty);

    if (!product) return alert("Select product");
    if (!quantity) return alert("Enter quantity");
    if (product.stock < quantity)
      return alert("Not enough stock");

    const total = product.price * quantity;
    const profit = (product.price - product.cost) * quantity;

    let updatedSales;

    if (editId) {
      updatedSales = sales.map((s) =>
        s.id === editId
          ? { ...s, qty: quantity, total, profit }
          : s
      );
    } else {
      updatedSales = [
        ...sales,
        {
          id: Date.now(),
          productId: product.id,
          name: product.name,
          qty: quantity,
          total,
          profit,
          date: today,
        },
      ];
    }

    const updatedProducts = products.map((p) =>
      p.id === product.id
        ? { ...p, stock: p.stock - quantity }
        : p
    );

    setSales(updatedSales);
    setProducts(updatedProducts);

    saveData("sales", updatedSales);
    saveData("products", updatedProducts);

    setSelected("");
    setQty("");
    setEditId(null);
  };

  /* ================= SHIFT ACTIONS ================= */

  const closeShift = () => {
    const todaySales = sales.filter((s) => s.date === today);

    const summary = {
      date: today,
      totalSales: todaySales.reduce((s, v) => s + v.total, 0),
      totalProfit: todaySales.reduce((s, v) => s + v.profit, 0),
      itemsSold: todaySales.reduce((s, v) => s + v.qty, 0),
    };

    const updated = [...summaries, summary];

    setSummaries(updated);
    saveData("dailySummary", updated);

    const remaining = sales.filter((s) => s.date !== today);

    setSales(remaining);
    saveData("sales", remaining);

    setReopened(false);

    alert("✅ Shift Closed");
  };

  const reopenShift = () => {
    if (role !== "admin") {
      return alert("❌ Only admin can reopen shifts");
    }

    const updated = summaries.filter((s) => s.date !== today);

    setSummaries(updated);
    saveData("dailySummary", updated);

    setReopened(true);

    alert("🔓 Shift Reopened");
  };

  /* ================= UI ================= */

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>💰 Sales</h2>

        <span
          style={{
            ...styles.roleBadge,
            background: role === "admin" ? "#7c3aed" : "#16a34a",
          }}
        >
          {role.toUpperCase()}
        </span>
      </div>

      {/* INPUT CARD */}
      <div style={styles.card}>
        <h3 style={{ marginBottom: 10 }}>
          ➕ Add / Update Sale
        </h3>

        <div style={styles.formRow}>
          <select
            style={styles.input}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Stock: {p.stock})
              </option>
            ))}
          </select>

          <input
            style={styles.input}
            type="number"
            value={qty}
            placeholder="Qty"
            onChange={(e) => setQty(e.target.value)}
          />
        </div>

        <button style={styles.addBtn} onClick={addSale}>
          {editId ? "Update Sale" : "Add Sale"}
        </button>
      </div>

      {/* SHIFT CONTROLS */}
      <div style={styles.shiftRow}>
        {!alreadyClosed && (
          <button style={styles.closeBtn} onClick={closeShift}>
            🔒 Close Shift
          </button>
        )}

        {role === "admin" && alreadyClosed && (
          <button style={styles.reopenBtn} onClick={reopenShift}>
            🔓 Reopen Shift
          </button>
        )}
      </div>

      {/* SALES LIST */}
      <h3 style={{ marginTop: 20 }}>🧾 Today’s Sales</h3>

      {sales.filter((s) => s.date === today).length === 0 ? (
        <p style={{ color: "#777" }}>No sales today</p>
      ) : (
        sales
          .filter((s) => s.date === today)
          .map((s) => (
            <div key={s.id} style={styles.saleCard}>
              <div>
                <b>{s.name}</b>

                <p style={styles.small}>
                  Qty: {s.qty} | Total: Ksh {s.total}
                </p>

                {role === "admin" && (
                  <p style={{ ...styles.small, color: "#22c55e" }}>
                    Profit: Ksh {s.profit}
                  </p>
                )}
              </div>

              {/* ACTIONS */}
              {!alreadyClosed && (
                <div style={styles.btnRow}>
                  <button
                    style={styles.editBtn}
                    onClick={() => {
                      setEditId(s.id);
                      setSelected(s.productId);
                      setQty(s.qty);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => {
                      const updated = sales.filter(
                        (x) => x.id !== s.id
                      );
                      setSales(updated);
                      saveData("sales", updated);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
      )}
    </div>
  );
}

/* ================= STYLES (NO BACKGROUND CHANGE) ================= */

const styles = {
  container: {
    padding: 20,
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  roleBadge: {
    padding: "4px 10px",
    borderRadius: 20,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  card: {
    marginTop: 15,
    padding: 15,
    border: "1px solid #ddd",
    borderRadius: 12,
    background: "rgba(255,255,255,0.4)",
  },

  formRow: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    outline: "none",
  },

  addBtn: {
    padding: 10,
    width: "100%",
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "white",
    cursor: "pointer",
  },

  shiftRow: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },

  closeBtn: {
    padding: 10,
    border: "none",
    borderRadius: 8,
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },

  reopenBtn: {
    padding: 10,
    border: "none",
    borderRadius: 8,
    background: "#22c55e",
    color: "white",
    cursor: "pointer",
  },

  saleCard: {
    marginTop: 10,
    padding: 12,
    border: "1px solid #eee",
    borderRadius: 10,
    background: "rgba(255,255,255,0.4)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  small: {
    fontSize: 12,
    color: "#666",
  },

  btnRow: {
    display: "flex",
    gap: 8,
  },

  editBtn: {
    padding: "6px 10px",
    border: "none",
    borderRadius: 8,
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "6px 10px",
    border: "none",
    borderRadius: 8,
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },
};