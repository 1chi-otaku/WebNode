import express from "express";
import exphbs from "express-handlebars";
import "dotenv/config"; 
import siteRouter from "./routers/site-routes.js";
import { products } from "./data/products.js";
import { contacts } from "./data/contacts.js";
import { skills } from "./data/skills.js";

const PORT = process.env.PORT || 4200; 

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
})

const app = express();
app.engine('hbs',hbs.engine);
app.set('view engine', 'hbs');
app.set("views", "views")

app.use(express.json());

app.get('/', (req,res)=>{
    res.render("index",  {skills});
})
app.get('/contacts', (req,res)=>{
    res.render("contacts",  {contacts});
})
app.get('/products',  (req,res)=>{
    res.render("products", {products});
})
app.get('/about',  (req,res)=>{
    res.render("about");
})

app.use('/products',siteRouter);
app.all('*', (req,res)=>{
    res.status(404).json({error:"Not found"})
})

app.listen(PORT, () => { 
    console.log(`The Server is running at http://localhost:${PORT}`);
});
