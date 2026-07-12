const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register User
const registerUser = async ({ name, email, password, role }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return {
    token: generateToken(user._id, user.role),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// Login User
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return {
    token: generateToken(user._id, user.role),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};