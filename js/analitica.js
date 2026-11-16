// Medición: Google Analytics 4 y Pixel de Meta.
// Completar los dos IDs (vacío = no se carga nada). Ver LEEME-SEO.md.
const ID_GA4 = ""; // ej. "G-XXXXXXXXXX"
const ID_PIXEL_META = ""; // ej. "123456789012345"

(function () {
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

    // ---- Pixel de Meta ----
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

    // Consulta enviada: la página de gracias es la conversión
    if (/\/gracias(\.html)?$/.test(window.location.pathname)) {
        evento("generate_lead", "Lead", { content_name: "Solicitud de catálogo" });
    }

    // Clic en WhatsApp (botón flotante y enlaces)
    document.addEventListener("click", function (e) {
        const enlace = e.target.closest("a[href*='wa.me']");
        if (enlace) evento("click_whatsapp", "Contact", { link_url: enlace.href });
        const mail = e.target.closest("a[href^='mailto:']");
        if (mail) evento("click_mail", "Contact", { link_url: mail.href });
    });
})();
