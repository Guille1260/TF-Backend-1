import { cartModel } from "../model/cart.model.js";
import mongoose from "mongoose";

class CartManager {
    constructor(){

    }
    async getCarts(){
        // Poblar los productos dentro del carrito
        return await cartModel.find().populate('products.product').lean(); // Se agrega populate
    }
    
    async getCartById(id) {
        try {
            const cart = await cartModel.findOne({ _id: id }).populate("products.product").lean(); 
            if (!cart) {
                console.log("Carrito no encontrado");
                return null;
            }
            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            return null;
        }
    }
    async createCart() {
        await cartModel.create({products:[]});
    }
    async addCartProduct(cid, pid) {
        try {
            let cart = await cartModel.findOne({ _id: cid });
            if (!cart) {
                return {mensaje:"Carrito no encontrado:"};
            }
            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }
            await cart.save();
            return ({mensaje:"Producto agregado al carrito:"});
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
        }
    }
    async deleteProductFromCart(cid, pid) {
        let cart = await cartModel.findOne({ _id: cid }).lean();
        let products = cart.products.filter(item=> item.product != pid);
        if (products.length === cart.products.length) {
            return { message: "El producto no se encontró en el carrito" };
        }
        await cartModel.updateOne({ _id: cid }, { products: products });
        return { message: "El producto  se elimino  del carrito" };
    }
    async updateCart(cartId, updatedCartData)  {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(cartId, updatedCartData, { new: true });
            return updatedCart; 
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            throw error;
        }
    };
    
}


export default CartManager;