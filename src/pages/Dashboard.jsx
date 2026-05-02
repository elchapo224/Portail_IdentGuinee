import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import HeroBanner from '../components/dashboard/HeroBanner';
import StatCard from '../components/dashboard/StatCard';
import ServiceCard from '../components/dashboard/ServiceCard';
import ActivityTracker from '../components/dashboard/ActivityTracker';
import SupportCard from '../components/dashboard/SupportCard';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './Dashboard.css';

const Dashboard = () => {
  const { user, updateUser } = useAuth();

  // Synchronisation agressive avec NaissanceChain
  React.useEffect(() => {
    const syncData = async () => {
      if (!user) return;

      // On cherche d'abord via l'ID d'acte lié, sinon on tente via le nom/prénom pour la démo
      let searchId = user.id_acte_lie;
      
      if (!searchId) {
        console.log("Tentative de récupération de l'acte via l'identité...");
        const { data: findActe } = await supabase
          .from('naissancechain')
          .select('id_acte')
          .eq('nom', user.nom)
          .eq('prenom', user.prenom)
          .maybeSingle();
        
        if (findActe) {
          searchId = findActe.id_acte;
        }
      }

      if (searchId) {
        console.log("Synchronisation blockchain pour l'acte:", searchId);
        const { data: chainData } = await supabase
          .from('naissancechain')
          .select('*')
          .eq('id_acte', searchId)
          .maybeSingle();
        
        if (chainData) {
          // Normalisation de la date pour l'input type="date" (doit être YYYY-MM-DD)
          let formattedDate = chainData.date_naissance;
          if (formattedDate && formattedDate.includes('/')) {
            const parts = formattedDate.split('/');
            if (parts.length === 3) {
              formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
          }

          // On récupère aussi le téléphone depuis citoyens si possible
          const { data: citoyenFull } = await supabase
            .from('citoyens')
            .select('telephone')
            .eq('id', user.id)
            .single();

          // Mise à jour du contexte pour toute l'application
          updateUser({
            id_acte_lie: searchId,
            date_naissance: formattedDate,
            lieu_naissance: chainData.lieu_naissance,
            nom_pere: chainData.nom_pere,
            nom_mere: chainData.nom_mere,
            nom: chainData.nom,
            prenom: chainData.prenom,
            genre: chainData.genre,
            telephone: citoyenFull?.telephone || user.telephone
          });
          
          // Sauvegarde en base de données citoyens pour la persistance
          await supabase
            .from('citoyens')
            .update({
              id_acte_lie: searchId,
              date_naissance: formattedDate,
              lieu_naissance: chainData.lieu_naissance
            })
            .eq('id', user.id);
        }
      }
    };
    
    // On ne synchronise que si des données cruciales manquent
    if (user && (!user.date_naissance || !user.id_acte_lie)) {
      syncData();
    }
  }, [user, updateUser]);
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
