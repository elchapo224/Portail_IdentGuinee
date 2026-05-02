import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import HeroBanner from '../components/dashboard/HeroBanner';
import StatCard from '../components/dashboard/StatCard';
import ServiceCard from '../components/dashboard/ServiceCard';
import ActivityTracker from '../components/dashboard/ActivityTracker';
import SupportCard from '../components/dashboard/SupportCard';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="layout-wrapper">
      <Sidebar />
      
      <main className="main-content">
        <Header />
        
        <div className="dashboard-content animate-fade-in">
          <div className="hero-row animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <HeroBanner />
            <div className="stats-column">
              <StatCard 
                type="verify"
                title="100% Vérifié"
                description="Chaque demande est traitée via des systèmes biométriques sécurisés."
                color="white"
              />
              <StatCard 
                type="time"
                title="Moins de 48h"
                description="Délai de traitement moyen pour une demande de passeport standard."
                color="light-green"
              />
            </div>
          </div>

          <section className="services-section animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="section-header">
              <h3 className="section-title">Services Disponibles</h3>
              <a href="/services" className="see-all">Tout voir</a>
            </div>
            <div className="services-grid">
              <ServiceCard 
                iconType="identity"
                title="Carte d'Identité"
                documentType="Carte d'Identité"
                description="Nouvelle génération avec puce électronique sécurisée."
                note="À partir de 15,000 GNF"
              />
              <ServiceCard 
                iconType="passport"
                title="Passeport"
                documentType="Passeport"
                description="Document de voyage international conforme OACI."
                note="À partir de 500,000 GNF"
              />
              <ServiceCard 
                iconType="birth"
                title="Extrait de Naissance"
                documentType="Extrait de Naissance"
                description="Digitalisation de l'acte de naissance authentique."
                note="GRATUIT POUR -18 ANS"
              />
              <ServiceCard 
                iconType="driver"
                title="Permis de Conduire"
                documentType="Permis de Conduire"
                description="Renouvellement et duplication de titre sécurisé."
                note="EXAMEN & DOSSIER"
              />
            </div>
          </section>

          <div className="bottom-grid animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <ActivityTracker />
            <SupportCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
