import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.14.0';

// On désactive le cache local du navigateur pour éviter les conflits
env.allowLocalModels = false;
env.useBrowserCache = false; 

let extractor = null;

// Fonction de nettoyage (minuscule, sans accents)
function normalize(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

self.addEventListener('message', async (event) => {
    const { type, data } = event.data;

    if (type === 'init') {
        if (!extractor) {
            // On reprend le modèle multilingue
            extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');
        }
        self.postMessage({ status: 'ready' });
    } 
    
    else if (type === 'search') {
        const { query, documents } = data;
        
        // 1. Préparation de la requête utilisateur
        // On garde uniquement les vrais mots de plus de 2 lettres
        const cleanQuery = normalize(query);
        const queryWords = cleanQuery.split(/[\s,.;:!?]+/).filter(w => w.length > 2);

        // 2. Calcul vectoriel (IA) pour avoir une base de tri
        const queryOutput = await extractor(query, { pooling: 'mean', normalize: true });
        const queryVec = queryOutput.data;

        const results = [];

        for (const doc of documents) {
            // A. Score IA (Vectoriel) - Entre 0 et 1
            const docOutput = await extractor(doc.text, { pooling: 'mean', normalize: true });
            const docVec = docOutput.data;
            
            let vectorScore = 0;
            for (let i = 0; i < queryVec.length; i++) {
                vectorScore += queryVec[i] * docVec[i];
            }

            // B. Score Mots-Clés (Compteur précis)
            // On compte COMBIEN de mots de la requête sont dans le texte du document
            let matchCount = 0;
            const docTextClean = normalize(doc.text);

            for (const word of queryWords) {
                if (docTextClean.includes(word)) {
                    matchCount++;
                }
            }

            // C. SCORE FINAL
            // La logique est simple : 
            // - Chaque mot trouvé vaut 10 points.
            // - L'IA sert juste de virgule pour départager (0.xxxx).
            // Ex: Mot trouvé (1) + IA(0.4) = Score 1.4
            // Ex: Aucun mot (0) + IA(0.4) = Score 0.4
            // Le document avec le mot-clé gagnera TOUJOURS.
            
            let finalScore = matchCount + (vectorScore * 0.1);

            results.push({ ...doc, score: finalScore });
        }

        // Tri : Les plus gros scores d'abord
        results.sort((a, b) => b.score - a.score);

        // On renvoie les résultats (on normalise le score affiché à 99% si c'est un match mot-clé pour faire joli)
        const output = results.slice(0, 3).map(r => ({
            ...r,
            score: r.score >= 1 ? 0.99 : r.score // Si score >= 1, c'est un match parfait
        }));

        self.postMessage({ type: 'results', results: output });
    }
});