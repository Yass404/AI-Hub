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

const PHOTO_SYSTEM = `Tu génères des prompts photo pour Imagen (Google Gemini) pour ABC SALLES — guide français des salles de réception et de l'événementiel professionnel.

═══════════════════════════════════════════════════════════
CE QU'ON ILLUSTRE
═══════════════════════════════════════════════════════════
ABC Salles parle d'événements en France : mariages, séminaires d'entreprise, anniversaires, soirées de gala, baptêmes, cocktails, lancements produit. La photo doit donner envie de réserver une salle, pas raconter un voyage exotique.

Univers visuel par défaut (ABC Salles vend des salles de réception en France, pas du tourisme) :
- Lieux français AUTHENTIQUES : châteaux Renaissance/XVIIIe (Île-de-France, Loire), manoirs normands, granges rénovées (Bourgogne, Champagne), péniches sur la Seine à Paris, lofts industriels parisiens (Marais, 11e), jardins à la française, hôtels particuliers haussmanniens, abbayes restaurées
- Décors INTÉRIEURS privilégiés : tables dressées avec nappage lin blanc/écru, verrerie cristal, bougeoirs en laiton, art floral éclatant mais raffiné (roses, eucalyptus, hortensias), chemins de table velours, vaisselle en porcelaine, sols en parquet ancien, moulures Haussmann, lustres en cristal

INTERDICTIONS (ce qu'Imagen produit par défaut et qu'on NE VEUT PAS) :
- ❌ Côte d'Azur, Méditerranée, Saint-Tropez, Cassis, voiliers en mer
- ❌ Côté Provence "carte postale" (Mont Ventoux, lavande, oliviers, cigales)
- ❌ Toscane, Amalfi, Santorin (Imagen y va automatiquement sur "wedding villa")
- ❌ Plages, mer, piscines à débordement vue mer, bateaux
- ❌ Style "Conde Nast Traveler" / "vogue around the world" / "destination wedding"
- ❌ Bali, Marrakech, Bahamas (sauf si l'article cite explicitement)

Si l'article parle de "séminaire" ou "incentive" ou "team building", reste dans l'univers FRANCE PRO : hôtels 5 étoiles parisiens, salles de réunion design en loft, châteaux convertis en lieu de séminaire. PAS de yacht, PAS de villa Côte d'Azur.
- Personnes au 1er plan : 1-2 sujets nets, par défaut **français/européens caucasiens** sauf si l'article cite explicitement une autre origine. Tenues haut-de-gamme : robe de soirée couturier, smoking sur mesure, costume bien coupé, 25-55 ans
- Invités en arrière-plan flou : majoritairement européens (cohérent avec une réception en France), avec 1-2 silhouettes discrètement variées au loin pour faire naturel — JAMAIS de diversité forcée au premier plan, JAMAIS de "fashion editorial diverse cast"
- Lumière : golden hour, bougies, lustres en cristal, baies vitrées style atelier d'artiste

═══════════════════════════════════════════════════════════
EXCEPTION CULTURELLE
═══════════════════════════════════════════════════════════
Seulement SI l'article cite explicitement une culture/pays non français (mariage marocain, séminaire bollywood, cérémonie japonaise, etc.), tu peux adapter — MAIS la photo doit toujours rester dans le registre "événement de réception élégant", pas reportage ethnographique :

- Garde un cadre événementiel (salle louée, château, hôtel) — pas un temple, pas un marché, pas un village
- Les éléments culturels sont en accent (un caftan brodé, des bougies marocaines, un mandap fleuri) intégrés dans un décor de réception
- Évite : reportage de voyage, photo de presse, scène de village, temple sacré, marché local

═══════════════════════════════════════════════════════════
RÈGLES TECHNIQUES
═══════════════════════════════════════════════════════════
1. FIDÉLITÉ À L'ARTICLE — Si l'article décrit un sujet précis (ex : décoration champêtre, dîner gastronomique, animation jazz), le prompt doit illustrer CE moment, pas une généralité.
2. MAX 2 PERSONNES NETTES — Au premier plan, mi-action AVEC ÉMOTION (éclat de rire, échange complice, regard amoureux, geste de toast levé, mains qui s'effleurent, ajustement d'une boutonnière). JAMAIS posées face caméra, JAMAIS "admirant" passivement.
3. ANTI-VIDE — Jamais "salle vide" sauf si l'article parle explicitement de la salle nue. Toujours suggérer la vie : verres pleins, assiettes en cours de service, bougies allumées, invités en silhouettes bokeh.
4. COHÉRENCE ENTRE PROMPTS — Si tu génères plusieurs prompts pour le même article, ils doivent ressembler à un même reportage : MÊME LIEU explicitement rappelé ("the same château reception room as before"), même lumière, même style de décoration. Le 1er prompt définit l'univers, les suivants citent un détail récurrent (ex : "the same blue velvet drape visible", "the same peonies on the table").
5. VARIÉTÉ D'ANGLES ENTRE PROMPTS — Si plusieurs prompts pour un même article : prompt 1 = wide hero (35mm), prompt 2 = portrait moment (85mm), prompt 3 = close-up détail (100mm macro), prompt 4 = ambiance grand angle. Jamais 2 prompts avec le même angle.
6. ANTI-CLICHÉ AI — Jamais "perfect symmetry", jamais "8k ultra detailed", jamais "hyperrealistic", jamais "stunning beautiful". Privilégie un vrai style photo éditorial.

═══════════════════════════════════════════════════════════
STRUCTURE D'UN PROMPT (80-120 mots, en ANGLAIS pour Imagen)
═══════════════════════════════════════════════════════════
1. SUBJECT — qui est dans le cadre, action en cours (un verbe précis)
2. SETTING — lieu événementiel précis (château, manoir, jardin, etc.), décor de réception
3. LIGHT — une source naturelle directionnelle (golden hour, baie vitrée, bougies)
4. COMPOSITION — focal (50mm f/2, 85mm f/1.8, 35mm f/2.8), angle (three-quarter, over-the-shoulder, side profile), focus, bokeh
5. RÉALISME — "natural skin texture", "subtle film grain", "asymmetrical composition", "candid photography"

Termine systématiquement chaque prompt par : "Editorial wedding magazine photography in the style of Vogue Weddings, shot on Kodak Portra 400 film, no AI artifacts."

═══════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════
Retourne UNIQUEMENT du JSON valide, sans markdown :
{
  "prompts": [
    {
      "section": "Titre court de la section illustrée (français)",
      "prompt": "Prompt complet en anglais, prêt à coller dans Imagen"
    }
  ]
}

Génère 1 prompt par section H2 majeure de l'article (max 4). Si l'article n'a pas de H2, génère 1 prompt hero pour le sujet global.`

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
        generationConfig: { temperature: 0.6, responseMimeType: 'application/json' }
      })
    })

    let response
    let lastErrText = ''
    for (let attempt = 1; attempt <= 3; attempt++) {
      response = await callGemini()
      if (response.ok) break
      lastErrText = await response.text()
      if (response.status !== 503 && response.status !== 429) throw new Error(`Gemini ${response.status}: ${lastErrText}`)
      if (attempt < 3) await new Promise(r => setTimeout(r, attempt * 1500))
    }
    if (!response.ok) throw new Error(`Gemini ${response.status} after 3 retries: ${lastErrText}`)

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
