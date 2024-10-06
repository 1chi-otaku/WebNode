import { Router } from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import redirectIfAuthenticated from "../middleware/redirectIfAuthenticated.js";


const userRoutes = Router();

const users = [];

userRoutes.get("/user/signin", redirectIfAuthenticated, (req, res) => {
    res.render("form_auth");
});

userRoutes.get("/user/signup", redirectIfAuthenticated,  (req, res) => {
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

    req.session.user = {
        login:req.body.login,
        email:req.body.email
    }

    res.redirect("/");

    console.log(users);
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
