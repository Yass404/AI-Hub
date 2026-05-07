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

const PHOTO_SYSTEM = `Tu génères des prompts photo pour Imagen (Google Gemini), au style "ABC Salles Magazine".

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

    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_LLM_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: PHOTO_SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.4, responseMimeType: 'application/json' }
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Gemini ${response.status}: ${errText}`)
    }

    const data = await response.json()
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!content) return res.status(502).json({ error: 'Empty Gemini response' })

    const parsed = JSON.parse(content)
    if (!Array.isArray(parsed?.prompts) || parsed.prompts.length === 0) {
      return res.status(502).json({ error: 'No prompts returned', raw: parsed })
    }
    res.json(parsed)
  } catch (err) {
    console.error('photo-prompt error:', err)
    res.status(500).json({ error: err.message || 'Internal error' })
  }
})

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`)
})
