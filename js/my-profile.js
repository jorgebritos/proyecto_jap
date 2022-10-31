let obj = {};
let img = document.getElementById("imgPerfil");
let inputs = document.getElementsByClassName("form-control");
let requiredI = [];
let notRequiredI = [];
let errDesc = document.getElementById("errDesc");
let btn = document.getElementById("btn-enviar");
let imgFile = "";
let account = JSON.parse(localStorage.getItem("account"));

function readURL(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            imgFile = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    for (const i of inputs) {
        if (i.required === true) requiredI.push(i);
        if (i.required === false) notRequiredI.push(i);
    }

    if (account) {
        for (const i of inputs) {
            if (account[i.id] && i.id !== "img") i.value = account[i.id];

            if (account[i.id] && i.id === "img") {
                img.src = account[i.id];
            } else if (account['img'] === "") {
                img.src = "../img/user.png";
            }
        }
    }

    btn.addEventListener("click", () => {
        for (const i of requiredI) {
            if (i.value == "") return alert("Rellene los campos obligatorios");
            obj[i.id] = i.value;
        }

        for (const i of notRequiredI) {
            if (i.id !== "img") obj[i.id] = i.value;
        }

        if (img !== "") obj.img = imgFile;

        obj = JSON.stringify(obj);

        localStorage.setItem("account", obj);
        window.location = "my-profile.html";
    })

})

