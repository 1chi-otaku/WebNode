import express from "express";
import "dotenv/config";
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";
import path from "node:path";
import session from "express-session"
import siteRoutes from "./routes/site-routes.js";
import userRoutes from "./routes/user-routes.js";
import checkUser from "./middleware/checkUser.js";


const PORT = process.env.PORT || 2060;

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
});

const server = express();
server.use(express.json());
server.use(cookieParser());
server.use(session({
    secret: process.env.SECRET_KEY ,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1005000,
    }

}))
server.use(express.urlencoded({extended: true}));
server.use(express.static("public"));
server.use(checkUser);

server.engine("hbs", hbs.engine);
server.set("view engine", "hbs");
server.set("views", path.join("src", "views"));

server.use(siteRoutes);
server.use(userRoutes);

server.listen(PORT,()=>{
    console.log('Server is running http://localhost:' + PORT)
})


