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

const SYSTEM_PROMPT = `You write SHORT image prompts (60-100 words) for Imagen (Google AI image generator) for ABC SALLES — French magazine about event venues (mariages, séminaires, gala, anniversaires, baptêmes, cocktails).

═══════════════════════════════════════════════════════════
RULE #0 — ARTICLE FIDELITY
═══════════════════════════════════════════════════════════
Each prompt must illustrate THIS specific article, not a generic version of the topic. Pick concrete, NAMED elements from the article (a specific room type, a named dish, a precise activity). Never invent objects or scenes the article doesn't mention.

═══════════════════════════════════════════════════════════
SETTINGS — what to depict
═══════════════════════════════════════════════════════════
Default universe (when article doesn't specify a location): authentic French venues:
- Châteaux (Loire, Île-de-France), manoirs normands, abbayes restaurées
- Granges rénovées (Bourgogne, Champagne), domaines viticoles
- Péniches sur la Seine à Paris, lofts industriels parisiens (Marais, 11e)
- Hôtels particuliers haussmanniens, hôtels 5* parisiens
- Jardins à la française, orangeries, vérandas
- Pour montagne / nature : refuges design, chalets en bois, fermes-auberges (PAS Suisse cartepostale, PAS Autriche)

What to avoid by default:
- Mediterranean / Côte d'Azur / Saint-Tropez / Cassis / sea views
- Tuscany / Amalfi / Santorini / Bali / Marrakech (unless article explicitly names them)
- Beaches, sailboats, infinity pools, destination wedding aesthetic
- Generic stock-photo locations (Alpine high-five postcards, tropical resorts)

═══════════════════════════════════════════════════════════
PEOPLE — how to depict
═══════════════════════════════════════════════════════════
- Max 2 SHARP people in foreground. NEVER describe their ethnicity, nationality, or skin color in the prompt — Imagen will pick naturally. Just describe AGE RANGE, GESTURE, and CLOTHING.
- Foreground people: mid-action with subtle, restrained emotion (a conversation, a focused expression while writing, a quiet smile during a toast, hands resting on a notebook). NEVER "laughing joyfully", NEVER "high-fiving", NEVER "celebrating". The result must feel editorial, not stock photo "team success".
- Body language only — NO emotional adjectives like "joyful", "enthusiastic", "happy". Say what they DO ("listening", "writing in a notebook", "lifting a glass"), not what they FEEL.
- Background witnesses: out-of-focus shapes, color masses, bokeh silhouettes. Never sharp faces in the background.
- Clothing: elegant but contextual. Wedding = couture / black-tie. Seminar = smart business casual (blazer, cashmere knit, tailored trousers). Cocktail = chic city. Outdoor seminar = high-end Patagonia/Aigle aesthetic, never bright primary colors.

═══════════════════════════════════════════════════════════
LIGHT — set the mood
═══════════════════════════════════════════════════════════
ONE directional natural light source per prompt. Be specific:
- "soft window light from camera left, diffused by sheer linen curtain"
- "candles and chandelier glow, evening interior"
- "overcast diffused daylight, gentle and shadowless"
- "golden hour rim light through tall French windows"
NEVER "bright sunny day", NEVER "vibrant colors", NEVER "clear blue sky" (unless article specifies).

═══════════════════════════════════════════════════════════
COMPOSITION & ANTI-AI
═══════════════════════════════════════════════════════════
- Asymmetrical composition, off-center subjects, rule of thirds broken intentionally
- Authentic textures (wood grain, fabric weave, stone weathering, parquet patina)
- "candid photography" not "posed shot"
- Subdued, warm color palette — earthy tones, off-whites, muted greens. NEVER saturated/vibrant.

═══════════════════════════════════════════════════════════
COHERENCE ACROSS MULTIPLE PROMPTS
═══════════════════════════════════════════════════════════
If multiple prompts for same article: cite ONE recurring detail in each (same chandelier, same drape, same flower arrangement) so the set reads as a single editorial shoot.

═══════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════
Return ONLY valid JSON, no markdown:
{
  "prompts": [
    { "section": "Short title of the section being illustrated (French OK)", "prompt": "Full English prompt, 60-100 words — NO film stock suffix, NO 'shot on 85mm' details — that's appended by the system" }
  ]
}

Generate 1 prompt per major H2 section of the article (max 4). If no H2, generate 1 hero prompt for the global subject. NEVER include ethnicity, NEVER use "joyful/happy/celebrating", NEVER use bright color words.`

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
