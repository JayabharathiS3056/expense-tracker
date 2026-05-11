const Expense = require("../models/Expense");
const ExcelJS = require("exceljs");

// @desc    Add new expense
// @route   POST /api/expense/add
// @access  Private
const addExpense = async (req, res) => {
  try {
    const { icon, category, description, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res
        .status(400)
        .json({ message: "Category, amount, and date are required" });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than 0" });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      icon: icon || "💸",
      category,
      description: description || "",
      amount: Number(amount),
      date: new Date(date),
    });

    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error adding expense", error: error.message });
  }
};

// @desc    Get all expenses for the logged-in user
// @route   GET /api/expense/all
// @access  Private
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({
      date: -1,
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching expenses",
      error: error.message,
    });
  }
};

// @desc    Delete expense by ID
// @route   DELETE /api/expense/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense record not found" });
    }

    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error deleting expense",
      error: error.message,
    });
  }
};

// @desc    Download expense data as Excel
// @route   GET /api/expense/download-excel
// @access  Private
const downloadExpenseExcel = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({
      date: -1,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expense Report");

    // Define columns
    worksheet.columns = [
      { header: "Icon", key: "icon", width: 8 },
      { header: "Category", key: "category", width: 20 },
      { header: "Description", key: "description", width: 30 },
      { header: "Amount (₹)", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 20 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEF4444" },
    };
    worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

    // Add data rows
    expenses.forEach((expense) => {
      worksheet.addRow({
        icon: expense.icon,
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        date: new Date(expense.date).toLocaleDateString("en-IN"),
      });
    });

    // Add total row
    const totalRow = worksheet.addRow({
      description: "TOTAL",
      amount: expenses.reduce((sum, e) => sum + e.amount, 0),
    });
    totalRow.font = { bold: true };
    totalRow.getCell("description").alignment = { horizontal: "right" };

    // Style amount column
    worksheet.getColumn("amount").numFmt = "₹#,##0.00";

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=expense-report-${Date.now()}.xlsx`
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

module.exports = {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenseExcel,
};
