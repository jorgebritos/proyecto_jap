let productsArray = [];
let unSorted = [];

function setProdID(id) {
    localStorage.setItem("prodID", id);
    location.href = "./product-info.html";
}

function showProducts(array) {
    let htmlContentToAppend = "";

    for (const product of array) {

        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action" onclick=setProdID(${product.id}) style="cursor: pointer">
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
        `;
    }

    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;

}

document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData(PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productsArray = resultObj.data.products;
            unSorted = resultObj.data.products;
            showProducts(productsArray);
        }
    });

});

document.getElementById("rangeFilterCount").addEventListener("click", function () {
    //Obtengo el mínimo y máximo de los intervalos para filtrar por precio
    minCost = document.getElementById("rangeFilterCountMin").value;
    maxCost = document.getElementById("rangeFilterCountMax").value;

    productsArray = unSorted.filter(p => p.cost >= minCost && p.cost <= maxCost)

    showProducts(productsArray);
});

function filter(criteria) {

    switch (criteria) {

        case "costAsc":

            productsArray.sort((a, b) => (b.cost > a.cost) ? 1 : ((a.cost > b.cost) ? -1 : 0));
            break;

        case "costDesc":

            productsArray.sort((a, b) => (a.cost > b.cost) ? 1 : ((b.cost > a.cost) ? -1 : 0));
            break;

        case "count":

            productsArray.sort((a, b) => (b.soldCount > a.soldCount) ? 1 : ((a.soldCount > b.soldCount) ? -1 : 0));
            break;

    }

    showProducts(productsArray);

}

document.getElementById('clearRangeFilter').addEventListener("click", function () {

    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";

    minCount = undefined;
    maxCount = undefined;

    showProducts(unSorted);

});