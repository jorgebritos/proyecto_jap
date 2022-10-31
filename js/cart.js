let subtotalGeneral = 0;
let costoEnvio = 0;
let tipoPago = "";
let activated = [];

let controls = document.querySelectorAll('input[class="form-control"]');
let claseEnvios = document.querySelectorAll('input[name="tipo_envio"]');
let clasePagos = document.querySelectorAll('input[name="transferenciaTipo"]');
let descPaymentType = document.getElementById("descPaymentType");
let errPaymentType = document.getElementById("err-pt");
let inputsTarjeta = document.getElementsByClassName("input-tarjeta");
let inputsTransferencia = document.getElementsByClassName("input-transferencia");

//AQUI SE CALCULA EL SUBTOTAL DEL APARTADO DE COSTOS, ADEMÁS DE TRANSFORMAR LOS PRECIOS QUE SEAN DE PESOS A DÓLARES
let calcularSubtotal = function () {
    let subtotales = document.getElementsByClassName("subtotal");
    let currencies = document.getElementsByClassName("unitCost");

    let sumaSubtotales = 0;
    for (let i = 0; i < subtotales.length; i++) {
        let currency = currencies[i].innerHTML.split(" ").splice(0, 1)[0];

        if (currency === "UYU") {
            dolar = Number(localStorage.getItem("dolar"));
            // FIXED PARA TRAERME LOS PRIMEROS 2 DECIMALES (ME PARECIÓ NECESARIO YA QUE SON DÓLARES)
            sumaSubtotales += Number(((Number(subtotales[i].innerHTML)) / dolar).toFixed(2));
        } else {
            sumaSubtotales += Number(subtotales[i].innerHTML);
        }
    }
    subtotalGeneral = sumaSubtotales;

    // INVOCO A calcularIva YA QUE SI EL SUBTOTAL CAMBIA, EL IVA SE CALCULA CON ELLO
    calcularIva();
}

let calcularIva = function () {
    // VER CUAL CLASE DE ENVIO EL USUARIO TIENE SELECCIONADO
    for (const r of claseEnvios) {
        if (r.checked) {
            costoEnvio = subtotalGeneral * Number(r.value);
        }
    }

    //POR EL MISMO MOTIVO INVOCO A mostrarTotal YA QUE SE CALCULA TANTO CON EL IVA COMO EL SUBTOTAL
    mostrarTotal();
}

let mostrarTotal = function () {

    totalPrecio = Number(subtotalGeneral) + Number(costoEnvio);

    // AQUÍ HARDCODEO 'USD' DEBIDO A QUE NO ME PARECIÓ NECESARIO TRAREME LA CURRENCY DE CUALQUIER ARTÍCULO, YA QUE
    // DE UNA FORMA U OTRA SIEMPRE DEBE SER DÓLARES
    subtotal.innerHTML = "USD " + subtotalGeneral;
    tipoEnvio.innerHTML = "USD " + costoEnvio.toFixed(2);
    total.innerHTML = "USD " + totalPrecio.toFixed(2);

}

let mostrarTipoPago = function () {

    //VEO SI EL USUARIO VA A PAGAR CON TARJETA O TRANSFERENCIA
    for (const r of clasePagos) {
        if (r.checked) {
            tipoPago = r.value;
        }
    }

    // Y SE HACEN LAS MEDIDAS NECESARIAS (EN LO PERSONAL ALGO REPETITIVO, CUANDO TENGA TIEMPO HARÉ UN REFACTORING CON UNA FUNCIÓN DEDICADA)
    switch (tipoPago) {

        case "tarjeta":
            descPaymentType.innerHTML = "Tarjeta de Crédito";
            activated = document.querySelectorAll('input[class="input-tarjeta form-control"]');
            for (let i of inputsTransferencia) {
                i.disabled = true;
                i.required = false;
            }
            for (let i of inputsTarjeta) {
                i.disabled = false;
                i.required = true;
            }
            break;

        case "transferencia":
            descPaymentType.innerHTML = "Transferencia Bancaria";
            activated = document.querySelectorAll('input[class="input-transferencia form-control"]');
            for (let i of inputsTransferencia) {
                i.disabled = false;
                i.required = true;
            }
            for (let i of inputsTarjeta) {
                i.disabled = true;
                i.required = false;
            }
            break;

        // EN CASO DE QUE NO TENGA SELECCIONADO NINGUNO, SE HARÁ LO SIGUIENTE
        default:
            descPaymentType.innerHTML = "No ha seleccionado";
            for (let i of inputsTransferencia) {
                i.disabled = true;
                i.required = false;
            }
            for (let i of inputsTarjeta) {
                i.disabled = true;
                i.required = false;
            }
            break;

    }

}

