function redirect() {
    let correo = document.getElementById("emailInput");
    let pass = document.getElementById("passInput");
    localStorage.setItem("email", document.getElementById('emailInput').value)
    console.log(location.href)
    if (!correo.value || !pass.value) return alert("Debe completar los campos");
    location.href="./main.html";
}