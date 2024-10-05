import { Router } from "express";
import path from "node:path";

const __dirname = path.dirname(import.meta.dirname);

const product_routes = Router();

const products = [
    { id: 1, name: "TV", price: 100 },
    { id: 2, name: "Vacuum Cleaner", price: 200 },
    { id: 3, name: "Turtle", price: 300 }
];

product_routes.route("/") 
    .get((req,res)=>{
        res.sendFile(path.join( __dirname, "public", "pages", "form.html"))
    })
    .post((req,res)=>{
        const { name, price } = req.body;
        console.log(name, price);
        const newProduct = {
            id: products.length + 1,
            name,
            price: parseFloat(price),
        };
        products.push(newProduct);
        res.status(201).json(newProduct);
    })


product_routes.get('/view', (req, res) =>{
    res.json(products);
});

product_routes.get('/view/:id', (req, res) => {
    const { id } = req.params;
    res.json(products.find((p) => p.id === parseInt(id)));
});

export default product_routes;
