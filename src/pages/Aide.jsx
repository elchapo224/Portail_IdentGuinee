import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LifeBuoy, Mail, Phone, MessageSquare, BookOpen, Clock, ShieldCheck } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import './Aide.css';

const Aide = () => {
  const openChatSupport = () => {
    window.location.href = 'mailto:support@identiguinee.gov.gn?subject=Demande%20de%20support%20IdentiGuin%C3%A9e';
  };

  return (
    <div className="layout-wrapper">
      <Sidebar />
      <main className="main-content">
        <Header />

        <div className="help-page-content animate-fade-in">
          <nav className="breadcrumbs animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span>TABLEAU DE BORD</span> <ChevronRight size={14} />
            <span className="active">AIDE & SUPPORT</span>
          </nav>

          <div className="help-header animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="page-title">Besoin d'aide ? Nous sommes là pour vous.</h2>
            <p className="page-subtitle">
              Retrouvez ici toutes les ressources, canaux de contact et réponses rapides pour avancer dans vos démarches citoyennes.
              Notre équipe support vous accompagne à chaque étape.
            </p>
          </div>

          <div className="help-top-grid animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <section className="help-main-card">
              <div className="section-header">
                <div className="icon-badge secondary"><LifeBuoy size={20} /></div>
                <div>
                  <h3 className="section-title">Support rapide</h3>
                  <p className="section-description">Choisissez la méthode qui vous convient le mieux pour obtenir une réponse rapide.</p>
                </div>
              </div>

              <div className="help-actions-grid">
                <div className="action-card">
                  <div className="action-icon"><Mail size={24} /></div>
                  <div className="action-content">
                    <h4>Envoyer un email</h4>
                    <p>Posez votre question et recevez une réponse en moins de 24h.</p>
                  </div>
                  <a href="mailto:support@identiguinee.gov.gn" className="btn-action-outline">
                    Contacter par email <ChevronRight size={16} />
                  </a>
                </div>

                <div className="action-card">
                  <div className="action-icon"><Phone size={24} /></div>
                  <div className="action-content">
                    <h4>Appeler le support</h4>
                    <p>Notre centre d’assistance téléphonique est disponible du lundi au vendredi.</p>
                  </div>
                  <a href="tel:+224622000000" className="btn-action-outline">
                    Appeler maintenant <ChevronRight size={16} />
                  </a>
                </div>

                <div className="action-card">
                  <div className="action-icon"><MessageSquare size={24} /></div>
                  <div className="action-content">
                    <h4>Discussion en ligne</h4>
                    <p>Discutez avec un conseiller pour vous aider à finaliser votre demande.</p>
                  </div>
                  <button type="button" onClick={openChatSupport} className="btn-action-primary">
                    Ouvrir le chat <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </section>

            <aside className="help-sidebar-card">
              <div className="contact-card">
                <div className="contact-badge"><ShieldCheck size={18} /></div>
                <h3>Support prioritaire</h3>
                <p>Tout problème technique ou question urgente est traité en priorité par notre équipe dédiée.</p>
                <div className="contact-info-row">
                  <div>
                    <span>Téléphone</span>
                    <p>+224 622 00 00 00</p>
                  </div>
                  <div>
                    <span>Email</span>
                    <p>support@identiguinee.gov.gn</p>
                  </div>
                </div>
                <a href="mailto:support@identiguinee.gov.gn" className="cta-button">Envoyer un message</a>
              </div>

              <div className="hours-card">
                <div className="hours-header">
                  <span><Clock size={18} /></span>
                  <h4>Horaires d'ouverture</h4>
                </div>
                <p>Du lundi au vendredi de 08h00 à 18h00.</p>
                <p>Samedi : 09h00 - 13h00</p>
                <p>Fermé le dimanche et les jours fériés.</p>
              </div>

              <div className="resource-card">
                <div className="resource-icon"><BookOpen size={18} /></div>
                <h4>Guides utiles</h4>
                <ul>
                  <li><Link to="/nouvelle-demande">Comment déposer une nouvelle demande</Link></li>
                  <li><Link to="/documents">Accéder à mes documents</Link></li>
                  <li><Link to="/suivi">Suivre une demande</Link></li>
                </ul>
              </div>
            </aside>
          </div>

          <section className="faq-section animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="section-header">
              <div className="icon-badge"><LifeBuoy size={20} /></div>
              <div>
                <h3 className="section-title">Questions fréquentes</h3>
                <p className="section-description">Trouvez une réponse immédiate aux questions les plus courantes.</p>
              </div>
            </div>

            <div className="faq-list">
              <div className="faq-item">
                <h4>Comment puis-je modifier mes informations personnelles ?</h4>
                <p>Rendez-vous dans la page Paramètres, puis mettez à jour votre profil. Les modifications sont sauvegardées automatiquement.</p>
              </div>
              <div className="faq-item">
                <h4>Je n'ai pas reçu mon code de validation par email.</h4>
                <p>Vérifiez votre dossier spam. Si le problème persiste, contactez le support par email ou téléphone.</p>
              </div>
              <div className="faq-item">
                <h4>Comment suivre l'état de ma demande ?</h4>
                <p>La page Suivi des demandes affiche le statut en temps réel de tous vos dossiers.</p>
              </div>
              <div className="faq-item">
                <h4>Quelles pièces fournir pour une nouvelle demande ?</h4>
                <p>Consultez la page Nouvelle demande ; chaque service liste les pièces justificatives requises.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Aide;
