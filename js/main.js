// Filtro del catálogo.
// 1) Busco los botones y las tarjetas.
// 2) Al hacer clic en un botón, leo su categoría (data-categoria).
// 3) Muestro las tarjetas de esa categoría y oculto las demás.
// 4) Al cambiar de filtro, la grilla se desvanece y las tarjetas entran de a una.
const botones = document.querySelectorAll(".filtro-boton");
const tarjetas = document.querySelectorAll(".tarjeta");
const grilla = document.querySelector(".productos");
const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let categoriaActual = "todos";

function aplicarFiltro(categoria) {
    let posicion = 0;
    tarjetas.forEach(function (tarjeta) {
        const coincide = categoria === "todos" || tarjeta.dataset.categoria === categoria;
        tarjeta.classList.toggle("oculta", !coincide);
        if (coincide) {
            // las tarjetas entran una atrás de otra, empezando de nuevo en cada filtro
            tarjeta.classList.remove("visible");
            tarjeta.style.transitionDelay = (posicion % 3) * 90 + "ms";
            posicion++;
        }
    });
    // un instante después se muestran, así se nota la entrada
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            tarjetas.forEach(function (tarjeta) {
                if (!tarjeta.classList.contains("oculta")) tarjeta.classList.add("visible");
            });
        });
    });
}

// Panel del filtro en el celular (en pantallas grandes no se usa)
const panel = document.getElementById("filtros");
const fondo = document.getElementById("filtros-fondo");
const botonAbrir = document.getElementById("filtro-abrir");
const textoActual = document.getElementById("filtro-actual");
const botonQuitar = document.getElementById("filtro-quitar");

// la cruz saca el filtro directamente
botonQuitar.addEventListener("click", function () {
    filtrar("todos", true);
});

function panelAbierto(abrir) {
    panel.classList.toggle("abierto", abrir);
    fondo.classList.toggle("abierto", abrir);
    botonAbrir.setAttribute("aria-expanded", abrir ? "true" : "false");
}

botonAbrir.addEventListener("click", function () {
    panelAbierto(true);
});
document.getElementById("filtros-cerrar").addEventListener("click", function () {
    panelAbierto(false);
});
fondo.addEventListener("click", function () {
    panelAbierto(false);
});
document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") panelAbierto(false);
});

function filtrar(categoria, conAnimacion) {
    botones.forEach(function (boton) {
        const activo = boton.dataset.categoria === categoria;
        boton.classList.toggle("activo", activo);
        // el botón "Filtro" muestra cuál está elegido
        if (activo) {
            textoActual.textContent = categoria === "todos" ? "" : "· " + boton.textContent;
        }
    });
    panelAbierto(false);
    botonQuitar.hidden = categoria === "todos";
    // el filtro queda anotado en la dirección (catalogo.html?categoria=mesas):
    // así, al volver atrás desde una ficha, la página vuelve con el mismo filtro
    const direccion = categoria === "todos" ? window.location.pathname : "?categoria=" + categoria;
    history.replaceState(null, "", direccion);
    if (categoria === categoriaActual) return;
    categoriaActual = categoria;

    if (!conAnimacion || menosMovimiento || !grilla) {
        tarjetas.forEach(function (tarjeta) {
            const coincide = categoria === "todos" || tarjeta.dataset.categoria === categoria;
            tarjeta.classList.toggle("oculta", !coincide);
        });
        return;
    }

    // 1) se desvanece lo que había, 2) cambia el filtro, 3) entra lo nuevo
    grilla.classList.add("filtrando");
    setTimeout(function () {
        aplicarFiltro(categoria);
        grilla.classList.remove("filtrando");
    }, 250);
}

botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
        filtrar(boton.dataset.categoria, true);
    });
});

// Si llegás desde el inicio (catalogo.html?categoria=sillas), ya filtra solo.
const categoriaUrl = new URLSearchParams(window.location.search).get("categoria");
if (categoriaUrl) {
    filtrar(categoriaUrl, false);
}
