import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import HeroBanner from '../components/dashboard/HeroBanner';
import StatCard from '../components/dashboard/StatCard';
import ServiceCard from '../components/dashboard/ServiceCard';
import ActivityTracker from '../components/dashboard/ActivityTracker';
import SupportCard from '../components/dashboard/SupportCard';
import { DOCUMENT_TYPES } from '../lib/documentTypes';
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
                title={DOCUMENT_TYPES.CNI.label}
                documentType={DOCUMENT_TYPES.CNI.value}
                description={DOCUMENT_TYPES.CNI.description}
                note={DOCUMENT_TYPES.CNI.note}
              />
              <ServiceCard 
                iconType="passport"
                title={DOCUMENT_TYPES.PASSEPORT.label}
                documentType={DOCUMENT_TYPES.PASSEPORT.value}
                description={DOCUMENT_TYPES.PASSEPORT.description}
                note={DOCUMENT_TYPES.PASSEPORT.note}
              />
              <ServiceCard 
                iconType="birth"
                title={DOCUMENT_TYPES.NAISSANCE.label}
                documentType={DOCUMENT_TYPES.NAISSANCE.value}
                description={DOCUMENT_TYPES.NAISSANCE.description}
                note={DOCUMENT_TYPES.NAISSANCE.note}
              />
              <ServiceCard 
                iconType="driver"
                title={DOCUMENT_TYPES.PERMIS.label}
                documentType={DOCUMENT_TYPES.PERMIS.value}
                description={DOCUMENT_TYPES.PERMIS.description}
                note={DOCUMENT_TYPES.PERMIS.note}
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
