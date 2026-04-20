const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── GESTOR DOCUMENTAL ─────────────────────────────────────────
// Documentos del SGC embebidos como contexto para la IA
// En producción esto vendría de Supabase Storage
const documentosSGC = {
  'PGI-01': {
    codigo: 'PGI-01',
    nombre: 'Revisión de Gerencia',
    version: '09',
    clausula: '9.3',
    contenido: `PROCEDIMIENTO PGI-01 - REVISIÓN DE GERENCIA (Ver. 09)

OBJETIVO: Entregar la metodología a aplicar en la revisión del Sistema de Gestión Integrado por parte del Gerente General, para asegurar la efectividad y continuidad de este.

ALCANCE: Aplicable a todos los elementos, aspectos y componentes del Sistema de Gestión Integrado de la Empresa.

RESPONSABLES:
- Gerente General
- Encargado de Calidad
- Encargado de Medioambiente, Salud y Seguridad
- Gerente de Sucursal

NORMATIVA: ISO 9001:2015, ISO 14001:2015, ISO 45001:2018

DESCRIPCIÓN DEL PROCEDIMIENTO:

Generalidades: El Encargado de Calidad programa y coordina las Revisiones Gerenciales, a realizarse por lo menos una vez al año. Se enviará un correo electrónico para citar a los asistentes involucrados por lo menos con 15 días hábiles de anticipación de manera de planificar y recopilar la información necesaria para revisión.

Elementos de entrada para la revisión:
- El estado de las acciones tomadas en revisiones gerenciales anteriores.
- Cambios en cuestiones externas e internas que afectan al SGI.
- Información sobre el desempeño y eficacia del SGI.
- Adecuación de recursos.
- Eficacia de acciones tomadas para abordar los riesgos y oportunidades detectadas.
- Oportunidades de mejora.
- Satisfacción de los clientes y retroalimentación de partes.
- Revisión del registro Objetivos e Indicadores del SGI.
- Desempeño de los procesos y conformidad de los productos y servicios.
- No conformidades y acciones correctivas.
- Resultados de seguimiento y mediciones.
- Resultados auditorias anteriores (internas y externas).
- Desempeño de proveedores externos.

Elementos de Salida de la Revisión Gerencial:
- Acciones y decisiones relacionadas con posibles cambios en el SGI.
- Necesidad de nuevos recursos.
- Acciones para la mejora de la eficiencia del SGI.
- La mejora del producto/servicio con respecto a los requisitos de los clientes.

Cierre: Una vez terminada la revisión el Encargado del SGI realiza el Acta de Revisión del SGI, el cual será incorporada en la web del SGI, informando vía correo electrónico a todos los jefes y Encargados de áreas involucrados en el sistema.

ARCHIVO: Acta de Revisión del SGI - Responsable: Encargado de Calidad - Tiempo: 1 año.`
  },
  'PGI-07': {
    codigo: 'PGI-07',
    nombre: 'Ventas',
    version: '07',
    clausula: '8.2',
    contenido: `PROCEDIMIENTO PGI-07 - VENTAS (Ver. 07)

OBJETIVO: Describir el proceso de ventas de equipos, implementos, accesorios, repuestos y reparaciones.

ALCANCE: Se aplica a todas las ventas que se generen en la casa matriz y sucursal.

RESPONSABLES:
- Gerente General
- Gerente Comercial
- Gerente Fabricación
- Asistente de Ventas
- Gerente de Sucursal
- Vendedores

NORMATIVA: ISO 9001:2015, ISO 14001:2015, PGI-34, PGI-08, PGI-21, PGI-05

TERMINOLOGÍA:
- Cotización: Documento que identifica el producto o servicio, sus especificaciones, precio, condiciones comerciales, plazo de entrega y tiempo de validez.
- Orden de Compra: Documento recibido de parte del cliente que especifica el producto asociado a la cotización y la aceptación de los términos de ésta.
- Orden de Trabajo: Documento que especifica el producto a fabricar, su información técnica, plazos de entrega.
- Cierre de negocio: Documento que especifica con mayor detalle la información entregada por cliente.
- Nota de venta: Documento comercial para ingresar el detalle de los ítems y valores de la orden de compra.

DESCRIPCIÓN DEL PROCEDIMIENTO:

7.1 Los requerimientos de clientes llegan de distintas formas: llamadas telefónicas, página web, correo electrónico, visita de vendedores a faenas, visitas de clientes a oficinas, redes sociales.

7.2 El requerimiento es atendido por el vendedor correspondiente (mercado interno, internacional o repuestos). Si no corresponde a producto de línea, se analiza factibilidad con Gerencia Comercial y Depto. de Diseño y Planos de Fabricación.

7.3 Se prepara cotización con referencia en Lista de Precios, estimación de costo de producción, costo de adquisición. Se considera información de Producción, Diseño, Abastecimientos, Gerencia de Operaciones. Las condiciones comerciales y precios deben ser aprobados por la Gerencia General.

7.4 La cotización debe contener: descripción del producto/servicio, precio unitario, condiciones de pago, cláusula de venta, plazo de entrega, tiempo de validez de oferta, condiciones de garantía.

7.5 Previo al envío, la cotización debe ser validada y autorizada por el Gerente Comercial o Gerente sucursal, con autorización previa de Gerencia General.

7.6 Si la cotización es aceptada, el cliente envía Orden de Compra. En caso de que la OC no se haya recibido y sea prioritaria la elaboración, solo el Gerente General puede autorizar (o el Gerente Comercial si no está presente).

7.7 Recibida la OC, el responsable verifica el plazo de entrega con Producción o Abastecimientos. Se emite NOTA DE VENTA relacionada con GUÍA DE DESPACHO y finalmente FACTURA.

7.8 Si vinculada a fabricación de equipo de línea: abrir Orden de Trabajo, realizar reunión de arranque y entregar ficha de cierre de negocio.

7.9 Terminado el producto, Jefe de Fábrica entrega OT al Auditor para cierre. Asistente de ventas coordina aviso al cliente para entrega.

7.10 Al momento del despacho, se emite toda la documentación legal necesaria.

7.13 Cada vez que se realice venta de equipo de línea o repuestos, se comparte encuesta sobre aspectos comerciales para medir satisfacción del cliente con vendedor y producto.

ARCHIVO: Lista de Precios (permanente), Cotizaciones (indefinido), Orden de Compra (indefinido), Orden de Trabajo (indefinido), Guía de despacho (indefinido), Facturas (indefinido).`
  }
};

