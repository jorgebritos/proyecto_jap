//VALORES
let product = {};
let comments = [];
let carritoLista = [];

//Donde se guarda el comentario que crea el usuario
let comment = {};

//OBJETOS
let commentsCont = document.getElementById("comments");
let contenedor = document.getElementById("container");
let newComment = document.getElementById("sendComment");
let relatedProductsContainer = document.getElementById("relatedProducts");


//OBTENER DATOS DEL PRODUCTO Y SUS COMENTARIOS
document.addEventListener("DOMContentLoaded", function (e) {

    //PRODUCTO
    getJSONData(PRODUCT_INFO_URL + localStorage.getItem("prodID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;
            showProduct(product);
        }
    });

    //COMENTARIOS
    getJSONData(PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("prodID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            comments = resultObj.data;
            showComments(comments);
        }
    });
});

function agregarACarrito() {

    if (localStorage.getItem("listaCarrito")) carritoLista = JSON.parse(localStorage.getItem("listaCarrito"));
    if (carritoLista.find(p => p.name == product.name)) return 0;

    let unitCost = product.cost;
    let image = product.images[0];
    let count = 1;
    let { id, name, currency } = product;
    let usefulProductData = { id, name, count, unitCost, currency, image };

    carritoLista.push(usefulProductData);
    localStorage.setItem("listaCarrito", JSON.stringify(carritoLista));
}


//MOSTRAR DATOS PRODUCTO
function showProduct(product) {
    let htmlContentToAppend = `
    <h2>${product.name}</h2>
    <button onclick="agregarACarrito()">Comprar</button>
    <hr>
    <h5>Precio</h5>
    <p>${product.currency} ${product.cost}</p>
    <h5>Descripción</h5>
    <p>${product.description}</p>
    <h5>Categoría</h5>
    <p>${product.category}</p>
    <h5>Cantidad de vendidos</h5>
    <p>${product.soldCount}</p>
    <h5>Imagenes ilustrativas</h5>
    <div id="carousel" class="carousel carousel-dark slide" data-bs-ride="carousel" style="width: 80%; margin: 0 auto;">
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#carousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner" id="carrousel">
            <div class="carousel-item active" data-bs-interval="5000">
                <img src="${product.images[0]}" class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                </div>
            </div>
            <div class="carousel-item" data-bs-interval="5000">
                <img src="${product.images[1]}" class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                </div>
            </div>
            <div class="carousel-item" data-bs-interval="5000">
                <img src="${product.images[2]}" class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
            </div>
        </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
    </div>
        `;

    contenedor.innerHTML = htmlContentToAppend;

    //PRODUCTOS RELACIONADOS
    let relatedProducts = product.relatedProducts;
    let relatedProductsContent = "";
    for (const rp of relatedProducts) {
        relatedProductsContent += `
            <div onclick="setProdID(${rp.id})" class="cursor-active">
                <img src="${rp.image}" alt="product image" class="img-thumbnail">
                <h5>${rp.name}</h5>
            </div>`;
    }
    relatedProductsContainer.innerHTML = relatedProductsContent;
}

function setProdID(id) {
    localStorage.setItem("prodID", id);
    location.href = "./product-info.html";
}

//MOSTRAR COMENTARIOS DEL PRODUCTO
function showComments(comments) {
    for (const comment of comments) {
        //FUNCION PARA CALCULAR CANTIDAD DE ESTRELLAS DEL COMENTARIO
        let stars = function (numberStars) {

            let stars = "";
            let cont = 0;

            //SI EL SCORE ES 5...
            for (let i = 0; i < numberStars; i++) {
                stars += `<span class="fa fa-star checked"></span>`;
                cont++;
            }
            if (numberStars === 5) return stars;

            //SI ES MENOR A 5...
            let missing = 5 - cont;

            for (let i = 0; i < missing; i++) {
                stars += `<span class="fa fa-star"></span>`;
            }
            return stars;
        }

        let htmlContentToAppend = "";

        htmlContentToAppend = `
        <div class="list-group-item list-group-item-action">
            <p><b>${comment.user}</b> - ${comment.dateTime} - ${stars(comment.score)}</p>
            <small>${comment.description}</small>
        </div>
        <br>
        `;
        commentsCont.innerHTML += htmlContentToAppend;
    }
}

// (DESAFIATE) AÑADIR UN NUEVO COMENTARIO
newComment.addEventListener("click", function () {
    let text = document.getElementById("comment");
    let score = document.getElementById("score");

    if (!text.value) return alert("El comentario no puede estar vacío");

    var date = new Date();
    let dateTime = date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate() + " " + (date.getUTCHours() - 3) + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();

    comment = {
        dateTime: dateTime,
        description: text.value,
        score: Number(score.value),
        user: localStorage.getItem("email"),
        product: Number(localStorage.getItem("prodID"))
    };
    comments.push(comment);
    commentsCont.innerHTML = "";
    showComments(comments);

    text.value = "";
    score.value = 1;
});