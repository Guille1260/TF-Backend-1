import { json } from 'express';
import fs from 'fs';

class ProductManager {
    constructor () {
        this.products = [],
        this.dir = './model/json'; 
        this.file = `${this.dir}/productos.json`;
        this.createFile()
       
    }
    createId(){
        let max = 0;
        this.products.forEach(item=>{
            if(item.id>max){
                max = item.id ;
            }
        })
        return max + 1;
    }
    createFile(){
        if(!fs.existsSync(this.file)){
            fs.writeFileSync(this.file,JSON.stringify(this.products));
        }
    };
    getProducts(){
        this.products = JSON.parse(fs.readFileSync(this.file,'utf-8'));
        return this.products;
    };
    getProductsById(id){
        this.products = JSON.parse(fs.readFileSync(this.file,'utf-8'));
        const product = this.products.find(p => p.id == id);
        return product ? product : {error:"id de Producto no encontrado "};
    };
    addProduct(prod){
        this.getProducts();
        let newProduct = {id:this.createId(),...prod}
        this.products.push(newProduct);
        return this.saveProducts()
    };
    saveProducts(){
        return fs.writeFileSync(this.file, JSON.stringify(this.products));
    };
    
    updateProduct(id, newProductData) {
        this.products = JSON.parse(fs.readFileSync(this.file, 'utf-8'));
        const index = this.products.findIndex(p => p.id == id);
        if (index === -1) {
            return { error: "Producto no encontrado" };
        }
        this.products[index] = { ...this.products[index], ...newProductData };
        this.saveProducts();
        return this.products[index];
    }
    
    deleteProduct(pid) {
        this.products = JSON.parse(fs.readFileSync(this.file, 'utf-8'));
        const index = this.products.findIndex(p => p.id == pid);
        if (index === -1) {
            return { error: "Producto no encontrado" };
        }
        const deletedProduct = this.products.splice(index, 1);
        this.saveProducts();
        return deletedProduct[0];
    }
    
}

export default ProductManager;