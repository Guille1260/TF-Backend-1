import { cartModel } from "../model/cart.model.js";
import mongoose from "mongoose";

class CartManager {
    constructor(){

    }
    async getCarts(){
        return await cartModel.find().lean();
    }
    async getCartById(id) {
        return await cartModel.find({_id:id});
    }
    async createCart() {
        await cartModel.create({products:[]});
    }
    async addCartProduct(cid, pid) {
        try {
            let cart = await cartModel.findById(cid); // 🔹 Buscar el carrito por ID

            if (!cart) {
                return { error: "Carrito no encontrado!" };
            }

            // 🔹 Buscar si el producto ya está en el carrito
            let productIndex = cart.products.findIndex(item => item.product.toString() === pid);

            if (productIndex !== -1) {
                // 🔹 Si el producto existe, aumentar la cantidad
                cart.products[productIndex].quantity += 1;
            } else {
                // 🔹 Si no existe, agregarlo al carrito
                cart.products.push({ product: new mongoose.Types.ObjectId(pid), quantity: 1 });
            }

            // 🔹 Marcar el array como modificado para que Mongoose lo guarde correctamente
            cart.markModified("products");

            await cart.save(); // 🔹 Guardar los cambios en MongoDB

            return { estado: "OK", mensaje: "Producto agregado al carrito!" };
        } catch (error) {
            console.error("❌ Error al agregar producto al carrito:", error);
            return { error: "Error interno al agregar producto" };
        }
    }
}


export default CartManager;