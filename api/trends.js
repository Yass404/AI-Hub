// Vercel Function — fetches event/wedding trends via Gemini with Google Search grounding.
// Migrated from Perplexity to Gemini (May 2026).

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const SYSTEM_PROMPT = `Tu es un expert en veille de tendances pour ABC Salles, leader français des salles de réception et événementiel.

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const fallback = (status, error, details) => res.status(status).json({
    error,
    details,
    fallback: true,
    data: [{
      id: 1,
      title: 'Mode Secours (Erreur API)',
      description: details || 'Impossible de joindre Gemini. Vérifiez les logs Vercel.',
      keyword: 'Erreur',
      category: 'Système'
    }]
  })

  if (!process.env.GEMINI_LLM_API_KEY) {
    return fallback(500, 'Configuration Error', 'GEMINI_LLM_API_KEY missing on server')
  }

  try {
    const topic = req.query.topic || 'mariage et événementiel'
    const userMessage = `Quelles sont les dernières tendances 2025/2026 sur le sujet : "${topic}" ? Donne-moi des idées fraîches, innovantes et variées.`

    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_LLM_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: { temperature: 0.3 }
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Gemini API error:', response.status, errText)
      return fallback(502, 'Gemini API Error', `${response.status}: ${errText}`)
    }

    const data = await response.json()
    let content = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!content) return fallback(502, 'Empty response from Gemini', JSON.stringify(data).slice(0, 200))

    content = content.replace(/```json/g, '').replace(/```/g, '').trim()

    try {
      return res.status(200).json(JSON.parse(content))
    } catch {
      return fallback(502, 'Invalid JSON from Gemini', content.slice(0, 200))
    }
  } catch (err) {
    console.error('Error fetching trends:', err)
    return fallback(500, 'Failed to fetch trends', err.message)
  }
}
