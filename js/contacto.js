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
    window.location.href = "gracias.html";
});

// Si llegás desde la ficha de un producto (contacto.html?producto=Mesa%20Stella),
// el mensaje ya viene escrito.
const productoConsulta = new URLSearchParams(window.location.search).get("producto");
if (productoConsulta) {
    document.getElementById("mensaje").value = "¡Hola! Quiero más información sobre " + productoConsulta.slice(0, 80);
}
