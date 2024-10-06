import express from "express";
import "dotenv/config";
import exphbs from "express-handlebars";
import path from "node:path";
import siteRoutes from "./routes/sites-routes.js";
import userRoutes from "./routes/user-routes.js";

const PORT = process.env.PORT || 4200;

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
});
const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(express.static("public"));
server.engine("hbs", hbs.engine);
server.set("view engine", "hbs");
server.set("views", path.join("src", "views"));
server.use(siteRoutes);
server.use(userRoutes);
server.listen(PORT, ()=>{
    console.log(`The Server is running at http://localhost:${PORT}`);
})