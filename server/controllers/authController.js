const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================
// Register User
// ==========================
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userWithoutPassword
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ==========================
// Login User
// ==========================
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        // Check user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                virtualBalance: user.virtualBalance
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};