import { cartModel } from "../model/cart.model.js";
import mongoose from "mongoose";

class CartManager {
    constructor(){

    }
    async getCarts(){
        return await cartModel.find().lean();
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
        let products = cart.products.filter(item=> item._id != pid);
        await cartModel.updateOne({ _id: cid }, { products: products });
    }
    
}


export default CartManager;