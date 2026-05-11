const express = require("express");
const router = express.Router();
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, addIncome);
router.get("/all", protect, getAllIncome);
router.delete("/:id", protect, deleteIncome);
router.get("/download-excel", protect, downloadIncomeExcel);

module.exports = router;
