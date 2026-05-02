import React, { useEffect, useState, Component } from 'react';
import { ChevronRight, Share2, Download, Shield, Info, CheckCircle, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { supabase } from '../lib/supabase';
import './DocumentGenere.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error.toString() };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
          <h2>Erreur d'affichage du document</h2>
          <p>{this.state.errorMsg}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const DocumentGenereContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const documentId = location.state?.documentId;
  const [docData, setDocData] = useState(null);
  const [citoyenData, setCitoyenData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Déterminer le type de document (Passeport ou CNI)
  const [type_document, setTypeDocument] = useState(location.state?.type_document || "Carte d'Identité");

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      // Charger les détails du citoyen
      const { data: citoyen } = await supabase
        .from('citoyens')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setCitoyenData(citoyen);

      // Charger le document généré
      let docQuery = supabase.from('documents_certifies').select('*').eq('citoyen_id', user.id);
      
      if (documentId) {
        docQuery = docQuery.eq('id', documentId);
      } else {
        docQuery = docQuery.order('date_generation', { ascending: false }).limit(1);
      }

      const { data: docs } = await docQuery;
      
      if (docs && docs.length > 0) {
        const doc = docs[0];
        setDocData(doc);
        
        // Si le type n'est pas passé en state, on le déduit du statut_demande stocké en base
        if (!location.state?.type_document && doc.statut_demande) {
          if (doc.statut_demande.startsWith('P:')) setTypeDocument('Passeport');
          if (doc.statut_demande.startsWith('C:')) setTypeDocument('Carte d\'Identité');
        }
      }
      
      setLoading(false);
    };

    loadData();
  }, [user?.id, documentId, location.state?.type_document]);

  const getVerificationUrl = () => {
    return `${window.location.origin}/verify/${docData?.id}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Aujourd\'hui';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Aujourd\'hui';
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'À l\'instant';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'À l\'instant';
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + ' à ' + date.toLocaleTimeString('fr-FR');
  };

  if (loading) {
    return (
      <div className="layout-wrapper">
        <Sidebar />
        <main className="main-content">
          <Header />
          <div style={{ padding: '40px', textAlign: 'center' }}>Chargement du document...</div>
        </main>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    const element = document.getElementById('official-doc-container');
    if (!element || !window.html2canvas || !window.jspdf) {
      alert("Préparation du moteur PDF... Réessayez dans une seconde.");
      return;
    }

    try {
      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      
      // Calcul des dimensions en mm (1px approx 0.264583mm)
      const imgWidth = canvas.width * 0.264583 / 2; // /2 car scale=2
      const imgHeight = canvas.height * 0.264583 / 2;
      
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [imgWidth, imgHeight]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`IdentiGuinee_${user?.nom || 'Document'}.pdf`);
    } catch (err) {
      console.error("PDF Download error:", err);
    }
  };

  const handleDownloadPNG = async () => {
    const element = document.getElementById('official-doc-container');
    if (!element || !window.html2canvas) {
      alert("La capture d'image n'est pas encore prête. Veuillez réessayer dans un instant.");
      return;
    }
    
    try {
      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `IdentiGuinee_${user?.nom || 'Document'}.png`;
      link.click();
    } catch (err) {
      console.error("PNG Download error:", err);
    }
  };

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
              <button className="btn-secondary" onClick={handleDownloadPNG}>
                <Smartphone size={18} /> Télécharger (PNG)
              </button>
              <button className="btn-primary-doc" onClick={handleDownloadPDF}>
                <Download size={18} /> Télécharger (PDF)
              </button>
            </div>
          </div>

          <div className="doc-grid animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Colonne Principale - Le Document */}
            <div className="document-container" id="official-doc-container">
              {type_document === 'Passeport' ? (
                <>
                  {/* PASSEPORT RECTO */}
                  <div className="official-document doc-passport-recto">
                    <div className="passport-top-header">
                      <div className="rep-left">
                        <h3 className="rep-title">RÉPUBLIQUE DE GUINÉE</h3>
                        <p className="card-type">PASSEPORT / PASSPORT</p>
                      </div>
                      <div className="rep-right" style={{ display: 'flex', gap: '24px' }}>
                        <div className="info-mini">
                          <label>Type / Type</label>
                          <p>PO</p>
                        </div>
                        <div className="info-mini">
                          <label>Code du Pays / Country Code</label>
                          <p>GIN</p>
                        </div>
                        <div className="info-mini">
                          <label>Passeport No / Passport No</label>
                          <p>{docData?.id ? `GN${String(docData.id).padStart(7, '0')}` : '000000000'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="doc-body" style={{ marginTop: '20px' }}>
                      <div className="doc-photo-col">
                        <img src={user?.avatar} alt="Photo ID" className="id-photo" style={{ height: '160px' }} />
                        <div className="ghost-photo" style={{ opacity: 0.3, width: '60px', height: '80px', borderRadius: '8px', overflow: 'hidden', margin: '0 auto' }}>
                           <img src={user?.avatar} alt="Ghost" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                      
                      <div className="doc-info-col passport-info">
                        <div className="info-group">
                          <label>Nom / Surname</label>
                          <p className="info-val uppercase">{user?.nom}</p>
                        </div>
                        <div className="info-group">
                          <label>Prénoms / Given Names</label>
                          <p className="info-val uppercase">{user?.prenom}</p>
                        </div>
                        <div className="info-group">
                          <label>Nationalité / Nationality</label>
                          <p className="info-val">GUINÉENNE</p>
                        </div>
                        
                        <div className="info-row-passport">
                          <div className="info-group">
                            <label>Sexe / Sex</label>
                            <p className="info-val">{citoyenData?.genre || 'F'}</p>
                          </div>
                          <div className="info-group">
                            <label>Numéro Personnel / Personal No</label>
                            <p className="info-val">{citoyenData?.id ? `50010301${String(citoyenData.id).padStart(7, '0')}` : '500103010001030'}</p>
                          </div>
                        </div>

                        <div className="info-row-passport">
                          <div className="info-group">
                            <label>Date de Naissance / Date of Birth</label>
                            <p className="info-val">{formatDate(citoyenData?.date_naissance)}</p>
                          </div>
                          <div className="info-group">
                            <label>Lieu de Naissance / Place of Birth</label>
                            <p className="info-val uppercase">{citoyenData?.lieu_naissance || 'DALABA'}</p>
                          </div>
                        </div>

                        <div className="info-row-passport">
                          <div className="info-group">
                            <label>Date de Délivrance / Date of Issue</label>
                            <p className="info-val">{formatDate(docData?.date_generation || docData?.created_at)}</p>
                          </div>
                          <div className="info-group">
                            <label>Autorité / Authority</label>
                            <p className="info-val">DCPAF</p>
                          </div>
                        </div>

                        <div className="info-group">
                          <label>Date d'Expiration / Date of Expiry</label>
                          <p className="info-val">{
                            docData?.date_generation ? 
                              formatDate(new Date(new Date(docData.date_generation).setFullYear(new Date(docData.date_generation).getFullYear() + 5))) :
                              '01 AOÛT 2029'
                          }</p>
                        </div>
                      </div>
                    </div>

                    <div className="mrz-code passport-mrz">
                      P&lt;GIN{(user?.nom || 'SYLLA').toUpperCase()}&lt;&lt;{(user?.prenom || 'IBRAHIMA<SORY').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
                      0000000008GIN7605024M23080105001030100013006
                    </div>
                  </div>

                  {/* PASSEPORT VERSO (Description Page) */}
                  <div className="official-document doc-passport-verso" style={{ marginTop: '32px' }}>
                    <div className="verso-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '24px 32px' }}>
                       <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1A1A1A', textAlign: 'center', letterSpacing: '2px' }}>SIGNALEMENT DESCRIPTION</h3>
                    </div>
                    <div className="doc-body" style={{ padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                       <div className="info-line">
                          <label>Fonction / Function</label>
                          <p className="info-val-line uppercase">{citoyenData?.profession || '...'}</p>
                       </div>
                       <div className="info-line">
                          <label>Taille / Height</label>
                          <p className="info-val-line">
                             {citoyenData?.taille ? 
                                (citoyenData.taille.includes('.') || citoyenData.taille.includes(',') ? 
                                   `${Math.round(parseFloat(citoyenData.taille.replace(',', '.')) * 100)} cm` : 
                                   `${citoyenData.taille} cm`) : 
                                '...'}
                          </p>
                       </div>
                       <div className="info-line">
                          <label>Signes Particuliers / Distinguishing Marks</label>
                          <p className="info-val-line uppercase">{citoyenData?.signes_particuliers || 'NÉANT'}</p>
                       </div>
                       <div className="info-line" style={{ marginTop: '12px' }}>
                          <label>Domicile / Home Address</label>
                          <p className="info-val-line uppercase" style={{ fontSize: '14px', lineHeight: '1.6' }}>{citoyenData?.domicile || '...'}</p>
                       </div>
                       
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '30px' }}>
                          <div className="holder-signature" style={{ flex: 1, borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                             <label style={{ fontSize: '10px', color: '#666' }}>Signature du titulaire / Holder's Signature</label>
                             <div style={{ fontFamily: "'Brush Script MT', cursive", fontSize: '32px', marginTop: '8px' }}>
                                {user?.prenom} {user?.nom}
                             </div>
                          </div>
                          <div className="passport-verify-qr" style={{ textAlign: 'center' }}>
                             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(getVerificationUrl())}`} alt="QR Code" style={{ border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                             <p style={{ fontSize: '8px', color: '#006D44', fontWeight: 'bold', marginTop: '4px' }}>VERIFY AUTHENTICITY</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* RECTO CNI */}
                  <div className="official-document doc-recto">
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
                        <h3 className="card-type" style={{ textTransform: 'uppercase' }}>{type_document} BIOMÉTRIQUE</h3>
                        <p className="card-id">N° ID: {citoyenData?.id || user?.id}</p>
                      </div>
                    </div>

                    <div className="doc-body">
                      <div className="doc-photo-col">
                        <img src={user?.avatar} alt="Photo ID" className="id-photo" />
                        <div className="signature-area">
                          <p className="signature-label">SIGNATURE</p>
                          <p className="signature-text">{String(user?.prenom || '').charAt(0)}. {user?.nom}</p>
                        </div>
                      </div>
                      
                      <div className="doc-info-col">
                        <div className="info-group">
                          <label>Nom / Surname</label>
                          <p className="info-val uppercase">{user?.nom}</p>
                        </div>
                        <div className="info-group">
                          <label>Prénom / First name</label>
                          <p className="info-val">{user?.prenom}</p>
                        </div>
                        <div className="info-group">
                          <label>Nationalité / Nationality</label>
                          <p className="info-val">GUINEENNE</p>
                        </div>
                        <div className="info-row-2">
                          <div className="info-group">
                            <label>Sexe / Sex</label>
                            <p className="info-val">{citoyenData?.genre || 'F'}</p>
                          </div>
                          <div className="info-group">
                            <label>Taille / Height</label>
                            <p className="info-val">{citoyenData?.taille ? `${citoyenData.taille} m` : '1,64 m'}</p>
                          </div>
                        </div>
                        <div className="info-group">
                          <label>Date de naissance / Date of birth</label>
                          <p className="info-val">{formatDate(citoyenData?.date_naissance)}</p>
                        </div>
                        <div className="info-row-2">
                          <div className="info-group">
                            <label>Date d'émission / Date of issuance</label>
                            <p className="info-val">{formatDate(docData?.date_generation || docData?.created_at)}</p>
                          </div>
                          <div className="info-group">
                            <label>Date d'expiration / Date of expiry</label>
                            <p className="info-val">{
                              docData?.date_generation ? 
                                formatDate(new Date(new Date(docData.date_generation).setFullYear(new Date(docData.date_generation).getFullYear() + 5))) :
                                '31 MAY 2029'
                            }</p>
                          </div>
                        </div>
                        <div className="info-group">
                          <label>Numéro d'identité / ID number</label>
                          <p className="info-val">{citoyenData?.id || user?.id}</p>
                        </div>
                        <div className="info-group">
                          <label>Lieu de délivrance / Place of issuance</label>
                          <p className="info-val">CONAKRY / M.S.P.C</p>
                        </div>
                      </div>

                      <div className="doc-qr-col">
                        <div className="qr-wrapper">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getVerificationUrl())}`} alt="QR Code" />
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
                          <p className="stamp-ministry">Ministère de la Sécurité et de la Protection Civile</p>
                        </div>
                      </div>
                      <div className="generation-timestamp">
                        Généré le {formatDateTime(docData?.date_generation || docData?.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* VERSO CNI */}
                  <div className="official-document doc-verso" style={{ marginTop: '32px' }}>
                    <div className="doc-republic-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '12px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '11px', color: '#666' }}>Code pays</span>
                          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>GIN</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', flex: 1 }}>
                          <h3 className="rep-title" style={{ margin: 0, fontSize: '16px' }}>RÉPUBLIQUE DE GUINÉE</h3>
                          <span style={{ fontSize: '11px', color: '#666', marginTop: '6px' }}>Autorité de délivrance</span>
                          <span style={{ fontSize: '12px', fontWeight: '600' }}>Le Directeur Général de la Police Nationale</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: '#666' }}>NIN</span>
                          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>286122600388415</span>
                        </div>
                      </div>
                    </div>

                    <div className="doc-body" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <div className="info-group">
                          <label>Lieu de naissance</label>
                          <p className="info-val uppercase">{citoyenData?.commune || 'MATOTO'}<br/>{citoyenData?.prefecture || 'CONAKRY'}</p>
                        </div>
                        <div className="info-group">
                          <label>Préfecture</label>
                          <p className="info-val uppercase">{citoyenData?.prefecture || 'CONAKRY'}</p>
                        </div>
                        
                        <div className="info-group">
                          <label>Région/Region</label>
                          <p className="info-val uppercase">{citoyenData?.region || 'CONAKRY'}</p>
                        </div>
                        
                        <div className="info-group">
                          <label>Sous-préfecture/Commune</label>
                          <p className="info-val uppercase">{citoyenData?.commune || 'MATOTO'}</p>
                        </div>

                        <div className="info-group">
                          <label>Quartier/District</label>
                          <p className="info-val uppercase">{citoyenData?.quartier || 'GBESSIA CENTRE'}</p>
                        </div>

                        <div className="info-group">
                          <label>Secteur/Village</label>
                          <p className="info-val uppercase">{citoyenData?.secteur || '02'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mrz-code" style={{ 
                      fontFamily: 'monospace', 
                      background: 'rgba(255, 255, 255, 0.4)', 
                      padding: '20px 24px', 
                      letterSpacing: '4px', 
                      fontSize: '16px', 
                      lineHeight: '1.6',
                      fontWeight: '600',
                      borderBottomLeftRadius: '16px',
                      borderBottomRightRadius: '16px',
                      color: '#1a1a1a'
                    }}>
                      I&lt;GIN222612231&lt;10200466&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
                      8612261F2905316GIN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;2<br/>
                      {(user?.nom || 'CAMARA').toUpperCase()}&lt;&lt;{(user?.prenom || 'SALEMATOU').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                    </div>
                  </div>
                </>
              )}
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

const DocumentGenere = () => (
  <ErrorBoundary>
    <DocumentGenereContent />
  </ErrorBoundary>
);

export default DocumentGenere;
