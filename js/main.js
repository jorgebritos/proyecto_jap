document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
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
});

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