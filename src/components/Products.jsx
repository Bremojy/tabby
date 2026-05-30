import React, { useState, useEffect } from "react";
import { getData, saveData } from "../utils/storage";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [role, setRole] = useState("staff");

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

  // 🔐 ROLE SWITCH
  const handleRoleChange = () => {
    if (role === "staff") {
      const pw = prompt("Enter admin password:");
      if (pw === "nimda") {
        setRole("admin");
        alert("✅ Admin mode enabled");
      } else {
        alert("❌ Wrong password");
      }
    } else {
      setRole("staff");
    }
  };

  // ✏️ EDIT START
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

  // 💾 SAVE EDIT
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

  // 🗑 DELETE
  const deleteProduct = (id) => {
    if (role !== "admin") return alert("❌ Staff cannot delete products");

    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveData("products", updated);
  };

  // ➕ ADD PRODUCT (FIXED)
  const addProduct = () => {
    if (role !== "admin") return alert("❌ Staff cannot add products");

    if (!newProduct.name.trim()) {
      return alert("Product name required");
    }

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

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 Products</h2>

      {/* ROLE */}
      <button onClick={handleRoleChange}>
        {role === "staff" ? "Switch to Admin" : "Switch to Staff"}
      </button>

      <span style={{ marginLeft: 10 }}>Role: {role.toUpperCase()}</span>

      {/* ADD PRODUCT */}
      {role === "admin" && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            border: "1px solid #ddd",
            borderRadius: 10,
            background: "#fff",
          }}
        >
          <h3>➕ Add Product</h3>

          <input
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Cost"
            value={newProduct.cost}
            onChange={(e) =>
              setNewProduct({ ...newProduct, cost: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />

          <button onClick={addProduct}>➕ Add Product</button>
        </div>
      )}

      {/* PRODUCT LIST */}
      <ul style={{ marginTop: 20 }}>
        {products.map((p) => (
          <li
            key={p.id}
            style={{
              padding: 10,
              borderBottom: "1px solid #eee",
            }}
          >
            {editingId === p.id ? (
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                <input
                  value={editFields.name}
                  onChange={(e) =>
                    setEditFields({ ...editFields, name: e.target.value })
                  }
                />

                <input
                  type="number"
                  value={editFields.stock}
                  onChange={(e) =>
                    setEditFields({ ...editFields, stock: e.target.value })
                  }
                />

                <input
                  type="number"
                  value={editFields.cost}
                  onChange={(e) =>
                    setEditFields({ ...editFields, cost: e.target.value })
                  }
                />

                <input
                  type="number"
                  value={editFields.price}
                  onChange={(e) =>
                    setEditFields({ ...editFields, price: e.target.value })
                  }
                />

                <button onClick={() => saveEdit(p.id)}>💾 Save</button>
                <button onClick={cancelEditing}>❌ Cancel</button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <b>{p.name}</b>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    Stock: {p.stock} | Cost: {p.cost} | Price: {p.price}
                  </div>
                </div>

                <div>
                  <button onClick={() => startEditing(p)}>✏️ Edit</button>

                  {role === "admin" && (
                    <button onClick={() => deleteProduct(p.id)}>
                      🗑 Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}