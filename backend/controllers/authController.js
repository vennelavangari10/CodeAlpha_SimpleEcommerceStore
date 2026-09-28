const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ===============================
// Register User
// ===============================

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide name, email and password"
            });
        }


        const normalizedEmail =
            email.trim().toLowerCase();


        const existingUser =
            await User.findOne({
                email: normalizedEmail
            });


        if (existingUser) {

            return res.status(400).json({
                success: false,
                message:
                    "User already exists"
            });
        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const user = await User.create({

            name: name.trim(),

            email: normalizedEmail,

            password: hashedPassword
        });


        res.status(201).json({

            success: true,

            message:
                "User registered successfully",

            user: {

                id: user._id,

                name: user.name,

                email: user.email
            }
        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                "Failed to register user",

            error: error.message
        });
    }
};


// ===============================
// Login User
// ===============================

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide email and password"
            });
        }


        const normalizedEmail =
            email.trim().toLowerCase();


        const user =
            await User.findOne({
                email: normalizedEmail
            });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"
            });
        }


        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"
            });
        }


        const token =
            jwt.sign(

                {
                    userId: user._id
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1d"
                }
            );


        res.status(200).json({

            success: true,

            message:
                "Login successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email
            }
        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                "Failed to login",

            error: error.message
        });
    }
};


module.exports = {

    registerUser,

    loginUser
};