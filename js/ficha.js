// Fundido suave cuando algo cambia en pantalla (reinicia la animación aunque ya se haya usado)
function suave(elemento) {
    elemento.classList.remove("cambio-suave");
    void elemento.offsetWidth;
    elemento.classList.add("cambio-suave");
}

// Lee el producto de la dirección (?id=silla-allure) y completa la ficha.
const id = new URLSearchParams(window.location.search).get("id");
const producto = productos.find(function (p) {
    return p.id === id;
});

// categorías por las que se fue pasando (ej. "mesas,sillas"): cada "Combina con" suma un volver nuevo
const recorrido = (function () {
    const lista = (new URLSearchParams(window.location.search).get("desde") || "").split(",").filter(Boolean);
    if (producto && lista.indexOf(producto.categoria) === -1) lista.push(producto.categoria);
    return lista;
})();

if (producto) {
    document.title = producto.nombre + " - Habitare";

    const imgPrincipal = document.getElementById("producto-img");
    imgPrincipal.alt = producto.nombre;
    const miniaturas = document.getElementById("producto-miniaturas");

    // Cuadrado que ocupa el lugar de una foto que todavía no está cargada
    const fotoPendiente = document.createElement("div");
    fotoPendiente.className = "foto-pendiente oculta";
    fotoPendiente.textContent = "Foto próximamente";
    imgPrincipal.after(fotoPendiente);

    function mostrarPendiente() {
        imgPrincipal.classList.add("oculta");
        fotoPendiente.classList.remove("oculta");
        suave(fotoPendiente);
    }

    // Fotos horizontales que se muestran completas (sin recortar los costados) dentro del cuadrado.
    const fotosCompletas = ["mesa-allegra-almendra-3"];
    imgPrincipal.addEventListener("load", function () {
        const nombre = (imgPrincipal.getAttribute("src") || "").split("/").pop().replace(".jpg", "");
        imgPrincipal.classList.toggle("completa", fotosCompletas.indexOf(nombre) !== -1);
    });

    // Cambia la foto grande con un fundido suave
    function cambiarFoto(ruta) {
        imgPrincipal.classList.remove("oculta");
        fotoPendiente.classList.add("oculta");
        if (imgPrincipal.getAttribute("src") === ruta) return;
        imgPrincipal.classList.add("cambiando");
        // se espera a que la foto nueva esté cargada, así aparece con el fundido y no de golpe
        const nueva = new Image();
        const mostrar = function () {
            imgPrincipal.src = ruta;
            imgPrincipal.classList.remove("cambiando");
        };
        setTimeout(function () {
            nueva.onload = mostrar;
            nueva.onerror = mostrar;
            nueva.src = ruta;
        }, 350);
    }

    // Fotos que están en la carpeta pero no se muestran (para volver a mostrarla, sacala de la lista)
    const fotosOcultas = ["mesa-stella-para-marmol-3", "banqueta-gisele-3", "silla-allure-3", "silla-elise-3", "silla-jolie-3"];

    // Las fotos de un grupo: base.jpg, base-2.jpg, base-3.jpg, base-4.jpg
    function nombresDeBase(base) {
        return ["", "-2", "-3", "-4"].map(function (sufijo) {
            return base + sufijo;
        });
    }

    const ruta = function (nombre) {
        return "img/productos/" + nombre + ".jpg";
    };

    const esVisible = function (nombre) {
        return fotosOcultas.indexOf(nombre) === -1;
    };

    // Productos de un solo color: muestra su lista de fotos (nombres de archivo sin carpeta ni .jpg).
    // La primera visible es la grande. Si alguna no existe, su miniatura se borra sola.
    function mostrarFotos(nombres) {
        const visibles = nombres.filter(esVisible);
        miniaturas.innerHTML = "";
        if (visibles.length === 0) return;
        imgPrincipal.src = ruta(visibles[0]);
        visibles.forEach(function (nombre, i) {
            const boton = document.createElement("button");
            const foto = document.createElement("img");
            foto.src = ruta(nombre);
            foto.alt = producto.nombre + " vista " + (i + 1);
            foto.addEventListener("error", function () {
                boton.remove();
            });
            boton.addEventListener("click", function () {
                cambiarFoto(ruta(nombre));
                miniaturas.querySelectorAll("button").forEach(function (b) {
                    b.classList.remove("activo");
                });
                boton.classList.add("activo");
            });
            if (i === 0) boton.classList.add("activo");
            boton.append(foto);
            miniaturas.append(boton);
        });
    }

    // ---- Pasar de foto: flechas (computadora) y deslizar con el dedo o el mouse ----
    const marco = document.getElementById("foto-marco");

    function irA(paso) {
        const botones = Array.from(miniaturas.querySelectorAll("button"));
        if (botones.length < 2) return;
        let actual = botones.findIndex(function (b) {
            return b.classList.contains("activo");
        });
        if (actual < 0) actual = 0;
        botones[(actual + paso + botones.length) % botones.length].click();
    }

    document.getElementById("foto-anterior").addEventListener("click", function () {
        irA(-1);
    });
    document.getElementById("foto-siguiente").addEventListener("click", function () {
        irA(1);
    });

    // las flechas se esconden si quedó una sola foto
    new MutationObserver(function () {
        marco.classList.toggle("sin-flechas", miniaturas.querySelectorAll("button").length < 2);
    }).observe(miniaturas, { childList: true });

    let inicioX = null;
    let inicioY = null;
    marco.addEventListener("pointerdown", function (evento) {
        if (evento.target.closest(".foto-flecha")) return;
        inicioX = evento.clientX;
        inicioY = evento.clientY;
    });
    marco.addEventListener("pointerup", function (evento) {
        if (inicioX === null) return;
        const dx = evento.clientX - inicioX;
        const dy = evento.clientY - inicioY;
        inicioX = null;
        // un deslizamiento de costado, no un scroll vertical ni un toque
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            irA(dx < 0 ? 1 : -1);
        }
    });
    marco.addEventListener("pointercancel", function () {
        inicioX = null;
    });

    // ---- Ampliar la foto: al tocar la foto principal se ve grande, completa y sin recorte ----
    const ampliada = document.getElementById("ampliada");
    const ampliadaImg = document.getElementById("ampliada-img");
    let arrastrando = false;
    marco.addEventListener("pointerdown", function () {
        arrastrando = false;
    });
    marco.addEventListener("pointermove", function (evento) {
        if (inicioX !== null && Math.abs(evento.clientX - inicioX) > 10) arrastrando = true;
    });

    function ampliar(abrir) {
        if (abrir) {
            ampliadaImg.src = imgPrincipal.getAttribute("src");
            ampliadaImg.alt = imgPrincipal.alt;
            ampliada.hidden = false;
            ampliada.setAttribute("aria-hidden", "false");
            // un instante después, para que se note el fundido
            requestAnimationFrame(function () {
                ampliada.classList.add("abierta");
            });
        } else {
            ampliada.classList.remove("abierta");
            ampliada.setAttribute("aria-hidden", "true");
        }
        document.body.classList.toggle("ampliada-abierta", abrir);
    }

    imgPrincipal.addEventListener("click", function () {
        if (arrastrando || imgPrincipal.classList.contains("oculta")) return;
        ampliar(true);
    });
    ampliada.addEventListener("click", function () {
        ampliar(false);
    });
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") ampliar(false);
    });

    // Colores: productos con varios colores (producto.colores).
    // Las miniaturas muestran SIEMPRE todas las fotos de todas las variantes, una variante detrás de otra.
    // Al elegir un color (o una miniatura) se marca el color y se ve la foto de esa variante.
    // Cada color puede traer "fotos" (lista de archivos) o "archivo" (grupo base, base-2...).
    // Si una variante todavía no tiene fotos, deja un cuadrado "Foto próximamente".
    let combinaActual = null;
    const contenedorColores = document.getElementById("producto-colores");
    if (producto.colores) {
        contenedorColores.hidden = false;
        const etiquetaColor = document.createElement("p");
        contenedorColores.append(etiquetaColor);

        const grupos = producto.colores.map(function (color) {
            const nombres = color.fotos || (color.archivo ? nombresDeBase(color.archivo) : []);
            return { color: color, nombres: nombres.filter(esVisible), botones: [], circulo: null };
        });

        function elegir(grupo, boton, rutaFoto) {
            miniaturas.querySelectorAll("button").forEach(function (b) {
                b.classList.remove("activo");
            });
            boton.classList.add("activo");
            contenedorColores.querySelectorAll("button").forEach(function (b) {
                b.classList.remove("activo");
            });
            grupo.circulo.classList.add("activo");
            const textoColor = "Color: " + grupo.color.nombre;
            if (etiquetaColor.textContent !== textoColor) {
                etiquetaColor.textContent = textoColor;
                suave(etiquetaColor);
            }
            if (rutaFoto) cambiarFoto(rutaFoto);
            else mostrarPendiente();
            // si este color trae su propia lista "combina", se cambia con él
            combinaActual = grupo.color.combina || null;
            mostrarCombinaciones(combinaActual);
        }

        grupos.forEach(function (grupo) {
            const color = grupo.color;
            const circulo = document.createElement("button");
            circulo.title = color.nombre;
            circulo.setAttribute("aria-label", "Color " + color.nombre);
            // La muestra es la foto de la tela del catálogo.
            // (en las mesas la muestra es un color liso: "fondo")
            // ("fondo" puede ser un color liso o un degradé de dos colores, ej. tapa y base distintas)
            if (color.fondo) circulo.style[color.fondo.indexOf("gradient") !== -1 ? "backgroundImage" : "backgroundColor"] = color.fondo;
            else circulo.style.backgroundImage = "url(" + color.muestra + ")";
            circulo.addEventListener("click", function () {
                const primera = grupo.botones.find(function (b) {
                    return b.isConnected;
                });
                if (primera) primera.click();
            });
            grupo.circulo = circulo;
            contenedorColores.append(circulo);

            if (grupo.nombres.length === 0) {
                const boton = document.createElement("button");
                const cuadrado = document.createElement("span");
                cuadrado.className = "miniatura-pendiente";
                boton.title = color.nombre + " (foto próximamente)";
                boton.append(cuadrado);
                boton.addEventListener("click", function () {
                    elegir(grupo, boton, null);
                });
                grupo.botones.push(boton);
                miniaturas.append(boton);
                return;
            }
            grupo.nombres.forEach(function (nombre, i) {
                const boton = document.createElement("button");
                const foto = document.createElement("img");
                foto.src = ruta(nombre);
                foto.alt = producto.nombre + " " + color.nombre + " vista " + (i + 1);
                foto.addEventListener("error", function () {
                    boton.remove();
                });
                boton.addEventListener("click", function () {
                    elegir(grupo, boton, ruta(nombre));
                });
                boton.append(foto);
                grupo.botones.push(boton);
                miniaturas.append(boton);
            });
        });

        // arranca en la primera variante que ya tiene fotos (sin fundido)
        // (o en el color que pida la dirección, ej. ?id=mesa-agora&color=Ébano)
        const colorPedido = new URLSearchParams(window.location.search).get("color");
        const inicial = grupos.find(function (g) {
            return g.color.nombre === colorPedido;
        }) || grupos.find(function (g) {
            return g.nombres.length > 0;
        }) || grupos[0];
        if (inicial.nombres.length > 0) imgPrincipal.src = ruta(inicial.nombres[0]);
        inicial.botones[0].click();
    } else {
        mostrarFotos(nombresDeBase(producto.id));
    }

    document.getElementById("producto-categoria").textContent = producto.etiqueta;

    // Volver: a la categoría de este producto o a todo el catálogo
    // Un "Volver a ..." por cada categoría del recorrido, y al final "Ver todo el catálogo"
    const migas = document.getElementById("migas");
    migas.innerHTML = "";
    recorrido.concat("todo").forEach(function (cat, i) {
        const ejemplo = productos.find(function (p) {
            return p.categoria === cat;
        });
        const enlace = document.createElement("a");
        if (cat === "todo") {
            enlace.textContent = "Ver todo el cat\u00e1logo";
            enlace.href = "catalogo.html";
        } else {
            enlace.textContent = "\u2190 Volver a " + ejemplo.etiqueta;
            enlace.href = "catalogo.html?categoria=" + cat;
        }
        if (i > 0) {
            const guion = document.createElement("span");
            guion.setAttribute("aria-hidden", "true");
            guion.textContent = "-";
            migas.append(guion);
        }
        migas.append(enlace);
    });
    document.getElementById("migas").hidden = false;
    const titulo = document.getElementById("producto-nombre");
    titulo.textContent = producto.nombre;
    // aclaración chiquita al lado del nombre (campo "subtitulo", ej. imitación mármol)
    if (producto.subtitulo) {
        const chico = document.createElement("small");
        chico.textContent = producto.subtitulo;
        titulo.append(" ", chico);
    }
    // el botón lleva al formulario con el producto ya nombrado en el mensaje
    document.getElementById("boton-consulta").href = "contacto.html?producto=" + encodeURIComponent(producto.nombre);
    document.getElementById("producto-descripcion").textContent = producto.descripcion;

    const lista = document.getElementById("producto-specs");
    producto.specs.forEach(function (spec) {
        // Las medidas van destacadas, en un bloque aparte
        if (spec[0].indexOf("Medidas") === 0) {
            mostrarMedidas(spec);
            return;
        }
        const item = document.createElement("li");
        const titulo = document.createElement("span");
        const valor = document.createElement("span");
        titulo.className = "spec-titulo";
        valor.className = "spec-valor";
        titulo.textContent = spec[0];
        valor.textContent = spec[1];
        item.append(titulo, valor);
        lista.append(item);
    });

    // Último dato de la lista: disponibilidad
    const itemStock = document.createElement("li");
    const tituloStock = document.createElement("span");
    const valorStock = document.createElement("span");
    tituloStock.className = "spec-titulo";
    valorStock.className = "spec-valor spec-stock";
    tituloStock.textContent = "Disponibilidad";
    valorStock.textContent = "Stock inmediato";
    itemStock.append(tituloStock, valorStock);
    lista.append(itemStock);

    mostrarCombinaciones(combinaActual);
} else {
    document.getElementById("producto-nombre").textContent = "Producto no encontrado";
    document.getElementById("producto-descripcion").innerHTML = 'Volvé al <a href="catalogo.html">catálogo</a> para elegir otro.';
    document.getElementById("producto-img").remove();
}

