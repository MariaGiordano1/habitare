// Funciones compartidas por /api/lead y /api/qualified (las carpetas con "_" no son rutas en Vercel).
const crypto = require("crypto");

const VERSION_API = process.env.META_API_VERSION || "v24.0";

const sha256 = (v) => crypto.createHash("sha256").update(v).digest("hex");

// Saca tildes: "Córdoba" -> "Cordoba"
const sinTildes = (v) => v.normalize("NFD").replace(/[̀-ͯ]/g, "");

// Teléfono argentino -> 549 + área + número (sin el 0 del área ni el 15).
// Ej.: "011 15-3169-8686" -> "5491131698686"
function normalizarTelefono(texto) {
    let n = String(texto || "").replace(/\D/g, "");
    if (!n) return "";
    if (n.startsWith("00")) n = n.slice(2);
    if (n.startsWith("54")) {
        n = n.slice(2);
        if (n.startsWith("9")) n = n.slice(1);
    }
    if (n.startsWith("0")) n = n.slice(1);
    // Con el 15 queda en 12 números: se busca después de un área de 2, 3 o 4 números
    if (n.length === 12) {
        for (const largo of [2, 3, 4]) {
            if (n.substr(largo, 2) === "15") {
                n = n.slice(0, largo) + n.slice(largo + 2);
                break;
            }
        }
    }
    if (n.length === 8) n = "11" + n; // sin código de área: se asume CABA/AMBA
    if (n.length !== 10) return "";   // no se pudo armar bien: mejor no mandarlo
    return "549" + n;
}

// Nombre: minúsculas, sin signos (las tildes se mantienen). La primera palabra es fn, el resto ln.
function separarNombre(nombre) {
    const limpio = String(nombre || "").toLowerCase().replace(/[^\p{L}\s]/gu, "").trim();
    const [fn = "", ...resto] = limpio.split(/\s+/);
    return { fn, ln: resto.join(" ") };
}

// Ciudad: "Villa Urquiza" -> "villaurquiza"
const normalizarCiudad = (c) => sinTildes(String(c || "").toLowerCase()).replace(/[^a-z]/g, "");

// Arma user_data con los hashes SHA-256 (fbp, fbc, IP y user agent van sin hashear).
function armarUserData({ telefono, nombre, ciudad, externalId, ip, userAgent, fbp, fbc }) {
    const ud = { country: [sha256("ar")] };
    const ph = normalizarTelefono(telefono);
    if (ph) ud.ph = [sha256(ph)];
    const { fn, ln } = separarNombre(nombre);
    if (fn) ud.fn = [sha256(fn)];
    if (ln) ud.ln = [sha256(ln)];
    const ct = normalizarCiudad(ciudad);
    if (ct) ud.ct = [sha256(ct)];
    if (externalId) ud.external_id = [sha256(String(externalId).trim().toLowerCase())];
    if (ip) ud.client_ip_address = ip;
    if (userAgent) ud.client_user_agent = userAgent;
    if (fbp) ud.fbp = fbp;
    if (fbc) ud.fbc = fbc;
    return ud;
}

// Manda un evento a la API de conversiones. Nunca tira error: devuelve true/false.
async function enviarEventoMeta(evento) {
    const pixel = process.env.META_PIXEL_ID;
    const token = process.env.META_CAPI_TOKEN;
    if (!pixel || !token) {
        console.error("Meta CAPI: faltan META_PIXEL_ID o META_CAPI_TOKEN");
        return false;
    }
    const cuerpo = { data: [evento] };
    if (process.env.META_TEST_EVENT_CODE) cuerpo.test_event_code = process.env.META_TEST_EVENT_CODE;
    const url = `https://graph.facebook.com/${VERSION_API}/${pixel}/events?access_token=${encodeURIComponent(token)}`;
    try {
        const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cuerpo),
            signal: AbortSignal.timeout(5000),
        });
        if (!r.ok) {
            console.error("Meta CAPI respondió", r.status, (await r.text()).slice(0, 500));
            return false;
        }
        return true;
    } catch (e) {
        console.error("Error llamando a Meta CAPI", e && e.message);
        return false;
    }
}

// IP real del visitante (Vercel la pasa en x-forwarded-for)
function ipDe(req) {
    const xff = req.headers["x-forwarded-for"];
    if (xff) return String(xff).split(",")[0].trim();
    return req.headers["x-real-ip"] || "";
}

function leerCuerpo(req) {
    if (typeof req.body === "string") {
        try { return JSON.parse(req.body); } catch (e) { return {}; }
    }
    return req.body || {};
}

module.exports = { sha256, normalizarTelefono, separarNombre, normalizarCiudad, armarUserData, enviarEventoMeta, ipDe, leerCuerpo };
