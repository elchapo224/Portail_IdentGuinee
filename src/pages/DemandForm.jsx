import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronRight, Info, CheckCircle, AlertCircle,
  UploadCloud, CreditCard, Calendar, FileText, Car, FileCheck
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import './DemandForm.css';

// ── Prix officiels par type de document ──
const DOCUMENT_CONFIG = {
  "Carte d'Identité": {
    label: "Carte Nationale d'Identité Biométrique",
    icon: <CreditCard size={22} />,
    price: 0,
    priceLabel: "Gratuite",
    color: "#006D44",
    frais: "Gratuit",
    totalLabel: "0 GNF",
  },
  "Passeport": {
    label: "Passeport Biométrique",
    icon: <FileText size={22} />,
    price: 500000,
    priceLabel: "500 000 GNF",
    color: "#0054A6",
    frais: "500 000 GNF",
    totalLabel: "500 000 GNF",
  },
  "Extrait de Naissance": {
    label: "Extrait d'Acte de Naissance",
    icon: <FileCheck size={22} />,
    price: 15000,
    priceLabel: "15 000 GNF",
    color: "#CE1126",
    frais: "15 000 GNF",
    totalLabel: "15 000 GNF",
  },
  "Permis de Conduire": {
    label: "Permis de Conduire",
    icon: <Car size={22} />,
    price: 250000,
    priceLabel: "250 000 GNF",
    color: "#FF8C00",
    frais: "250 000 GNF",
    totalLabel: "250 000 GNF",
  },
};

