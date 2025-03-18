import { query, Router } from "express";
import ProductManager from "../controllers/ProductManager.js";
import CartManager from "../controllers/CartManager.js";
import { log } from "console";

const routersViews = Router();
const PM = new ProductManager();
const CM = new CartManager()

routersViews.get("/" , async (req,res)=>{
    const {limit,page,sort,query} = req.query;
    const result = await PM.getProducts(limit,page,sort,query);
    res.render("home",{ result:result })
})
routersViews.get("/carrito", async (req, res) => {
    try {
      const carros = await CM.getCarts(); 
      
      carros.forEach(carrito => {
        let total = 0; 
        carrito.products.forEach(producto => {
          if (producto.product && producto.product.price) {
            producto.subTotal = producto.product.price * producto.quantity;
            total += producto.subTotal; 
          }
        });
        carrito.total = total; 
      });
      
      res.render("carrito", { carros });

    } catch (error) {
      console.error("Error al obtener los carritos:", error);
      res.status(500).send("Hubo un problema al obtener los carritos.");
    }
});
routersViews.get("/detalles/:pid", async (req, res) => {
    const { pid } = req.params; 
    try {
        const producto = await PM.getProductsById(pid); 
        if (producto.error) {
            return res.status(404).render("error", { message: producto.error });
            
        }
        
        res.render("detalles",  {producto:producto[0]});
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send("Hubo un problema al obtener el producto");
    }
});
routersViews.get("/realtimeproducts",async (req,res)=>{
    const a = await PM.getProducts();
    res.render("realTimeProducts",{prod:a})
})

export default routersViews;