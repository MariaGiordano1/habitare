// Carrusel del banner inicial: cambia solo cada 6 segundos,
// y también con las flechas, los puntitos o deslizando el dedo.
const slides = document.querySelectorAll(".hero .slide");
const puntos = document.querySelectorAll(".hero .punto");
const hero = document.querySelector(".hero");
let actual = 0;
let temporizador;

function mostrar(numero) {
    // da la vuelta: después del último vuelve al primero
    actual = (numero + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
        slide.classList.toggle("activo", i === actual);
    });
    puntos.forEach(function (punto, i) {
        punto.classList.toggle("activo", i === actual);
    });
}

function arrancar() {
    // si la persona pidió menos movimiento en su compu, no cambia solo
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clearInterval(temporizador);
    temporizador = setInterval(function () {
        mostrar(actual + 1);
    }, window.matchMedia("(max-width: 809.98px)").matches ? 4500 : 6000); // un poco más ágil en celular
}

function frenar() {
    clearInterval(temporizador);
}

document.getElementById("flecha-anterior").addEventListener("click", function () {
    mostrar(actual - 1);
    arrancar();
});

document.getElementById("flecha-siguiente").addEventListener("click", function () {
    mostrar(actual + 1);
    arrancar();
});

puntos.forEach(function (punto, i) {
    punto.addEventListener("click", function () {
        mostrar(i);
        arrancar();
    });
});

// se frena mientras el mouse está encima
hero.addEventListener("mouseenter", frenar);
hero.addEventListener("mouseleave", arrancar);

// Deslizar hacia los costados: con el dedo en el celular o arrastrando con el mouse.
// Usamos "pointer events", que sirven igual para dedo, mouse y lápiz.
let inicioX = 0;
let inicioY = 0;
let arrastrando = false;
let seDeslizo = false;

hero.addEventListener("pointerdown", function (evento) {
    // si toca una flecha o un puntito, que funcionen como siempre
    if (evento.target.closest(".carrusel-controles")) return;
    arrastrando = true;
    seDeslizo = false;
    inicioX = evento.clientX;
    inicioY = evento.clientY;
});

hero.addEventListener("pointerup", function (evento) {
    if (!arrastrando) return;
    arrastrando = false;
    const difX = evento.clientX - inicioX;
    const difY = evento.clientY - inicioY;
    // solo cuenta si el movimiento fue más de costado que de arriba hacia abajo
    if (Math.abs(difX) > 40 && Math.abs(difX) > Math.abs(difY)) {
        seDeslizo = true;
        mostrar(difX < 0 ? actual + 1 : actual - 1);
        arrancar();
    }
});

hero.addEventListener("pointercancel", function () {
    arrastrando = false;
});

// si deslizó, no abrimos el enlace "Ver catálogo" por accidente
hero.addEventListener(
    "click",
    function (evento) {
        if (seDeslizo) {
            evento.preventDefault();
            evento.stopPropagation();
            seDeslizo = false;
        }
    },
    true
);

// las fotos no se arrastran como imagen suelta
hero.querySelectorAll("img").forEach(function (foto) {
    foto.draggable = false;
});

arrancar();
