// Vercel Function — generates photo prompts for Imagen (Gemini app)
// in the "ABC Salles touch" style, based on a written article.
// Aligned with the prod prompt-generator (mag-image-replacer) approach.

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

// Variant-specific technical suffix — same logic as prod.
function variantSuffix(filmStock, variantIndex) {
  const v = (variantIndex % 3) + 1
  if (v === 1) return `Shot on 85mm f/1.8, ${filmStock}. Visible film grain at ISO 400. Shallow depth of field with creamy bokeh. Natural available light, slightly off-center composition. Natural skin pores and micro-texture visible. The image contains absolutely zero text, zero letters, zero numbers, zero signs, zero logos. Landscape 16:9 format. Ultra photorealistic.`
  if (v === 2) return `Shot on 100mm macro f/2.8, ${filmStock}. Visible film grain at ISO 400. Extreme shallow depth of field, subject tack-sharp, background dissolved into soft bokeh. Matte finish on surfaces, gentle sheen not glossy. Authentic material textures visible — wood grain, fabric weave, ceramic glaze. The image contains absolutely zero text, zero letters, zero numbers, zero signs, zero logos. Landscape 16:9 format. Ultra photorealistic.`
  return `Shot on 35mm f/2.8, ${filmStock}. Visible film grain at ISO 400. Moderate depth of field showing environmental context. Natural available light with warm amber tones. Authentic architectural textures — stone, wood, plaster, parquet. The image contains absolutely zero text, zero letters, zero numbers, zero signs, zero logos. Landscape 16:9 format. Ultra photorealistic.`
}

