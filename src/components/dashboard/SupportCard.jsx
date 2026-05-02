import React from 'react';
import { MessageSquare } from 'lucide-react';
import './SupportCard.css';

const SupportCard = () => {
  return (
    <div className="support-card">
      <h3 className="support-title">Besoin d'aide ?</h3>
      <p className="support-desc">
        Nos agents sont disponibles par chat 24/7 pour vous guider dans vos démarches administratives.
      </p>
      
      <div className="support-status-box">
        <p className="status-label">Dernière mise à jour :</p>
        <p className="status-text">
          Le centre de Conakry Kaloum est ouvert jusqu'à 20h cette semaine.
        </p>
      </div>

      <button className="chat-button">
        Lancer le Chat <MessageSquare size={18} />
      </button>
    </div>
  );
};

export default SupportCard;
