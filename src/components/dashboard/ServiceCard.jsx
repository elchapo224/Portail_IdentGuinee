import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, FileText, FileCheck, Car } from 'lucide-react';
import './ServiceCard.css';

const ServiceCard = ({ title, description, note, iconType, documentType, prix, delai, ministere }) => {
  const navigate = useNavigate();
  const icons = {
    identity: <CreditCard size={20} />,
    passport: <FileText size={20} />,
    birth: <FileCheck size={20} />,
    driver: <Car size={20} />
  };

  return (
    <div
      className="service-card"
      onClick={() => navigate('/nouvelle-demande', { state: { documentType } })}
      style={{ cursor: 'pointer' }}
    >
      <div className="service-icon">
        {icons[iconType]}
      </div>
      <h4 className="service-title">{title}</h4>
      <p className="service-desc">{description}</p>
      {(prix || delai) && (
        <div style={{ display: 'flex', gap: 8, margin: '8px 0', flexWrap: 'wrap' }}>
          {prix && (
            <span style={{ fontSize: 10, fontWeight: 800, color: '#006D44', background: '#e7f6f0', padding: '2px 8px', borderRadius: 20 }}>
              💰 {prix}
            </span>
          )}
          {delai && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#555', background: '#f3f4f6', padding: '2px 8px', borderRadius: 20 }}>
              ⏱ {delai}
            </span>
          )}
        </div>
      )}
      <p className="service-note">{note}</p>
    </div>
  );
};

export default ServiceCard;
