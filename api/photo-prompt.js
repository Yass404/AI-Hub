// Vercel Function — generates photo prompts for Imagen (Gemini app)
// in the "ABC Salles touch" style, based on a written article.
// Fully aligned with mag-image-replacer prod (Imagen Ultra) — see prompt-generator.mjs

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

// Context-aware film stock — same logic as prod.
function detectFilmStock(text) {
  const lower = (text || '').toLowerCase()
  const evening = ['soirée', 'soir ', 'nuit', 'réception', 'danse', 'dj', 'fête', 'animation', 'gala', 'cocktail', 'evening']
  if (evening.some(w => lower.includes(w))) return 'Kodak Portra 800'
  const garden = ['jardin', 'plein air', 'extérieur', 'champêtre', 'nature', 'verdure', 'terrasse', 'parc', 'garden', 'outdoor']
  if (garden.some(w => lower.includes(w))) return 'Fuji Pro 400H'
  return 'Kodak Portra 400'
}

// Variant-specific technical suffix — same as prod.
function variantSuffix(filmStock, variantIndex) {
  const v = (variantIndex % 3) + 1
  if (v === 1) return `Shot on 85mm f/1.8, ${filmStock}. Visible film grain at ISO 400. Shallow depth of field with creamy bokeh. Natural available light, slightly off-center composition. Natural skin pores and micro-texture visible, authentic material textures. The image contains absolutely zero text, zero letters, zero numbers, zero signs, zero logos, zero writing of any kind. Landscape 16:9 format. Ultra photorealistic.`
  if (v === 2) return `Shot on 100mm macro f/2.8, ${filmStock}. Visible film grain at ISO 400. Extreme shallow depth of field, subject tack-sharp, background dissolved into soft bokeh. Matte finish on surfaces, gentle sheen not glossy. Authentic material textures visible — wood grain, fabric weave, ceramic glaze, food moisture. The image contains absolutely zero text, zero letters, zero numbers, zero signs, zero logos, zero writing of any kind. Landscape 16:9 format. Ultra photorealistic.`
  return `Shot on 35mm f/2.8, ${filmStock}. Visible film grain at ISO 400. Moderate depth of field showing environmental context. Natural available light with warm amber tones. Authentic architectural textures — stone, wood, plaster, tile. The image contains absolutely zero text, zero letters, zero numbers, zero signs, zero logos, zero writing of any kind. Landscape 16:9 format. Ultra photorealistic.`
}

