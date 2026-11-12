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

// ===== Envío de la consulta =====
// Por ahora la consulta se manda por WhatsApp. Cuando esté el CRM, solo hay que
// cambiar esta función (por ejemplo, para mandar los datos a un webhook).
const NUMERO_WHATSAPP = "5491131698686";

function armarMensaje(datos) {
    const lineas = ["¡Hola! Quiero solicitar el catálogo de Habitare.", ""];
    lineas.push("Nombre: " + datos.nombre);
    lineas.push("Teléfono: " + datos.telefono);
    lineas.push("Ciudad: " + datos.ciudad);
    lineas.push("Tipo de negocio: " + datos.negocio);
    if (datos.rubro) lineas.push("Rubro: " + datos.rubro);
    if (datos.nombreNegocio) lineas.push("Nombre del negocio: " + datos.nombreNegocio);
    if (datos.mensaje) lineas.push("Interés: " + datos.mensaje);
    if (datos.tamano) lineas.push("Tamaño de la mesa: " + datos.tamano);
    lineas.push("Permite llamada telefónica: " + (datos.llamada ? "Sí" : "No"));
    return lineas.join("\n");
}

// Devuelve true si pudo abrir WhatsApp en una pestaña nueva.
function enviarConsulta(datos) {
    const url = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(armarMensaje(datos));
    const ventana = window.open(url, "_blank");
    if (!ventana) {
        // el navegador bloqueó la pestaña nueva: se abre WhatsApp en esta misma
        window.location.href = url;
        return false;
    }
    return true;
}

// Al enviar (con todos los campos completos) se abre WhatsApp con el mensaje armado
// y esta página pasa a la de agradecimiento (la que se usa para medir la conversión en Meta).
document.querySelector("form").addEventListener("submit", function (evento) {
    evento.preventDefault();
    const valor = function (id) { return document.getElementById(id).value.trim(); };
    const selectNegocio = document.getElementById("negocio");
    const abrio = enviarConsulta({
        nombre: valor("nombre"),
        telefono: valor("telefono"),
        ciudad: valor("ciudad"),
        negocio: selectNegocio.options[selectNegocio.selectedIndex].text,
        rubro: valor("rubro"),
        nombreNegocio: valor("nombre-negocio"),
        mensaje: valor("mensaje"),
        tamano: document.getElementById("tamano").value,
        llamada: document.getElementById("checkbox").checked
    });
    if (!abrio) return;
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
        return (p.nombreCompleto || p.nombre) === productoConsulta && p.categoria === "mesas";
    });
    const specMedidas = mesa && mesa.specs.find(function (s) {
        return s[0].indexOf("Medidas") === 0;
    });
    if (specMedidas) {
        const selectTamano = document.getElementById("tamano");
        specMedidas[1].split(/\s+y\s+(?=\d|Slim:|Gran tamaño:)|\s+-\s+(?=\d)/).forEach(function (texto) {
            // si trae etiqueta ("Slim: 2,20 x 1,10 (8 personas)"), va adelante
            const conEtiqueta = texto.match(/^(Slim|Gran tamaño):\s*(.*)$/);
            const prefijo = conEtiqueta ? conEtiqueta[1] + " · " : "";
            if (conEtiqueta) texto = conEtiqueta[2];
            const partes = texto.match(/^(.*?)\s*\((.*)\)$/);
            const opcion = document.createElement("option");
            opcion.value = prefijo + texto;
            opcion.textContent = prefijo + (partes ? partes[1] + " m (" + partes[2] + ")" : texto + " m");
            selectTamano.append(opcion);
        });
        document.getElementById("campo-tamano").hidden = false;
    }
}
