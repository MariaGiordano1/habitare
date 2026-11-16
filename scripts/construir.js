// Genera las páginas por producto (productos/<id>.html), sitemap.xml y llms.txt.
// Uso: node scripts/construir.js     (desde la carpeta del sitio)
// Las páginas salen de scripts/plantilla-ficha.html + js/productos.js. No se editan a mano.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.resolve(__dirname, "..");
const SITIO = "https://habitaremuebles.com";
const MAIL = "habitare@habitaremuebles.com";
const WHATSAPP = "5491131698686";
const WHATSAPP_VISIBLE = "+54 9 11 3169-8686";

const productos = vm.runInNewContext(
    fs.readFileSync(path.join(RAIZ, "js/productos.js"), "utf8") + "\n;productos;"
);
const plantilla = fs.readFileSync(path.join(RAIZ, "scripts/plantilla-ficha.html"), "utf8");

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const existe = (nombre) => fs.existsSync(path.join(RAIZ, "img/productos", nombre + ".jpg"));
const idsDe = (lista) => [].concat(lista || []).map((e) => e.split("|")[0]);

function fotosDe(p) {
    let nombres = [];
    if (p.colores && p.colores.length) {
        p.colores.forEach((c) => {
            if (c.fotos) nombres = nombres.concat(c.fotos);
            else if (c.archivo) nombres = nombres.concat(["", "-2", "-3", "-4"].map((s) => c.archivo + s));
        });
    } else if (p.fotos) nombres = p.fotos;
    else nombres = ["", "-2", "-3", "-4"].map((s) => p.id + s);
    return nombres.filter(existe);
}

function recortar(texto, max) {
    if (texto.length <= max) return texto;
    const corte = texto.slice(0, max - 1);
    return corte.slice(0, corte.lastIndexOf(" ")).replace(/[,.;:]$/, "") + "…";
}

const visibles = productos.filter((p) => !p.oculto);
const porId = Object.fromEntries(productos.map((p) => [p.id, p]));

// Qué productos combinan con cada uno (lista propia + inversa)
function combinaCon(p) {
    const todos = (q) => idsDe(q.combina).concat((q.colores || []).flatMap((c) => idsDe(c.combina)));
    const lista = idsDe(p.combina);
    visibles.forEach((q) => {
        if (todos(q).indexOf(p.id) !== -1 && lista.indexOf(q.id) === -1) lista.push(q.id);
    });
    return lista.map((id) => porId[id]).filter((q) => q && !q.oculto);
}

function nombreCompleto(p) {
    return p.nombreCompleto || p.nombre;
}

fs.mkdirSync(path.join(RAIZ, "productos"), { recursive: true });
fs.readdirSync(path.join(RAIZ, "productos")).forEach((f) => f.endsWith(".html") && fs.unlinkSync(path.join(RAIZ, "productos", f)));

