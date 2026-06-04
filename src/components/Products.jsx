import React, { useState, useEffect } from "react";
import { getData, saveData } from "../utils/storage";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // ✅ FIXED ROLE DETECTION (MATCHES SALES.JSX)
  const role = (localStorage.getItem("auth_role") || "staff").toLowerCase();

  const emptyProduct = {
    name: "",
    cost: "",
    price: "",
    stock: "",
  };

  const [editFields, setEditFields] = useState(emptyProduct);
  const [newProduct, setNewProduct] = useState(emptyProduct);

  useEffect(() => {
    const data = getData("products");
    setProducts(Array.isArray(data) ? data : []);
  }, []);

  /* ================= CRUD ================= */

  const startEditing = (product) => {
    if (role !== "admin") return alert("❌ Staff cannot edit products");

    setEditingId(product.id);
    setEditFields({
      name: product.name || "",
      cost: product.cost || "",
      price: product.price || "",
      stock: product.stock || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFields(emptyProduct);
  };

  const saveEdit = (id) => {
    const updated = products.map((p) =>
      p.id === id
        ? {
            ...p,
            name: editFields.name.trim(),
            stock: Number(editFields.stock || 0),
            cost: Number(editFields.cost || 0),
            price: Number(editFields.price || 0),
          }
        : p
    );

    setProducts(updated);
    saveData("products", updated);
    cancelEditing();
  };

  const deleteProduct = (id) => {
    if (role !== "admin") return alert("❌ Staff cannot delete products");

    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveData("products", updated);
  };

  const addProduct = () => {
    if (role !== "admin") return alert("❌ Staff cannot add products");

    if (!newProduct.name.trim())
      return alert("Product name required");

    const product = {
      id: Date.now(),
      name: newProduct.name.trim(),
      stock: Number(newProduct.stock || 0),
      cost: Number(newProduct.cost || 0),
      price: Number(newProduct.price || 0),
    };

    const updated = [...products, product];
    setProducts(updated);
    saveData("products", updated);
    setNewProduct(emptyProduct);
  };

  /* ================= UI ================= */

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>📦 Products</h2>

        <span
          style={{
            ...styles.roleBadge,
            background: role === "admin" ? "#7c3aed" : "#16a34a",
          }}
        >
          {role.toUpperCase()}
        </span>
      </div>

      {/* ADD PRODUCT (ADMIN ONLY) */}
      {role === "admin" && (
        <div style={styles.formCard}>
          <h3 style={{ marginBottom: 10 }}>➕ Add Product</h3>

          <div style={styles.formGrid}>
            <input
              style={styles.input}
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />

            <input
              style={styles.input}
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
            />

            <input
              style={styles.input}
              type="number"
              placeholder="Cost"
              value={newProduct.cost}
              onChange={(e) =>
                setNewProduct({ ...newProduct, cost: e.target.value })
              }
            />

            <input
              style={styles.input}
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
          </div>

          <button style={styles.addBtn} onClick={addProduct}>
            ➕ Add Product
          </button>
        </div>
      )}

      {/* PRODUCT GRID */}
      <div style={styles.grid}>
        {products.map((p) => (
          <div key={p.id} style={styles.card}>
            {editingId === p.id ? (
              <>
                <input
                  style={styles.input}
                  value={editFields.name}
                  onChange={(e) =>
                    setEditFields({ ...editFields, name: e.target.value })
                  }
                />

                <input
                  style={styles.input}
                  value={editFields.stock}
                  onChange={(e) =>
                    setEditFields({ ...editFields, stock: e.target.value })
                  }
                />

                <input
                  style={styles.input}
                  value={editFields.cost}
                  onChange={(e) =>
                    setEditFields({ ...editFields, cost: e.target.value })
                  }
                />

                <input
                  style={styles.input}
                  value={editFields.price}
                  onChange={(e) =>
                    setEditFields({ ...editFields, price: e.target.value })
                  }
                />

                <div style={styles.btnRow}>
                  <button style={styles.saveBtn} onClick={() => saveEdit(p.id)}>
                    Save
                  </button>

                  <button style={styles.cancelBtn} onClick={cancelEditing}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ marginBottom: 5 }}>{p.name}</h3>

                <p style={styles.text}>
                  Stock: <b>{p.stock}</b>
                </p>
                <p style={styles.text}>
                  Cost: <b>{p.cost}</b>
                </p>
                <p style={styles.text}>
                  Price: <b>{p.price}</b>
                </p>

                <div style={styles.btnRow}>
                  <button
                    style={styles.editBtn}
                    onClick={() => startEditing(p)}
                  >
                    Edit
                  </button>

                  {role === "admin" && (
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: 20,
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  roleBadge: {
    padding: "4px 10px",
    borderRadius: 20,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  formCard: {
    padding: 15,
    border: "1px solid #ddd",
    borderRadius: 12,
    marginBottom: 20,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 10,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 15,
  },

  card: {
    padding: 15,
    borderRadius: 12,
    border: "1px solid #eee",
    background: "rgba(255,255,255,0.4)",
    boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
  },

  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    outline: "none",
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    color: "#444",
  },

  btnRow: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },

  editBtn: {
    flex: 1,
    padding: 8,
    border: "none",
    borderRadius: 8,
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },

  deleteBtn: {
    flex: 1,
    padding: 8,
    border: "none",
    borderRadius: 8,
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },

  saveBtn: {
    flex: 1,
    padding: 8,
    border: "none",
    borderRadius: 8,
    background: "#22c55e",
    color: "white",
    cursor: "pointer",
  },

  cancelBtn: {
    flex: 1,
    padding: 8,
    border: "none",
    borderRadius: 8,
    background: "#6b7280",
    color: "white",
    cursor: "pointer",
  },

  addBtn: {
    marginTop: 10,
    padding: 10,
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "white",
    cursor: "pointer",
  },
};