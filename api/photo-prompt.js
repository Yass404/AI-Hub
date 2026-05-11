// Vercel Function — generates photo prompts for Imagen (Gemini app)
// in the "ABC Salles touch" style, based on a written article.

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const SYSTEM_PROMPT = `Tu génères des prompts photo pour Imagen (Google Gemini) pour ABC SALLES — guide français des salles de réception et de l'événementiel professionnel.

═══════════════════════════════════════════════════════════
CE QU'ON ILLUSTRE
═══════════════════════════════════════════════════════════
ABC Salles parle d'événements en France : mariages, séminaires d'entreprise, anniversaires, soirées de gala, baptêmes, cocktails, lancements produit. La photo doit donner envie de réserver une salle, pas raconter un voyage exotique.

Univers visuel par défaut :
- Lieux français : châteaux Renaissance/XVIIIe, manoirs, granges rénovées, péniches sur la Seine, lofts industriels parisiens, jardins à la française, villas de Provence, hôtels particuliers
- Décors : tables dressées avec nappage lin, verrerie cristal, bougeoirs en laiton, art floral éclatant mais raffiné (roses, eucalyptus, hortensias), chemins de table velours, vaisselle en porcelaine
- Personnes au 1er plan : 1-2 sujets nets, cohérents entre eux (un couple = même type/style ensemble, pas forcé). Tenues haut-de-gamme : robe de soirée couturier, smoking sur mesure, costume bien coupé, 25-55 ans
- Invités en arrière-plan flou : origines naturellement variées (une silhouette afro, une asiatique, une européenne dans le bokeh — JAMAIS toutes une seule origine, mais JAMAIS forcé non plus en gros plan)
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

    // Retry on 503 (Gemini is sometimes overloaded). Up to 3 attempts with backoff.
    const callGemini = async () => fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_LLM_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: {
          temperature: 0.6,
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

    return res.status(200).json(parsed)
  } catch (err) {
    console.error('photo-prompt error:', err)
    return res.status(500).json({ error: err.message || 'Internal error' })
  }
}
