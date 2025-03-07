import { query, Router } from "express";
import ProductManager from "../controllers/ProductManager.js";


const routersViews = Router();
const PM = new ProductManager();


routersViews.get("/" , async (req,res)=>{
    const {limit,page,sort,query} = req.query;
    const result = await PM.getProducts(limit,page,sort,query);
    res.render("home",{ result:result })
})



routersViews.get("/realtimeproducts",async (req,res)=>{
    const a = await PM.getProducts();
    res.render("realTimeProducts",{prod:a})
})

export default routersViews;