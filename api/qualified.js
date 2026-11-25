// Función de Vercel para la señal de calidad (plan B del brief, punto 7.5).
// La llama un workflow de GoHighLevel (acción "Webhook") cuando un lead pasa a
// "Calificado" o "Venta", y manda ese evento a Meta por la API de conversiones.
//
// Seguridad: GHL tiene que mandar la clave en el encabezado "x-habitare-key"
// (o en la dirección como ?key=...). La clave está en la variable QUALIFIED_SECRET.
//
// Datos que tiene que mandar GHL (JSON): event_name ("LeadCalificado" o "Venta"),
// phone, name (o first_name + last_name), city, event_id (el del campo "Event ID"),
// y opcionalmente fbc / fbp si se guardaron.

const crypto = require("crypto");
const { armarUserData, enviarEventoMeta, leerCuerpo } = require("./_lib/meta");

const EVENTOS = ["LeadCalificado", "Venta"];
const texto = (v) => (typeof v === "string" ? v.trim().slice(0, 500) : "");

function claveCorrecta(recibida) {
    const secreto = process.env.QUALIFIED_SECRET || "";
    if (!secreto || !recibida) return false;
    const a = Buffer.from(String(recibida));
    const b = Buffer.from(secreto);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ ok: false });
    }
    if (!claveCorrecta(req.headers["x-habitare-key"] || (req.query && req.query.key))) {
        return res.status(401).json({ ok: false });
    }

    const b = leerCuerpo(req);
    const eventName = EVENTOS.includes(texto(b.event_name)) ? texto(b.event_name) : "LeadCalificado";
    const nombre = texto(b.name) || [texto(b.first_name), texto(b.last_name)].join(" ").trim();
    const telefono = texto(b.phone);
    if (!telefono && !nombre) return res.status(400).json({ ok: false });

    const leadEventId = texto(b.event_id);
    const ok = await enviarEventoMeta({
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        // id propio por evento, para que un reintento de GHL no cuente doble
        event_id: (leadEventId || telefono.replace(/\D/g, "")) + "-" + eventName,
        action_source: "system_generated",
        user_data: armarUserData({
            telefono,
            nombre,
            ciudad: texto(b.city),
            externalId: leadEventId, // mismo external_id que el Lead original
            fbp: texto(b.fbp),
            fbc: texto(b.fbc),
        }),
        custom_data: { content_category: texto(b.tipo_negocio) || undefined },
    });

    return res.status(ok ? 200 : 502).json({ ok });
};
