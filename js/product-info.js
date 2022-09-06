//VALORES
let product = {};
let comments = [];
let comment = {};

//OBJETOS
let commentsCont = document.getElementById("comments")
let contenedor = document.getElementById("container");
let newComment = document.getElementById("sendComment")

//OBTENER DATOS DEL PRODUCTO Y SUS COMENTARIOS
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL + localStorage.getItem("prodID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;
            showProduct(product)
        }
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("prodID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            comments = resultObj.data;
            showComments(comments);
        }
    });
});

//MOSTRAR DATOS PRODUCTO
function showProduct(product) {
    let htmlContentToAppend = "";
    htmlContentToAppend += `
    <h2>${product.name}</h2>
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
    <p>${product.soldCount}</p>
    <div class="col-3 d-flex justify-content-between">
        <img src="` + product.images[0] + `" alt="product image" class="img-thumbnail">
        <img src="` + product.images[1] + `" alt="product image" class="img-thumbnail">
        <img src="` + product.images[2] + `" alt="product image" class="img-thumbnail">
        <img src="` + product.images[3] + `" alt="product image" class="img-thumbnail">
    </div>
        `
    contenedor.innerHTML = htmlContentToAppend;
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
                stars += `<span class="fa fa-star checked"></span>`
                cont++;
            }
            if (numberStars === 5) return stars;

            //SI ES MENOR A 5...
            let missing = 5 - cont;

            for (let i = 0; i < missing; i++) {
                stars += `<span class="fa fa-star"></span>`
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
        `
        commentsCont.innerHTML += htmlContentToAppend;
    }
}

// (DESAFIATE) AÑADIR UN NUEVO COMENTARIO
newComment.addEventListener("click", function () {
    let text = document.getElementById("comment")
    let score = document.getElementById("score")

    if (!text.value) return alert("El comentario no puede estar vacío")

    var date = new Date();
    let dateTime = date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate() + " " + (date.getUTCHours() - 3) + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();

    comment = {
        dateTime: dateTime,
        description: text.value,
        score: Number(score.value),
        user: localStorage.getItem("email"),
        product: Number(localStorage.getItem("prodID"))
    }
    comments.push(comment)
    commentsCont.innerHTML = "";
    showComments(comments)

    text.value = "";
    score.value = 1;
})