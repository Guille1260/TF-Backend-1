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
    res.send({result:result});
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
    const { cid } = req.params; 
    const products = req.body; 
    if (!Array.isArray(products)) {
        return res.status(400).json({ message: "El body debe ser un array de productos" });
    }
    try {
        const carrito = await cartModel.findById(cid);
        if (!carrito) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        carrito.products = products; 
        await carrito.save();
        res.send({ message: "Carrito actualizado", carrito });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el carrito", error: error.message });
    }
});




cartRouter.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;   
    const { quantity } = req.body;     
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "La cantidad debe ser mayor que 0." });
    }
    try {
        const cart = await cartModel.findOne({ _id: cid });
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }
        cart.products[productIndex].quantity = quantity;
        await cart.save();
        return res.send({ message: "Cantidad actualizada correctamente", cart });
    } catch (error) {
        return res.status(500).json({ message: `Error al actualizar la cantidad: ${error.message}` });
    }
});





export default cartRouter;