// Medidas destacadas: separa cada medida y deja entre paréntesis las personas.
// "1,35 x 1,15 (5 personas) - 1,65 x 1,40 (6 personas)" -> dos renglones.
function mostrarMedidas(spec) {
    const contenedor = document.getElementById("producto-medidas");
    const listaMedidas = document.getElementById("producto-medidas-lista");
    document.getElementById("producto-medidas-titulo").textContent = spec[0];
    // una medida puede empezar con una etiqueta ("Slim: 2,20 x 1,10 (8 personas)")
    spec[1].split(/\s+y\s+(?=\d|Slim:|Gran tamaño:)|\s+-\s+(?=\d|Puff)/).forEach(function (texto) {
        const item = document.createElement("li");
        const conEtiqueta = texto.match(/^(Slim|Gran tamaño):\s*(.*)$/);
        const etiqueta = conEtiqueta ? conEtiqueta[1] : "";
        if (conEtiqueta) texto = conEtiqueta[2];
        const partes = texto.match(/^(.*?)\s*(\(.*\))?$/);
        const medida = document.createElement("span");
        medida.className = "medida-valor";
        medida.textContent = partes[1];
        item.append(medida);
        if (partes[2]) {
            const personas = document.createElement("span");
            personas.className = "medida-personas";
            personas.textContent = partes[2];
            item.append(personas);
        }
        if (etiqueta) {
            const tag = document.createElement("span");
            tag.className = "medida-etiqueta";
            tag.textContent = etiqueta;
            item.append(tag);
        }
        listaMedidas.append(item);
    });
    contenedor.hidden = false;
}

