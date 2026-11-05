// Animaciones sutiles al scrollear, transición entre páginas y menú del celular.
// La clase "js" avisa al CSS que el JavaScript funciona
// (así, si el JS falla, el contenido igual se ve).
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- 1. Qué elementos aparecen al scrollear ----
    const aAnimar = [
        ".distribuidor-texto",
        ".categorias li",
        ".ambiente img",
        ".cta > *",
        ".tarjeta"
    ];
    aAnimar.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (elemento, i) {
            elemento.classList.add("reveal");
            // las tarjetas de una misma fila entran una atrás de otra
            if (selector === ".tarjeta" || selector === ".categorias li") {
                elemento.style.transitionDelay = (i % 3) * 60 + "ms";
            }
        });
    });

    // ---- 2. Cada uno se muestra cuando entra en pantalla ----
    const elementos = document.querySelectorAll(".reveal");
    if (reducido || !("IntersectionObserver" in window)) {
        elementos.forEach(function (e) {
            e.classList.add("visible");
        });
    } else {
        const vigilante = new IntersectionObserver(
            function (entradas) {
                entradas.forEach(function (entrada) {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add("visible");
                        vigilante.unobserve(entrada.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
        );
        elementos.forEach(function (e) {
            vigilante.observe(e);
        });
    }

    // ---- 3. Transición entre páginas: se desvanece al salir y aparece al entrar ----
    if (!reducido) {
        document.body.classList.add("entra");

        document.addEventListener("click", function (evento) {
            const enlace = evento.target.closest("a");
            if (!enlace) return;
            // solo enlaces internos comunes (no nueva pestaña, ni #, ni teclas especiales)
            if (enlace.target === "_blank" || enlace.hasAttribute("download")) return;
            if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey || evento.button !== 0) return;
            const destino = new URL(enlace.href, window.location.href);
            if (destino.origin !== window.location.origin && destino.protocol !== "file:") return;
            if (destino.pathname === window.location.pathname && destino.search === window.location.search) return;
            if (destino.protocol !== "file:" && destino.protocol !== "http:" && destino.protocol !== "https:") return;
            evento.preventDefault();
            document.body.classList.add("saliendo");
            setTimeout(function () {
                window.location.href = destino.href;
            }, 150);
        });

        // si vuelve con el botón "atrás", la página no queda en blanco
        window.addEventListener("pageshow", function (evento) {
            if (evento.persisted) document.body.classList.remove("saliendo");
        });
    }

    // ---- 4. Menú hamburguesa (celular) ----
    const cabecera = document.querySelector("header");
    const botonMenu = document.getElementById("menu-boton");
    if (cabecera && botonMenu) {
        function cambiarMenu(abrir) {
            cabecera.classList.toggle("menu-abierto", abrir);
            botonMenu.setAttribute("aria-expanded", abrir ? "true" : "false");
            botonMenu.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
        }
        botonMenu.addEventListener("click", function () {
            cambiarMenu(!cabecera.classList.contains("menu-abierto"));
        });
        document.querySelectorAll("#menu a").forEach(function (enlace) {
            enlace.addEventListener("click", function () {
                cambiarMenu(false);
            });
        });
        // se cierra con Esc, tocando afuera o al agrandar la pantalla
        document.addEventListener("keydown", function (evento) {
            if (evento.key === "Escape") cambiarMenu(false);
        });
        document.addEventListener("click", function (evento) {
            if (!evento.target.closest("header")) cambiarMenu(false);
        });
        window.addEventListener("resize", function () {
            if (window.innerWidth > 810) cambiarMenu(false);
        });
    }
});
