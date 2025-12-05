# 🤖 Module IA NIRD & Services Publics (Défi Mauritanie)

Assistant intelligent bilingue (Français/Arabe), Low-cost et Offline-first, développé pour la Nuit de l'Info 2025.

## 📋 Description
Ce module permet aux utilisateurs d'accéder à des informations administratives (Passeport, Carte grise, Santé...) et techniques (NIRD, Linux) via une interface de chat.
Il utilise une **IA embarquée dans le navigateur** (ONNX Runtime) et fonctionne sans connexion internet après le premier chargement.

## 🚀 Fonctionnalités Clés
- **Bilingue :** Compréhension et réponses en Français 🇫🇷 et Arabe 🇲🇷.
- **Offline-First :** Fonctionne sans serveur backend (Edge AI).
- **Recherche Hybride :** Combinaison de recherche vectorielle (Sémantique) et par mots-clés pour une précision maximale.
- **Low-Cost :** Modèle quantifié optimisé pour les faibles connexions.

## 🛠️ Pré-requis
- **Node.js** (version 18 ou supérieure) installé sur la machine.

## 📦 Installation

1. Décompressez le dossier du projet.
2. Ouvrez un terminal dans le dossier racine.
3. Installez les dépendances :
   ```bash
   npm install

Ouvrez votre navigateur sur : http://localhost:3000

Note importante pour le mode Offline : Lors du premier lancement, attendez que le badge en haut devienne vert ("SYSTÈME ONLINE"). Cela signifie que le modèle IA a été téléchargé. Ensuite, vous pouvez couper votre connexion Internet pour tester la robustesse du système.

📂 Structure du Projet
app/page.tsx : Interface utilisateur (Chatbot Académique).

public/ai.worker.js : Le "Cerveau" de l'IA (Web Worker + Transformers.js).

src/data/knowledge.json : Base de connaissances (Questions/Réponses).

src/hooks/useAIAssistant.js : Hook React pour la gestion du Worker.

🔧 Personnalisation
Pour ajouter de nouvelles questions/réponses, modifiez simplement le fichier src/data/knowledge.json. L'IA prendra en compte les changements instantanément (après rechargement de la page).

Équipe : [LE SHIFT DE NUIT] Nuit de l'Info 2025


