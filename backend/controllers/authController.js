const jwt = require("jsonwebtoken");
const User = require("../models/User");
const path = require("path");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, profileImageUrl } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, email and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl: profileImageUrl || null,
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during registration", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

// @desc    Get current user info
// @route   GET /api/auth/me
// @access  Private
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error fetching user", error: error.message });
  }
};

// @desc    Upload profile image
// @route   POST /api/auth/upload-image
// @access  Private
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/profiles/${
      req.file.filename
    }`;

    // Update user profile image
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImageUrl: imageUrl },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImageUrl: imageUrl,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error uploading image",
      error: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, getUserInfo, uploadProfileImage };