const SYSTEM_PROMPT = `You write image prompts for Imagen (Google AI image generator) for ABC SALLES — French magazine about event venues.

Your prompts must look like the work of a discrete editorial photographer (think NYT Style, Cereal Magazine, M Le Magazine du Monde), NEVER like stock photography or commercial advertising.

═══════════════════════════════════════════════════════════
TEMPLATE (mandatory structure for each prompt)
═══════════════════════════════════════════════════════════
Each prompt MUST follow this exact 5-section format (the LLM-side, the system appends technical suffix afterwards):

SUBJECT: [Who is in the frame. ALWAYS seen from behind, side profile, three-quarter turned away, or with fingers partially obscured. NEVER face-to-camera. NEVER describe ethnicity or skin color. State age range + clothing + what they DO (verb), never what they FEEL.]
SETTING: [The venue, with named architectural elements. Use quoted French terms when relevant ("pierres apparentes", "piste de danse", "moulures", "parquet à bâtons rompus", "verrière", "jardin à la française"). Be specific about materials (stone, wood, linen, brass).]
LIGHT: [ONE directional natural light source with explicit direction. Examples: "warm morning light from the tall windows on the left", "late afternoon golden hour streaming diagonally from camera left", "candles and chandelier glow from above, evening interior". NEVER "bright", NEVER "vibrant", NEVER "stunning".]
COMPOSITION: [Camera angle and focus. Example: "wide off-center shot from low angle, subjects in mid-ground with foreground softly blurred" or "medium close-up over-the-shoulder, shallow depth of field on the hands".]
IMPERFECTIONS: [One small humanising detail. Examples: "a single chair slightly askew", "a half-empty glass of water", "a linen napkin loosely folded", "a wine bottle's label partially peeled".]

═══════════════════════════════════════════════════════════
HARD RULES — DO NOT BREAK
═══════════════════════════════════════════════════════════

1. NO FACE-TO-CAMERA. Always backs, profiles, three-quarter turned, fingers hiding face, looking out a window, looking at hands. The viewer should NEVER see anyone smiling at them.

2. NO ETHNICITY mentions. Skip nationality, skin color, "Caucasian", "French", "European" entirely. Let Imagen choose. Just age range + clothing.

3. NO EMOTION ADJECTIVES. Banned: "joyful", "happy", "enthusiastic", "smiling broadly", "laughing", "celebrating", "playful", "high-fiving", "mid-laugh", "posing", "delighted". Only describe ACTIONS: "writing in a notebook", "lifting a glass", "examining the floor plan", "adjusting a cufflink", "resting fingers on the table".

4. NO MARKETING / TRAVEL words. Banned: "stunning", "breathtaking", "magnificent", "vibrant", "sparkling", "magical", "unforgettable", "luxurious", "elegant" used as adjective (use "elegantly" only as adverb for action). Banned: "Tour Eiffel in the background", "Parisian rooftop with city lights", "photobooth", "guirlandes guinguettes" — these are stock-photo clichés.

5. NO BRIGHT COLORS. Default palette: muted earth tones, off-whites, faded greens, aged wood, weathered stone. Never primary saturation. Never "vibrant".

6. SETTINGS: French event venues only by default (châteaux, manoirs, granges rénovées, péniches Seine, lofts du Marais, hôtels particuliers haussmanniens, abbayes restaurées, jardins à la française, domaines viticoles). For mountain/outdoor: rustic refuges, fermes-auberges, never Alpine postcard.

7. AVOID: Côte d'Azur, Saint-Tropez, sailboats, sea views, Toscane, Amalfi, Santorin, Bali, Marrakech (unless article explicitly names them). Avoid Tour Eiffel as backdrop unless article is specifically about Paris views.

8. FRENCH CONTEXTUAL ELEMENTS via quoted terms — use them naturally inside the English prompt: "pierres apparentes", "moulures", "lustres en cristal", "parquet ancien", "chemin de table", "mobilier de base", "salle de réception", "verrière".

═══════════════════════════════════════════════════════════
COHERENCE ACROSS PROMPTS (when multiple H2 in article)
═══════════════════════════════════════════════════════════
- Prompt 1 establishes the venue (wide shot, defines the universe).
- Prompts 2-4 cite a recurring anchor: "the same château salon as in the first frame", "the same dark wooden table", "the same linen tablecloth", "viewed through the same arched window".
- Same time of day across all prompts.
- Same season/weather across all prompts.

═══════════════════════════════════════════════════════════
OUTPUT FORMAT (strict JSON, no markdown)
═══════════════════════════════════════════════════════════
{
  "prompts": [
    {
      "section": "Short title of the section being illustrated (French OK)",
      "prompt": "SUBJECT: ...\\nSETTING: ...\\nLIGHT: ...\\nCOMPOSITION: ...\\nIMPERFECTIONS: ..."
    }
  ]
}

Generate 1 prompt per major H2 section of the article (max 4 prompts). If the article has no H2 structure, generate 1 hero prompt.

REMEMBER: NEVER face-to-camera. NEVER emotion adjectives. NEVER bright colors. NEVER stock photo clichés. The result must look like a thoughtful editorial photographer's work, not an Instagram event ad.`

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

    const userMessage = `SUJET : ${subject}
TYPE D'ARTICLE : ${agentType || 'guide'}

ARTICLE RÉDIGÉ :
${articleText}

Génère les prompts photo au format JSON demandé.`

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

    let response
    let lastErrText = ''
    for (let attempt = 1; attempt <= 3; attempt++) {
      response = await callGemini()
      if (response.ok) break
      lastErrText = await response.text()
      if (response.status !== 503 && response.status !== 429) {
        console.error('Gemini API non-retryable error:', response.status, lastErrText)
        return res.status(502).json({ error: `Gemini API ${response.status}`, details: lastErrText })
      }
      if (attempt < 3) await new Promise(r => setTimeout(r, attempt * 1500))
    }
    if (!response.ok) {
      console.error('Gemini API still failing after retries:', response.status, lastErrText)
      return res.status(502).json({ error: `Gemini API ${response.status} (after 3 retries)`, details: lastErrText })
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
    const filmStock = detectFilmStock(`${subject} ${articleText}`)
    parsed.prompts = parsed.prompts.map((p, idx) => ({
      ...p,
      prompt: `${p.prompt.trim()} ${variantSuffix(filmStock, idx)}`.trim()
    }))

    return res.status(200).json(parsed)
  } catch (err) {
    console.error('photo-prompt error:', err)
    return res.status(500).json({ error: err.message || 'Internal error' })
  }
}
