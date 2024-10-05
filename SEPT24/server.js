import express from "express";
import "dotenv/config"; 
import siteRouter from "./routers/site-routes.js";

const PORT = process.env.PORT || 4200; 

const app = express();
app.use(express.json());
app.use(siteRouter);
app.all('*', (req,res)=>{
    res.status(404).json({error:"Not found"})
})

app.listen(PORT, () => { 
    console.log(`The Server is running at http://localhost:${PORT}`);
});
