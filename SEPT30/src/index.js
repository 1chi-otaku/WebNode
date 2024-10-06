import express from "express";
import "dotenv/config";
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";
import path from "node:path";
import siteRoutes from "./routes/sites-routes.js";
import userRoutes from "./routes/user-routes.js";
import checkUser from "./middleware/checkuser-middleware.js";
import session from "express-session"

const PORT = process.env.PORT || 4200;
//#region options for hbs 
const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
});
//#endregion
const server = express();
server.use(express.json());
server.use(cookieParser());
server.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false

}))
server.use(express.urlencoded({extended: true}));
server.use(express.static("public"));
server.use(checkUser);

server.engine("hbs", hbs.engine);
server.set("view engine", "hbs");
server.set("views", path.join("src", "views"));

server.use(siteRoutes);
server.use(userRoutes);

server.listen(PORT, ()=>{
    console.log(`The Server is running at http://localhost:${PORT}`);
})