const DemandForm = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDocumentType = location.state?.documentType || "Carte d'Identité";

  const [currentStep, setCurrentStep] = useState(1);
  const [acteData, setActeData] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('Orange Money');

  const [formData, setFormData] = useState({
    type_document: selectedDocumentType,
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    date_naissance: '',
    lieu_naissance: '',
    nom_pere: '',
    nom_mere: '',
    num_acte: ''
  });

  const [verificationStatus, setVerificationStatus] = useState('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({ acte: null, residence: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const docConfig = DOCUMENT_CONFIG[formData.type_document] || DOCUMENT_CONFIG["Carte d'Identité"];

  // ── Vérification réelle dans NaissanceChain ──
  useEffect(() => {
    if (formData.num_acte.length < 3) {
      setVerificationStatus('idle');
      setActeData(null);
      setVerificationMessage('');
      return;
    }

    const debounce = setTimeout(async () => {
      setVerificationStatus('checking');
      try {
        const { data, error } = await supabase
          .from('naissancechain')
          .select('*')
          .eq('id_acte', formData.num_acte.trim())
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setVerificationStatus('verified');
          setActeData(data);
          // Message simplifié — sans données techniques
          setVerificationMessage(`Acte trouvé : ${data.prenom} ${data.nom} — ${data.lieu_naissance}`);
          setFormData(prev => ({
            ...prev,
            nom: data.nom,
            prenom: data.prenom,
            lieu_naissance: data.lieu_naissance,
            nom_pere: data.nom_pere || '',
            nom_mere: data.nom_mere || '',
          }));
        } else {
          setVerificationStatus('error');
          setActeData(null);
          setVerificationMessage("Numéro d'acte introuvable dans le registre. Vérifiez le format GN-AAAA-NNNNN.");
        }
      } catch (err) {
        setVerificationStatus('error');
        setVerificationMessage('Erreur de connexion au registre. Réessayez dans un instant.');
      }
    }, 700);

    return () => clearTimeout(debounce);
  }, [formData.num_acte]);

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };
  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmitDemand = async () => {
    if (!user?.id) {
      setSubmitError('Utilisateur non authentifié. Veuillez vous reconnecter.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { data: docData, error: docError } = await supabase
        .from('documents_certifies')
        .insert([{
          id_acte: formData.num_acte || acteData?.id_acte || null,
          citoyen_id: user.id,
          statut: 'EN_ATTENTE',
          hash_document: acteData?.hash_blockchain || null,
          date_generation: new Date().toISOString(),
        }])
        .select()
        .single();

      if (docError) throw docError;

      const updatePayload = { statut_demande: 'EN_ATTENTE' };
      if (acteData?.id_acte) updatePayload.id_acte_lie = acteData.id_acte;
      await supabase.from('citoyens').update(updatePayload).eq('id', user.id);

      if (acteData) {
        updateUser({
          acteData,
          type_document: formData.type_document,
          documentId: docData?.id,
        });
      }

      navigate('/traitement', { state: { documentId: docData?.id, num_acte: formData.num_acte } });

    } catch (err) {
      console.error(err);
      setSubmitError(`Erreur : ${err.message || 'Une erreur inattendue est survenue.'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="layout-wrapper">
      <Sidebar />
      <main className="main-content">
        <Header />

        <div className="form-page-content animate-fade-in">
          <nav className="breadcrumbs animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span>TABLEAU DE BORD</span> <ChevronRight size={14} />
            <span className="active">NOUVELLE DEMANDE</span>
          </nav>

          <div className="form-header animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="page-title">Formulaire de demande de titre</h2>
            <p className="page-subtitle">
              Étape {currentStep} sur 3 :&nbsp;
              {currentStep === 1 ? 'Choix du document & informations personnelles' :
               currentStep === 2 ? 'Dépôt des justificatifs' :
               'Paiement et prise de rendez-vous'}
            </p>
          </div>

          {/* Indicateur de progression */}
          <div className="animate-slide-up" style={{ animationDelay: '0.25s', display: 'flex', gap: 0, marginBottom: 24, borderRadius: 10, overflow: 'hidden', border: '1px solid #e8e8e8' }}>
            {['Informations', 'Justificatifs', 'Paiement'].map((label, i) => (
              <div key={i} style={{
                flex: 1, padding: '10px 16px', textAlign: 'center', fontSize: 13,
                fontWeight: currentStep === i + 1 ? 700 : 500,
                background: currentStep > i ? '#006D44' : currentStep === i + 1 ? '#006D44' : '#f5f5f5',
                color: currentStep >= i + 1 ? '#fff' : '#aaa',
                borderRight: i < 2 ? '1px solid #e8e8e8' : 'none',
                transition: 'all 0.3s'
              }}>
                {currentStep > i + 1 ? '✓ ' : `${i + 1}. `}{label}
              </div>
            ))}
          </div>

          <div className="form-grid animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="form-sections">

              {/* ══════════════════════════════════
                  ÉTAPE 1 — Choix doc + Infos
              ══════════════════════════════════ */}
              {currentStep === 1 && (
                <div className="step-content animate-fade-in">

                  {/* Sélecteur type de document */}
                  <section className="form-card">
                    <div className="section-header-form">
                      <div className="icon-badge"><FileText size={18} /></div>
                      <h3>Type de document souhaité</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 12 }}>
                      {Object.entries(DOCUMENT_CONFIG).map(([id, doc]) => (
                        <div
                          key={id}
                          onClick={() => setFormData(prev => ({ ...prev, type_document: id }))}
                          style={{
                            border: `2px solid ${formData.type_document === id ? doc.color : '#e0e0e0'}`,
                            borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                            background: formData.type_document === id ? `${doc.color}12` : '#fff',
                            transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 8,
                            position: 'relative'
                          }}
                        >
                          <div style={{ color: formData.type_document === id ? doc.color : '#aaa' }}>{doc.icon}</div>
                          <p style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a', margin: 0 }}>{doc.label}</p>
                          <p style={{ fontSize: 12, color: doc.color, fontWeight: 700, margin: 0 }}>{doc.priceLabel}</p>
                          {formData.type_document === id && (
                            <CheckCircle size={16} color={doc.color} style={{ position: 'absolute', top: 10, right: 10 }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Informations personnelles */}
                  <section className="form-card" style={{ marginTop: 20 }}>
                    <div className="section-header-form">
                      <div className="icon-badge"><Info size={18} /></div>
                      <h3>Identité Personnelle</h3>
                    </div>

                    <div className="input-group-row">
                      <div className="input-field">
                        <label>NOM</label>
                        <input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
                      </div>
                      <div className="input-field">
                        <label>PRÉNOM</label>
                        <input type="text" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} />
                      </div>
                    </div>

                    <div className="input-group-row">
                      <div className="input-field">
                        <label>DATE DE NAISSANCE</label>
                        <input type="date" value={formData.date_naissance} onChange={(e) => setFormData({...formData, date_naissance: e.target.value})} />
                      </div>
                      <div className="input-field">
                        <label>LIEU DE NAISSANCE</label>
                        <input type="text" value={formData.lieu_naissance} onChange={(e) => setFormData({...formData, lieu_naissance: e.target.value})} />
                      </div>
                    </div>

                    <div className="input-group-row" style={{ marginTop: 16 }}>
                      <div className="input-field">
                        <label>GENRE</label>
                        <select value={formData.genre || ''} onChange={(e) => setFormData({...formData, genre: e.target.value})}>
                          <option value="">Sélectionner</option>
                          <option value="M">Masculin</option>
                          <option value="F">Féminin</option>
                        </select>
                      </div>
                      <div className="input-field">
                        <label>NUMÉRO DE TÉLÉPHONE</label>
                        <input type="tel" placeholder="Ex: +224 620 00 00 00" value={formData.telephone || ''} onChange={(e) => setFormData({...formData, telephone: e.target.value})} />
                      </div>
                    </div>
                  </section>

                  {/* Filiation & Vérification NaissanceChain */}
                  <section className="form-card" style={{ marginTop: 20 }}>
                    <div className="section-header-form">
                      <div className="icon-badge"><Info size={18} /></div>
                      <h3>Filiation & Vérification de l'acte</h3>
                    </div>

                    <div className="input-group-row">
                      <div className="input-field">
                        <label>NOM COMPLET DU PÈRE</label>
                        <input type="text" placeholder="Ex: Mamadou Diallo" value={formData.nom_pere} onChange={(e) => setFormData({...formData, nom_pere: e.target.value})} />
                      </div>
                      <div className="input-field">
                        <label>NOM COMPLET DE LA MÈRE</label>
                        <input type="text" placeholder="Ex: Aminata Bah" value={formData.nom_mere} onChange={(e) => setFormData({...formData, nom_mere: e.target.value})} />
                      </div>
                    </div>

                    <div className="input-field full" style={{ marginTop: 20 }}>
                      <label>NUMÉRO D'ACTE DE NAISSANCE</label>
                      <div className="verification-input-wrapper">
                        <input
                          type="text"
                          placeholder="Ex: GN-2012-00001"
                          value={formData.num_acte}
                          onChange={(e) => setFormData({...formData, num_acte: e.target.value})}
                        />
                        {verificationStatus === 'checking' && (
                          <span className="verify-icon" style={{ color: '#888', fontSize: 13 }}>⏳</span>
                        )}
                        {verificationStatus === 'verified' && <CheckCircle className="verify-icon success" size={20} color="#006D44" />}
                        {verificationStatus === 'error' && <AlertCircle className="verify-icon error" size={20} color="#CE1126" />}
                      </div>

                      {/* Message de vérification — simplifié, sans données techniques */}
                      {verificationMessage && (
                        <div style={{
                          marginTop: 10, padding: '10px 14px',
                          background: verificationStatus === 'verified' ? '#f0fdf4' : '#fff5f5',
                          border: `1px solid ${verificationStatus === 'verified' ? '#006D44' : '#CE1126'}`,
                          borderRadius: 8, fontSize: 13,
                          color: verificationStatus === 'verified' ? '#006D44' : '#CE1126',
                          fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8
                        }}>
                          {verificationStatus === 'verified' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                          {verificationMessage}
                        </div>
                      )}

                      <p className="field-hint" style={{ marginTop: 8 }}>
                        Format attendu : <strong>GN-AAAA-NNNNN</strong> — ex: GN-2012-00001. Ce numéro figure sur votre acte de naissance physique.
                      </p>
                    </div>
                  </section>

                  <div className="form-actions">
                    <button className="btn-cancel" onClick={() => navigate('/')}>Annuler</button>
                    <button
                      className="btn-next"
                      onClick={handleNextStep}
                      disabled={verificationStatus === 'checking'}
                    >
                      Continuer vers les justificatifs →
                    </button>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════
                  ÉTAPE 2 — Justificatifs
              ══════════════════════════════════ */}
              {currentStep === 2 && (
                <div className="step-content animate-fade-in">
                  <section className="form-card">
                    <div className="section-header-form">
                      <div className="icon-badge"><UploadCloud size={18} /></div>
                      <h3>Dépôt des Justificatifs</h3>
                    </div>
                    <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
                      Veuillez téléverser les pièces requises. Formats acceptés : PDF, JPG, PNG (max 5 Mo par fichier).
                    </p>

                    <div className="upload-zone" onClick={() => document.getElementById('upload-acte').click()}>
                      <UploadCloud size={32} color="#006D44" />
                      <p><strong>Copie de l'acte de naissance</strong></p>
                      <p style={{ fontSize: 12, color: '#888' }}>
                        {uploadedFiles.acte ? `✅ ${uploadedFiles.acte.name}` : 'Cliquez ou glissez votre fichier ici'}
                      </p>
                      <input id="upload-acte" type="file" accept=".pdf,.jpg,.png" style={{ display: 'none' }}
                        onChange={(e) => setUploadedFiles(prev => ({ ...prev, acte: e.target.files[0] }))} />
                    </div>

                    <div className="upload-zone" style={{ marginTop: 16 }} onClick={() => document.getElementById('upload-residence').click()}>
                      <UploadCloud size={32} color="#006D44" />
                      <p><strong>Justificatif de résidence</strong></p>
                      <p style={{ fontSize: 12, color: '#888' }}>
                        {uploadedFiles.residence ? `✅ ${uploadedFiles.residence.name}` : 'Cliquez ou glissez votre fichier ici'}
                      </p>
                      <input id="upload-residence" type="file" accept=".pdf,.jpg,.png" style={{ display: 'none' }}
                        onChange={(e) => setUploadedFiles(prev => ({ ...prev, residence: e.target.files[0] }))} />
                    </div>

                    {/* Récapitulatif document choisi */}
                    <div style={{
                      marginTop: 20, padding: '12px 16px',
                      background: `${docConfig.color}0d`,
                      border: `1px solid ${docConfig.color}40`,
                      borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12
                    }}>
                      <div style={{ color: docConfig.color }}>{docConfig.icon}</div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 13, margin: 0, color: '#1a1a1a' }}>{docConfig.label}</p>
                        <p style={{ fontSize: 12, color: docConfig.color, fontWeight: 600, margin: 0 }}>Frais : {docConfig.frais}</p>
                      </div>
                    </div>
                  </section>

                  <div className="form-actions">
                    <button className="btn-cancel" onClick={handlePrevStep}>← Retour</button>
                    <button className="btn-next" onClick={handleNextStep}>Continuer vers le paiement →</button>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════
                  ÉTAPE 3 — Paiement & RDV
              ══════════════════════════════════ */}
              {currentStep === 3 && (
                <div className="step-content animate-fade-in">
                  <section className="form-card">
                    <div className="section-header-form">
                      <div className="icon-badge"><CreditCard size={18} /></div>
                      <h3>Paiement des frais de dossier</h3>
                    </div>

                    {/* Récapitulatif prix */}
                    <div style={{ background: '#f9fafb', borderRadius: 10, padding: '16px 20px', marginBottom: 20, border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                        <span style={{ color: '#555' }}>Type de document</span>
                        <strong style={{ color: '#1a1a1a' }}>{docConfig.label}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                        <span style={{ color: '#555' }}>Frais de traitement</span>
                        <strong style={{ color: '#1a1a1a' }}>{docConfig.frais}</strong>
                      </div>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        borderTop: '1px solid #e0e0e0', paddingTop: 12, fontSize: 15
                      }}>
                        <span style={{ fontWeight: 700 }}>Total à payer</span>
                        <strong style={{ color: docConfig.color, fontSize: 16 }}>{docConfig.totalLabel}</strong>
                      </div>
                    </div>

                    {docConfig.price === 0 ? (
                      <div style={{
                        padding: '12px 16px', background: '#f0fdf4',
                        border: '1px solid #006D44', borderRadius: 10,
                        display: 'flex', alignItems: 'center', gap: 10,
                        fontSize: 14, color: '#006D44', fontWeight: 600, marginBottom: 20
                      }}>
                        <CheckCircle size={18} />
                        Ce document est gratuit — aucun paiement requis.
                      </div>
                    ) : (
                      <>
                        <p style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>
                          Le paiement se fait via Mobile Money (Orange Money, MTN MoMo) ou en agence bancaire (Ecobank, SGBG, BCRG).
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                          {['Orange Money', 'MTN MoMo', 'Ecobank', 'SGBG'].map(mode => (
                            <label key={mode} style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '12px 16px',
                              border: `2px solid ${selectedPayment === mode ? '#006D44' : '#ddd'}`,
                              borderRadius: 10, cursor: 'pointer', fontSize: 14,
                              background: selectedPayment === mode ? '#f0fdf4' : '#fff',
                              transition: 'all 0.2s', fontWeight: selectedPayment === mode ? 600 : 400
                            }}>
                              <input
                                type="radio" name="payment" value={mode}
                                checked={selectedPayment === mode}
                                onChange={() => setSelectedPayment(mode)}
                                style={{ accentColor: '#006D44' }}
                              />
                              {mode}
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                  </section>

                  {/* Prise de rendez-vous */}
                  <section className="form-card" style={{ marginTop: 16 }}>
                    <div className="section-header-form">
                      <div className="icon-badge"><Calendar size={18} /></div>
                      <h3>Prise de Rendez-vous</h3>
                    </div>
                    <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
                      Choisissez une date et un créneau pour récupérer votre document en centre administratif.
                    </p>
                    <div className="input-group-row">
                      <div className="input-field">
                        <label>DATE SOUHAITÉE</label>
                        <input type="date" min={new Date().toISOString().split('T')[0]} />
                      </div>
                      <div className="input-field">
                        <label>CRÉNEAU HORAIRE</label>
                        <select>
                          <option>08h00 - 09h00</option>
                          <option>09h00 - 10h00</option>
                          <option>10h00 - 11h00</option>
                          <option>14h00 - 15h00</option>
                          <option>15h00 - 16h00</option>
                        </select>
                      </div>
                    </div>
                    <div className="input-field" style={{ marginTop: 12 }}>
                      <label>CENTRE ADMINISTRATIF</label>
                      <select>
                        <option>Centre de Conakry — Kaloum</option>
                        <option>Centre de Conakry — Ratoma</option>
                        <option>Centre de Kindia</option>
                        <option>Centre de Labé</option>
                        <option>Centre de Kankan</option>
                        <option>Centre de Nzérékoré</option>
                      </select>
                    </div>
                  </section>

                  {submitError && (
                    <div style={{
                      padding: '10px 14px', background: '#fff0f0',
                      border: '1px solid #CE1126', borderRadius: 8,
                      color: '#CE1126', marginTop: 12, fontSize: 13,
                      display: 'flex', alignItems: 'center', gap: 8
                    }}>
                      <AlertCircle size={14} />{submitError}
                    </div>
                  )}

                  <div className="form-actions">
                    <button className="btn-cancel" onClick={handlePrevStep}>← Retour</button>
                    <button className="btn-next" onClick={handleSubmitDemand} disabled={isSubmitting}>
                      {isSubmitting ? '⏳ Traitement en cours...' : '✅ Confirmer et soumettre'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Récapitulatif latéral — version simple pour le citoyen ── */}
            <aside className="form-summary">
              <div className="summary-card">
                <h3><FileText size={16} style={{ marginRight: 6 }} />Votre demande</h3>
                <ul className="summary-list">
                  <li><span>Document</span><strong style={{ color: docConfig.color }}>{formData.type_document}</strong></li>
                  <li><span>Nom</span><strong>{formData.nom || '—'}</strong></li>
                  <li><span>Prénom</span><strong>{formData.prenom || '—'}</strong></li>
                  <li><span>Lieu naiss.</span><strong>{formData.lieu_naissance || '—'}</strong></li>
                  <li><span>Acte</span>
                    <strong style={{ color: verificationStatus === 'verified' ? '#006D44' : '#333' }}>
                      {formData.num_acte || '—'} {verificationStatus === 'verified' ? '✅' : ''}
                    </strong>
                  </li>
                  <li><span>Frais</span><strong style={{ color: docConfig.color }}>{docConfig.frais}</strong></li>
                </ul>

                {/* Étapes de la démarche */}
                <div style={{ marginTop: 16, borderTop: '1px solid #eee', paddingTop: 14 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 10 }}>VOTRE DÉMARCHE</p>
                  {[
                    { step: 1, label: 'Informations & vérification', done: currentStep > 1 },
                    { step: 2, label: 'Dépôt des pièces', done: currentStep > 2 },
                    { step: 3, label: 'Paiement & rendez-vous', done: false },
                  ].map(s => (
                    <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: 12 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        background: s.done ? '#006D44' : currentStep === s.step ? '#006D44' : '#e0e0e0',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700
                      }}>
                        {s.done ? '✓' : s.step}
                      </div>
                      <span style={{ color: s.done || currentStep === s.step ? '#1a1a1a' : '#aaa', fontWeight: s.done || currentStep === s.step ? 600 : 400 }}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16, padding: '10px 12px', background: '#f0fdf4', borderRadius: 8, fontSize: 11, color: '#006D44' }}>
                  🔒 Vos données sont sécurisées et traitées conformément à la politique de protection des données de l'État guinéen.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemandForm;
