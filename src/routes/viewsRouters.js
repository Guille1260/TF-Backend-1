import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";


const routersViews = Router();
const PM = new ProductManager();

routersViews.get("/" , async (req,res)=>{
    const a = await PM.getProducts();
    
    res.render("home",{prod:a})
})
routersViews.get("/realtimeproducts",async (req,res)=>{
    const a = await PM.getProducts();
    res.render("realTimeProducts",{prod:a})
})

export default routersViews;