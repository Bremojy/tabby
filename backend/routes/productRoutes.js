import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/* CREATE PRODUCT */
router.post("/", async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      price: Number(req.body.price || 0),
      cost: Number(req.body.cost || 0),
      stock: Number(req.body.stock || 0),
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET PRODUCTS */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE PRODUCT */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        price: Number(req.body.price),
        cost: Number(req.body.cost),
        stock: Number(req.body.stock),
      },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE PRODUCT */
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;