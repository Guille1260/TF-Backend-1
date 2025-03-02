import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";


const routersProducts = Router();
const PM = new ProductManager;

routersProducts.get("/",(req,res)=>{
    const p = PM.getProducts();
    res.send(p);  
});
routersProducts.get("/:id", (req, res) => {
    const id = req.params.id;
    let products = PM.getProductsById(id);
    res.send(products)
});


routersProducts.post("/",(req,res)=>{
    const {title,description,code,price,status,category,thumbnail} = req.body;
    let prod ={title,description,code,price,status,category,thumbnail}
    if (!title || !description || !code || !price || !category  || !status){

        res.send({estado:'Error',mensaje:"todos los campos menos el de la imagen son obligatorios"})
    }else{
        !thumbnail ? prod.thumbnail = [] : prod.thumbnail = [thumbnail];
        PM.addProduct(prod) ?  res.send({Error:'no se pudo guardar el producto'}) :  res.send({mensaje:'se guardo el producto '});
        
    }
});

routersProducts.put("/:pid", (req, res) => {
    const { pid } = req.params;
    const newProductData = req.body;

    const updatedProduct = PM.updateProduct(pid, newProductData);

    if (updatedProduct.error) {
        return res.status(404).send(updatedProduct);
    }

    return res.send(updatedProduct);
});
routersProducts.delete("/:pid", (req, res) => {
    const { pid } = req.params;

    const deletedProduct = PM.deleteProduct(pid);

    if (deletedProduct.error) {
        return res.status(404).send(deletedProduct);
    }
    return res.send({
        Extado:"OK",
        message: "Producto eliminado correctamente"
        
    });
});

export default routersProducts;
