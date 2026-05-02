import React, { useState, useRef } from 'react';
import { ChevronRight, Share2, Download, Shield, Info, CheckCircle, Smartphone, X, CreditCard, FileText, Car, FileCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import './DocumentGenere.css';

const DocumentGenere = () => {
  const { user } = useAuth();
  const printRef = useRef();
  const acte = user?.acteData || {};
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  const today = new Date();
  const dateEmission = today.toLocaleDateString('fr-FR');
  const expiryDate = new Date(today);
  expiryDate.setFullYear(expiryDate.getFullYear() + 10);
  const dateExpiration = expiryDate.toLocaleDateString('fr-FR');

  const qrData = encodeURIComponent(
    `IDENTIGUINEE|${acte.id_acte || 'N/A'}|${acte.nom || user?.nom}|${acte.prenom || user?.prenom}|${acte.hash_blockchain || ''}|${acte.transaction_id || ''}`
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

  const genre = acte.genre || 'M';
  const taille = acte.taille_cm ? `${(acte.taille_cm / 100).toFixed(2)}m` : '—';
  const nin = acte.numero_identifiant_national || acte.numero_cin || user?.matricule || '—';
  const typeDoc = user?.type_document || "Carte Nationale d'Identité";

  // Impression propre — seulement le document
  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    if (!printContent) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>IdentiGuinée — ${typeDoc}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; background: #fff; }
            .official-document { border: 2px solid #333; border-radius: 12px; overflow: hidden; max-width: 800px; margin: 20px auto; }
            .doc-top-bar { height: 8px; background: linear-gradient(to right, #CE1126 33%, #FCD116 33%, #FCD116 66%, #009460 66%); }
            .doc-republic-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: #f8f8f8; border-bottom: 1px solid #ddd; }
            .republic-left { display: flex; align-items: center; gap: 12px; }
            .armoiries-img { width: 60px; height: 60px; object-fit: contain; }
            .rep-title { font-size: 15px; font-weight: 700; color: #1a1a1a; margin-bottom: 2px; }
            .rep-motto { font-size: 10px; color: #CE1126; font-weight: 600; letter-spacing: 1px; }
            .card-type { font-size: 14px; font-weight: 700; color: #006D44; }
            .card-id { font-size: 11px; color: #555; margin-top: 4px; }
            .doc-body { display: flex; gap: 20px; padding: 20px; }
            .doc-photo-col { display: flex; flex-direction: column; align-items: center; gap: 12px; min-width: 120px; }
            .id-photo { width: 110px; height: 140px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd; }
            .signature-area { text-align: center; border-top: 1px solid #ccc; padding-top: 8px; width: 100%; }
            .signature-label { font-size: 9px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; }
            .signature-text { font-size: 14px; font-style: italic; color: #333; font-weight: 600; }
            .doc-info-col { flex: 1; display: flex; flex-direction: column; gap: 10px; }
            .info-group label { font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 0.8px; }
            .info-val { font-size: 13px; font-weight: 600; color: #1a1a1a; margin-top: 2px; }
            .info-row-2 { display: flex; gap: 20px; }
            .doc-qr-col { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 140px; }
            .qr-wrapper img { width: 130px; height: 130px; }
            .blockchain-badge { display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: #f0fdf4; border: 1px solid #006D44; border-radius: 20px; font-size: 10px; color: #006D44; font-weight: 700; }
            .hash-bar { padding: 6px 16px; background: #f0fdf4; border-top: 1px solid #e0e0e0; font-size: 10px; font-family: monospace; color: #006D44; word-break: break-all; }
            .doc-footer { padding: 12px 20px; border-top: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; background: #fafafa; }
            .stamp-text p { font-size: 10px; }
            .stamp-label { font-weight: 700; color: #006D44; }
            .stamp-ministry { color: #666; }
            .generation-timestamp { font-size: 11px; color: #888; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
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
                <span className="active">{typeDoc.toUpperCase()}</span>
              </nav>
              <h1 className="doc-title">Votre Document est Prêt ✅</h1>
              <p className="doc-subtitle">Document officiel généré et sécurisé par les services de l'État guinéen.</p>
            </div>
            <div className="doc-header-actions">
              <button className="btn-secondary" onClick={() => navigator.share?.({ title: 'IdentiGuinée', text: `Document ${typeDoc} généré avec succès.` }) || alert("Lien copié !")}>
                <Share2 size={18} /> Partager
              </button>
              <button className="btn-primary-doc" onClick={handlePrint}>
                <Download size={18} /> Télécharger / Imprimer
              </button>
            </div>
          </div>

          <div className="doc-grid animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* ── Document officiel imprimable ── */}
            <div className="document-container">
              <div ref={printRef}>
                <div className="official-document">
                  <div className="doc-top-bar"></div>

                  <div className="doc-republic-header">
                    <div className="republic-left">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Coat_of_arms_of_Guinea.svg/200px-Coat_of_arms_of_Guinea.svg.png"
                        alt="Armoiries de Guinée"
                        className="armoiries-img"
                        onError={e => { e.target.onerror = null; e.target.src = "https://flagcdn.com/w80/gn.png"; }}
                      />
                      <div>
                        <h3 className="rep-title">RÉPUBLIQUE DE GUINÉE</h3>
                        <p className="rep-motto">TRAVAIL - JUSTICE - SOLIDARITÉ</p>
                      </div>
                    </div>
                    <div className="republic-right">
                      <h3 className="card-type">{typeDoc.toUpperCase()}</h3>
                      <p className="card-id">N° : {acte.numero_cin || nin}</p>
                    </div>
                  </div>

                  <div className="doc-body">
                    <div className="doc-photo-col">
                      <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${acte.prenom || user?.prenom}+${acte.nom || user?.nom}&background=006D44&color=fff&size=128`}
                        alt="Photo ID"
                        className="id-photo"
                        onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${acte.prenom || 'C'}+${acte.nom || 'N'}&background=006D44&color=fff&size=128`; }}
                      />
                      <div className="signature-area">
                        <p className="signature-label">SIGNATURE</p>
                        <p className="signature-text">
                          {(acte.prenom || user?.prenom || '').charAt(0)}. {acte.nom || user?.nom || ''}
                        </p>
                      </div>
                    </div>

                    <div className="doc-info-col">
                      <div className="info-group">
                        <label>NOM / SURNAME</label>
                        <p className="info-val uppercase">{acte.nom || user?.nom || '—'}</p>
                      </div>
                      <div className="info-group">
                        <label>PRÉNOMS / GIVEN NAMES</label>
                        <p className="info-val">{acte.prenom || user?.prenom || '—'}</p>
                      </div>
                      <div className="info-row-2">
                        <div className="info-group">
                          <label>SEXE / SEX</label>
                          <p className="info-val">{genre}</p>
                        </div>
                        <div className="info-group">
                          <label>TAILLE / HEIGHT</label>
                          <p className="info-val">{taille}</p>
                        </div>
                      </div>
                      <div className="info-group">
                        <label>DATE & LIEU DE NAISSANCE / DATE & PLACE OF BIRTH</label>
                        <p className="info-val">{acte.date_naissance || '—'} — {acte.lieu_naissance || '—'}</p>
                      </div>
                      <div className="info-group">
                        <label>PÈRE / FATHER</label>
                        <p className="info-val">{acte.nom_pere || '—'}</p>
                      </div>
                      <div className="info-group">
                        <label>MÈRE / MOTHER</label>
                        <p className="info-val">{acte.nom_mere || '—'}</p>
                      </div>
                      <div className="info-row-2">
                        <div className="info-group">
                          <label>DATE D'ÉMISSION</label>
                          <p className="info-val">{dateEmission}</p>
                        </div>
                        <div className="info-group">
                          <label>DATE D'EXPIRATION</label>
                          <p className="info-val">{dateExpiration}</p>
                        </div>
                      </div>
                      <div className="info-group">
                        <label>N° IDENTIFIANT NATIONAL</label>
                        <p className="info-val" style={{ fontFamily: 'monospace', fontSize: 12 }}>{nin}</p>
                      </div>
                    </div>

                    <div className="doc-qr-col">
                      <div className="qr-wrapper">
                        <img src={qrUrl} alt="QR Code de vérification" />
                      </div>
                      <div className="blockchain-badge">
                        <Shield size={12} /> VÉRIFIÉ BLOCKCHAIN
                      </div>
                      <p style={{ fontSize: 10, color: '#888', marginTop: 4, textAlign: 'center', wordBreak: 'break-all' }}>
                        {acte.transaction_id || ''}
                      </p>
                    </div>
                  </div>

                  {acte.hash_blockchain && (
                    <div className="hash-bar">
                      🔐 HASH NAISSANCECHAIN: {acte.hash_blockchain}
                    </div>
                  )}

                  <div className="doc-footer">
                    <div className="signature-stamp">
                      <CheckCircle size={16} color="#006D44" />
                      <div className="stamp-text">
                        <p className="stamp-label">SIGNÉ ÉLECTRONIQUEMENT</p>
                        <p className="stamp-ministry">Ministère de l'Administration du Territoire et de la Décentralisation</p>
                      </div>
                    </div>
                    <div className="generation-timestamp">
                      Généré le {new Date().toLocaleString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Sidebar droite ── */}
            <aside className="doc-sidebar">
              <div className="sidebar-card details-card">
                <h3>Détails du Document</h3>
                <ul className="details-list">
                  <li><span className="det-label">Type</span><span className="det-val">{typeDoc}</span></li>
                  <li><span className="det-label">N° Acte</span><span className="det-val" style={{ fontSize: 11 }}>{acte.id_acte || '—'}</span></li>
                  <li><span className="det-label">Format</span><span className="det-val">PDF / Digital</span></li>
                  <li><span className="det-label">Émission</span><span className="det-val">{dateEmission}</span></li>
                  <li><span className="det-label">Expiration</span><span className="det-val">{dateExpiration}</span></li>
                  <li><span className="det-label">Statut</span><span className="det-val" style={{ color: '#006D44', fontWeight: 700 }}>✅ VALIDE</span></li>
                </ul>
                <div className="info-alert">
                  <Info size={16} />
                  <p>Scannez le QR code pour vérifier l'authenticité de ce document à tout moment.</p>
                </div>
              </div>

              <div className="sidebar-card security-card">
                <Shield size={28} className="sec-icon" />
                <h3>Sécurité NaissanceChain</h3>
                <p>Certifié via Hyperledger Fabric (simulé). Hash SHA-256. Standard GN-SEC-V3, cryptage AES-256.</p>
                {acte.hash_blockchain && (
                  <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#aaa', marginTop: 8, wordBreak: 'break-all' }}>
                    {acte.hash_blockchain.substring(0, 40)}...
                  </p>
                )}
              </div>

              <div className="sidebar-card history-card">
                <h3>Historique</h3>
                <div className="timeline">
                  <div className="timeline-item active">
                    <div className="timeline-icon success"><CheckCircle size={14} /></div>
                    <div className="timeline-content">
                      <p className="tl-title">Document généré</p>
                      <p className="tl-time">Aujourd'hui, {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="timeline-item active">
                    <div className="timeline-icon success"><CheckCircle size={14} /></div>
                    <div className="timeline-content">
                      <p className="tl-title">Vérification NaissanceChain</p>
                      <p className="tl-time">Hash confirmé ✅</p>
                    </div>
                  </div>
                  <div className="timeline-item active">
                    <div className="timeline-icon success"><CheckCircle size={14} /></div>
                    <div className="timeline-content">
                      <p className="tl-title">Demande soumise</p>
                      <p className="tl-time">{acte.id_acte || 'Acte vérifié'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Wallet card ── */}
              <div className="wallet-card">
                <div className="wallet-icon-wrap"><Smartphone size={24} /></div>
                <div className="wallet-text">
                  <h4>Emportez vos documents partout</h4>
                  <p>Ajoutez ce certificat à votre portefeuille mobile IdentiGuinée.</p>
                </div>
                <button className="btn-wallet" onClick={() => setWalletOpen(true)}>
                  Ajouter au Wallet
                </button>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Modal Wallet ── */}
        {walletOpen && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}>
            <div style={{
              background: '#fff', borderRadius: 16, padding: 32,
              width: 400, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              position: 'relative', textAlign: 'center'
            }}>
              <button onClick={() => setWalletOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                <X size={20} />
              </button>

              {!walletAdded ? (
                <>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Smartphone size={28} color="#006D44" />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Ajouter au Wallet Mobile</h3>
                  <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>
                    Ajoutez votre <strong>{typeDoc}</strong> à votre portefeuille numérique pour y accéder hors ligne.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                    {[
                      { icon: <CreditCard size={18} />, label: 'Apple Wallet', sub: 'Disponible sur iOS 15+' },
                      { icon: <FileText size={18} />, label: 'Google Wallet', sub: 'Disponible sur Android 8+' },
                      { icon: <Smartphone size={18} />, label: 'IdentiGuinée App', sub: 'Application officielle' },
                    ].map((w, i) => (
                      <button key={i} onClick={() => { setWalletAdded(true); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '12px 18px', border: '1px solid #e0e0e0',
                          borderRadius: 10, background: '#fff', cursor: 'pointer',
                          textAlign: 'left', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#006D44'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                      >
                        <div style={{ color: '#006D44' }}>{w.icon}</div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 13, margin: 0 }}>{w.label}</p>
                          <p style={{ fontSize: 11, color: '#888', margin: 0 }}>{w.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle size={32} color="#006D44" />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#006D44' }}>Document ajouté ! ✅</h3>
                  <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>
                    Votre <strong>{typeDoc}</strong> a été ajouté avec succès à votre portefeuille numérique. Vous pouvez y accéder même sans connexion internet.
                  </p>
                  <button onClick={() => { setWalletOpen(false); setWalletAdded(false); }}
                    style={{ background: '#006D44', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                    Fermer
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentGenere;
