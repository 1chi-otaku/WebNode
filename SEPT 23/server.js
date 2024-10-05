import express from "express"
import "dotenv/config";
import path from "node:path"
import router from "./routers.js";
import user_routes from "./routers/user-routers.js";
import product_routes from "./routers/product-routers.js";
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static("public")) //Підключення middleware 
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(router);
app.use("/user", user_routes);
app.use("/product", product_routes);

// app.get('/', (req,res)=>{
//     //res.status(201).json({status: "success"})
//     //res.status(200).send("<h1>NODE JS HTML OK, STATUS</h1>");
//     res.sendFile(path.join(import.meta.dirname, "public", "pages", "index.html"))
// })

// app.get('/products/', (req,res)=>{
//     res.status(200).send("<h1>PRODUCTS ALL</h1>");
// })
// app.get('/products/:id', (req, res) => {
//     res.status(200).send(`<h1>PRODUCT ID: ${req.params.id}</h1>`);
// });

app.listen(PORT,()=>{
    console.log('Server is running http://localhost:' + PORT)
})
