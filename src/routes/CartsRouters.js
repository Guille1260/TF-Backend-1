import { Router } from "express";
import CartManager from "../controllers/CartManager.js";
import { cartModel } from "../model/cart.model.js";
const cartRouter = Router();
const CM = new CartManager(); // ✅ Corrección: Instancia con `new`

// Obtener todos los carritos
cartRouter.get("/", async (req, res) => {
    try {
        const carts = await CM.getCarts(); // ✅ Corrección: `await`
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los carritos", mensaje: error.message });
    }
});

// Crear un nuevo carrito
cartRouter.post("/", async (req, res) => {
    try {
        await CM.createCart(); // ✅ Corrección: `await`
        res.json({ estado: "ok", mensaje: "Se creó el carrito con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito", mensaje: error.message });
    }
});
cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const result = await CM.addCartProduct(cid, pid);
    res.send(result);
});
cartRouter.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCartById(cid);
    res.send(cart)
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const result = await CM.deleteProductFromCart(cid, pid);
    res.send({result:result,mensaje:"se elimino el producto del carrito"});
});
cartRouter.delete("/:cid", async (req, res) => {
    const { cid } = req.params; 
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        cart.products = []; 
        await cart.save();
        res.send({ mensaje: "Se eliminaron todos los productos del carrito", cart });
    } catch (error) {
        console.error("Error al eliminar los productos del carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
cartRouter.put("/:cid", async (req, res) => {
    
});

cartRouter.put("/:cid/product/:pid", async (req, res) => {
    
});




export default cartRouter;
