function redirect() {
    let correo = document.getElementById("emailInput");
    let pass = document.getElementById("passInput");
    if (!correo.value || !pass.value) return alert("Debe completar los campos");
    localStorage.setItem("email", document.getElementById('emailInput').value)
    location.href="./main.html";
}