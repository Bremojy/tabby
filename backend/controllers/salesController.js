import Sale from "../models/Sale.js";
import Product from "../models/Product.js";

/* ================= GET ALL SALES ================= */
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= CREATE SALE ================= */
export const createSale = async (req, res) => {
  try {
    let { productId, qty, date } = req.body;

    qty = Number(qty);

    if (!productId || !qty || qty <= 0) {
      return res.status(400).json({ error: "Invalid product or quantity" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const price = Number(product.price || 0);
    const cost = Number(product.cost || 0);

    if (isNaN(price) || isNaN(cost)) {
      return res.status(400).json({ error: "Invalid product pricing data" });
    }

    if (product.stock < qty) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    const total = price * qty;
    const profit = (price - cost) * qty;

    const sale = await Sale.create({
      productId,
      name: product.name,
      qty,
      total,
      profit,
      date: date || new Date().toISOString().split("T")[0],
    });

    // reduce stock
    product.stock = Number(product.stock) - qty;
    await product.save();

    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= DELETE SALE ================= */
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    const product = await Product.findById(sale.productId);

    if (product) {
      product.stock = Number(product.stock) + Number(sale.qty);
      await product.save();
    }

    await Sale.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};