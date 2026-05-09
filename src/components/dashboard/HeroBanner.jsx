import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
import './HeroBanner.css';

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-banner">
      <div className="hero-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ display: 'flex', height: 16, width: 28, borderRadius: 3, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.3)', flexShrink: 0 }}>
            <div style={{ flex: 1, background: '#CE1126' }}/>
            <div style={{ flex: 1, background: '#FCD116' }}/>
            <div style={{ flex: 1, background: '#009A44' }}/>
          </div>
          <span className="hero-label" style={{ margin: 0 }}>RÉPUBLIQUE DE GUINÉE — SERVICE NATIONAL DE L'ÉTAT CIVIL</span>
        </div>
        <h2 className="hero-title">
          Obtenez votre document d’identité sans corruption.
        </h2>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, marginTop: -10 }}>
          Travail · Justice · Solidarité
        </p>
        <p className="hero-description">
          Un service rapide, automatique et sans intermédiaire pour tous les citoyens guinéens, où que vous soyez.
        </p>
        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => navigate('/nouvelle-demande')}
          >
            Faire une demande <ArrowRight size={18} />
          </button>
          <button
            className="btn-outline"
            onClick={() => navigate('/suivi')}
          >
            Voir mes dossiers
          </button>
        </div>
      </div>
      <div className="hero-image-overlay"></div>
    </section>
  );
};

export default HeroBanner;
