const socket = io();

socket.on("realTimeProducts", data => {
    let contenidoHtml = "";
    const prodId = document.getElementById("product_id");
    const existingOptions = new Set(); 
    Array.from(prodId.options).forEach(option => {
        existingOptions.add(option.value);
    });
    
    if(data.length === 0){
        contenidoHtml = '<h4 >Lo sentimos pero no tenemos productos disponibles</h4>';
    }else{
        data.forEach(item => {
            contenidoHtml += `
                <div class="card" style="width: 18rem; margin: 10px;">
                    <img src="${item.thumbnail[0]}" class="card-img-top" alt="${item.title}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.description}</p>
                        <p class="card-text"><strong>Price: $${item.price}</strong></p>
                    </div>
                </div>
            `;

            if (!existingOptions.has(item.id.toString())) {
                let option = document.createElement("option");
                option.value = item.id;
                option.innerHTML = `Producto #${item.id}`;
                prodId.appendChild(option);
            }
        });
    }   
    document.getElementById("content").innerHTML = contenidoHtml;
});

const addProduct = ()=>{
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const status = document.getElementById("status").value;
    const category = document.getElementById("category").value;
    const thumbnail = document.getElementById("thumbnail").value.trim(); 
    if (!title || !description || !code || !price || !status || !category) {
        alert("Todos los campos son requeridos.");
         return;
    }else{
        const thumbnailArray = thumbnail === "" ? [] : [thumbnail];  
        const product = {title,description,code,category,price,status,thumbnail: thumbnailArray};
        alert("Producto agregado con exito");
        document.getElementById("productForm").reset();
        socket.emit("nuevoProducto",product);
    }

    
    
}
const deleteProduct = ()=>{
    const prodId = document.getElementById("product_id").value;
    if (!prodId) {
        alert("Por favor ingrese un ID de producto.");
        return;
    }
    alert("Producto con id : " + prodId +" \n fue eliminado con exito");
    socket.emit("eliminarProducto", prodId);
    
}