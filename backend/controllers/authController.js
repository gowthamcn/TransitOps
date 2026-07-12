const authService = require("../services/authService");

// Register User
const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};