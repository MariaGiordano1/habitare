// Función de Vercel: recibe la consulta del formulario y la reenvía al webhook de GoHighLevel.
// Variable de entorno requerida en Vercel: GHL_WEBHOOK_URL (URL del trigger "Inbound Webhook").

const MAX = 1000;
const limpiar = (v) => (typeof v === "string" ? v.trim().slice(0, MAX) : "");

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ ok: false });
    }

    const url = process.env.GHL_WEBHOOK_URL;
    if (!url) {
        console.error("Falta GHL_WEBHOOK_URL");
        return res.status(500).json({ ok: false });
    }

    const b = typeof req.body === "string" ? safeParse(req.body) : req.body || {};

    // Trampa para bots: si el campo oculto viene con texto, se descarta sin avisar.
    if (limpiar(b.website)) return res.status(200).json({ ok: true });

    const nombre = limpiar(b.nombre);
    const telefono = limpiar(b.telefono);
    if (!nombre || !telefono) return res.status(400).json({ ok: false });

    const [firstName, ...resto] = nombre.split(/\s+/);

    const payload = {
        firstName,
        lastName: resto.join(" "),
        name: nombre,
        phone: telefono,
        city: limpiar(b.ciudad),
        companyName: limpiar(b.nombreNegocio),
        tipo_negocio: limpiar(b.negocio),
        rubro: limpiar(b.rubro),
        producto_interes: limpiar(b.mensaje),
        producto_ficha: limpiar(b.producto),
        tamano_mesa: limpiar(b.tamano),
        acepta_llamada: b.llamada ? "Sí" : "No",
        utm_source: limpiar(b.utm_source),
        utm_medium: limpiar(b.utm_medium),
        utm_campaign: limpiar(b.utm_campaign),
        utm_content: limpiar(b.utm_content),
        utm_term: limpiar(b.utm_term),
        pagina: limpiar(b.pagina),
        source: "Sitio web Habitare - Solicitud de catálogo",
    };

    try {
        const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!r.ok) {
            console.error("GHL respondió", r.status);
            return res.status(502).json({ ok: false });
        }
        return res.status(200).json({ ok: true });
    } catch (e) {
        console.error("Error llamando a GHL", e);
        return res.status(502).json({ ok: false });
    }
};

function safeParse(s) {
    try { return JSON.parse(s); } catch (e) { return {}; }
}