// ── /api/documentos — lista los documentos disponibles ────────
app.get('/api/documentos', (_req, res) => {
  const lista = Object.values(documentosSGC).map(d => ({
    codigo: d.codigo,
    nombre: d.nombre,
    version: d.version,
    clausula: d.clausula
  }));
  res.json({ documentos: lista, total: lista.length });
});

// ── /api/documentos/:codigo — obtiene un documento específico ─
app.get('/api/documentos/:codigo', (req, res) => {
  const doc = documentosSGC[req.params.codigo.toUpperCase()];
  if (!doc) return res.status(404).json({ error: 'Documento no encontrado' });
  res.json(doc);
});

// ── /api/analizar — análisis IA con contexto documental ───────
app.post('/api/analizar', async (req, res) => {
  const { systemPrompt, userMsg, history = [], incluirDocumentos } = req.body;

  if (!systemPrompt || !userMsg) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  // Si se solicita, inyectar contexto documental al system prompt
  let systemFinal = systemPrompt;
  if (incluirDocumentos) {
    const contextoDoc = Object.values(documentosSGC)
      .map(d => `=== ${d.codigo} · ${d.nombre} (v${d.version}) ===\n${d.contenido}`)
      .join('\n\n');
    systemFinal = systemPrompt + `\n\n--- DOCUMENTOS DEL SGC DISPONIBLES ---\nTienes acceso a los siguientes procedimientos del sistema de gestión. Úsalos para contextualizar tus preguntas y sugerencias cuando sea relevante, citando el código del procedimiento (ej: "según PGI-07..."):\n\n${contextoDoc}`;
  }

  const messages = [
    ...history.filter(m => m.role === 'user' || m.role === 'assistant').slice(-4),
    { role: 'user', content: userMsg }
  ];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemFinal,
        messages
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return res.status(502).json({ error: 'Error al llamar a la IA' });
    }

    const data = await response.json();
    let text = data.content?.[0]?.text || '{}';
    text = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: 'Respuesta IA no válida', raw: text });
    }

    return res.json(parsed);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ── /api/guardar-nc ───────────────────────────────────────────
app.post('/api/guardar-nc', async (req, res) => {
  const { codigo, clausula, descripcion, responsable, prioridad, estado, fecha_deteccion } = req.body;

  if (!codigo || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/nc_registros`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ codigo, clausula, descripcion, responsable, prioridad, estado, fecha_deteccion })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Supabase error:', err);
      return res.status(502).json({ error: 'Error al guardar en Supabase' });
    }

    const data = await response.json();
    return res.json({ ok: true, data });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    ts: new Date().toISOString(),
    documentos: Object.keys(documentosSGC).length
  });
});

// ── Fallback SPA ──────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`NormaAI NC · puerto ${PORT} · ${Object.keys(documentosSGC).length} docs SGC cargados`));
