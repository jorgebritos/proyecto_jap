let productsArray = [];

function asd(id) {
    localStorage.setItem("prodID", id);
    location.href="./product-info.html";    
}

function showProducts(array) {
    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        let product = array[i];
        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action" onclick=asd(${product.id}) style="cursor: pointer">
            <div class="row">
                <div class="col-3">
                    <img src="` + product.image + `" alt="product image" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div class="mb-1">
                        <h4>`+ product.name + ` - ` + product.cost + ` ` + product.currency + `</h4> 
                        <p> `+ product.description + `</p> 
                        </div>
                        <small class="text-muted">` + product.soldCount + ` artículos</small> 
                    </div>
                </div>
            </div>
        </div>
        `
    }
    document.getElementById("title").innerHTML = "Verás aquí todos los productos de la categoria seleccionada"
    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productsArray = resultObj.data.products;
            showProducts(productsArray);
        }
    });
});

document.getElementById("rangeFilterCount").addEventListener("click", function () {
    //Obtengo el mínimo y máximo de los intervalos para filtrar por precio
    minCost = document.getElementById("rangeFilterCountMin").value;
    maxCost = document.getElementById("rangeFilterCountMax").value;
    products = [];

    productsArray.forEach(product => {
        if (product.cost >= minCount && product.cost <= maxCount) products.push(product);
    });

    showProducts(products);
});

document.getElementById("sortAsc").addEventListener("click", function () {
    let ascP = [...productsArray];
    (ascP.sort((a, b) => (b.cost > a.cost) ? 1 : ((a.cost > b.cost) ? -1 : 0)));
    showProducts(ascP);
});

document.getElementById("sortDesc").addEventListener("click", function () {
    let descP = [...productsArray];
    (descP.sort((a, b) => (a.cost > b.cost) ? 1 : ((b.cost > a.cost) ? -1 : 0)));
    showProducts(descP);
});

document.getElementById("sortByCount").addEventListener("click", function () {
    let countP = [...productsArray];
    (countP.sort((a, b) => (b.soldCount > a.soldCount) ? 1 : ((a.soldCount > b.soldCount) ? -1 : 0)));
    showProducts(countP);
});

document.getElementById('clearRangeFilter').addEventListener("click", function () {
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";

    minCount = undefined;
    maxCount = undefined;
    showProducts(productsArray);
})