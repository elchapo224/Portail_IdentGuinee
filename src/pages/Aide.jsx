import React, { useState } from 'react';
import { LifeBuoy, ChevronDown, ChevronUp, MessageSquare, Phone, Mail, Clock, CheckCircle, Search } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const faqs = [
  {
    q: "Comment obtenir mon extrait d'acte de naissance ?",
    a: "Connectez-vous au portail, cliquez sur 'Nouvelle demande', sélectionnez 'Extrait de Naissance', entrez votre numéro d'acte NaissanceChain (format GN-AAAA-NNNNN) et suivez les étapes. Le document est généré en moins de 2 minutes."
  },
  {
    q: "Où trouver mon numéro d'acte de naissance NaissanceChain ?",
    a: "Votre numéro d'acte est au format GN-AAAA-NNNNN (ex: GN-2005-00042). Il figure sur votre ancien acte de naissance physique ou vous pouvez le demander à la mairie de votre commune de naissance."
  },
  {
    q: "Combien coûte une demande de document ?",
    a: "Les frais varient selon le document : Extrait de naissance (gratuit pour les moins de 18 ans), Carte d'identité biométrique (gratuite depuis 2025), Passeport ordinaire (à partir de 500 000 GNF), Permis de conduire (selon catégorie)."
  },
  {
    q: "Mon document est-il valide légalement ?",
    a: "Oui. Chaque document généré via IdentiGuinée est certifié électroniquement par le Ministère de l'Administration du Territoire. Il intègre un QR code de vérification et un hash blockchain infalsifiable."
  },
  {
    q: "Combien de temps prend le traitement ?",
    a: "Grâce à NaissanceChain, le traitement prend moins de 30 secondes pour les vérifications automatiques. L'émission physique du document (passeport, permis) prend 7 à 14 jours ouvrables."
  },
  {
    q: "Comment vérifier l'authenticité d'un document IdentiGuinée ?",
    a: "Scannez le QR code présent sur le document avec n'importe quel lecteur QR. Il vous redirigera vers notre portail de vérification affichant les données enregistrées dans NaissanceChain."
  },
  {
    q: "Que faire si mes données dans NaissanceChain sont incorrectes ?",
    a: "Rendez-vous à la mairie de votre commune de naissance avec votre ancien acte physique et une pièce d'identité. Un officier d'état civil effectuera la correction dans le registre officiel."
  },
];

