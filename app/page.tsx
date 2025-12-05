"use client";
import { useState, useEffect, useRef } from 'react';
import { useAIAssistant } from '../hooks/useAIAssistant';
import database from '../data/knowledge.json';

export default function AssistantPage() {
  const { isReady, isLoading, results, search } = useAIAssistant();
  
  // Message d'accueil professionnel
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text_fr: "Bonjour. Je suis l'Assistant Numérique Universitaire (NIRD). Je suis connecté à la base de données des services publics et administratifs. Quelle est votre requête ?", 
      text_ar: "مرحباً. أنا المساعد الرقمي الجامعي (NIRD). أنا متصل بقاعدة بيانات الخدمات العامة والإدارية. ما هو طلبك؟" 
    }
  ]);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState('fr'); 
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (results.length > 0) {
      const bestMatch = results[0];
      
      // On affiche le résultat, quel que soit le score (car le worker filtre déjà)
      // On formate le score pour l'affichage académique
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text_fr: bestMatch.reponse_fr, 
        text_ar: bestMatch.reponse_ar,
        score: bestMatch.score,
        category: bestMatch.category,
        id: bestMatch.id
      }]);
    }
  }, [results]);

  const handleSend = () => {
    if (!input.trim() || !isReady) return;

    setMessages(prev => [...prev, { type: 'user', text: input }]);
    search(input, database);
    setInput('');
  };

  // --- STYLES (Configuration du Design System) ---
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f0f2f5', // Gris très clair "Admin"
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      color: '#1f2937'
    },
    header: {
      width: '100%',
      backgroundColor: '#1e3a8a', // Bleu Nuit "Université"
      color: 'white',
      padding: '15px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 10
    },
    headerContent: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: '600',
      letterSpacing: '0.5px'
    },
    statusBadge: {
      fontSize: '0.75rem',
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '4px 12px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    chatArea: {
      flex: 1,
      width: '100%',
      maxWidth: '800px',
      padding: '20px',
      paddingBottom: '100px', // Espace pour la barre du bas
      overflowY: 'auto'
    },
    messageRow: (isUser) => ({
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '20px'
    }),
    messageBubble: (isUser) => ({
      maxWidth: '80%',
      padding: '16px',
      borderRadius: '12px',
      borderTopLeftRadius: isUser ? '12px' : '2px',
      borderTopRightRadius: isUser ? '2px' : '12px',
      backgroundColor: isUser ? '#2563eb' : 'white', // Bleu roi pour user, Blanc pour bot
      color: isUser ? 'white' : '#1f2937',
      boxShadow: isUser ? '0 2px 4px rgba(37, 99, 235, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: lang === 'ar' && !isUser ? 'right' : 'left',
      lineHeight: '1.6'
    }),
    metaData: {
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    sourceBadge: {
      backgroundColor: '#eff6ff',
      color: '#1d4ed8',
      padding: '2px 8px',
      borderRadius: '4px',
      fontWeight: '600',
      textTransform: 'uppercase',
      fontSize: '0.7rem'
    },
    inputArea: {
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)'
    },
    inputContainer: {
      width: '100%',
      maxWidth: '800px',
      display: 'flex',
      gap: '12px'
    },
    textInput: {
      flex: 1,
      padding: '14px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      backgroundColor: '#f9fafb', // Gris très clair pour le fond
      color: '#000000',           // <--- ICI : NOIR POUR QUE CE SOIT VISIBLE
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.2s',
      textAlign: lang === 'ar' ? 'right' : 'left'
    },
    sendButton: {
      backgroundColor: isReady ? '#1e3a8a' : '#9ca3af',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0 24px',
      fontWeight: '600',
      cursor: isReady ? 'pointer' : 'not-allowed',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER ACADÉMIQUE */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '28px' }}>🏛️</div>
            <div>
              <div style={styles.title}>PORTAIL NIRD</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Guichet Numérique & Services Publics</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
            <div style={styles.statusBadge}>
              <span style={{ 
                height: '8px', width: '8px', borderRadius: '50%', 
                backgroundColor: isReady ? '#4ade80' : '#facc15' 
              }}></span>
              {isReady ? 'SYSTÈME ONLINE' : 'CHARGEMENT...'}
            </div>
            <button 
              onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
              style={{ 
                background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', 
                color: 'white', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'
              }}
            >
              {lang === 'fr' ? 'Interface : Arabe' : 'Interface : Français'}
            </button>
          </div>
        </div>
      </header>

      {/* ZONE DE CHAT */}
      <div style={styles.chatArea}>
        {messages.map((msg, idx) => (
          <div key={idx} style={styles.messageRow(msg.type === 'user')}>
            
            {/* Avatar Bot */}
            {msg.type === 'bot' && (
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                backgroundColor: '#1e3a8a', color: 'white', 
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                marginRight: '10px', marginTop: '5px', fontSize: '14px'
              }}>IA</div>
            )}

            <div style={styles.messageBubble(msg.type === 'user')}>
              {msg.type === 'user' ? (
                msg.text
              ) : (
                <>
                  <div style={{ fontWeight: '500', marginBottom: '8px' }}>
                     {lang === 'fr' ? msg.text_fr : msg.text_ar}
                  </div>
                  
                  {/* Footer Académique du message */}
                  {msg.score && (
                    <div style={styles.metaData}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Réf:</span>
                        <span style={styles.sourceBadge}>{msg.category}</span>
                      </div>
                      <div title="Score de similarité vectorielle + boosting sémantique">
                        Indice de Pertinence : <strong>{(msg.score * 100).toFixed(1)}%</strong>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* BARRE DE SAISIE CORRIGÉE */}
      <div style={styles.inputArea}>
        <div style={styles.inputContainer}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={lang === 'fr' ? "Rechercher une procédure (ex: Passeport, FST, Linux)..." : "ابحث عن إجراء (مثل: جواز سفر ، FST ، Linux)..."}
            disabled={!isReady}
            style={styles.textInput} 
          />
          <button 
            onClick={handleSend}
            disabled={!isReady}
            style={styles.sendButton}
          >
            {lang === 'fr' ? 'RECHERCHER' : 'بحث'}
          </button>
        </div>
      </div>
    </div>
  );
}