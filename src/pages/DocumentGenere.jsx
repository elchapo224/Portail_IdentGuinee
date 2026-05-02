import React, { useState, useEffect, Component } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight, Share2, Download, Shield, Info, CheckCircle, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { supabase } from '../lib/supabase';
import { DOCUMENT_TYPES, getDocumentTypeLabel } from '../lib/documentTypes';
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
  const typeValue = location.state?.documentType || DOCUMENT_TYPES.CNI.value;
  const selectedDocumentType = getDocumentTypeLabel(typeValue) || "Document officiel certifié";
  const isBirthExtract = typeValue === DOCUMENT_TYPES.NAISSANCE.value;
  const documentId = location.state?.documentId;

  const [docId, setDocId] = useState(documentId || null);
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      let docQuery = supabase.from('documents_certifies').select('*').eq('citoyen_id', user.id);
      
      if (docId) {
        docQuery = docQuery.eq('id', docId);
      } else {
        docQuery = docQuery.order('created_at', { ascending: false }).limit(1);
      }

      const { data: docs } = await docQuery;
      
      if (docs && docs.length > 0) {
        setDocData(docs[0]);
        setDocId(docs[0].id);
      }
      
      setLoading(false);
    };

    loadData();
  }, [user?.id, docId]);

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

  const verificationUrl = docId ? `${window.location.origin}/verifier/${docId}` : `${window.location.origin}/login`;

  const birthData = {
    acteNumber: docData?.id_acte || '001/RC/CK/2026',
    registre: 'Registre de naissances 2026 - Commune de Kindia',
    declarationDate: formatDate(docData?.created_at),
    declarationPlace: 'Mairie de Conakry',
    gender: user?.sexe || 'M',
    birthPlace: user?.lieu_naissance || 'Conakry',
    birthDate: user?.date_naissance || '12/05/1992',
    father: user?.nom_pere || 'Mamadou DIALLO',
    mother: user?.nom_mere || 'Aissata KONE',
    domicile: 'Quartier Camayenne, Conakry',
    issuerTitle: 'Officier d\'état civil',
    issuer: 'M. Sory KABA',
    issuerSignature: 'S.K',
    city: 'Conakry',
    date: formatDate(docData?.created_at),
    decorationStatement: 'Cet extrait certifie la déclaration de naissance conforme aux registres officiels de l\'État civil'
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('official-doc-container');
    if (!element || !window.html2canvas || !window.jspdf) {
      window.print(); // Fallback to print
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
      const imgWidth = canvas.width * 0.264583 / 2;
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
      window.print();
    }
  };

  const handleDownloadPNG = async () => {
    const element = document.getElementById('official-doc-container');
    if (!element || !window.html2canvas) {
      alert("La capture d'image n'est pas encore prête.");
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
                <span className="active">{isBirthExtract ? 'EXTRAIT DE NAISSANCE' : 'ATTESTATION D\'IDENTITÉ'}</span>
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
            <div className="document-container" id="official-doc-container">
              {isBirthExtract ? (
                <div className="birth-document-card official-style">
                  <div className="birth-document-border">
                    <div className="birth-document-inner">
                      <div className="birth-official-header">
                        <div className="birth-official-header-top">
                          <div className="header-top-left">
                            <p>RÉPUBLIQUE DE GUINÉE</p>
                            <p className="motto">TRAVAIL - JUSTICE - SOLIDARITÉ</p>
                          </div>
                          <div className="header-top-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Coat_of_arms_of_Guinea.svg/200px-Coat_of_arms_of_Guinea.svg.png" alt="Armoiries" className="armoiries-gold" />
                          </div>
                          <div className="header-top-right">
                            <p>MINISTÈRE DE LA JUSTICE</p>
                            <p>DIRECTION NATIONALE DE L'ÉTAT CIVIL</p>
                          </div>
                        </div>
                        
                        <div className="birth-main-title">
                          <h1>Acte de Naissance</h1>
                          <p className="subtitle-english">Certificate of Birth</p>
                          <h2 className="title-bold-large">Acte De Naissance</h2>
                        </div>

                        <div className="location-info-grid">
                          <div className="location-box">
                            <div className="location-row">
                              <span className="label">Ville / Préfecture / RÉGION :</span>
                              <span className="value">{birthData.city}</span>
                            </div>
                            <div className="location-row">
                              <span className="label">Commune :</span>
                              <span className="value">MATAM</span>
                            </div>
                          </div>
                          <div className="issuer-box">
                            <span className="label">Je Soussigné :</span>
                            <span className="value">{birthData.issuer}</span>
                          </div>
                        </div>
                      </div>

                      <div className="birth-official-section">
                        <div className="section-title-banner">ENFANT</div>
                        <div className="official-table">
                          <div className="table-row">
                            <div className="table-cell label-cell">NOM / LAST NAME</div>
                            <div className="table-cell value-cell bold uppercase">{user?.nom || 'DIALLO'}</div>
                          </div>
                          <div className="table-row">
                            <div className="table-cell label-cell">PRÉNOMS / GIVEN NAMES</div>
                            <div className="table-cell value-cell bold">{user?.prenom || 'Mamadou'}</div>
                          </div>
                          <div className="table-row split">
                            <div className="row-part">
                              <div className="table-cell label-cell">NÉ LE / DATE OF BIRTH</div>
                              <div className="table-cell value-cell">{birthData.birthDate}</div>
                            </div>
                            <div className="row-part">
                              <div className="table-cell label-cell">SEXE / SEX</div>
                              <div className="table-cell value-cell">{birthData.gender === 'M' ? 'MASCULIN' : 'FÉMININ'}</div>
                            </div>
                          </div>
                          <div className="table-row">
                            <div className="table-cell label-cell">LIEU DE NAISSANCE / PLACE OF BIRTH</div>
                            <div className="table-cell value-cell">{birthData.birthPlace}</div>
                          </div>
                        </div>
                      </div>

                      <div className="birth-official-section">
                        <div className="section-title-banner">PERE</div>
                        <div className="official-table">
                          <div className="table-row">
                            <div className="table-cell label-cell">NOM DU PERE / FATHER'S NAME</div>
                            <div className="table-cell value-cell">{birthData.father}</div>
                          </div>
                          <div className="table-row">
                            <div className="table-cell label-cell">LIEU DE NAISSANCE / PLACE OF BIRTH</div>
                            <div className="table-cell value-cell">CONAKRY</div>
                          </div>
                        </div>
                      </div>

                      <div className="birth-official-section">
                        <div className="section-title-banner">MERE</div>
                        <div className="official-table">
                          <div className="table-row">
                            <div className="table-cell label-cell">NOM DE LA MERE / MOTHER'S NAME</div>
                            <div className="table-cell value-cell">{birthData.mother}</div>
                          </div>
                          <div className="table-row">
                            <div className="table-cell label-cell">LIEU DE NAISSANCE / PLACE OF BIRTH</div>
                            <div className="table-cell value-cell">KINDIA</div>
                          </div>
                        </div>
                      </div>

                      <div className="birth-official-footer">
                        <div className="footer-top-text">
                          <p>Fait à {birthData.city}, le {birthData.date}</p>
                          <p>L'Officier de l'état civil délégué</p>
                        </div>
                        
                        <div className="official-seals-container">
                          <div className="seal-left">
                            <div className="blue-stamp">
                              <div className="inner-stamp">
                                <span>Officier de l'état civil délégué</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="seal-center">
                            <div className="qr-official">
                              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verificationUrl)}`} alt="QR Code" />
                              <div className="id-number">{birthData.acteNumber}</div>
                            </div>
                          </div>

                          <div className="seal-right">
                            <div className="red-jagged-seal">
                              <div className="seal-content">
                                <Shield size={24} />
                                <span>CERTIFIÉ</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="watermark-overlay">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Coat_of_arms_of_Guinea.svg/200px-Coat_of_arms_of_Guinea.svg.png" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* --- DESIGN CARTE D'IDENTITÉ CEDEAO (OFFICIEL) --- */
                <div className="ecowas-id-card">
                  <div className="card-background-overlay">
                    <div className="guinea-map-watermark"></div>
                  </div>
                  
                  <div className="ecowas-header">
                    <div className="ecowas-logo-container">
                      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/1/12/ECOWAS_logo.svg/1200px-ECOWAS_logo.svg.png" alt="CEDEAO" className="ecowas-logo" />
                    </div>
                    
                    <div className="ecowas-titles">
                      <h1 className="rep-guinee-title">RÉPUBLIQUE DE GUINÉE</h1>
                      <h2 className="card-main-title">CARTE D'IDENTITÉ CEDEAO</h2>
                      <p className="card-sub-titles">ECOWAS IDENTITY CARD / BILHETE DE IDENTIDADE CEDEAO</p>
                    </div>
                    
                    <div className="guinea-flag-container">
                      <div className="guinea-flag"></div>
                    </div>
                  </div>

                  <div className="ecowas-body">
                    <div className="ecowas-left-col">
                      <div className="main-id-photo-wrapper">
                        <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="ID" />
                      </div>
                      <div className="signature-container-id">
                        <p className="label-italic">Signature / Signature</p>
                        <div className="signature-graphic">
                          {user?.prenom?.charAt(0)}. {user?.nom}
                        </div>
                      </div>
                    </div>

                    <div className="ecowas-middle-col">
                      <div className="data-field">
                        <label>Nom / Surname</label>
                        <p className="data-val bold-upper">{user?.nom || 'CAMARA'}</p>
                      </div>
                      <div className="data-field">
                        <label>Prénom / First name</label>
                        <p className="data-val bold-upper">{user?.prenom || 'SALEMATOU'}</p>
                      </div>
                      <div className="data-field">
                        <label>Nationalité / Nationality</label>
                        <p className="data-val bold-upper">GUINÉENNE</p>
                      </div>
                      <div className="data-field">
                        <label>Date de naissance / Date of birth</label>
                        <p className="data-val">{user?.date_naissance || '26 DEC 1986'}</p>
                      </div>
                      <div className="data-field">
                        <label>Date d'émission / Date of issuance</label>
                        <p className="data-val">31 MAY 2024</p>
                      </div>
                      <div className="data-field">
                        <label>Date d'expiration / Date of expiry</label>
                        <p className="data-val">31 MAY 2029</p>
                      </div>
                      <div className="data-field id-number-field">
                        <label>Numéro d'identité / ID number</label>
                        <p className="data-val-large">{user?.matricule?.replace('GN-', '') || '2226122311020046'}</p>
                      </div>
                    </div>

                    <div className="ecowas-right-col">
                      <div className="right-top-data">
                        <div className="data-field">
                          <label>Sexe / Sex</label>
                          <p className="data-val-box">{user?.sexe?.charAt(0) || 'F'}</p>
                        </div>
                        <div className="data-field">
                          <label>Taille / Height</label>
                          <p className="data-val-box">1,64 m</p>
                        </div>
                      </div>
                      
                      <div className="ghost-photo-oval">
                        <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Ghost" className="ghost-photo" />
                      </div>

                      <div className="qr-code-embedded">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verificationUrl)}`} alt="QR Code" />
                         <div className="qr-label">SECURITY SCAN</div>
                      </div>
                    </div>
                  </div>

                  <div className="ecowas-footer-id">
                     <div className="issuance-place">
                       <label>Lieu de délivrance / Place of issuance</label>
                       <p>CONAKRY / M.S.P.C</p>
                     </div>
                     
                     <div className="authority-signature">
                        <p className="label-italic">Signature de l'autorité</p>
                        <div className="auth-sig-img"></div>
                     </div>
                  </div>
                </div>
              )}
            </div>

            <aside className="doc-sidebar no-print">
              <div className="sidebar-card details-card">
                <h3>Détails du Document</h3>
                <ul className="details-list">
                  <li>
                    <span className="det-label">Type</span>
                    <span className="det-val">{selectedDocumentType}</span>
                  </li>
                  <li>
                    <span className="det-label">Format</span>
                    <span className="det-val">CEDEAO / Biométrique</span>
                  </li>
                  <li>
                    <span className="det-label">Validité</span>
                    <span className="det-val">5 Ans</span>
                  </li>
                </ul>
                <div className="info-alert">
                  <Info size={16} />
                  <p>Cette carte est conforme aux standards de la CEDEAO et permet la libre circulation dans l'espace communautaire.</p>
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
                      <p className="tl-time">{formatDateTime(docData?.created_at)}</p>
                    </div>
                  </div>
                  <div className="timeline-item active">
                    <div className="timeline-icon success"><CheckCircle size={14} /></div>
                    <div className="timeline-content">
                      <p className="tl-title">Validation biométrique</p>
                      <p className="tl-time">Aujourd'hui, 14:28</p>
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
