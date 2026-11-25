// Función de Vercel: recibe la consulta del formulario de contacto y
// 1) la manda al webhook de GoHighLevel (con los datos del anuncio) y
// 2) avisa a Meta por la API de conversiones (evento Lead, mismo event_id que el píxel).
// Variables de entorno (en Vercel, nunca en el código):
//   GHL_WEBHOOK_URL, META_PIXEL_ID, META_CAPI_TOKEN, META_TEST_EVENT_CODE (solo mientras se prueba)

const { armarUserData, enviarEventoMeta, ipDe, leerCuerpo } = require("./_lib/meta");

const MAX = 1000;
const limpiar = (v) => (typeof v === "string" ? v.trim().slice(0, MAX) : "");

// Dominios desde los que se aceptan envíos (CORS)
const PERMITIDOS = [
    "https://habitaremuebles.com",
    "https://www.habitaremuebles.com",
    "https://habitare-flax.vercel.app",
];
const origenPermitido = (o) =>
    PERMITIDOS.includes(o) || /^https:\/\/habitare-[a-z0-9-]+-comunidadmango1\.vercel\.app$/.test(o);

// Límite básico: hasta 5 envíos por IP cada 10 minutos (por instancia de la función).
const VENTANA_MS = 10 * 60 * 1000;
const LIMITE = 5;
const envios = new Map();
function superaLimite(ip) {
    const ahora = Date.now();
    const lista = (envios.get(ip) || []).filter((t) => ahora - t < VENTANA_MS);
    lista.push(ahora);
    envios.set(ip, lista);
    if (envios.size > 5000) envios.clear();
    return lista.length > LIMITE;
}

module.exports = async function handler(req, res) {
    const origen = req.headers.origin || "";
    if (origenPermitido(origen)) {
        res.setHeader("Access-Control-Allow-Origin", origen);
        res.setHeader("Vary", "Origin");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
    if (req.method === "OPTIONS") return res.status(origenPermitido(origen) ? 204 : 403).end();
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ ok: false });
    }
    if (!origenPermitido(origen)) return res.status(403).json({ ok: false });

    const ip = ipDe(req);
    if (superaLimite(ip)) return res.status(429).json({ ok: false });

    const url = process.env.GHL_WEBHOOK_URL;
    if (!url) {
        console.error("Falta GHL_WEBHOOK_URL");
        return res.status(500).json({ ok: false });
    }

    const b = leerCuerpo(req);

    // Trampa para bots: si el campo oculto "No completar" viene con texto,
    // se responde OK (para que el bot no se dé cuenta) pero no se manda nada.
    if (limpiar(b.website)) return res.status(200).json({ ok: true });

    const nombre = limpiar(b.nombre);
    const telefono = limpiar(b.telefono);
    const negocio = limpiar(b.negocio);
    const digitos = telefono.replace(/\D/g, "").length;
    if (!nombre || !negocio || digitos < 8 || digitos > 15) return res.status(400).json({ ok: false });

    const eventId = limpiar(b.event_id).slice(0, 100) || require("crypto").randomUUID();
    const paginaUrl = limpiar(b.page_url) || limpiar(b.pagina);
    const utmSource = limpiar(b.utm_source);
    const [firstName, ...resto] = nombre.split(/\s+/);

    const payload = {
        firstName,
        lastName: resto.join(" "),
        name: nombre,
        phone: telefono,
        city: limpiar(b.ciudad),
        companyName: limpiar(b.nombreNegocio),
        tipo_negocio: negocio,
        rubro: limpiar(b.rubro),
        producto_interes: limpiar(b.mensaje),
        producto_ficha: limpiar(b.producto),
        tamano_mesa: limpiar(b.tamano),
        acepta_llamada: b.llamada ? "Sí" : "No",
        // Datos del anuncio
        utm_source: utmSource,
        utm_medium: limpiar(b.utm_medium),
        utm_campaign: limpiar(b.utm_campaign),
        utm_content: limpiar(b.utm_content),
        utm_term: limpiar(b.utm_term),
        ad_id: limpiar(b.ad_id),
        adset_id: limpiar(b.adset_id),
        campaign_id: limpiar(b.campaign_id),
        fbclid: limpiar(b.fbclid),
        landing_url: limpiar(b.landing_url),
        page_url: paginaUrl,
        pagina: paginaUrl,
        event_id: eventId,
        fuente: utmSource.toLowerCase() === "meta" ? "Meta Ads – Sitio" : "Sitio – Orgánico",
        source: "Sitio web Habitare - Solicitud de catálogo",
    };

    // 1) GoHighLevel: si falla, se avisa al navegador (el lead es lo más importante)
    try {
        const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(8000),
        });
        if (!r.ok) {
            console.error("GHL respondió", r.status);
            return res.status(502).json({ ok: false });
        }
    } catch (e) {
        console.error("Error llamando a GHL", e && e.message);
        return res.status(502).json({ ok: false });
    }

    // 2) Meta (API de conversiones): si falla, se registra pero se responde OK igual
    await enviarEventoMeta({
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: paginaUrl || "https://habitaremuebles.com/contacto",
        user_data: armarUserData({
            telefono,
            nombre,
            ciudad: b.ciudad,
            externalId: eventId,
            ip,
            userAgent: req.headers["user-agent"] || "",
            fbp: limpiar(b.fbp),
            fbc: limpiar(b.fbc),
        }),
        custom_data: {
            content_category: negocio,
            content_name: limpiar(b.mensaje).slice(0, 200),
        },
    });

    return res.status(200).json({ ok: true });
};
