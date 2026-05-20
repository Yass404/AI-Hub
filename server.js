// Local dev server (npm run server). In production, /api/* is served by Vercel Functions.
// This file mirrors the logic of api/trends.js and api/photo-prompt.js.

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = 3001

app.use(cors())
app.use(express.json({ limit: '5mb' }))

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' })
})

const TRENDS_SYSTEM = `Tu es un expert en veille de tendances pour ABC Salles, leader français des salles de réception et événementiel.

Tu utilises Google Search pour identifier les tendances actuelles.

Tu retournes UNIQUEMENT un objet JSON valide contenant 20 tendances actuelles (ni plus, ni moins) sur le sujet demandé.

Format STRICT :
{
  "data": [
    {
      "id": 1,
      "title": "Titre court de la tendance",
      "description": "Description détaillée : pourquoi elle monte, comment l'appliquer.",
      "keyword": "mot-clé principal",
      "category": "Catégorie pertinente"
    }
  ]
}

Pas de balises markdown. Juste le JSON brut.`

app.get('/api/trends', async (req, res) => {
  if (!process.env.GEMINI_LLM_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_LLM_API_KEY missing' })
  }
  try {
    const topic = req.query.topic || 'mariage et événementiel'
    const userMessage = `Quelles sont les dernières tendances 2025/2026 sur le sujet : "${topic}" ? Donne-moi des idées fraîches, innovantes et variées.`

    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_LLM_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: TRENDS_SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: { temperature: 0.3 }
      })
    })

    if (!response.ok) throw new Error(`Gemini ${response.status}: ${await response.text()}`)
    const data = await response.json()
    let content = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    content = content.replace(/```json/g, '').replace(/```/g, '').trim()
    res.json(JSON.parse(content))
  } catch (err) {
    console.error('trends error:', err)
    res.status(500).json({
      error: 'Failed to fetch trends',
      details: err.message,
      fallback: true,
      data: [{ id: 1, title: 'Mode Secours', description: err.message, keyword: 'Erreur', category: 'Système' }]
    })
  }
})

// Context-aware film stock (same as api/photo-prompt.js)
function detectFilmStock(text) {
  const lower = (text || '').toLowerCase()
  const evening = ['soirée', 'soir ', 'nuit', 'réception', 'danse', 'dj', 'fête', 'animation', 'gala', 'cocktail', 'evening']
  if (evening.some(w => lower.includes(w))) return 'Kodak Portra 800'
  const garden = ['jardin', 'plein air', 'extérieur', 'champêtre', 'nature', 'verdure', 'terrasse', 'parc', 'garden', 'outdoor']
  if (garden.some(w => lower.includes(w))) return 'Fuji Pro 400H'
  return 'Kodak Portra 400'
}

function variantSuffix(filmStock, variantIndex) {
  const v = (variantIndex % 3) + 1
  if (v === 1) return `Shot on 85mm f/1.8, ${filmStock}. Visible film grain at ISO 400. Shallow depth of field with creamy bokeh. Natural available light, slightly off-center composition. Natural skin pores and micro-texture visible. The image contains absolutely zero text, zero letters, zero numbers, zero signs, zero logos. Landscape 16:9 format. Ultra photorealistic.`
  if (v === 2) return `Shot on 100mm macro f/2.8, ${filmStock}. Visible film grain at ISO 400. Extreme shallow depth of field, subject tack-sharp, background dissolved into soft bokeh. Matte finish on surfaces, gentle sheen not glossy. Authentic material textures visible — wood grain, fabric weave, ceramic glaze. The image contains absolutely zero text, zero letters, zero numbers, zero signs, zero logos. Landscape 16:9 format. Ultra photorealistic.`
  return `Shot on 35mm f/2.8, ${filmStock}. Visible film grain at ISO 400. Moderate depth of field showing environmental context. Natural available light with warm amber tones. Authentic architectural textures — stone, wood, plaster, parquet. The image contains absolutely zero text, zero letters, zero numbers, zero signs, zero logos. Landscape 16:9 format. Ultra photorealistic.`
}