const SYSTEM_PROMPT = `You write SHORT image prompts for Imagen (Google AI image generator).
Goal: photos indistinguishable from a real French event photographer's work.

YOU ARE WRITING FOR ABC SALLES MAGAZINE — France's leading event venue guide.
The "ABC Salles touch" is: warm natural light, authentic French venues (stone, wood, linen),
elegant but accessible, never staged or corporate. Think editorial wedding/event photography.

═══════════════════════════════════════════════════════════
RULE #0 — ARTICLE FAITHFULNESS (THE MOST IMPORTANT RULE)
═══════════════════════════════════════════════════════════

Your ONLY source of truth is the article text. The prompts must illustrate
THIS article, not a generic version of the topic.

ABSOLUTE GROUNDING RULE — NO HALLUCINATION:
- You may ONLY describe people, clothing, objects, food, gestures, places,
  and architectural elements that are EXPLICITLY mentioned in the article
  text or are unambiguous, well-known facts.
- If the article does not name a specific object, do NOT invent one.
- Never invent "traditional symbols", "ceremonial objects", "ritual items"
  that are not actually part of what's described.

CULTURAL & GEOGRAPHIC ACCURACY (when applicable):
- Default setting: French event venues (châteaux, manoirs, granges, péniches
  Seine, lofts Marais, hôtels particuliers haussmanniens, abbayes, jardins).
- If the article is about a specific non-French culture (mariage marocain,
  séminaire bollywood, etc.), match ethnicity, clothing, and architecture.
- NEVER describe ethnicity for default French articles — let Imagen pick.
- ONLY describe ethnicity if the article explicitly names a non-French culture.

═══════════════════════════════════════════════════════════
THE PROMPTS (one per H2 section, max 4)
═══════════════════════════════════════════════════════════

PROMPT LENGTH: 80-120 words each.

EACH PROMPT IS A "LIVING SCENE" WITH:
- 1-2 SHARP foreground subjects, MID-ACTION (never standing still, never posing)
- Camera angles: over-the-shoulder, side profile, three-quarter turned away
- Hands HOLD OBJECTS (glass, flower, plate, fabric, notebook) — fingers hidden by the object
- Body language only: "leaning forward", "reaching across", "writing in", "lifting"
- NEVER emotions: no "joyful", "happy", "smiling", "laughing", "celebrating"
- ALWAYS show the FULL person for sharp foreground subjects (never crop mid-body)

THE BACKGROUND MUST BE POPULATED (never empty):
Use one or more of these layers, based on what the article describes:
  - "softly out-of-focus seated guests in the background, suggested as
    silhouettes and color blocks of clothing, faces dissolved into bokeh"
  - "rows of occupied wooden chairs visible behind, blurred by depth of field"
  - "ceremonial decor in the mid-ground: floral arrangements, candles, table
    settings, draped fabric, all softly out of focus"
  - "ambient details typical of the venue: cathedral arches, painted ceiling,
    stained glass, mairie wood paneling, depending on the article"

Anti-empty-room rule: NEVER write "in an empty hall", "in a deserted room"
unless the article explicitly describes solitude.

═══════════════════════════════════════════════════════════
STRUCTURE EACH PROMPT IN THIS ORDER
═══════════════════════════════════════════════════════════
1. SUBJECT — who is in the frame, what they are DOING (verbs from the article)
2. SETTING — specific French venue, named architectural elements
3. LIGHT — ONE natural light source with explicit direction ("warm morning
   light from the tall arched windows on the left", "candles and chandelier
   glow from above, evening interior", "late afternoon golden hour streaming
   diagonally from camera left")
4. COMPOSITION — camera angle, what's in focus, what's in bokeh
5. ONE IMPERFECTION — "a single chair slightly askew", "a half-empty glass",
   "a linen napkin loosely folded", "the tablecloth has a subtle wrinkle"

USE QUOTED FRENCH TERMS naturally inside the English prompts:
"pierres apparentes", "moulures", "lustres en cristal", "parquet ancien",
"chemin de table", "piste de danse", "salle de réception", "verrière",
"jardin à la française".

ANTI-AI REALISM — CRITICAL phrases to weave in:
- "natural skin pores and micro-texture" on visible skin
- "authentic material textures" — wood grain, stone weathering, fabric weave
- "matte finish" for food (never "glossy")
- "gentle sheen" instead of "wet"
- "asymmetrical composition, nothing centered"

═══════════════════════════════════════════════════════════
ABSOLUTE BANS
═══════════════════════════════════════════════════════════
- NO front-facing visible faces (side, profile, three-quarter, back-of-head only)
- NO more than 2 SHARP people in foreground
- NO close-ups showing isolated fingers (hands MUST hold objects)
- NO text in the scene (signs, menus, labels, logos, writing)
- NO perfect symmetry, NO centered subjects
- NO aerial / overhead / drone shots
- NO cropped / partial people
- NO emotion words ("joyful", "happy", "smiling", "celebrating", "laughing",
  "playful", "mid-laugh", "enthusiastic", "delighted")
- NO marketing words ("stunning", "breathtaking", "magnificent", "vibrant",
  "sparkling", "magical", "unforgettable", "luxurious")
- NO art direction phrases ("in the style of X", "inspired by Y")
- NO bright primary colors (default to muted earth tones, off-whites, faded
  greens, aged wood, weathered stone)
- NO destination wedding clichés (Côte d'Azur, Saint-Tropez, sailboats,
  Toscane, Amalfi, Santorin, Bali, Marrakech) unless article names them
- NO "Tour Eiffel in the background", NO "Parisian rooftop with city lights",
  NO "photobooth", NO "guirlandes guinguettes"

═══════════════════════════════════════════════════════════
COHERENCE ACROSS PROMPTS (when multiple H2)
═══════════════════════════════════════════════════════════
- Prompt 1 ESTABLISHES the universe (wide hero shot).
- Prompts 2-4 CITE a recurring anchor explicitly: "the same château salon
  as in the first frame", "the same dark wooden table", "the same linen
  tablecloth visible", "through the same arched window".
- ALL prompts: same time of day, same season, same weather, same overall
  light quality. They must look like 3-4 photos from the SAME magazine spread.

═══════════════════════════════════════════════════════════
OUTPUT FORMAT — STRICT (this discipline tool prevents hallucination)
═══════════════════════════════════════════════════════════

You MUST output exactly this JSON structure, no markdown:

{
  "visual_elements": [
    "list 5-10 CONCRETE visual elements LITERALLY mentioned in the article",
    "quote or near-quote the article",
    "named clothing, named objects, named food, named gestures, named places",
    "ONE element per array item"
  ],
  "culture": "country / culture / ethnicity of people (or 'French default' if no specific culture named)",
  "prompts": [
    {
      "section": "Short title of the section being illustrated (French OK)",
      "prompt": "Full 80-120 word prompt following the structure above. Every concrete noun MUST come from visual_elements or be a verifiable fact about the culture."
    }
  ]
}

CRITICAL: Every concrete noun in your prompts MUST come from visual_elements
(or be a logical, well-known fact about the culture). If an element isn't in
visual_elements and isn't a verifiable cultural fact, do NOT put it in the prompts.

Generate 1 prompt per major H2 section of the article (max 4). If no H2, generate 1 hero prompt.`

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.GEMINI_LLM_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_LLM_API_KEY missing on server' })
  }

  try {
    const { subject, articleText, agentType } = req.body || {}
    if (!subject?.trim() || !articleText?.trim()) {
      return res.status(400).json({ error: 'subject and articleText are required' })
    }

    const filmStock = detectFilmStock(`${subject} ${articleText}`)

    const userMessage = `Article subject: "${subject}"
Article type: ${agentType || 'guide'}
Film stock for this article: ${filmStock}

FULL ARTICLE CONTENT (for tone, culture, named visual elements):
${articleText}

YOUR TASK:

Step 1 — Read the article. Extract the visual_elements (5-10 concrete nouns
literally mentioned or near-quoted from the article) and the culture
(French default unless article explicitly names another).

Step 2 — Write 1 prompt per major H2 section (max 4 prompts). If no H2,
write 1 hero prompt. Each prompt 80-120 words, following the 5-section
structure (SUBJECT, SETTING, LIGHT, COMPOSITION, IMPERFECTION).

Step 3 — Every concrete noun in the prompts MUST come from visual_elements
(or be a verifiable cultural fact). NEVER invent objects, symbols, rituals
not in the article.

Output strictly the JSON format specified in the system prompt.`

    // Retry on 503/429 (Gemini overload) with backoff
    const callGemini = async () => fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_LLM_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: {
          temperature: 0.55,
          responseMimeType: 'application/json'
        }
      })
    })

    // 5 attempts with exponential backoff (2s, 4s, 8s, 16s) — total ~30s max.
    // Gemini 503/429 spikes typically clear within 10-20s.
    let response
    let lastErrText = ''
    let lastStatus = 0
    for (let attempt = 1; attempt <= 5; attempt++) {
      response = await callGemini()
      if (response.ok) break
      lastErrText = await response.text()
      lastStatus = response.status
      if (response.status !== 503 && response.status !== 429) {
        console.error('Gemini API non-retryable error:', response.status, lastErrText)
        return res.status(502).json({
          error: 'Une erreur inattendue côté Gemini est survenue. Réessaie ou contacte l\'équipe Tech.',
          code: 'GEMINI_ERROR',
          status: response.status,
        })
      }
      if (attempt < 5) await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
    }
    if (!response.ok) {
      console.error('Gemini API overloaded after 5 retries:', lastStatus, lastErrText)
      return res.status(503).json({
        error: 'Gemini est temporairement surchargé. Patiente une minute et réessaie.',
        code: 'GEMINI_OVERLOADED',
        retryable: true,
      })
    }

    const data = await response.json()
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!content) {
      return res.status(502).json({ error: 'Empty response from Gemini', raw: data })
    }

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (err) {
      return res.status(502).json({ error: 'Invalid JSON from Gemini', raw: content })
    }

    if (!Array.isArray(parsed?.prompts) || parsed.prompts.length === 0) {
      return res.status(502).json({ error: 'No prompts returned', raw: parsed })
    }

    // Append technical suffix (film stock + lens) to each prompt — context-aware
    parsed.prompts = parsed.prompts.map((p, idx) => ({
      ...p,
      prompt: `${p.prompt.trim()}\n\n${variantSuffix(filmStock, idx)}`.trim()
    }))

    return res.status(200).json(parsed)
  } catch (err) {
    console.error('photo-prompt error:', err)
    return res.status(500).json({ error: err.message || 'Internal error' })
  }
}
