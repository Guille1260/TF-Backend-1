import { json } from 'express';
import fs from 'fs';
import { productModel } from '../model/prodcuts.model.js';

class ProductManager {
    constructor () {
        this.products = []
    }
    async getProducts(){
        let products= await productModel.find().lean();
        return products;
    };
    async getProductsById(id) {
            const product = await productModel.find({_id:id});
            return product ? product : { error: "ID de Producto no encontrado" };
        
    }
    async addProduct(prod){
        await productModel.create({...prod});
    };
    async updateProduct(id, newProductData) {
            const updatedProduct = await productModel.findByIdAndUpdate(id, newProductData, { new: true });
            return updatedProduct ? updatedProduct : { error: "Producto no encontrado" };
        
    }
    async deleteProduct(pid) {
        await productModel.deleteOne({_id:pid});
    
    }
    
}

export default ProductManager;