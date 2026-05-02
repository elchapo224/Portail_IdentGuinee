import React from 'react';
import { ShieldCheck, Clock } from 'lucide-react';
import './StatCard.css';

const StatCard = ({ type, title, description, color }) => {
  const Icon = type === 'verify' ? ShieldCheck : Clock;

  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon-wrapper">
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-description">{description}</p>
      </div>
    </div>
  );
};

export default StatCard;
