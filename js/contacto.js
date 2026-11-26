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

// ===== CRM (GoHighLevel) y Meta =====
// Los datos van a /api/lead (función de Vercel). Esa función los manda a GoHighLevel
// y a la API de conversiones de Meta. La dirección del webhook y el token de Meta
// quedan escondidos en Vercel (variables de entorno), nunca en este archivo.

// Identificador único de esta consulta. Se usa igual en el navegador y en el servidor
// para que Meta cuente un solo Lead aunque le lleguen dos avisos.
function nuevoEventId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Date.now() + "-" + Math.random().toString(36).slice(2);
}

// Completa los campos ocultos del formulario con los datos del anuncio y las cookies de Meta.
function completarOcultos(formulario, eventId) {
    const anuncio = window.habitareAtribucion ? window.habitareAtribucion() : {};
    const cookie = window.habitareCookie || function () { return ""; };
    const valores = {
        utm_source: anuncio.utm_source,
        utm_campaign: anuncio.utm_campaign,
        utm_content: anuncio.utm_content,
        ad_id: anuncio.ad_id,
        adset_id: anuncio.adset_id,
        campaign_id: anuncio.campaign_id,
        fbclid: anuncio.fbclid,
        fbp: cookie("_fbp"),
        fbc: cookie("_fbc"),
        event_id: eventId,
        page_url: window.location.href
    };
    Object.keys(valores).forEach(function (nombre) {
        formulario.elements[nombre].value = valores[nombre] || "";
    });
    // utm_medium y utm_term no tienen campo oculto, pero se mandan igual al CRM
    return Object.assign({}, valores, {
        utm_medium: anuncio.utm_medium || "",
        utm_term: anuncio.utm_term || "",
        landing_url: anuncio.landing_url || ""
    });
}

// Manda la consulta y espera la respuesta. Devuelve true solo si llegó bien a GoHighLevel.
function enviarAlCRM(datos, ocultos) {
    const params = new URLSearchParams(window.location.search);
    const cuerpo = Object.assign({}, datos, ocultos, {
        producto: params.get("producto") || "",
        pagina: window.location.href,
        website: document.getElementById("website").value // trampa para bots: debe ir vacío
    });
    const controlador = window.AbortController ? new AbortController() : null;
    const corte = setTimeout(function () { if (controlador) controlador.abort(); }, 10000);
    return fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
        keepalive: true,
        signal: controlador ? controlador.signal : undefined
    }).then(function (r) {
        return r.ok;
    }).catch(function () {
        return false;
    }).finally(function () {
        clearTimeout(corte);
    });
}

// Dispara el Lead del píxel (solo después de que /api/lead respondió OK).
// Espera un momento a que termine de cargar el píxel para no perder el evento al cambiar de página.
function dispararLead(eventId, tipoNegocio) {
    return new Promise(function (listo) {
        if (!window.fbq) return listo();
        const inicio = Date.now();
        (function esperar() {
            const cargado = typeof window.fbq.callMethod === "function";
            if (cargado || Date.now() - inicio > 1500) {
                fbq("track", "Lead", { content_category: tipoNegocio }, { eventID: eventId });
                setTimeout(listo, 300);
            } else {
                setTimeout(esperar, 100);
            }
        })();
    });
}

// ===== Validación =====
// Todos los campos son obligatorios. En vez de la burbuja del navegador, el aviso
// aparece debajo del campo con el estilo de Habitare (ver .aviso-campo en contacto.css).
function mostrarAviso(campo, texto) {
    const control = campo.querySelector("input, select, textarea");
    let aviso = campo.querySelector(".aviso-campo");
    if (!aviso) {
        aviso = document.createElement("p");
        aviso.className = "aviso-campo";
        aviso.id = "aviso-" + control.id;
        aviso.setAttribute("role", "alert");
        campo.append(aviso);
    }
    aviso.textContent = texto;
    void aviso.offsetHeight; // para que el aviso aparezca con fundido y no de golpe
    campo.classList.add("con-error");
    control.setAttribute("aria-invalid", "true");
    control.setAttribute("aria-describedby", aviso.id);
}