visibles.forEach((p) => {
    const url = SITIO + "/productos/" + p.id;
    const nombre = nombreCompleto(p);
    const fotos = fotosDe(p);
    const imagen = SITIO + "/img/productos/" + (fotos[0] || "") + ".jpg";
    const medidas = (p.specs.find((s) => s[0].indexOf("Medidas") === 0) || [])[1];
    const colores = (p.colores || []).map((c) => c.nombre);

    let desc = nombre + ". " + p.descripcion;
    if (medidas) desc += " Medidas: " + medidas + ".";
    const descCorta = recortar(desc.replace(/\s+/g, " "), 158);

    const jsonld = [
        {
            "@context": "https://schema.org",
            "@type": "Product",
            name: nombre,
            description: p.descripcion + (colores.length ? " Disponible en: " + colores.join(", ") + "." : ""),
            image: fotos.slice(0, 4).map((f) => SITIO + "/img/productos/" + f + ".jpg"),
            category: p.etiqueta,
            sku: p.id,
            url: url,
            brand: { "@type": "Brand", name: "Habitare" },
            additionalProperty: p.specs.map((s) => ({ "@type": "PropertyValue", name: s[0], value: s[1] }))
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: SITIO + "/" },
                { "@type": "ListItem", position: 2, name: "Catálogo", item: SITIO + "/catalogo" },
                { "@type": "ListItem", position: 3, name: p.etiqueta, item: SITIO + "/catalogo?categoria=" + p.categoria },
                { "@type": "ListItem", position: 4, name: nombre, item: url }
            ]
        }
    ];

    const cabeza = [
        "<title>" + esc(nombre) + " | Habitare</title>",
        '<meta name="description" content="' + esc(descCorta) + '">',
        '<link rel="canonical" href="' + url + '">',
        '<meta property="og:type" content="product">',
        '<meta property="og:site_name" content="Habitare">',
        '<meta property="og:locale" content="es_AR">',
        '<meta property="og:title" content="' + esc(nombre) + ' | Habitare">',
        '<meta property="og:description" content="' + esc(descCorta) + '">',
        '<meta property="og:url" content="' + url + '">',
        '<meta property="og:image" content="' + imagen + '">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<script type="application/ld+json">' + JSON.stringify(jsonld) + "</script>"
    ].join("\n    ");

    const specsHtml = p.specs
        .map((s) => '<li><span class="spec-titulo">' + esc(s[0]) + '</span><span class="spec-valor">' + esc(s[1]) + "</span></li>")
        .concat('<li><span class="spec-titulo">Disponibilidad</span><span class="spec-valor spec-stock">Stock inmediato</span></li>')
        .join("\n                    ");
    const combinaHtml = combinaCon(p)
        .map((q) => '<li><a href="productos/' + q.id + '.html">' + esc(nombreCompleto(q)) + "</a></li>")
        .join("");
    const h1 = esc(p.nombre) + (p.subtitulo ? " <small>" + esc(p.subtitulo) + "</small>" : "");

    const cambios = [
        ['<html lang="es">', '<html lang="es" data-producto="' + p.id + '">'],
        ['<meta charset="UTF-8">', '<meta charset="UTF-8">\n    <base href="../">'],
        ["<title>Producto - Habitare</title>", cabeza],
        ['<p class="categoria" id="producto-categoria"></p>', '<p class="categoria" id="producto-categoria">' + esc(p.etiqueta) + "</p>"],
        ['<h1 id="producto-nombre"></h1>', '<h1 id="producto-nombre">' + h1 + "</h1>"],
        ['<p class="descripcion" id="producto-descripcion"></p>', '<p class="descripcion" id="producto-descripcion">' + esc(p.descripcion) + "</p>"],
        ['<ul class="specs" id="producto-specs"></ul>', '<ul class="specs" id="producto-specs">\n                    ' + specsHtml + "\n                </ul>"],
        ['<ul id="producto-combina-lista"></ul>', '<ul id="producto-combina-lista">' + combinaHtml + "</ul>"],
        ['src="" alt="" draggable="false"', 'src="img/productos/' + (fotos[0] || "") + '.jpg" alt="' + esc(p.nombre) + '" draggable="false"'],
        ['href="#producto-combina"', 'href="productos/' + p.id + '.html#producto-combina"']
    ];
    let html = plantilla;
    cambios.forEach(([desde, hasta]) => {
        if (html.indexOf(desde) === -1) throw new Error("No se encontró en la plantilla: " + desde);
        html = html.replace(desde, () => hasta);
    });
    fs.writeFileSync(path.join(RAIZ, "productos", p.id + ".html"), html);
});

// ---- sitemap.xml ----
const hoy = new Date().toISOString().slice(0, 10);
const paginas = ["", "catalogo", "tendencias", "contacto"].map((r) => SITIO + (r ? "/" + r : "/"));
const urls = paginas.concat(visibles.map((p) => SITIO + "/productos/" + p.id));
fs.writeFileSync(
    path.join(RAIZ, "sitemap.xml"),
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls.map((u) => "  <url><loc>" + u + "</loc><lastmod>" + hoy + "</lastmod></url>").join("\n") +
        "\n</urlset>\n"
);

// ---- llms.txt (resumen para asistentes de IA) ----
const porCategoria = {};
visibles.forEach((p) => (porCategoria[p.etiqueta] = (porCategoria[p.etiqueta] || []).concat(p)));
let llms = "# Habitare\n\n";
llms += "> Habitare es el distribuidor exclusivo en Argentina de J.Marcon. Vende muebles de diseño (mesas, sillas, banquetas, poltronas y complementos) bajo modalidad mayorista, para mueblerías y estudios de interiorismo. Los productos están en stock inmediato y se consulta sin precios publicados.\n\n";
llms += "## Contacto\n\n";
llms += "- Mail: " + MAIL + "\n- WhatsApp: " + WHATSAPP_VISIBLE + " (https://wa.me/" + WHATSAPP + ")\n- Formulario: " + SITIO + "/contacto\n- Sitio: " + SITIO + "/\n\n";
llms += "## Páginas principales\n\n";
llms += "- [Catálogo](" + SITIO + "/catalogo): todos los productos por categoría\n";
llms += "- [Tendencias](" + SITIO + "/tendencias): productos disponibles a pedido\n";
llms += "- [Contacto](" + SITIO + "/contacto): solicitud de catálogo para mueblerías e interioristas\n\n";
Object.keys(porCategoria).forEach((cat) => {
    llms += "## " + cat + "\n\n";
    porCategoria[cat].forEach((p) => {
        llms += "- [" + nombreCompleto(p) + "](" + SITIO + "/productos/" + p.id + "): " + p.descripcion + "\n";
    });
    llms += "\n";
});
fs.writeFileSync(path.join(RAIZ, "llms.txt"), llms);

console.log("Listo:", visibles.length, "páginas de producto, sitemap.xml y llms.txt");
