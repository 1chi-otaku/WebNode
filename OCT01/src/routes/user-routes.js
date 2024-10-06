import { Router } from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import secure from "../services/user-secure.js";


const userRoutes = Router();

const users = [
    {
    id: 1,
    login: "vasya",
    email: "vasya@gmail.com",
    password: "$2b$10$J9hYH1nGL9LoYncBDKGgBOoCQ69frW6VMId2EGjXMPoLlrgXBgD/y",
    }];

userRoutes.get("/user/signin", (req, res) => {
    res.render("form_auth");
});

userRoutes.get("/user/signup",  (req, res) => {
    res.render("form_register");
});

userRoutes.get("/users", (req, res) => {
    res.json(users);
});

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


    // res.cookie("user", login, {
    //     httpOnly: true,
    //     maxAge: 1005000, 
    // });

   const token = secure.generateToken({ login: newUser.login, email: newUser.email });

  req.session.user = {
    login: newUser.login,
    email: newUser.email,
    token: token,  
  };

  res.json({ token: token });

    console.log(users);
});

userRoutes.get("/protected", secure.authenticateToken, (req, res) => {
    res.json({ message: "You have access to this protected route!", user: req.user });
});


userRoutes.get("/user/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("Error logging out");
        }      
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});


export default userRoutes;