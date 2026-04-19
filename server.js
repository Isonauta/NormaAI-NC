const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── /api/analizar ──────────────────────────────────────────────
app.post('/api/analizar', async (req, res) => {
  const { systemPrompt, userMsg, history = [] } = req.body;

  if (!systemPrompt || !userMsg) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  const messages = [
    ...history
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-4),
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
        system: systemPrompt,
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

// ── /api/guardar-nc (Supabase) ─────────────────────────────────
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
        body: JSON.stringify({
          codigo, clausula, descripcion, responsable,
          prioridad, estado, fecha_deteccion
        })
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

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// ── Fallback SPA ───────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`NormaAI NC · puerto ${PORT}`));
