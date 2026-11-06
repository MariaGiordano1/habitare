// Lee el producto de la dirección (?id=silla-allure) y completa la ficha.
const id = new URLSearchParams(window.location.search).get("id");
const producto = productos.find(function (p) {
    return p.id === id;
});

if (producto) {
    document.title = producto.nombre + " - Habitare";

    const imgPrincipal = document.getElementById("producto-img");
    imgPrincipal.alt = producto.nombre;
    const miniaturas = document.getElementById("producto-miniaturas");

    // Cambia la foto grande con un fundido suave
    function cambiarFoto(ruta) {
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
    const fotosOcultas = ["mesa-stella-para-marmol-3", "banqueta-gisele-3"];

    // Muestra las fotos de un grupo: base.jpg, base-2.jpg, base-3.jpg.
    // Si alguna foto no existe, su miniatura se borra sola.
    function mostrarFotos(base, conFundido) {
        miniaturas.innerHTML = "";
        if (conFundido) {
            cambiarFoto("img/productos/" + base + ".jpg");
        } else {
            imgPrincipal.src = "img/productos/" + base + ".jpg";
        }
        ["", "-2", "-3"].forEach(function (sufijo) {
            if (fotosOcultas.indexOf(base + sufijo) !== -1) return;
            const boton = document.createElement("button");
            const foto = document.createElement("img");
            foto.src = "img/productos/" + base + sufijo + ".jpg";
            foto.alt = producto.nombre + " vista " + (sufijo === "" ? "1" : sufijo.slice(1));
            foto.addEventListener("error", function () {
                boton.remove();
            });
            boton.addEventListener("click", function () {
                cambiarFoto(foto.src);
                miniaturas.querySelectorAll("button").forEach(function (b) {
                    b.classList.remove("activo");
                });
                boton.classList.add("activo");
            });
            if (sufijo === "") boton.classList.add("activo");
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

    // Colores: solo las sillas con varios colores (producto.colores).
    const contenedorColores = document.getElementById("producto-colores");
    if (producto.colores) {
        contenedorColores.hidden = false;
        const etiquetaColor = document.createElement("p");
        contenedorColores.append(etiquetaColor);
        producto.colores.forEach(function (color, i) {
            const boton = document.createElement("button");
            boton.title = color.nombre;
            boton.setAttribute("aria-label", "Color " + color.nombre);
            // La muestra es la foto de la tela del catálogo.
            boton.style.backgroundImage = "url(" + color.muestra + ")";
            boton.addEventListener("click", function () {
                contenedorColores.querySelectorAll("button").forEach(function (b) {
                    b.classList.remove("activo");
                });
                boton.classList.add("activo");
                etiquetaColor.textContent = "Color: " + color.nombre;
                mostrarFotos(color.archivo, true);
            });
            contenedorColores.append(boton);
            if (i === 0) boton.click();
        });
    } else {
        mostrarFotos(producto.id);
    }

    document.getElementById("producto-categoria").textContent = producto.etiqueta;

    // Volver: a la categoría de este producto o a todo el catálogo
    const miga = document.getElementById("miga-categoria");
    miga.textContent = "\u2190 Volver a " + producto.etiqueta;
    miga.href = "catalogo.html?categoria=" + producto.categoria;
    document.getElementById("migas").hidden = false;
    document.getElementById("producto-nombre").textContent = producto.nombre;
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

    mostrarCombinaciones();
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
    spec[1].split(/\s+y\s+(?=\d)|\s+-\s+(?=\d|Puff)/).forEach(function (texto) {
        const item = document.createElement("li");
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
        listaMedidas.append(item);
    });
    contenedor.hidden = false;
}

// "Combina con": los productos que se llevan bien con este. Cada producto trae una lista
// (campo `combina` en productos.js) y además aparecen los que lo nombran a él en su lista.
function mostrarCombinaciones() {
    function listaDe(p) {
        return [].concat(p.combina || []);
    }
    const ids = listaDe(producto);
    productos.forEach(function (p) {
        if (listaDe(p).indexOf(producto.id) !== -1 && ids.indexOf(p.id) === -1) ids.push(p.id);
    });
    const otros = ids
        .map(function (id) {
            return productos.find(function (p) {
                return p.id === id;
            });
        })
        .filter(function (p) {
            return p && !p.oculto;
        });
    if (otros.length === 0) return;
    const lista = document.getElementById("producto-combina-lista");
    otros.forEach(function (otro) {
        const item = document.createElement("li");
        const enlace = document.createElement("a");
        const foto = document.createElement("img");
        const nombre = document.createElement("span");
        enlace.href = "ficha-producto.html?id=" + otro.id;
        foto.src = "img/productos/" + otro.id + ".jpg";
        foto.alt = "";
        nombre.textContent = otro.nombre;
        enlace.append(foto, nombre);
        item.append(enlace);
        lista.append(item);
    });
    document.getElementById("producto-combina").hidden = false;
}