const Aide = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: 'agent', text: "Bonjour ! Je suis l'assistant IdentiGuinée. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setChatInput('');

    // Réponse automatique simulée
    setTimeout(() => {
      let reply = "Je transmets votre message à un agent disponible. Temps d'attente estimé : 5 minutes.";
      const lower = userMsg.toLowerCase();
      if (lower.includes('acte') || lower.includes('naissance')) {
        reply = "Pour votre acte de naissance, cliquez sur 'Nouvelle demande' et sélectionnez 'Extrait de Naissance'. Entrez votre numéro au format GN-AAAA-NNNNN.";
      } else if (lower.includes('passeport')) {
        reply = "Pour un passeport, rendez-vous dans 'Nouvelle demande' → 'Passeport'. Le délai de traitement physique est de 7 à 14 jours ouvrables.";
      } else if (lower.includes('carte') || lower.includes('identit')) {
        reply = "La carte d'identité biométrique est désormais gratuite. Cliquez sur 'Nouvelle demande' → 'Carte d'Identité'.";
      } else if (lower.includes('permis')) {
        reply = "Pour un permis de conduire, vous devez d'abord passer l'examen auprès de l'ANASER. Ensuite, faites votre demande via 'Nouvelle demande' → 'Permis de Conduire'.";
      }
      setChatMessages(prev => [...prev, { from: 'agent', text: reply }]);
    }, 1200);
  };

  return (
    <div className="layout-wrapper">
      <Sidebar />
      <main className="main-content">
        <Header />

        <div style={{ padding: '24px 32px', maxWidth: 900, margin: '0 auto' }} className="animate-fade-in">

          {/* Titre */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <LifeBuoy size={28} color="#006D44" />
              <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>Aide & Support</h1>
            </div>
            <p style={{ color: '#666', fontSize: 14 }}>
              Trouvez des réponses à vos questions ou contactez nos agents disponibles 24h/7j.
            </p>
          </div>

          {/* Statut des centres */}
          <div style={{
            background: '#f0fdf4', border: '1px solid #006D44', borderRadius: 12,
            padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32
          }}>
            <CheckCircle size={20} color="#006D44" />
            <div>
              <p style={{ fontWeight: 600, color: '#006D44', fontSize: 14 }}>Tous les centres sont opérationnels</p>
              <p style={{ color: '#555', fontSize: 12 }}>Centre de Conakry Kaloum ouvert jusqu'à 20h · Kindia · Labé · Kankan · Nzérékoré</p>
            </div>
          </div>

          {/* Contacts rapides */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
            {[
              { icon: <Phone size={22} color="#006D44" />, label: 'Téléphone', val: '+224 655 00 00 00', sub: 'Lun-Sam 8h-20h' },
              { icon: <Mail size={22} color="#006D44" />, label: 'Email', val: 'support@identiguinee.gov.gn', sub: 'Réponse sous 24h' },
              { icon: <Clock size={22} color="#006D44" />, label: 'Horaires', val: 'Lun - Sam', sub: '8h00 - 20h00' },
            ].map((c, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12,
                padding: '18px 16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <div style={{ marginBottom: 8 }}>{c.icon}</div>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#333' }}>{c.label}</p>
                <p style={{ fontSize: 12, color: '#006D44', fontWeight: 600, margin: '4px 0' }}>{c.val}</p>
                <p style={{ fontSize: 11, color: '#888' }}>{c.sub}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
              Questions fréquentes
            </h2>

            {/* Recherche FAQ */}
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
              <input
                type="text"
                placeholder="Rechercher dans la FAQ..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px 10px 40px',
                  border: '1px solid #ddd', borderRadius: 10,
                  fontSize: 14, outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredFaqs.map((faq, i) => (
                <div key={i} style={{
                  border: '1px solid #e8e8e8', borderRadius: 10,
                  overflow: 'hidden', background: '#fff',
                  boxShadow: openFaq === i ? '0 4px 12px rgba(0,109,68,0.1)' : 'none'
                }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', padding: '14px 18px',
                      background: openFaq === i ? '#f0fdf4' : '#fff',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      fontWeight: 600, fontSize: 14, color: '#1a1a1a'
                    }}
                  >
                    {faq.q}
                    {openFaq === i ? <ChevronUp size={18} color="#006D44" /> : <ChevronDown size={18} color="#888" />}
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 18px 16px', fontSize: 13, color: '#555', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
              {filteredFaqs.length === 0 && (
                <p style={{ color: '#888', fontSize: 14, textAlign: 'center', padding: 20 }}>
                  Aucun résultat pour "{searchQuery}". Essayez d'autres termes ou contactez un agent.
                </p>
              )}
            </div>
          </div>

          {/* Bouton lancer le chat */}
          <div style={{
            background: 'linear-gradient(135deg, #006D44, #00a86b)',
            borderRadius: 14, padding: '24px 28px', color: '#fff',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Vous n'avez pas trouvé votre réponse ?</h3>
              <p style={{ fontSize: 13, opacity: 0.85 }}>Un agent est disponible maintenant pour vous aider en direct.</p>
            </div>
            <button
              onClick={() => setChatOpen(true)}
              style={{
                background: '#fff', color: '#006D44', fontWeight: 700,
                border: 'none', borderRadius: 10, padding: '12px 24px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14
              }}
            >
              <MessageSquare size={18} /> Lancer le Chat
            </button>
          </div>
        </div>

        {/* ── Chat flottant ── */}
        {chatOpen && (
          <div style={{
            position: 'fixed', bottom: 24, right: 24, width: 360,
            background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            display: 'flex', flexDirection: 'column', zIndex: 9999, overflow: 'hidden'
          }}>
            {/* Header chat */}
            <div style={{ background: '#006D44', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={18} color="#006D44" />
                </div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>Support IdentiGuinée</p>
                  <p style={{ color: '#b8ffd9', fontSize: 11, margin: 0 }}>● En ligne maintenant</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>✕</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, maxHeight: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '80%', padding: '10px 14px', borderRadius: 12,
                    background: msg.from === 'user' ? '#006D44' : '#f0f0f0',
                    color: msg.from === 'user' ? '#fff' : '#333',
                    fontSize: 13, lineHeight: 1.5
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '10px 12px', borderTop: '1px solid #eee', display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Tapez votre message..."
                style={{
                  flex: 1, padding: '10px 14px', border: '1px solid #ddd',
                  borderRadius: 10, fontSize: 13, outline: 'none'
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  background: '#006D44', color: '#fff', border: 'none',
                  borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 13
                }}
              >
                Envoyer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Aide;
