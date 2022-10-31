function getByID(input) {

    let id = input.id;

    switch (id) {

        case "autos":

            localStorage.setItem("catID", 101);
            break;

        case "juguetes":

            localStorage.setItem("catID", 102);
            break;

        case "muebles":

            localStorage.setItem("catID", 103);
            break;

    }

    location.href = "./products.html";
}