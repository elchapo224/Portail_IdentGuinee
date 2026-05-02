import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, FileText, FileCheck, Car } from 'lucide-react';
import './ServiceCard.css';

const ServiceCard = ({ title, description, note, iconType, documentType }) => {
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
      <p className="service-note">{note}</p>
    </div>
  );
};

export default ServiceCard;
