import { json } from 'express';
import fs from 'fs';
import { productModel } from '../model/prodcuts.model.js';
import { log } from 'console';

class ProductManager {
    // constructor () {
    //     this.products = []
    // }
    async getProducts(limit,page,sort,query){
        try {
            limit = limit ? limit : 10;
            page = page >= 1 ? page : 1;
            sort = sort ? sort : "asc";
            query = query ? query : "";
            
            let result;
            if (query){
                result = await productModel.paginate({category:query},{limit:limit,page:page,sort:sort,lean:true});
            }else{
                
                result = await productModel.paginate({},{limit:limit,page:page,sort:sort,lean:true});
            }
            result = {
                status: 'success',
                payload: result.docs, // Los productos solicitados
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: (result.hasPrevPage? "/?limit="+limit+"&page="+ (result.page-1 ) : null),
                nextLink: (result.hasNextPage
                  ? "/?limit="+limit+"&page="+ (result.page+1 ) : null)
              };
            
            return result;    
        } catch (error) {
            return {status:"error",payload:""}
        }
        
        
    }
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