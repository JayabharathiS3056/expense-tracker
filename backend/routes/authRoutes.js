const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserInfo,
  uploadProfileImage,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getUserInfo);
router.post("/upload-image", protect, upload.single("image"), uploadProfileImage);

module.exports = router;
