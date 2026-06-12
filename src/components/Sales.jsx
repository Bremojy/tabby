import React, { useState, useEffect } from "react";
import { getData, saveData } from "../utils/storage";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [summaries, setSummaries] = useState([]);
const [editId, setEditId] = useState(null);
 const today = new Date().toISOString().split("T")[0];

const reopenKey = `reopened_${today}`;

const [reopened, setReopened] = useState(
  localStorage.getItem(reopenKey) === "true"
);

  const [selected, setSelected] = useState("");
  const [qty, setQty] = useState("");

  const role = localStorage.getItem("auth_role") || "staff";


  const loadProducts = async () => {
  try {
    const res = await fetch(
      "https://tabby-shop-backend.onrender.com/api/products"
    );

    const data = await res.json();

    setProducts(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Failed to load products", err);
  }
};

 

  /* ================= LOAD DATA ================= */
useEffect(() => {
  const loadAll = async () => {
    try {
      await loadProducts();

      const res = await fetch(
        "https://tabby-shop-backend.onrender.com/api/sales",
        {
          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem("token"),
          },
        }
      );

      const salesData = await res.json();

      setSales(
        Array.isArray(salesData)
          ? salesData
          : []
      );

      const summaryData =
        getData("dailySummary") || [];

      setSummaries(summaryData);
    } catch (err) {
      console.error(
        "Failed loading sales",
        err
      );
    }
  };

  loadAll();
}, []);
  useEffect(() => {
  const checkReopen = () => {
    setReopened(localStorage.getItem(reopenKey) === "true");
  };

  const interval = setInterval(checkReopen, 1000);

  return () => clearInterval(interval);
}, [reopenKey]);
const alreadyClosed =
  summaries.some((s) => s.date === today) && !reopened;

  /* ================= ADD SALE ================= */
  const addSale = async () => {
  if (alreadyClosed)
    return alert("⚠️ Shift is closed");

  const product = products.find(
    (p) =>
      String(p._id) === String(selected) ||
      String(p.id) === String(selected)
  );

  const quantity = Number(qty);

  console.log("Selected ID:", selected);
  console.log("Products:", products);

  if (!product) return alert("Select product");

  if (!quantity || quantity <= 0)
    return alert("Invalid quantity");

  if (product.stock < quantity)
    return alert("Not enough stock");

  try {
    /* ================= EDIT SALE ================= */
    if (editId) {
      const updateRes = await fetch(
        `https://tabby-shop-backend.onrender.com/api/sales/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " +
              localStorage.getItem("token"),
          },
          body: JSON.stringify({
            qty: quantity,
          }),
        }
      );

      const updateData = await updateRes.json();

      if (!updateRes.ok) {
        return alert(
          updateData.error || "Failed to update sale"
        );
      }

      await loadProducts();
      window.dispatchEvent(new Event("storage"));

      const salesRes = await fetch(
        "https://tabby-shop-backend.onrender.com/api/sales",
        {
          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem("token"),
          },
        }
      );

      const salesData = await salesRes.json();

      setSales(salesData);

      setSelected("");
      setQty("");
      setEditId(null);

      alert("✅ Sale updated");

      return;
    }

    /* ================= ADD SALE ================= */
    const addRes = await fetch(
      "https://tabby-shop-backend.onrender.com/api/sales",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },
        body: JSON.stringify({
          productId: product._id,
          qty: quantity,
        }),
      }
    );

    const text = await addRes.text();

console.log("SERVER RESPONSE:", text);

let addData = {};
try {
  addData = JSON.parse(text);
} catch {}

    if (!addRes.ok) {
      return alert(
        addData.error || "Failed to save sale"
      );
    }

    await loadProducts();
    window.dispatchEvent(new Event("storage"));

    const salesRes = await fetch(
      "https://tabby-shop-backend.onrender.com/api/sales",
      {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem("token"),
        },
      }
    );

    const salesData = await salesRes.json();

    setSales(salesData);

    setSelected("");
    setQty("");
    setEditId(null);

    alert("✅ Sale added");
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  /* ================= DELETE ================= */
  const deleteSale = async (id) => {
  try {
    const res = await fetch(
      `https://tabby-shop-backend.onrender.com/api/sales/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return alert(data.error || "Failed to delete sale");
    }

    await loadProducts();

    const salesRes = await fetch(
      "https://tabby-shop-backend.onrender.com/api/sales",
      {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    setSales(await salesRes.json());

    window.dispatchEvent(new Event("storage"));

    alert("✅ Sale deleted");
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  

  /* ================= STATS ================= */
  console.log("Loaded Sales:", sales);
  const todaySales = sales.filter(
  (s) =>
    s.date &&
    s.date.slice(0, 10) === today
);
  const totalSalesAmount = todaySales.reduce(
  (sum, sale) => sum + Number(sale.total || 0),
  0
);

  const totalProfit = todaySales.reduce(
  (sum, sale) => sum + Number(sale.profit || 0),
  0
);

  const closeShift = () => {
  const summary = {
    date: today,
    totalSales: todaySales.reduce(
      (a, b) => a + b.total,
      0
    ),
    totalProfit: todaySales.reduce(
      (a, b) => a + b.profit,
      0
    ),
    itemsSold: todaySales.reduce(
      (a, b) => a + b.qty,
      0
    ),
    salesData: [...todaySales],
  };

  const updated = [
  ...summaries.filter((s) => s.date !== today),
  summary,
];

  setSummaries(updated);

  saveData("dailySummary", updated);

  localStorage.removeItem(reopenKey);

  setReopened(false);

  alert("✅ Shift Closed");
};
const reopenShift = () => {
  if (role !== "admin")
    return alert("Admin only");

  const updated = summaries.filter(
    (s) => s.date !== today
  );

  setSummaries(updated);

  saveData("dailySummary", updated);

  localStorage.setItem(reopenKey, "true");

  setReopened(true);

  window.dispatchEvent(new Event("storage"));

  alert("🔓 Shift Reopened");
};

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>💰 Sales Dashboard</h2>
          <p style={styles.subText}>Manage daily sales efficiently</p>
        </div>

        <span style={styles.badge(role)}>
          {role.toUpperCase()}
        </span>
      </div>

      {/* STATS CARDS */}
      <div style={styles.statsRow}>
  <div style={styles.statCard}>
    <h3>{todaySales.length}</h3>
    <p>Transactions</p>
  </div>

  <div style={styles.statCard}>
    <h3>Ksh {totalSalesAmount.toLocaleString()}</h3>
    <p>Total Sales</p>
  </div>

  {role === "admin" && (
    <div style={styles.statCard}>
      <h3>Ksh {totalProfit.toLocaleString()}</h3>
      <p>Total Profit</p>
    </div>
  )}

  <div style={styles.statCard}>
    <h3>{products.length}</h3>
    <p>Products</p>
  </div>
</div>

      {/* ADD SALE CARD */}
      <div style={styles.card}>
        <h3>➕ Add Sale</h3>

        <div style={styles.row}>
          <select
  style={styles.input}
  value={selected}
  onChange={(e) => {
    console.log("Selected:", e.target.value);
    setSelected(e.target.value);
  }}
>
  <option value="">Select Product</option>

  {products.map((p) => (
    <option
  key={p._id || p.id}
  value={String(p._id || p.id)}
>
      {p.name} (Stock: {p.stock})
    </option>
  ))}
</select>

          <input
            style={styles.input}
            type="number"
            placeholder="Qty"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <button style={styles.button} onClick={addSale}>
  {editId ? "Update" : "Add"}
</button>
        </div>
      </div>

      <div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 15,
  }}
>
  {!alreadyClosed && (
    <button
      style={{
        ...styles.button,
        background: "#ef4444",
      }}
      onClick={closeShift}
    >
      🔒 Close Shift
    </button>
  )}

  {role === "admin" && alreadyClosed && (
    <button
      style={{
        ...styles.button,
        background: "#22c55e",
      }}
      onClick={reopenShift}
    >
      🔓 Reopen Shift
    </button>
  )}
</div>

      {/* SALES LIST */}
      <h3 style={{ marginTop: 20 }}>📊 Today Sales</h3>

      {todaySales.length === 0 ? (
        <p style={{ color: "#777" }}>No sales yet</p>
      ) : (
        todaySales.map((s) => (
  <div key={s._id} style={styles.saleCard}>
            <div>
              <b style={{ fontSize: 16 }}>{s.name}</b>
              <p style={styles.small}>
                Qty: {s.qty} | Total: Ksh {s.total}
              </p>
              {role === "admin" && (
  <p style={{ ...styles.small, color: "#22c55e" }}>
    Profit: Ksh {s.profit}
  </p>
)}
            </div>

<div style={{ display: "flex", gap: 8 }}>
  {!alreadyClosed && (
    <>
      <button
        style={{
          ...styles.deleteBtn,
          background: "#2563eb",
        }}
        onClick={() => {
          setEditId(s._id);
          setSelected(String(s.productId));
          setQty(s.qty);
        }}
      >
        Edit
      </button>

      <button
        style={styles.deleteBtn}
        onClick={() => deleteSale(s._id)}
      >
        Delete
      </button>
    </>
  )}
</div>
          </div>
        ))
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: 20,
    fontFamily: "Arial",
    background: "#f9fafb",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  subText: {
    margin: 0,
    color: "#666",
    fontSize: 13,
  },

  badge: (role) => ({
    padding: "6px 12px",
    borderRadius: 20,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    background: role === "admin" ? "#7c3aed" : "#16a34a",
  }),

  statsRow: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
  marginBottom: 20,
},

  statCard: {
    padding: 15,
    background: "white",
    borderRadius: 12,
    textAlign: "center",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  },

  card: {
    padding: 15,
    background: "white",
    borderRadius: 12,
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  },

  row: {
    display: "flex",
    gap: 10,
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    outline: "none",
  },

  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: 8,
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },

  saleCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    background: "white",
    borderRadius: 10,
    marginBottom: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  small: {
    fontSize: 13,
    color: "#444",
    margin: 2,
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