// "Combina con": los productos que se llevan bien con este. Cada producto trae una lista
// (campo `combina` en productos.js) y además aparecen los que lo nombran a él en su lista.
function mostrarCombinaciones(listaPropia) {
    // una entrada puede ser "id" o "id|foto" (para mostrar otra variante en la miniatura)
    function ids(lista) {
        return [].concat(lista || []).map(function (e) {
            return e.split("|")[0];
        });
    }
    // todo lo que nombra un producto: su lista general y la de cada color
    function listaDe(p) {
        let todo = ids(p.combina);
        (p.colores || []).forEach(function (c) {
            todo = todo.concat(ids(c.combina));
        });
        return todo;
    }
    // si el color elegido trae su lista, se usa esa; si no, la general
    const propia = listaPropia || producto.combina;
    const fotos = {};
    [].concat(propia || []).forEach(function (e) {
        const partes = e.split("|");
        if (partes[1]) fotos[partes[0]] = partes[1];
    });
    const lista = document.getElementById("producto-combina-lista");
    lista.innerHTML = "";
    const ids2 = ids(propia);
    productos.forEach(function (p) {
        if (listaDe(p).indexOf(producto.id) !== -1 && ids2.indexOf(p.id) === -1 && !listaPropia) ids2.push(p.id);
    });
    const otros = ids2
        .map(function (id) {
            return productos.find(function (p) {
                return p.id === id;
            });
        })
        .filter(function (p) {
            return p && !p.oculto;
        });
    document.getElementById("producto-combina").hidden = otros.length === 0;
    if (otros.length === 0) return;
    otros.forEach(function (otro) {
        const item = document.createElement("li");
        const enlace = document.createElement("a");
        const foto = document.createElement("img");
        const nombre = document.createElement("span");
        enlace.href = "ficha-producto.html?id=" + otro.id + "&desde=" + recorrido.join(",");
        // si tiene varios colores y no hay foto con su nombre, usa la del primer color
        const primero = otro.colores && otro.colores[0].fondo ? otro.colores[0] : null;
        const base = primero ? primero.archivo || (primero.fotos && primero.fotos[0]) || otro.id : otro.id;
        foto.src = "img/productos/" + (fotos[otro.id] || base) + ".jpg";
        foto.alt = "";
        // marco de tamaño fijo; "zoomMiniatura" acerca las fotos donde el producto se ve chico
        const marco = document.createElement("span");
        marco.className = "combina-foto";
        if (otro.zoomMiniatura) foto.style.transform = "scale(" + otro.zoomMiniatura + ")";
        marco.append(foto);
        nombre.textContent = otro.nombre;
        enlace.append(marco, nombre);
        item.append(enlace);
        lista.append(item);
    });
    document.getElementById("producto-combina").hidden = false;
    suave(lista);
}
