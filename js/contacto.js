// Formulario: si el tipo de negocio es "Otro", aparece un campo para escribir el rubro.
const tipoNegocio = document.getElementById("negocio");
const campoRubro = document.getElementById("campo-rubro");
const inputRubro = document.getElementById("rubro");

tipoNegocio.addEventListener("change", function () {
    const esOtro = tipoNegocio.value === "otro";
    campoRubro.hidden = !esOtro;
    inputRubro.required = esOtro;
    if (esOtro) {
        inputRubro.focus();
    } else {
        inputRubro.value = "";
    }
});

// Al enviar (con todos los campos completos) se pasa a la página de agradecimiento.
// Esa página es la que se usa para medir la conversión en Meta.
document.querySelector("form").addEventListener("submit", function (evento) {
    evento.preventDefault();
    // la página se desvanece antes de pasar a la de agradecimiento (igual que al cambiar de página)
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.body.classList.add("saliendo");
        setTimeout(function () {
            window.location.href = "gracias.html";
        }, 300);
    } else {
        window.location.href = "gracias.html";
    }
});

// Si llegás desde la ficha de un producto (contacto.html?producto=Mesa%20Stella),
// el mensaje ya viene escrito.
const productoConsulta = new URLSearchParams(window.location.search).get("producto");
if (productoConsulta) {
    document.getElementById("mensaje").value = "¡Hola! Quiero más información sobre " + productoConsulta.slice(0, 80);
}

// Si el producto es una mesa, aparece un campo para elegir el tamaño (con las personas).
// Las medidas salen de productos.js: "2,00 x 1,10 (8 personas) y 2,50 x 1,20 (8 personas)".
if (productoConsulta) {
    const mesa = productos.find(function (p) {
        return p.nombre === productoConsulta && p.categoria === "mesas";
    });
    const specMedidas = mesa && mesa.specs.find(function (s) {
        return s[0].indexOf("Medidas") === 0;
    });
    if (specMedidas) {
        const selectTamano = document.getElementById("tamano");
        specMedidas[1].split(/\s+y\s+(?=\d)|\s+-\s+(?=\d)/).forEach(function (texto) {
            const partes = texto.match(/^(.*?)\s*\((.*)\)$/);
            const opcion = document.createElement("option");
            opcion.value = texto;
            opcion.textContent = partes ? partes[1] + " m (" + partes[2] + ")" : texto + " m";
            selectTamano.append(opcion);
        });
        document.getElementById("campo-tamano").hidden = false;
    }
}
