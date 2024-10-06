import { Router } from "express";
import bcrypt from "bcrypt";
import validator from "validator";

const userRoutes = Router();

const users = [];

userRoutes.get("/user/signin", (req, res) => {
    res.render("form_auth");
});

userRoutes.get("/user/signup", (req, res) => {
    res.render("form_register");
});

userRoutes.post("/user/signup", async (req, res) => {
    const { login, email, password, confirm_password } = req.body;
    let errors = [];

    if (!validator.isEmail(email)) {
        errors.push("Invalid email format.");
    }
    if (!validator.isLength(password, { min: 6 })) {
        errors.push("Password must be at least 6 characters long.");
    }
    if (password !== confirm_password) {
        errors.push("Passwords do not match.");
    }
    if (!validator.isAlphanumeric(login)) {
        errors.push("Login must contain only letters and numbers.");
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        errors.push("Email is already registered.");
    }

    if (errors.length > 0) {
        return res.status(400).render("form_register", { errors, login, email });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { login, email, password: hashedPassword };
    users.push(newUser);

    res.cookie("user", login, {
        httpOnly: true,
        maxAge: 1005000, 
    });
    res.redirect("/");

    console.log(users);
});

userRoutes.get("/user/logout", (req, res) => {
    res.clearCookie("user");
    res.redirect("/");
});

export default userRoutes;
