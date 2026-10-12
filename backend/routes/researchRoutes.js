const express = require("express");
const router = express.Router();
const controller = require("../controllers/researchController");
const Research = require("../models/Research");


router.post("/", controller.createResearch);

router.get("/", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState === 1) {
      const data = await Research.find().sort({ createdAt: -1 });
      return res.json(data);
    }
    res.json([]);
  } catch (err) {
    res.json([]);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Research.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Research brief deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete brief" });
  }
});

module.exports = router;
