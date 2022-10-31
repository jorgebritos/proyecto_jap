//MENU
if (!localStorage.getItem("email")) location.href = "./index.html";

let expandableMenu = document.getElementById('email');
let values = ["", "Mi Carrito", "Mi Perfil", "Cerrar Sesión"];

for (let i = 0; i < values.length; i++) {

    let option = document.createElement("option");
    let value = values[i];

    if (i === 0) {
        option.hidden = true;
        option.text = localStorage.getItem("email");
    } else {
        option.value = value;
        option.text = value;
    }

    expandableMenu.appendChild(option);

}

function menu(valor) {
    switch (valor) {
        case "Mi Perfil":
            location.href = "./my-profile.html";
            break;

        case "Mi Carrito":
            location.href = "./cart.html";
            break;

        case "Cerrar Sesión":
            localStorage.removeItem("email");
            location.href = "./index.html";
            break;
    }
}