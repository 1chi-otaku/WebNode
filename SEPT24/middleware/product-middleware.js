
import { products } from "../data/products.js";

export const createProduct = (req,res,next) =>{
    console.log(req.body);
    if(req.body && req.body.title && req.body.price){
        const body = req.body;
        const new_id = products.length +1;
        const new_product = {id:new_id, ...body}
        products.push(new_product);
        req.new_product = new_product;
        next();

    }else{
        res.status(400).json({error: "body is empty"});
    }
};