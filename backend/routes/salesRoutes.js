import express from "express";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= CREATE SALE ================= */router.post("/", verifyToken, async (req, res) => {
  try {
    console.log("SALE BODY:", req.body);

    const { productId, qty, date } = req.body;

    console.log("productId:", productId);
    console.log("qty:", qty);

    const quantity = Number(qty);

    const product = await Product.findById(productId);

    console.log("FOUND PRODUCT:", product);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const price = Number(product.price || 0);
    const cost = Number(product.cost || 0);

    console.log("price:", price);
    console.log("cost:", cost);

    const total = price * quantity;
    const profit = (price - cost) * quantity;

    const sale = await Sale.create({
      productId,
      name: product.name,
      qty: quantity,
      total,
      profit,
      date:
        date ||
        new Date().toISOString().split("T")[0],
    });

    console.log("SALE CREATED:", sale);

    product.stock =
      Number(product.stock) - quantity;

    await product.save();

    res.status(201).json(sale);
  } catch (err) {
    console.error("CREATE SALE ERROR:", err);

    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
});

/* ================= GET SALES ================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const sales = await Sale.find().sort({
      createdAt: -1,
    });

    res.json(sales);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ================= DELETE SALE ================= */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const sale = await Sale.findById(
      req.params.id
    );

    if (!sale) {
      return res.status(404).json({
        error: "Sale not found",
      });
    }
    console.log("REQ BODY:", req.body);
    console.log("PRODUCT ID:", productId);
    if (!mongoose.Types.ObjectId.isValid(productId)) {
  return res.status(400).json({
    error: "Invalid product id",
  });
}

const product = await Product.findById(productId);

    if (product) {
      product.stock =
        Number(product.stock) +
        Number(sale.qty);

      await product.save();
    }

    await Sale.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Deleted successfully",
    });
  }catch (err) {
  console.error("CREATE SALE ERROR:", err);

  res.status(500).json({
    error: err.message,
    stack: err.stack,
  });
}
});

/* ================= UPDATE SALE ================= */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { qty } = req.body;

    const sale = await Sale.findById(
      req.params.id
    );

    if (!sale) {
      return res.status(404).json({
        error: "Sale not found",
      });
    }

    const product = await Product.findById(
      sale.productId
    );

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const oldQty = Number(sale.qty);
    const newQty = Number(qty);

    if (!newQty || newQty <= 0) {
      return res.status(400).json({
        error: "Invalid quantity",
      });
    }

    const difference = newQty - oldQty;

    if (
      difference > 0 &&
      Number(product.stock) < difference
    ) {
      return res.status(400).json({
        error: "Not enough stock",
      });
    }

    product.stock =
      Number(product.stock) - difference;

    await product.save();

    const price = Number(product.price || 0);
    const cost = Number(product.cost || 0);

    sale.qty = newQty;
    sale.total = price * newQty;
    sale.profit =
      (price - cost) * newQty;

    await sale.save();

    res.json(sale);
  } catch (err) {
    console.error("UPDATE SALE ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;