// (EVENTLISTENERS AL FINAL DEL DOCUMENTO)

document.addEventListener("DOMContentLoaded", function () {

    getJSONData(CART_INFO_URL + "25801" + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            products = resultObj.data.articles;
            showCartInfo(products);
        }
    });

    //QUISE IR UN POCO MÁS ALLÁ Y UTILICÉ UNA API QUE TE TRAE EL PRECIO
    //ACTUAL DEL DÓLAR, ASÍ QUE LO UTILIZO PARA HACER LA CONVERSIÓN A PESOS
    //(NO MUESTRA EL VALOR DEL DÓLAR QUE UNO BUSCA EN INTERNET, SINO EL VALOR DEL DÓLAR SEGÚN EL BROU)
    getJSONData(DOLAR).then(function (resultObj) {
        if (resultObj.status === "ok") {
            dolar = resultObj.data.rates['USD'].buy;
            localStorage.setItem("dolar", dolar);
        }
    });

    function showCartInfo(productsArray) {

        let itemsPersonales = JSON.parse(localStorage.getItem("listaCarrito"));
        productsArray.push(...itemsPersonales);

        let tbodyRef = document.getElementById('products').getElementsByTagName('tbody')[0];

        for (const product of productsArray) {
            let { name, unitCost, count, image } = product;
            let itteratorProduct = { image, name, unitCost, count };

            var newItem = tbodyRef.insertRow();

            for (const prop in itteratorProduct) {
                let newCell = newItem.insertCell();
                let input = document.createElement("INPUT");

                //EN TODAS LAS CASILLAS QUE UTILIZO DIRECTAMENTE, LES COLOCO EL NOMBRE DEL MISMO PRODUCTO, MÁS EL TIPO DE CASILLA
                //COMO SU ID. ESTO PARA QUE SEA MAS FÁCIL HACERLE SABER AL DOCUMENTO QUE CASILLAS ESPECÍFICAS QUIERO UTILIZAR
                //(SIENTO QUE SERÍA MUCHO MÁS LIMPIO UTILIZAR EL ID EN VEZ DEL NOMBRE, PERO LO HARÉ CUANDO VUELVA A REFACTORIZAR)
                switch (prop) {

                    case "image":
                        let img = document.createElement("img");
                        img.src = `/${itteratorProduct[prop]}`;
                        img.classList = "col-12";
                        newCell.style = 'width: 100px';
                        newCell.appendChild(img);
                        break;

                    case "count":
                        input = document.createElement("INPUT");
                        input.setAttribute("type", "number");
                        input.setAttribute("min", "1");
                        input.setAttribute("id", `${itteratorProduct['name']}Count`);
                        input.setAttribute("oninput", "validity.valid||(value='1')");
                        input.setAttribute("value", itteratorProduct[prop]);
                        newCell.appendChild(input);

                        document.getElementById(`${itteratorProduct['name']}Count`).addEventListener("input", function () {

                            let subtotal = document.getElementById(`${itteratorProduct['name']}Subtotal`).childNodes[0];
                            let costoUnitario = document.getElementById(`${itteratorProduct['name']}UnitCost`).childNodes[0].innerHTML.split(" ").splice(1, 1)[0];
                            let cantidad = document.getElementById(`${itteratorProduct['name']}Count`).value;
                            subtotal.innerHTML = costoUnitario * cantidad;

                            calcularSubtotal(cantidad);;
                        })

                        break;

                    case "unitCost":
                        let p = document.createElement("p");
                        p.setAttribute("class", "unitCost");
                        var newText = document.createTextNode(product.currency + " " + itteratorProduct[prop]);
                        p.appendChild(newText);
                        newCell.id = `${itteratorProduct['name']}UnitCost`;
                        newCell.appendChild(p);
                        break;

                    default:
                        //AQUÍ ENTRAN LAS CASILLAS QUE NO UTILIZO DIRECTAMENTE Y SOLO MUESTRAN DATOS
                        var newText = document.createTextNode(itteratorProduct[prop]);
                        newCell.appendChild(newText);
                        break;
                }
            }

            //CASILLA SUBTOTAL
            let newCell = newItem.insertCell();
            newCell.id = `${itteratorProduct['name']}Subtotal`;
            let p = document.createElement("p");
            p.setAttribute("class", "subtotal");
            var newText = document.createTextNode(itteratorProduct.count * itteratorProduct.unitCost);
            p.appendChild(newText);
            newCell.appendChild(p);

            // CASILLA DE ELIMINAR PRODUCTO
            let deleteButton = newItem.insertCell();
            let deleteIcon = document.createElement('button');
            deleteIcon.classList = 'fa fa-trash fa-3';

            deleteIcon.addEventListener("click", function () {

                //EN CASO DE SELECCIONARLO, ADEMÁS DE ELIMINARLO DE LA LISTA, REINICIA LA PÁGINA PARA QUE REFLEJE LOS CAMBIOS
                //EN SU TOTALIDAD (NO ME PARECE LA MANERA MÁS CONVENIENTE, PERO PARA UNA PRIMERA INSTANCIA, ES LO QUE SE ME OCURRIÓ)
                itemsPersonales = itemsPersonales.filter(p => p.name != itteratorProduct.name);
                localStorage.setItem("listaCarrito", JSON.stringify(itemsPersonales));
                location.href = "./cart.html";

            })

            deleteButton.appendChild(deleteIcon);
        }
        //MOSTRAR VALORES INICIALES
        calcularSubtotal();
        calcularIva();
        mostrarTipoPago();
    }

    // AQUÍ ES CUANDO SE ACTIVAN LOS FEEDBACK DE LOS INPUT DEL FORMULARIO CUANDO EL USUARIO NO COMPLETA LOS DATOS
    // O SE BORRAN LOS DATOS Y SE MUESTRA EL POP-UP SI SE HACE CORRECTAMENTE

    var form = document.querySelector('.needs-validation');

    form.addEventListener('submit', function (event) {

        for (const i of activated) {
            //EN CASO DE QUE DENTRO DEL MODAL, ALGUNO DE LOS CAMPOS SELECCIONADOS ESTÉN VACÍOS, EN VEZ DE MOSTRAR UN ERROR
            //DEBAJO DEL TIPO DE PAGO EN LA PÁGINA PRINCIPAL, SE DESPLIEGA EL MISMO MODAL PARA QUE EL USUARIO VEA EL ERROR
            if (i.value.length < 1) document.getElementById("btn-modal").click();
        }
        if (tipoPago === "") {
            //SI EL USUARIO NO SELECCIONÓ NINGUN MÉTODO DE PAGO...
            errPaymentType.innerHTML = "Debe seleccionar una forma de pago";
            form.classList.add('was-validated');
            return 1;
        } else {
            errPaymentType.innerHTML = "";
        }
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            event.preventDefault();
            event.stopPropagation();
        } else {
            let success = document.getElementById("success");

            //EN VEZ DE CREAR EL POP-UP EN EL HTML Y DARLE LA CLASE DE SHOW DESDE JS, DECIDÍ HACERLO DE ESTA FORMA, DEBIDO A QUE
            //EN EL GRUPAL 1, TENÍAMOS ALGO PARECÍDO, Y EN CASO DE QUE APRETARAMOS EL BOTÓN 2 VECES, TIRABA ERROR Y NO LO MOSTRABA.
            //DE ESTA FORMA SE EVÍTA DICHO ERROR.
            success.innerHTML = `
            <div class="alert alert-success alert-dismissible fade" role="alert" id="alert-success">
                <p>La compra se ha realizado correctamente!</p>
                <button type="button" class="btn-close" id="cerrarPopup" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
            document.getElementById("alert-success").classList.add("show");

            //PARA QUE CUANDO SE QUITEN LOS DATOS DE LOS INPUTS, NO SIGA MOSTRANDO LOS FEEDBACK
            form.classList.remove('was-validated');

            //LUEGO DE 4 SEGUNDOS, SE ELIMINA AUTOMÁTICAMENTE EL POP-UP
            setTimeout(() => {
                document.getElementById("cerrarPopup").click();
            }, 4000);


            //ELIMINANDO DATOS LUEGO DE COMPLETAR CORRECTAMENTE EL FORMULARIO
            let reiniciar = (toReplace) => {
                for (let i of toReplace) {
                    i.value = "";
                }

                for (const r of clasePagos) {
                    r.checked = false;
                }

                // PARA QUE SE REINICIE EL TEXTO QUE MUESTRA EL TIPO DE PAGO
                tipoPago = "";
                mostrarTipoPago();
            }

            reiniciar([...controls, ...inputsTarjeta, ...inputsTransferencia]);

        }

    }, false)

    claseEnvios.forEach((radio) => {
        radio.addEventListener("click", () => {
            //SI EL TIPO DE ENVÍO CAMBIA, DEBE REFLEJARSE EN EL PRECIO DEL IVA
            calcularIva();
        })
    })

    clasePagos.forEach((radio) => {
        radio.addEventListener("click", () => {

            mostrarTipoPago();

            if (!form.checkValidity()) {
                if (tipoPago !== "") {
                    errPaymentType.innerHTML = "";
                }
            }
        })
    })
})