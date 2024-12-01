import { Router } from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import secure from "../services/user-secure.js";

const userRoutes = Router();

const users = [
  {
    id: 1,
    login: "vasya",
    email: "vasya@gmail.com",
    password: "$2b$10$J9hYH1nGL9LoYncBDKGgBOoCQ69frW6VMId2EGjXMPoLlrgXBgD/y",
  },
];


userRoutes.post("/user/signup", async (req, res) => {
  const { login, email, password, confirm_password } = req.body;
  let isError = false;


  if (!validator.isEmail(email)) {
    console.warn("Invalid email format.");
    isError = true;
  }
  if (!validator.isLength(password, { min: 6 })) {
    console.warn("Password must be at least 6 characters long.");
    isError = true;
  }
  if (password !== confirm_password) {
    console.warn("Passwords do not match.");
    isError = true;
  }
  if (!validator.isAlphanumeric(login)) {
    console.warn("Login must contain only letters and numbers.");
    isError = true;
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    console.warn("Email is already registered.");
    isError = true;
  }

  if (isError) {
    return res.status(400).render("form_register");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { login, email, password: hashedPassword };
  users.push(newUser);


  const accessToken = secure.generateAccessToken({ login: newUser.login, email: newUser.email });
  const refreshToken = secure.generateRefreshToken({ login: newUser.login, email: newUser.email });

  res.cookie("refresh_token", refreshToken, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });


  res.json({ accessToken });
});


userRoutes.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) return res.status(400).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Invalid credentials");

  const accessToken = secure.generateAccessToken({ login: user.login, email: user.email });
  const refreshToken = secure.generateRefreshToken({ login: user.login, email: user.email });

  res.cookie("refresh_token", refreshToken, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({ accessToken });
});


userRoutes.post("/user/refresh", secure.refreshAccessToken);


userRoutes.get("/protected", secure.authenticateToken, (req, res) => {
  res.json({ message: "You have access to this protected route!", user: req.user });
});


userRoutes.get("/user/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("refresh_token");
    res.redirect("/");
  });
});

export default userRoutes;
