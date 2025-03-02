import express from 'express';
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import __dirname from './utils.js'
import routersProducts from './routes/ProductsRouters.js';
import routersViews from './routes/viewsRouters.js';
import ProductManager from './controllers/ProductManager.js';


const app = express();
const port = 8080;

const httpServer = app.listen(port,()=>{
    console.log("sevidor activo,puerto:"+port);
})

const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));

app.engine("handlebars",handlebars.engine())

app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use("/api/products",routersProducts);
app.use("/",routersViews);

const PM = new ProductManager;

socketServer.on("connection", socket =>{
    const products  = PM.getProducts();
    socket.emit("realTimeProducts",products);
    socket.on("nuevoProducto",data=>{
        PM.addProduct(data);
        const products  = PM.getProducts();
        socket.emit("realTimeProducts",products);
    })
    socket.on("eliminarProducto",data=>{
        PM.deleteProduct(data);
        const products  = PM.getProducts();
        socket.emit("realTimeProducts",products);
    })
})
