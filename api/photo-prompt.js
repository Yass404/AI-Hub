// Vercel Function — generates photo prompts for Imagen (Gemini app)
// in the "ABC Salles touch" style, based on a written article.

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const SYSTEM_PROMPT = `Tu génères des prompts photo pour Imagen (Google Gemini), au style "ABC Salles Magazine".

LE STYLE ABC SALLES :
- Lumière naturelle chaude, jamais flash dur
- Lieux français authentiques (pierre, bois, lin, zellige selon culture)
- Élégant mais accessible, jamais corporate ou posé
- Photographie éditoriale magazine, pas studio

RÈGLES ABSOLUES :
1. FIDÉLITÉ À L'ARTICLE — Tu ne décris QUE des éléments présents dans l'article. Pas d'invention d'objets, de symboles, de rituels.
2. PRÉCISION CULTURELLE — Si l'article parle d'une culture spécifique (Maroc, Inde, Rwanda, Japon, etc.), les personnes, vêtements et lieux doivent matcher cette culture. Précise toujours l'ethnicité explicitement ("femme marocaine de 30 ans") sinon l'IA défaut sur des Européens blancs.
3. NOMS RÉELS — Utilise les vrais noms culturels (caftan, lehenga, umushanana, kimono) jamais "robe traditionnelle".
4. MAX 2 PERSONNES NETTES — Au premier plan, mi-action (jamais figées, jamais face caméra). Arrière-plan flou avec invités/témoins suggérés en bokeh.
5. ANTI-VIDE — Jamais "salle vide" ou "pièce déserte". Toujours des invités, du décor, de la vie en arrière-plan flou.

STRUCTURE D'UN PROMPT (80-120 mots, en anglais pour Imagen) :
1. SUBJECT — qui est dans le cadre (avec ethnicité si non-française), action en cours
2. SETTING — lieu spécifique cohérent avec la culture
3. LIGHT — une source de lumière naturelle directionnelle
4. COMPOSITION — angle (over-the-shoulder, three-quarter), focus, bokeh
5. ANTI-AI — "visible film grain at ISO 400", "natural skin pores", "asymmetrical composition"

OUTPUT FORMAT :
Retourne UNIQUEMENT du JSON valide, sans markdown :
{
  "prompts": [
    {
      "section": "H2 ou contexte de la section",
      "prompt": "Le prompt photo complet en anglais, prêt à coller dans Imagen"
    }
  ]
}

Génère 1 prompt par section H2 majeure de l'article (max 4 prompts). Si l'article n'a pas de H2, génère 1 seul prompt "hero" pour le sujet global.`

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

    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_LLM_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json'
        }
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Gemini API error:', response.status, errText)
      return res.status(502).json({ error: `Gemini API ${response.status}`, details: errText })
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

    return res.status(200).json(parsed)
  } catch (err) {
    console.error('photo-prompt error:', err)
    return res.status(500).json({ error: err.message || 'Internal error' })
  }
}
