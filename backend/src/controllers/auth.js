import { generateToken } from "../utils/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    if (!firstName || !lastName || !userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });
    let token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      user: {
        firstName,
        lastName,
        userName,
        email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let existUser = await User.findOne({ email });

    if (!existUser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    let matchPasswor = await bcrypt.compare(password, existUser.password);
    if (!matchPasswor) {
      return res.status(400).json({ message: "Password does not match" });
    }
    let token = generateToken(existUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      user: {
        firstName: existUser.firstName,
        lastName: existUser.lastName,
        userName: existUser.userName,
        email: existUser.email,
      },
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
