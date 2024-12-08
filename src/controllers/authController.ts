import { Request, Response } from "express";
import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt";
import { User } from "../types/user";
import { userModel } from "../models/userModel";

export const register: RequestHandler = async (req, res) => {
  const { username, password, email } = req.body;
  console.log(req.body);

  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user and save to the database
    const newUser = new userModel({ username, password: hashedPassword, email });
    await newUser.save();

    // Generate tokens for the newly registered user
    const accessToken = generateAccessToken({ id: newUser._id, username: newUser.username });
    const refreshToken = generateRefreshToken({ id: newUser._id, username: newUser.username });

    // Respond with success message and tokens
    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Cannot register user" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await userModel.findOne({ username });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return; // Stop execution if user is not found
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return; // Stop execution if password is invalid
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id, username: user.username });
    const refreshToken = generateRefreshToken({ id: user._id, username: user.username });

    // Respond with tokens
    res.status(200).json({ message: "Login successful!", accessToken, refreshToken });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const refreshToken: RequestHandler = (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(401).json({ message: "Token is required" });
    return;
  }

  try {
    // Verify the refresh token
    const decoded = verifyToken(token, process.env.REFRESH_TOKEN_SECRET as string);

    // Ensure the decoded token has the necessary payload
    if (typeof decoded === "string" || !decoded.id || !decoded.username) {
      res.status(403).json({ message: "Invalid token payload" });
      return;
    }

    // Generate a new access token
    const accessToken = generateAccessToken({ id: decoded.id, username: decoded.username });

    // Send the new access token
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
