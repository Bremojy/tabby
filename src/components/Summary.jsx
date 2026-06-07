import React, { useState, useEffect } from "react";

const PRODUCTS_URL = "http://localhost:5000/api/products";
const SALES_URL = "http://localhost:5000/api/sales";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [shiftClosed, setShiftClosed] = useState(false);

  const [selected, setSelected] = useState("");
  const [qty, setQty] = useState("");

  const role = (localStorage.getItem("auth_role") || "staff").toLowerCase();
  const token = localStorage.getItem("token");

  const today = new Date().toISOString().split("T")[0];
  const shiftKey = `shift_closed_${today}`;

  const isAdmin = role === "admin";

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchProducts();
    fetchSales();

    const savedShift = localStorage.getItem(shiftKey);
    setShiftClosed(savedShift === "true");

    const interval = setInterval(() => {
      fetchProducts();
      fetchSales();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(PRODUCTS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch(SALES_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= ADD SALE ================= */
  const addSale = async () => {
    if (shiftClosed) return alert("⚠️ Shift is closed");

    const product = products.find((p) => p._id === selected);
    const quantity = Number(qty);

    if (!product) return alert("Select product");
    if (!quantity || quantity <= 0) return alert("Invalid quantity");
    if (product.stock < quantity) return alert("Not enough stock");

    await fetch(SALES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product._id,
        qty: quantity,
        date: today,
      }),
    });

    setSelected("");
    setQty("");

    fetchSales();
    fetchProducts();
  };

  /* ================= CLOSE SHIFT ================= */
  const closeShift = () => {
    if (shiftClosed) return alert("Shift already closed");

    const todaySales = sales.filter((s) => s.date === today);

    if (todaySales.length === 0) {
      return alert("No sales to close");
    }

    localStorage.setItem(shiftKey, "true");
    setShiftClosed(true);

    alert("🔒 Shift Closed Successfully");
  };

  /* ================= REOPEN SHIFT ================= */
  const reopenShift = () => {
    if (!isAdmin) {
      return alert("Only admin can reopen shift");
    }

    localStorage.removeItem(shiftKey);
    setShiftClosed(false);

    alert("🔓 Shift Reopened");
  };

  /* ================= DELETE ================= */
  const deleteSale = async (id) => {
    await fetch(`${SALES_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchSales();
    fetchProducts();
  };

  const todaySales = sales.filter((s) => s.date === today);
  const totalProfit = todaySales.reduce((a, b) => a + (b.profit || 0), 0);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>💰 Sales</h2>

        <span style={styles.badge(role)}>
          {role.toUpperCase()}
        </span>
      </div>

      {/* SHIFT CONTROLS */}
      <div style={styles.shiftBox}>
        {!shiftClosed && (
          <button style={styles.closeBtn} onClick={closeShift}>
            🔒 Close Shift
          </button>
        )}

        {shiftClosed && isAdmin && (
          <button style={styles.reopenBtn} onClick={reopenShift}>
            🔓 Reopen Shift
          </button>
        )}
      </div>

      {/* ADD SALE */}
      <div style={styles.card}>
        <h3>Add Sale</h3>

        <div style={styles.row}>
          <select
            style={styles.input}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (Stock: {p.stock})
              </option>
            ))}
          </select>

          <input
            style={styles.input}
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="Qty"
          />

          <button style={styles.addBtn} onClick={addSale}>
            Add
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div style={styles.summary}>
        <h4>Today Summary</h4>
        <p>Sales: {todaySales.length}</p>

        {/* ONLY ADMIN SEES PROFIT */}
        {isAdmin && (
          <p style={{ color: "green" }}>
            Profit: Ksh {totalProfit}
          </p>
        )}
      </div>

      {/* SALES LIST */}
      <h3>Today Sales</h3>

      {todaySales.map((s) => (
        <div key={s._id} style={styles.cardItem}>
          <div>
            <b>{s.name}</b>
            <p>Qty: {s.qty} | Total: Ksh {s.total}</p>

            {/* ONLY ADMIN SEES PROFIT */}
            {isAdmin && (
              <p style={{ color: "green" }}>
                Profit: Ksh {s.profit}
              </p>
            )}
          </div>

          <button
            style={styles.delBtn}
            onClick={() => deleteSale(s._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: { padding: 20, fontFamily: "Arial" },

  header: {
    display: "flex",
    justifyContent: "space-between",
  },

  badge: (role) => ({
    padding: "6px 12px",
    borderRadius: 20,
    color: "white",
    background: role === "admin" ? "#7c3aed" : "#16a34a",
  }),

  shiftBox: {
    display: "flex",
    gap: 10,
    margin: "10px 0",
  },

  closeBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: 10,
    borderRadius: 8,
  },

  reopenBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: 10,
    borderRadius: 8,
  },

  card: {
    padding: 15,
    border: "1px solid #ddd",
    borderRadius: 10,
    marginBottom: 10,
  },

  row: { display: "flex", gap: 10 },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  addBtn: {
    padding: "10px 15px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 8,
  },

  summary: {
    padding: 10,
    background: "#f3f4f6",
    borderRadius: 10,
    marginBottom: 10,
  },

  cardItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    border: "1px solid #eee",
    borderRadius: 8,
    marginBottom: 8,
  },

  delBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
  },
};