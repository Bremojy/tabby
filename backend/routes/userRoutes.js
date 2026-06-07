import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= GET ALL USERS ================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.error("Get users error:", err);

    res.status(500).json({
      error: "Failed to load users",
    });
  }
});

/* ================= DELETE USER ================= */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete user error:", err);

    res.status(500).json({
      error: "Failed to delete user",
    });
  }
});

export default router;