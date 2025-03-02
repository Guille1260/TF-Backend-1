import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";


const routersViews = Router();
const PM = new ProductManager;

routersViews.get("/",(req,res)=>{
    const a = PM.getProducts();
    res.render("home",{prod:a})
})
routersViews.get("/realtimeproducts",(req,res)=>{
    const a = PM.getProducts();
    res.render("realTimeProducts",{prod:a})
})

export default routersViews;