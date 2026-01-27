import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Mock endpoint for Trends
app.get('/api/trends', async (req, res) => {
    try {
        const topic = req.query.topic || "mariage et événementiel";

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
            console.error('API Error:', error);
            throw new Error(`Perplexity API Error: ${response.status}`);
        }

        const data = await response.json();

        let content = data.choices[0].message.content;

        // Clean markdown if present
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();

        res.json(JSON.parse(content));

    } catch (error) {
        console.error('Error fetching trends:', error);
        // Fallback to mock data if API fails
        res.status(500).json({
            error: "Failed to fetch trends",
            details: error.message,
            fallback: true,
            data: [
                {
                    id: 1,
                    title: "Mariage Minimaliste (Fallback)",
                    description: "L'API n'a pas répondu, voici une tendance par défaut.",
                    keyword: "simplicité"
                }
            ]
        });
    }
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
