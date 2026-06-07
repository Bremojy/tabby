import express from "express";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= CREATE SALE ================= */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { productId, qty, date } = req.body;

    const quantity = Number(qty);

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid product or quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    const total = Number(product.price) * quantity;
    const profit = (Number(product.price) - Number(product.cost)) * quantity;

    const sale = await Sale.create({
      productId,
      name: product.name,
      qty: quantity,
      total,
      profit,
      date: date || new Date().toISOString().split("T")[0],
    });

    product.stock -= quantity;
    await product.save();

    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET SALES ================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DELETE SALE ================= */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ error: "Sale not found" });

    const product = await Product.findById(sale.productId);

    if (product) {
      product.stock += sale.qty;
      await product.save();
    }

    await Sale.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;