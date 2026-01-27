
export default async function handler(req, res) {
    // Set CORS headers allowing access from any origin (or restrict to your domain)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const topic = req.query.topic || "mariage et événementiel";

        // Check for API Key
        if (!process.env.PERPLEXITY_API_KEY) {
            console.error("PERPLEXITY_API_KEY is missing in environment variables.");
            // Fallback to mock data if key is missing (safe fail)
            return res.status(500).json({
                error: "Configuration Error",
                details: "API Key is missing on server.",
                fallback: true,
                data: [
                    {
                        id: 1,
                        title: "Configuration Requise (Vercel)",
                        description: "La clé API Perplexity n'est pas configurée dans les paramètres Vercel.",
                        keyword: "Config",
                        category: "Système"
                    }
                ]
            });
        }

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'sonar-pro',
                messages: [
                    {
                        role: 'system',
                        content: `Tu es un expert en veille de tendances.
Ton objectif est de retourner UNIQUEMENT un objet JSON valide contenant 20 tendances actuelles (ni plus, ni moins) sur le sujet demandé.
Le format doit être STRICTEMENT celui-ci :
{
  "data": [
    {
      "id": 1,
      "title": "Titre court de la tendance",
      "description": "Description détaillée de la tendance, pourquoi elle monte, et comment l'appliquer.",
      "keyword": "mot-clé principal",
      "category": "Catégorie pertinente"
    }
  ]
}
Ne mets PAS de balises markdown. Renvoie juste le JSON brut.`
                    },
                    {
                        role: 'user',
                        content: `Quelles sont les dernières tendances 2025/2026 sur le sujet : "${topic}" ? Donne-moi des idées fraîches, innovantes et variées.`
                    }
                ],
                temperature: 0.2
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Perplexity API Error: ${response.status} - ${error}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content;

        // Clean markdown if present
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();

        res.status(200).json(JSON.parse(content));

    } catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({
            error: "Failed to fetch trends",
            details: error.message,
            fallback: true,
            data: [
                {
                    id: 1,
                    title: "Mode Secours (Erreur API)",
                    description: "Impossible de joindre Perplexity. Vérifiez les logs Vercel.",
                    keyword: "Erreur",
                    category: "Système"
                }
            ]
        });
    }
}
