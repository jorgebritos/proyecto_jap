document.addEventListener("DOMContentLoaded", function () {
    getJSONData(CART_INFO_URL + "25801" + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            products = resultObj.data.articles;
            showCartInfo(products)
        }
    });

    function showCartInfo(productsArray) {
        let itemsPersonales = JSON.parse(localStorage.getItem("listaCarrito"));
        productsArray.push(...itemsPersonales)
        let tbodyRef = document.getElementById('products').getElementsByTagName('tbody')[0];

        for (const product of productsArray) {
            let { name, unitCost, count, image } = product;
            let itteratorProduct = { image, name, unitCost, count }

            var newItem = tbodyRef.insertRow();

            for (const prop in itteratorProduct) {
                let newCell = newItem.insertCell();
                let input = document.createElement("INPUT");
                switch (prop) {
                    case "image":
                        let img = document.createElement("img");
                        img.src = `/${itteratorProduct[prop]}`;
                        img.classList = "col-3"
                        newCell.classList = "col-sm-5 pr-0"
                        newCell.appendChild(img)
                        break;
                    case "count":
                        input = document.createElement("INPUT");
                        input.setAttribute("type", "number");
                        input.setAttribute("min", "1");
                        input.setAttribute("id", `${itteratorProduct['name']}Count`)
                        input.setAttribute("oninput", "validity.valid||(value='1')")
                        input.setAttribute("value", itteratorProduct[prop])
                        newCell.appendChild(input)

                        document.getElementById(`${itteratorProduct['name']}Count`).addEventListener("change", function () {
                            let subtotal = document.getElementById(`${itteratorProduct['name']}Subtotal`);
                            let costoUnitario = document.getElementById(`${itteratorProduct['name']}UnitCost`).innerHTML;
                            let cantidad = document.getElementById(`${itteratorProduct['name']}Count`).value;

                            subtotal.innerHTML = costoUnitario * cantidad;
                        })
                    case "unitCost":
                        var newText = document.createTextNode(itteratorProduct[prop]);
                        newCell.id = `${itteratorProduct['name']}UnitCost`
                        newCell.appendChild(newText);
                        break;

                    default:
                        var newText = document.createTextNode(itteratorProduct[prop]);
                        newCell.appendChild(newText);
                        break;
                }
            }

            let newCell = newItem.insertCell();
            var newText = document.createTextNode(itteratorProduct.count * itteratorProduct.unitCost);
            newCell.id = `${itteratorProduct['name']}Subtotal`
            newCell.appendChild(newText);

        }
    }
})

//MENU

let expandableMenu = document.getElementById('email');
let option = document.createElement("option");
option.hidden = true;
let value = localStorage.getItem("email")
option.text = value;
expandableMenu.appendChild(option);

option = document.createElement("option");
value = "Mi Carrito"
option.value = value;
option.text = value;
expandableMenu.appendChild(option);

option = document.createElement("option");
value = "Mi Perfil"
option.value = value;
option.text = value;
expandableMenu.appendChild(option);

option = document.createElement("option");
value = "Cerrar Sesión";
option.value = value;
option.text = value;
expandableMenu.appendChild(option);

function menu(valor) {
    switch (valor) {
        case "Mi Perfil":
            window.location = "my-profile.html";
            break;

        case "Mi Carrito":
            window.location = "cart.html";
            break;

        case "Cerrar Sesión":
            localStorage.removeItem("email");
            window.location = "index.html";
            break;

        default:
            break;
    }
}