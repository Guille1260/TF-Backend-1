import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const routersProducts = Router();
const PM = new ProductManager();

// Obtener todos los productos
routersProducts.get("/", async (req, res) => {
    try {
        const products = await PM.getProducts();
        res.json(products);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Obtener un producto por ID
routersProducts.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await PM.getProductsById(id);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Agregar un nuevo producto
routersProducts.post("/", async (req, res) => {
    try {
        const { title, description, code, price, status, category, thumbnail } = req.body;

        if (!title || !description || !code || !price || !category || !status) {
            return res.status(400).json({ error: "Todos los campos (excepto imagen) son obligatorios" });
        }

        const newProduct = {
            title,
            description,
            code,
            price,
            status,
            category,
            thumbnail: thumbnail ? [thumbnail] : [],
        };

        const result = await PM.addProduct(newProduct);

        if (!result) {
            return res.status(500).json({ error: "No se pudo guardar el producto" });
        }

        res.status(201).json({ message: "Producto guardado correctamente", product: result });
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Actualizar un producto por ID
routersProducts.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const newProductData = req.body;

        const updatedProduct = await PM.updateProduct(pid, newProductData);

        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado o no actualizado" });
        }

        res.json({ message: "Producto actualizado correctamente", product: updatedProduct });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Eliminar un producto por ID
routersProducts.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await PM.deleteProduct(pid);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Producto no encontrado o no eliminado" });
        }

        res.json({ status: "OK", message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default routersProducts;
