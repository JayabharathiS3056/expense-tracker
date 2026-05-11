# 💰 Expense Tracker — MERN Stack Finance Manager

A modern, full-stack personal finance management application built with the MERN stack. Track income and expenses, visualise spending habits with interactive charts and export reports to Excel.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 JWT Authentication | Secure login & signup with token-based auth (7-day sessions) |
| 📊 Interactive Charts | Bar, Line and Pie charts powered by Recharts on a wheat background |
| 💼 Income Management | Add, view, delete income with source-based categorisation |
| 💸 Expense Tracking | 12 smart categories — Food, Travel, Health and more |
| 📥 Excel Export | Download styled `.xlsx` reports for income and expenses |
| 🕐 Recent Transactions | Quick view of the 5 latest financial activities |
| 🖼️ Profile Photo | Upload a photo or pick from 12 emoji avatars on signup |
| 📱 Mobile Responsive | Full sidebar + drawer navigation for all screen sizes |
| 🎨 Wheat & Sienna Theme | Warm, calm colour palette throughout the entire app |
| 🗑️ Hover-to-Delete | Hover over any record to reveal a smooth delete button |

---

## 🛠 Tech Stack

### Frontend
- **React 18** — UI library with hooks
- **React Router v6** — client-side routing with protected routes
- **Tailwind CSS v3** — utility-first styling with custom wheat/sienna theme
- **Recharts** — Bar, Pie and Line charts
- **Axios** — HTTP client with JWT interceptors
- **Vite** — lightning-fast build tool and dev server

### Backend
- **Node.js** — JavaScript runtime
- **Express.js** — REST API framework
- **MongoDB + Mongoose** — NoSQL database and ODM
- **JSON Web Token (JWT)** — stateless authentication
- **bcryptjs** — password hashing
- **ExcelJS** — styled Excel report generation
- **Multer** — profile image upload handling
- **CORS** — cross-origin request configuration

### Hosting
- **GitHub** — source control
- **Vercel** — frontend hosting (auto-deploys on push)
- **Render** — backend hosting (auto-deploys on push)
- **MongoDB Atlas** — cloud database (free M0 tier)

---

## 📁 Project Structure

```
expense-tracker/
│
├── backend/                        # Node.js + Express API
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, GetMe, Upload image
│   │   ├── incomeController.js     # Add, GetAll, Delete, Excel export
│   │   ├── expenseController.js    # Add, GetAll, Delete, Excel export
│   │   └── dashboardController.js  # Aggregated stats + chart data
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT protect guard
│   │   └── uploadMiddleware.js     # Multer image upload config
│   ├── models/
│   │   ├── User.js                 # User schema (bcrypt hashing)
│   │   ├── Income.js               # Income schema
│   │   └── Expense.js              # Expense schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── dashboardRoutes.js
│   ├── uploads/profiles/           # Stored profile images (gitignored)
│   ├── server.js                   # Express app entry point
│   ├── .env.example                # Environment variable template
│   └── package.json
│
└── frontend/                       # React + Vite app
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── landing/
    │   │   │   └── LandingPage.jsx # Navbar, Hero, About, Features, WhyUs, CTA, Footer
    │   │   ├── auth/
    │   │   │   ├── LoginPage.jsx   # Split-panel login with show/hide password
    │   │   │   └── SignupPage.jsx  # Emoji avatar picker + password strength meter
    │   │   ├── common/
    │   │   │   ├── Layout.jsx      # Sidebar + mobile drawer navigation
    │   │   │   ├── SummaryCard.jsx # Balance / Income / Expense summary cards
    │   │   │   └── TransactionItem.jsx # Hover-to-delete transaction row
    │   │   ├── dashboard/
    │   │   │   └── Dashboard.jsx   # Bar + Line + 2x Pie charts
    │   │   ├── income/
    │   │   │   └── IncomePage.jsx  # Add form, list, delete, Excel download
    │   │   └── expense/
    │   │       └── ExpensePage.jsx # Add form, list, delete, Bar+Pie, Excel download
    │   ├── context/
    │   │   └── UserContext.jsx     # Global auth state (React Context)
    │   ├── utils/
    │   │   ├── apiPaths.js         # All API endpoint constants
    │   │   ├── axiosInstance.js    # Axios + JWT interceptor + 401 redirect
    │   │   └── helpers.js          # formatCurrency, CHART_COLORS, categories
    │   ├── App.jsx                 # Routes + PrivateRoute + PublicRoute guards
    │   ├── main.jsx                # React entry point
    │   └── index.css               # Global styles + scroll-reveal animations
    ├── vercel.json                 # SPA rewrite rule (fixes page refresh 404)
    └── package.json
```

---

## 📸 Screenshots

| Page | Description |
|---|---|
| 🏠 Landing Page | Navbar, Hero with floating dashboard preview, About, Features, Why Us, Footer |
| 🔐 Login / Signup | Split-panel layout, emoji avatar picker, password strength meter |
| 📊 Dashboard | 4 interactive charts — Bar (30-day expenses), Line (60-day income), 2x Pie (overview + categories) |
| 💼 Income Page | Add form with quick-select source buttons, running total, Pie chart, sortable list |
| 💸 Expense Page | Add form with 12 category grid, Bar + Pie charts, Excel export |

---

## Landing Page

<img width="1918" height="909" alt="image" src="https://github.com/user-attachments/assets/8e55528d-34e9-4cb2-bde9-2a88fab2a817" />

---

## Sign Up

<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/28dfe175-b054-45ff-b349-4a21439401d8" />

---

## Dashboard Page

<img width="1917" height="908" alt="image" src="https://github.com/user-attachments/assets/3d6be3e7-239d-4cfe-916c-c2f6321e1377" />

---

## Income Page

<img width="1920" height="915" alt="image" src="https://github.com/user-attachments/assets/2fb6e7c7-6efe-4f28-8667-4ba43b634186" />

---

## Expense Page

<img width="1920" height="911" alt="image" src="https://github.com/user-attachments/assets/41945b85-c635-49cc-871c-70c5ea532679" />


## 📄 License

This project is licensed under the **MIT License** — free to use, modify and distribute.

---

## Author

Jayabharathi S "Ready to hear from you"
