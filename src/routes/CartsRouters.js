import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

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
    res.json(result);
});
cartRouter.get("/:cid", async (req, res) => {
    const cid = req.params.cid;  // Obtener el ID del carrito desde los parámetros de la URL
    try {
        const cart = await CM.getCartById(cid);  // Obtener el carrito con ese ID
        if (cart.error) {
            res.status(404).json(cart);  // Si no se encuentra el carrito, enviar un error 404
        } else {
            res.json(cart);  // Si se encuentra el carrito, enviar los productos del carrito
        }
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: "Hubo un error al obtener el carrito" });
    }
});

export default cartRouter;
