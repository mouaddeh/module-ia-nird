import { useState, useEffect, useRef } from 'react';

export function useAIAssistant() {
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [results, setResults] = useState([]);
    const workerRef = useRef(null);

    useEffect(() => {
        // L'astuce est ici : on ajoute un nombre aléatoire "?v=" à la fin
        // Cela force le navigateur à télécharger le NOUVEAU code à chaque fois
        const timestamp = Date.now(); 
        workerRef.current = new Worker(`/ai.worker.js?v=${timestamp}`, { type: 'module' });

        workerRef.current.onmessage = (event) => {
            const { status, type, results: searchResults } = event.data;

            if (status === 'ready') {
                setIsReady(true);
                setIsLoading(false);
                console.log("✅ Cerveau IA rechargé et prêt !");
            } else if (type === 'results') {
                setResults(searchResults);
            }
        };

        workerRef.current.postMessage({ type: 'init' });

        return () => workerRef.current.terminate();
    }, []);

    const search = (query, database) => {
        if (!workerRef.current || !isReady) return;
        workerRef.current.postMessage({ 
            type: 'search', 
            data: { query, documents: database } 
        });
    };

    return { isReady, isLoading, results, search };
}