const PHOTO_SYSTEM = `You write SHORT image prompts for Imagen (Google AI image generator).
Goal: photos indistinguishable from a real French event photographer's work.

YOU ARE WRITING FOR ABC SALLES MAGAZINE — France's leading event venue guide.
The "ABC Salles touch" is: warm natural light, authentic French venues (stone, wood, linen),
elegant but accessible, never staged or corporate. Think editorial wedding/event photography.

═══════════════════════════════════════════════════════════
RULE #0 — ARTICLE FAITHFULNESS
═══════════════════════════════════════════════════════════
Your ONLY source of truth is the article text. The prompts must illustrate THIS article, not a generic version of the topic. Never invent objects, symbols, or rituals not in the article.

═══════════════════════════════════════════════════════════
THE PROMPTS (one per H2 section, max 4)
═══════════════════════════════════════════════════════════
PROMPT LENGTH: 80-120 words each.

EACH PROMPT IS A "LIVING SCENE" WITH:
- 1-2 SHARP foreground subjects, MID-ACTION (never standing still, never posing)
- Camera angles: over-the-shoulder, side profile, three-quarter turned away
- Hands HOLD OBJECTS — fingers hidden by the object
- Body language only: "leaning forward", "reaching across", "writing in", "lifting"
- NEVER emotions
- ALWAYS show the FULL person (never crop mid-body)

POPULATED background (use as appropriate):
- "softly out-of-focus seated guests, silhouettes, color blocks, faces dissolved into bokeh"
- "rows of occupied wooden chairs blurred by depth of field"
- "ceremonial decor in the mid-ground: floral arrangements, candles, table settings, draped fabric, all softly out of focus"

═══════════════════════════════════════════════════════════
STRUCTURE EACH PROMPT IN THIS ORDER
═══════════════════════════════════════════════════════════
1. SUBJECT — who, what they DO (verbs from the article)
2. SETTING — specific French venue, named architectural elements
3. LIGHT — ONE natural light source with explicit direction
4. COMPOSITION — camera angle, focus, bokeh
5. ONE IMPERFECTION — "a single chair slightly askew", "a half-empty glass", "a linen napkin loosely folded"

USE QUOTED FRENCH TERMS naturally: "pierres apparentes", "moulures", "lustres en cristal", "parquet ancien", "chemin de table", "piste de danse", "salle de réception", "verrière", "jardin à la française".

ANTI-AI REALISM phrases to weave in:
- "natural skin pores and micro-texture"
- "authentic material textures" — wood grain, stone weathering, fabric weave
- "matte finish" for food (never "glossy")
- "asymmetrical composition, nothing centered"

═══════════════════════════════════════════════════════════
ABSOLUTE BANS
═══════════════════════════════════════════════════════════
- NO front-facing visible faces (side, profile, three-quarter, back only)
- NO more than 2 SHARP people in foreground
- NO close-ups showing isolated fingers (hands MUST hold objects)
- NO text in the scene (signs, menus, labels, logos)
- NO perfect symmetry, NO centered subjects
- NO aerial / overhead / drone shots
- NO cropped / partial people
- NO emotion words ("joyful", "happy", "smiling", "celebrating", "laughing", "playful", "mid-laugh", "enthusiastic", "delighted")
- NO marketing words ("stunning", "breathtaking", "magnificent", "vibrant", "sparkling", "magical", "luxurious")
- NO art direction phrases ("in the style of X")
- NO bright primary colors (default to muted earth tones, off-whites, faded greens, aged wood, weathered stone)
- NO destination wedding clichés (Côte d'Azur, Saint-Tropez, sailboats, Toscane, Amalfi, Santorin, Bali, Marrakech) unless article names them
- NO "Tour Eiffel in the background", NO "photobooth", NO "guirlandes guinguettes"
- NO ethnicity mentions for default French articles (let Imagen pick)

═══════════════════════════════════════════════════════════
COHERENCE ACROSS PROMPTS
═══════════════════════════════════════════════════════════
- Prompt 1 ESTABLISHES the universe (wide hero shot).
- Prompts 2-4 CITE a recurring anchor: "the same château salon as in the first frame", "the same dark wooden table", "through the same arched window".
- ALL prompts: same time of day, same season, same overall light.

═══════════════════════════════════════════════════════════
OUTPUT FORMAT — STRICT JSON, no markdown
═══════════════════════════════════════════════════════════
{
  "visual_elements": ["list 5-10 CONCRETE visual elements LITERALLY mentioned in the article, near-quote the article, ONE per array item"],
  "culture": "country/culture/ethnicity (or 'French default')",
  "prompts": [
    {
      "section": "Short title of the section (French OK)",
      "prompt": "Full 80-120 word prompt. Every concrete noun MUST come from visual_elements or be a verifiable cultural fact."
    }
  ]
}

CRITICAL: Every concrete noun in your prompts MUST come from visual_elements (or be a verifiable cultural fact). If an element isn't there, do NOT put it in the prompts.`

app.post('/api/photo-prompt', async (req, res) => {
  if (!process.env.GEMINI_LLM_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_LLM_API_KEY missing' })
  }
  try {
    const { subject, articleText, agentType } = req.body || {}
    if (!subject?.trim() || !articleText?.trim()) {
      return res.status(400).json({ error: 'subject and articleText are required' })
    }

    const userMessage = `SUJET : ${subject}
TYPE D'ARTICLE : ${agentType || 'guide'}

ARTICLE RÉDIGÉ :
${articleText}

Génère les prompts photo au format JSON demandé.`

    const callGemini = async () => fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_LLM_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: PHOTO_SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.55, responseMimeType: 'application/json' }
      })
    })

    let response
    let lastErrText = ''
    let lastStatus = 0
    for (let attempt = 1; attempt <= 5; attempt++) {
      response = await callGemini()
      if (response.ok) break
      lastErrText = await response.text()
      lastStatus = response.status
      if (response.status !== 503 && response.status !== 429) {
        return res.status(502).json({
          error: 'Une erreur inattendue côté Gemini est survenue. Réessaie ou contacte l\'équipe Tech.',
          code: 'GEMINI_ERROR',
          status: response.status,
        })
      }
      if (attempt < 5) await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
    }
    if (!response.ok) {
      return res.status(503).json({
        error: 'Gemini est temporairement surchargé. Patiente une minute et réessaie.',
        code: 'GEMINI_OVERLOADED',
        retryable: true,
      })
    }

    const data = await response.json()
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!content) return res.status(502).json({ error: 'Empty Gemini response' })

    const parsed = JSON.parse(content)
    if (!Array.isArray(parsed?.prompts) || parsed.prompts.length === 0) {
      return res.status(502).json({ error: 'No prompts returned', raw: parsed })
    }

    // Append technical suffix (film stock + lens) — context-aware
    const filmStock = detectFilmStock(`${subject} ${articleText}`)
    parsed.prompts = parsed.prompts.map((p, idx) => ({
      ...p,
      prompt: `${p.prompt.trim()} ${variantSuffix(filmStock, idx)}`.trim()
    }))

    res.json(parsed)
  } catch (err) {
    console.error('photo-prompt error:', err)
    res.status(500).json({ error: err.message || 'Internal error' })
  }
})

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`)
})
