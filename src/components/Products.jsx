import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:5000/api/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const role = (localStorage.getItem("auth_role") || "staff").toLowerCase();

  const emptyProduct = {
    name: "",
    cost: "",
    price: "",
    stock: "",
  };

  const [editFields, setEditFields] = useState(emptyProduct);
  const [newProduct, setNewProduct] = useState(emptyProduct);

  /* ================= LOAD FROM BACKEND ================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();

      const sorted = data.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );

      setProducts(sorted);
    } catch (err) {
      console.log("Error loading products:", err);
    }
  };

  /* ================= ADD PRODUCT ================= */
  const addProduct = async () => {
    if (role !== "admin") return alert("❌ Staff cannot add products");

    if (!newProduct.name.trim()) return alert("Product name required");

    if (Number(newProduct.price) < Number(newProduct.cost)) {
      return alert("Selling price cannot be lower than cost");
    }

    const product = {
      name: newProduct.name.trim(),
      stock: Number(newProduct.stock || 0),
      cost: Number(newProduct.cost || 0),
      price: Number(newProduct.price || 0),
    };

    try {
      await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      setNewProduct(emptyProduct);
      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= DELETE ================= */
  const deleteProduct = async (id) => {
    if (role !== "admin") return alert("❌ Staff cannot delete products");

    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= EDIT ================= */
  const startEditing = (product) => {
    if (role !== "admin") return alert("❌ Staff cannot edit products");

    setEditingId(product._id);
    setEditFields(product);
  };

  const saveEdit = async (id) => {
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFields),
      });

      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFields(emptyProduct);
  };

  /* ================= SEARCH ================= */
  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );
  

  
  
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

    {/* SEARCH */}
    <input
      style={styles.searchInput}
      placeholder="🔍 Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

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

    {/* PRODUCTS */}
    <div style={styles.grid}>
      {filteredProducts.map((p) => (
        <div key={p._id || p.id} style={styles.card}>
          <h3 style={{ marginBottom: 5 }}>{p.name}</h3>

          <p style={styles.text}>
            Stock: <b>{p.stock}</b>
          </p>

          {role === "admin" && (
            <p style={styles.text}>
              Cost: <b>{p.cost}</b>
            </p>
          )}

          <p style={styles.text}>
            Price: <b>{p.price}</b>
          </p>

          {role === "admin" && (
            <div style={styles.btnRow}>
              <button
                style={styles.editBtn}
                onClick={() => startEditing(p)}
              >
                Edit
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteProduct(p._id || p.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
); 
}
// ================= RETURN DATA ================= 
  

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
  searchInput: {
  width: "100%",
  padding: 12,
  marginBottom: 15,
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
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