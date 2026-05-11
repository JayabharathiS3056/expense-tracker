const Income = require("../models/Income");
const ExcelJS = require("exceljs");

// @desc    Add new income
// @route   POST /api/income/add
// @access  Private
const addIncome = async (req, res) => {
  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res
        .status(400)
        .json({ message: "Source, amount, and date are required" });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than 0" });
    }

    const income = await Income.create({
      userId: req.user._id,
      icon: icon || "💰",
      source,
      amount: Number(amount),
      date: new Date(date),
    });

    res.status(201).json({ message: "Income added successfully", income });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error adding income", error: error.message });
  }
};

// @desc    Get all income for the logged-in user
// @route   GET /api/income/all
// @access  Private
const getAllIncome = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user._id }).sort({
      date: -1,
    });

    res.status(200).json(incomes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error fetching income", error: error.message });
  }
};

// @desc    Delete income by ID
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!income) {
      return res
        .status(404)
        .json({ message: "Income record not found" });
    }

    await income.deleteOne();
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error deleting income", error: error.message });
  }
};

// @desc    Download income data as Excel
// @route   GET /api/income/download-excel
// @access  Private
const downloadIncomeExcel = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user._id }).sort({
      date: -1,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Income Report");

    // Define columns
    worksheet.columns = [
      { header: "Icon", key: "icon", width: 8 },
      { header: "Source", key: "source", width: 25 },
      { header: "Amount (₹)", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 20 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F46E5" },
    };
    worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

    // Add data rows
    incomes.forEach((income) => {
      worksheet.addRow({
        icon: income.icon,
        source: income.source,
        amount: income.amount,
        date: new Date(income.date).toLocaleDateString("en-IN"),
      });
    });

    // Add total row
    const totalRow = worksheet.addRow({
      source: "TOTAL",
      amount: incomes.reduce((sum, i) => sum + i.amount, 0),
    });
    totalRow.font = { bold: true };
    totalRow.getCell("source").alignment = { horizontal: "right" };

    // Style amount column
    worksheet.getColumn("amount").numFmt = "₹#,##0.00";

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=income-report-${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({
      message: "Server error generating Excel",
      error: error.message,
    });
  }
};

module.exports = { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel };
