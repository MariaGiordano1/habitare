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