function quitarAviso(campo) {
    const control = campo.querySelector("input, select, textarea");
    campo.classList.remove("con-error");
    control.removeAttribute("aria-invalid");
    control.removeAttribute("aria-describedby");
}

// Teléfono: solo puede tener números, espacios, +, guiones y paréntesis,
// y entre 8 y 15 números (ej. 11 3169-8686 o +54 9 11 3169 8686).
function telefonoValido(texto) {
    if (!/^[0-9+()\-\s.]+$/.test(texto)) return false;
    const numeros = texto.replace(/\D/g, "").length;
    return numeros >= 8 && numeros <= 15;
}

// Devuelve el primer campo con error (o null si está todo completo).
function validarFormulario(formulario) {
    let primero = null;
    formulario.querySelectorAll(".campo").forEach(function (campo) {
        if (campo.hidden) return; // por ejemplo "rubro" o "tamaño" cuando no corresponden
        const control = campo.querySelector("input, select, textarea");
        const vacio = control.value.trim() === "";
        if (vacio) {
            mostrarAviso(campo, control.tagName === "SELECT" ? "Elegí una opción" : "Completá este campo");
            if (!primero) primero = control;
        } else if (control.id === "telefono" && !telefonoValido(control.value)) {
            mostrarAviso(campo, "Revisá el número (con código de área)");
            if (!primero) primero = control;
        } else {
            quitarAviso(campo);
        }
    });
    return primero;
}

// El aviso desaparece apenas la persona corrige el campo
document.querySelectorAll(".campo").forEach(function (campo) {
    const control = campo.querySelector("input, select, textarea");
    ["input", "change"].forEach(function (tipo) {
        control.addEventListener(tipo, function () {
            if (campo.classList.contains("con-error") && control.value.trim() !== "") {
                quitarAviso(campo);
            }
        });
    });
});

let enviando = false;
document.querySelector("form").addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (enviando) return; // evita que un doble clic mande la consulta dos veces
    const formulario = evento.target;
    const sinCompletar = validarFormulario(formulario);
    if (sinCompletar) {
        sinCompletar.focus();
        return;
    }
    const valor = function (id) { return document.getElementById(id).value.trim(); };
    const selectNegocio = document.getElementById("negocio");
    const datos = {
        nombre: valor("nombre"),
        telefono: valor("telefono"),
        ciudad: valor("ciudad"),
        negocio: selectNegocio.options[selectNegocio.selectedIndex].text,
        rubro: valor("rubro"),
        nombreNegocio: valor("nombre-negocio"),
        mensaje: valor("mensaje"),
        tamano: document.getElementById("tamano").value,
        llamada: document.getElementById("checkbox").checked
    };
    enviando = true;
    const boton = formulario.querySelector("button[type='submit']");
    boton.disabled = true;

    const eventId = nuevoEventId();
    const ocultos = completarOcultos(formulario, eventId);

    enviarAlCRM(datos, ocultos).then(function (ok) {
        if (!ok) {
            // no llegó al CRM: se avisa y se puede volver a intentar (no se pierde lo escrito)
            enviando = false;
            boton.disabled = false;
            mostrarErrorEnvio(formulario);
            return;
        }
        quitarErrorEnvio(formulario);
        dispararLead(eventId, datos.negocio).then(function () {
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
    });
});

// Aviso debajo del botón si la consulta no se pudo enviar (aparece con fundido, ver .aviso-envio en contacto.css)
function mostrarErrorEnvio(formulario) {
    let aviso = formulario.querySelector(".aviso-envio");
    if (!aviso) {
        aviso = document.createElement("p");
        aviso.className = "aviso-envio";
        aviso.setAttribute("role", "alert");
        aviso.textContent = "No pudimos enviar tu consulta. Probá de nuevo en unos segundos.";
        formulario.append(aviso);
        void aviso.offsetHeight;
    }
    aviso.classList.add("visible");
}

function quitarErrorEnvio(formulario) {
    const aviso = formulario.querySelector(".aviso-envio");
    if (aviso) aviso.classList.remove("visible");
}

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
