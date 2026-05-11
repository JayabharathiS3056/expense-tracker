const Income = require("../models/Income");
const Expense = require("../models/Expense");

// @desc    Get dashboard overview data
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // ── Total Income & Expense ──────────────────────────────────────────
    const totalIncomeResult = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalIncome =
      totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0;

    const totalExpenseResult = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalExpense =
      totalExpenseResult.length > 0 ? totalExpenseResult[0].total : 0;

    const totalBalance = totalIncome - totalExpense;

    // ── Recent Transactions (last 5 combined) ──────────────────────────
    const recentIncome = await Income.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    const recentExpense = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    // Tag each entry with its type
    const taggedIncome = recentIncome.map((i) => ({ ...i, type: "income" }));
    const taggedExpense = recentExpense.map((e) => ({ ...e, type: "expense" }));

    const recentTransactions = [...taggedIncome, ...taggedExpense]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // ── Last 60 Days Income (for line/pie chart) ───────────────────────
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const last60DaysIncome = await Income.find({
      userId,
      date: { $gte: sixtyDaysAgo },
    })
      .sort({ date: -1 })
      .lean();

    // ── Last 30 Days Expenses (for bar chart) ──────────────────────────
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const last30DaysExpenses = await Expense.find({
      userId,
      date: { $gte: thirtyDaysAgo },
    })
      .sort({ date: -1 })
      .lean();

    // ── Expense by Category (for pie chart) ───────────────────────────
    const expenseByCategory = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    // ── Income by Source (for pie chart) ──────────────────────────────
    const incomeBySource = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: "$source", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({
      totalBalance,
      totalIncome,
      totalExpense,
      recentTransactions,
      last60DaysIncome: {
        transactions: last60DaysIncome,
        total: last60DaysIncome.reduce((sum, i) => sum + i.amount, 0),
      },
      last30DaysExpenses: {
        transactions: last30DaysExpenses,
        total: last30DaysExpenses.reduce((sum, e) => sum + e.amount, 0),
      },
      expenseByCategory,
      incomeBySource,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching dashboard data",
      error: error.message,
    });
  }
};

module.exports = { getDashboardData };
