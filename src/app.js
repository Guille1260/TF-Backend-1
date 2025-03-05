import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';
import routersProducts from './routes/ProductsRouters.js';
import routersViews from './routes/viewsRouters.js';
import ProductManager from './controllers/ProductManager.js';
import mongoose from 'mongoose';
import cartsRouter from './routes/CartsRouters.js';

const app = express();
const port = 8080;

// Servidor HTTP
const httpServer = app.listen(port, () => {
    console.log("Servidor activo en el puerto: " + port);
});

// Servidor WebSocket
const socketServer = new Server(httpServer);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Rutas
app.use("/api/products", routersProducts);
app.use("/", routersViews);
app.use("/api/carts",cartsRouter);
// Instancia de ProductManager
const PM = new ProductManager();

// Conexión a MongoDB
mongoose.connect("mongodb+srv://guille1260:123@cluster0.htqik.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conectado a MongoDB"))
    .catch(error => console.error("Error al conectar a MongoDB:", error));

// WebSockets
socketServer.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    try {
        // Enviar productos al conectar un cliente
        const products = await PM.getProducts();
        socket.emit("realTimeProducts", products);

        // Agregar producto
        socket.on("nuevoProducto", async (data) => {
            await PM.addProduct(data);
            const updatedProducts = await PM.getProducts();
            socketServer.emit("realTimeProducts", updatedProducts); // Enviar a todos
        });

        // Eliminar producto
        socket.on("eliminarProducto", async (id) => {
            await PM.deleteProduct(id);
            const updatedProducts = await PM.getProducts();
            socketServer.emit("realTimeProducts", updatedProducts); // Enviar a todos
        });

    } catch (error) {
        console.error("Error en WebSockets:", error);
    }
});
