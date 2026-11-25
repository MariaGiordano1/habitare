# SEO / AEO de Habitare

## Páginas por producto
Cada producto tiene su propia página en `productos/<id>.html` (URL pública: `/productos/<id>`).
No se editan a mano: salen de `js/productos.js` + `scripts/plantilla-ficha.html`.

**Cada vez que cambies `productos.js` o la plantilla, correr (desde la carpeta del sitio):**

    node scripts/construir.js

Eso regenera las páginas de producto, `sitemap.xml` y `llms.txt`.

## Qué hay
- Cada página: título, meta descripción, canonical, Open Graph y datos estructurados (Product, BreadcrumbList).
- Inicio: Organization + WebSite (nombre, mail, WhatsApp, país).
- `robots.txt` (permite buscadores y bots de IA), `sitemap.xml`, `llms.txt`.
- `vercel.json`: URLs sin `.html` (`/catalogo`, `/productos/mesa-ornella`).
- `ficha-producto.html?id=...` (dirección vieja) redirige a la página nueva.

## Medición
`js/analitica.js`: `ID_GA4` (vacío = no carga) e `ID_PIXEL_META` (ya cargado). Ahí también se guardan los datos del anuncio (UTM, ad_id, fbclid) 30 días, se mide Contact en WhatsApp y ViewContent en el catálogo. El Lead lo dispara `js/contacto.js` cuando `/api/lead` confirma el envío. Variables en Vercel: GHL_WEBHOOK_URL, META_PIXEL_ID, META_CAPI_TOKEN, META_TEST_EVENT_CODE (borrar antes de lanzar), QUALIFIED_SECRET.
Eventos: `generate_lead`/`Lead` (página de gracias), clics en WhatsApp y mail.
