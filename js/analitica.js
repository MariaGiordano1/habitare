// Medición: Google Analytics 4 y Pixel de Meta.
// Completar los dos IDs (vacío = no se carga nada). Ver LEEME-SEO.md.
const ID_GA4 = ""; // ej. "G-XXXXXXXXXX"
const ID_PIXEL_META = "1616271093372593"; // es público: se ve en cualquier sitio con píxel

(function () {
    // ---- Datos del anuncio (atribución) ----
    // Si la persona llega desde un anuncio (con utm_*, ad_id, fbclid... en la dirección),
    // se guardan 30 días en el navegador. Así no se pierden aunque recorra el catálogo
    // antes de ir a contacto. Si vuelve desde otro anuncio, se pisan: cuenta el último.
    const CLAVE = "habitare_attribution";
    const DIAS = 30;
    const PARAMETROS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
        "ad_id", "adset_id", "campaign_id", "fbclid"];

    function leerCookie(nombre) {
        const m = document.cookie.match(new RegExp("(?:^|; )" + nombre + "=([^;]*)"));
        return m ? decodeURIComponent(m[1]) : "";
    }

    try {
        const url = new URLSearchParams(window.location.search);
        const trae = PARAMETROS.some(function (p) { return url.get(p); });
        if (trae) {
            const datos = { fecha: Date.now(), landing_url: window.location.href };
            PARAMETROS.forEach(function (p) { datos[p] = (url.get(p) || "").slice(0, 300); });
            localStorage.setItem(CLAVE, JSON.stringify(datos));
        }
        // Cookie _fbc (la que Meta usa para saber de qué clic vino). El píxel suele crearla solo;
        // esto asegura que exista. Formato: fb.1.<milisegundos>.<fbclid>
        const fbclid = url.get("fbclid");
        if (fbclid && !leerCookie("_fbc")) {
            document.cookie = "_fbc=fb.1." + Date.now() + "." + fbclid +
                "; max-age=" + 90 * 24 * 60 * 60 + "; path=/; SameSite=Lax";
        }
    } catch (e) {}

    // Devuelve los datos del anuncio guardados (o {} si no hay o vencieron).
    window.habitareAtribucion = function () {
        try {
            const datos = JSON.parse(localStorage.getItem(CLAVE) || "{}");
            if (!datos.fecha || Date.now() - datos.fecha > DIAS * 24 * 60 * 60 * 1000) {
                localStorage.removeItem(CLAVE);
                return {};
            }
            return datos;
        } catch (e) {
            return {};
        }
    };
    window.habitareCookie = leerCookie;

    // Referencia corta para WhatsApp: [ref: últimos 6 dígitos del ad_id]
    window.habitareRef = function () {
        const adId = window.habitareAtribucion().ad_id;
        return adId ? "[ref: " + String(adId).slice(-6) + "]" : "";
    };

    // ---- Google Analytics 4 ----
    if (ID_GA4) {
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + ID_GA4;
        document.head.append(script);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        gtag("js", new Date());
        gtag("config", ID_GA4);
    }

    // ---- Pixel de Meta (código estándar) ----
    if (ID_PIXEL_META) {
        !(function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = true;
            n.version = "2.0";
            n.queue = [];
            t = b.createElement(e);
            t.async = true;
            t.src = v;
            s = b.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
        fbq("init", ID_PIXEL_META);
        fbq("track", "PageView");
    }

    // ---- Eventos ----
    function evento(nombreGa, nombrePixel, datos) {
        if (window.gtag) gtag("event", nombreGa, datos || {});
        if (window.fbq) fbq("track", nombrePixel, datos || {});
    }

    // La conversión "Lead" ya NO se mide al abrir la página de gracias: la dispara
    // js/contacto.js solo cuando /api/lead confirma que el lead llegó (con el mismo
    // event_id que manda el servidor, para que Meta lo cuente una sola vez).

    // Catálogo: ViewContent con la categoría (?categoria=mesas), y otra vez al cambiar de filtro.
    if (/\/catalogo(\.html)?$/.test(window.location.pathname)) {
        const categoria = new URLSearchParams(window.location.search).get("categoria") || "todos";
        evento("view_item_list", "ViewContent", { content_category: categoria });
        document.addEventListener("click", function (e) {
            const boton = e.target.closest("[data-categoria]");
            if (boton && boton.tagName === "BUTTON") {
                evento("view_item_list", "ViewContent", { content_category: boton.dataset.categoria });
            }
        });
    }

    // Clic en WhatsApp (botón flotante y enlaces): evento Contact y, si la persona vino
    // de un anuncio, se suma la referencia al final del mensaje.
    document.addEventListener("click", function (e) {
        const enlace = e.target.closest("a[href*='wa.me']");
        if (enlace) {
            const ref = window.habitareRef();
            if (ref) {
                try {
                    const destino = new URL(enlace.href);
                    const texto = destino.searchParams.get("text") || "";
                    if (texto.indexOf("[ref:") === -1) {
                        destino.searchParams.set("text", (texto ? texto + " " : "") + ref);
                        enlace.href = destino.toString();
                    }
                } catch (err) {}
            }
            evento("click_whatsapp", "Contact", { link_url: enlace.href });
        }
        const mail = e.target.closest("a[href^='mailto:']");
        if (mail) evento("click_mail", "Contact", { link_url: mail.href });
    });
})();
