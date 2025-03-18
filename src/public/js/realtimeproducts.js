const socket = io();

socket.on("realTimeProducts", data => {
    let contenidoHtml = "";
    let prodId = document.getElementById("product_id");
    prodId.innerHTML = "";

    if (data.length === 0) {
        contenidoHtml = '<h4>Lo sentimos, pero no tenemos productos disponibles</h4>';
    } else {
        data.payload.forEach(item => {
            contenidoHtml += `
                <div class="card" style="width: 18rem; margin: 10px;">
                    <img src="${item.thumbnail?.[0] || 'default.jpg'}" class="card-img-top" alt="${item.title}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.description}</p>
                        <p class="card-text"><strong>Precio: $${item.price}</strong></p>
                        <button type="button" class="btn" on>Añadir al carrito<i class="fa-solid fa-cart-shopping"></i></button>
                        <a href="/detalles/${item._id}" class="btn btn-primary">Detalles</a>
                    </div>
                </div>
            `;
            let option = document.createElement("option");
            option.value = item._id;
            option.textContent = `Producto => ${item.title}, ID => #${item._id}`;
            prodId.appendChild(option);
        });
    }

    document.getElementById("content").innerHTML = contenidoHtml;
});

const addProduct = () => {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const code = document.getElementById("code").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const status = document.getElementById("status").value.trim();
    const category = document.getElementById("category").value.trim();
    const thumbnailInput = document.getElementById("thumbnail").value.trim();
    const stock = parseInt(document.getElementById("stock").value, 10); // Convertir a número

    if (!title || !description || !code || isNaN(price) || !status || !category || stock < 0) {
        alert("Todos los campos son requeridos y el precio debe ser un número válido.");
        return;
    }else{
        alert("Se guardo un nuevo prducto");
    }

    const thumbnails = thumbnailInput ? thumbnailInput.split(",").map(url => url.trim()) : [];

    const product = { title, description, code, category, price, status, thumbnail: thumbnails,stock };

    socket.emit("nuevoProducto", product);
    document.getElementById("productForm").reset();
};

const deleteProduct = () => {
    const prodId = document.getElementById("product_id").value;
    if (!prodId) {
        alert("Por favor seleccione un producto para eliminar.");
        return;
    }

    socket.emit("eliminarProducto", prodId);
};

const addCart =()=>{
    console.log("añadir")
}
