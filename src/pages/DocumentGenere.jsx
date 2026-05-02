import React from 'react';
import { ChevronRight, Share2, Download, Shield, Info, CheckCircle, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import './DocumentGenere.css';

const DocumentGenere = () => {
  const { user } = useAuth();

  return (
    <div className="layout-wrapper">
      <Sidebar />
      <main className="main-content">
        <Header />
        
        <div className="doc-page-content animate-fade-in">
          <div className="doc-header-section animate-slide-up">
            <div className="doc-header-left">
              <nav className="breadcrumbs">
                <span>MES DOCUMENTS</span> <ChevronRight size={14} />
                <span className="active">ATTESTATION D'IDENTITÉ</span>
              </nav>
              <h1 className="doc-title">Votre Document est Prêt</h1>
              <p className="doc-subtitle">Document officiel généré et sécurisé par les services de l'État.</p>
            </div>
            <div className="doc-header-actions">
              <button className="btn-secondary"><Share2 size={18} /> Partager</button>
              <button className="btn-primary-doc"><Download size={18} /> Télécharger le document</button>
            </div>
          </div>

          <div className="doc-grid animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Colonne Principale - Le Document */}
            <div className="document-container">
              <div className="official-document">
                <div className="doc-top-bar"></div>
                
                <div className="doc-republic-header">
                  <div className="republic-left">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Coat_of_arms_of_Guinea.svg/200px-Coat_of_arms_of_Guinea.svg.png" alt="Armoiries" className="armoiries-img" />
                    <div>
                      <h3 className="rep-title">RÉPUBLIQUE DE GUINÉE</h3>
                      <p className="rep-motto">TRAVAIL - JUSTICE - SOLIDARITÉ</p>
                    </div>
                  </div>
                  <div className="republic-right">
                    <h3 className="card-type">CARTE NATIONALE D'IDENTITÉ BIOMÉTRIQUE</h3>
                    <p className="card-id">N° ID: {user?.matricule}</p>
                  </div>
                </div>

                <div className="doc-body">
                  <div className="doc-photo-col">
                    <img src={user?.avatar} alt="Photo ID" className="id-photo" />
                    <div className="signature-area">
                      <p className="signature-label">SIGNATURE</p>
                      <p className="signature-text">{user?.prenom.charAt(0)}. {user?.nom}</p>
                    </div>
                  </div>
                  
                  <div className="doc-info-col">
                    <div className="info-group">
                      <label>NOM / SURNAME</label>
                      <p className="info-val uppercase">{user?.nom}</p>
                    </div>
                    <div className="info-group">
                      <label>PRÉNOMS / GIVEN NAMES</label>
                      <p className="info-val">{user?.prenom}</p>
                    </div>
                    <div className="info-row-2">
                      <div className="info-group">
                        <label>SEXE / SEX</label>
                        <p className="info-val">F</p>
                      </div>
                      <div className="info-group">
                        <label>TAILLE / HEIGHT</label>
                        <p className="info-val">1.72m</p>
                      </div>
                    </div>
                    <div className="info-group">
                      <label>DATE & LIEU DE NAISSANCE / DATE & PLACE OF BIRTH</label>
                      <p className="info-val">12.05.1992 - Conakry</p>
                    </div>
                    <div className="info-group">
                      <label>DATE D'ÉMISSION / DATE OF ISSUE</label>
                      <p className="info-val">24.10.2023</p>
                    </div>
                  </div>

                  <div className="doc-qr-col">
                    <div className="qr-wrapper">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GN-ID-VALIDATION-CHAIN" alt="QR Code" />
                    </div>
                    <div className="blockchain-badge">
                      <Shield size={12} /> VÉRIFIÉ BLOCKCHAIN
                    </div>
                  </div>
                </div>

                <div className="doc-footer">
                  <div className="signature-stamp">
                    <CheckCircle size={16} color="#006D44" />
                    <div className="stamp-text">
                      <p className="stamp-label">SIGNÉ ÉLECTRONIQUEMENT</p>
                      <p className="stamp-ministry">Ministère de l'Administration du Territoire</p>
                    </div>
                  </div>
                  <div className="generation-timestamp">
                    Généré le 24 Octobre 2026 à 14:32:01
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Droite */}
            <aside className="doc-sidebar">
              <div className="sidebar-card details-card">
                <h3>Détails du Document</h3>
                <ul className="details-list">
                  <li>
                    <span className="det-label">Type</span>
                    <span className="det-val">Attestation d'Identité</span>
                  </li>
                  <li>
                    <span className="det-label">Format</span>
                    <span className="det-val">PDF / Digital Wallet</span>
                  </li>
                  <li>
                    <span className="det-label">Poids</span>
                    <span className="det-val">1.2 MB</span>
                  </li>
                  <li>
                    <span className="det-label">Expiration</span>
                    <span className="det-val">24 Oct. 2031</span>
                  </li>
                </ul>
                <div className="info-alert">
                  <Info size={16} />
                  <p>Ce document est protégé par un filigrane numérique et peut être vérifié à tout moment via l'application mobile IdentiGuinée.</p>
                </div>
              </div>

              <div className="sidebar-card security-card">
                <Shield size={28} className="sec-icon" />
                <h3>Sécurité de Haut Niveau</h3>
                <p>Votre document utilise le standard GN-SEC-V3 avec cryptage AES-256 pour garantir son intégrité totale.</p>
                <a href="#" className="sec-link">En savoir plus sur la sécurité</a>
              </div>

              <div className="sidebar-card history-card">
                <h3>Historique</h3>
                <div className="timeline">
                  <div className="timeline-item active">
                    <div className="timeline-icon success"><CheckCircle size={14} /></div>
                    <div className="timeline-content">
                      <p className="tl-title">Document généré</p>
                      <p className="tl-time">Aujourd'hui, 14:32</p>
                    </div>
                  </div>
                  <div className="timeline-item active">
                    <div className="timeline-icon success"><CheckCircle size={14} /></div>
                    <div className="timeline-content">
                      <p className="tl-title">Validation biométrique</p>
                      <p className="tl-time">Aujourd'hui, 14:28</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon"><CheckCircle size={14} /></div>
                    <div className="timeline-content">
                      <p className="tl-title">Demande soumise</p>
                      <p className="tl-time">Hier, 09:15</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="wallet-card">
                <div className="wallet-icon-wrap"><Smartphone size={24} /></div>
                <div className="wallet-text">
                  <h4>Emportez vos documents partout</h4>
                  <p>Ajoutez ce certificat à votre portefeuille mobile IdentiGuinée.</p>
                </div>
                <button className="btn-wallet">Ajouter au Wallet</button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentGenere;
