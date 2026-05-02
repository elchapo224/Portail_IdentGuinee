import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './HeroBanner.css';

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-banner">
      <div className="hero-content">
        <span className="hero-label">SERVICE NATIONAL DE L'ÉTAT CIVIL</span>
        <h2 className="hero-title">
          Obtenez votre document d’identité sans corruption.
        </h2>
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
