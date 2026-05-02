import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Info, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import './DemandForm.css';

const DemandForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDocumentType = location.state?.documentType || "Carte d'Identité";

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

  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, checking, verified, error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const toDdMmYyyy = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    if (!year || !month || !day) return '';
    return `${day}/${month}/${year}`;
  };

  // Vérification réelle via Supabase
  useEffect(() => {
    const checkActe = async () => {
      if (formData.num_acte.length < 10) {
        setVerificationStatus('idle');
        return;
      }

      setVerificationStatus('checking');
      
      try {
        const { data, error } = await supabase
          .from('naissancechain')
          .select('*')
          .eq('id_acte', formData.num_acte)
          .ilike('nom', formData.nom)
          .ilike('prenom', formData.prenom)
          .eq('date_naissance', toDdMmYyyy(formData.date_naissance))
          .single();

        if (!error && data) {
          setVerificationStatus('verified');
        } else {
          setVerificationStatus('error');
        }
      } catch (err) {
        setVerificationStatus('error');
      }
    };

    const debounce = setTimeout(checkActe, 500);
    return () => clearTimeout(debounce);
  }, [formData.num_acte]);

  const handleSubmitDemand = async () => {
    if (!user?.id) {
      setSubmitError('Utilisateur non authentifié. Veuillez vous reconnecter.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { data, error } = await supabase
        .from('documents_certifies')
        .insert([
          {
            citoyen_id: user.id,
            id_acte: formData.num_acte,
            statut_demande: 'EN_ATTENTE'
          }
        ])
        .select('id')
        .single();

      if (error) {
        setSubmitError(`Erreur lors de la création de la demande: ${error.message}`);
        return;
      }

      // Alignement Module 2: lier l'acte vérifié au citoyen courant si colonnes présentes.
      await supabase
        .from('citoyens')
        .update({
          id_acte_lie: formData.num_acte,
          statut_demande: 'EN_ATTENTE'
        })
        .eq('id', user.id);

      navigate('/traitement', { state: { documentId: data.id } });
    } catch (err) {
      setSubmitError('Une erreur inattendue est survenue lors de la soumission.');
    } finally {
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
            <span>SERVICES PUBLICS</span> <ChevronRight size={14} />
            <span>ÉTAT CIVIL</span> <ChevronRight size={14} />
            <span className="active">NOUVELLE DEMANDE</span>
          </nav>

          <div className="form-header animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="page-title">Formulaire de demande de titre</h2>
            <p className="page-subtitle">
              Veuillez vérifier vos informations pré-remplies et compléter les champs manquants pour initier votre demande de Carte Nationale d'Identité Biométrique.
            </p>
          </div>

          <div className="form-grid animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="form-sections">
              {/* Section Identité */}
              <section className="form-card">
                <div className="section-header-form">
                  <div className="icon-badge"><Info size={18} /></div>
                  <h3>Identité Personnelle</h3>
                </div>
                
                <div className="input-group-row">
                  <div className="input-field">
                    <label>NOM</label>
                    <input type="text" value={formData.nom} readOnly className="read-only" />
                  </div>
                  <div className="input-field">
                    <label>PRÉNOM</label>
                    <input type="text" value={formData.prenom} readOnly className="read-only" />
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
              </section>

              {/* Section Filiation */}
              <section className="form-card">
                <div className="section-header-form">
                  <div className="icon-badge"><Info size={18} /></div>
                  <h3>Filiation</h3>
                </div>
                <div className="input-group-row">
                  <div className="input-field">
                    <label>NOM COMPLET DU PÈRE</label>
                    <input type="text" value={formData.nom_pere} onChange={(e) => setFormData({...formData, nom_pere: e.target.value})} />
                  </div>
                </div>
                <div className="input-group-row">
                  <div className="input-field">
                    <label>NOM COMPLET DE LA MÈRE</label>
                    <input type="text" value={formData.nom_mere} onChange={(e) => setFormData({...formData, nom_mere: e.target.value})} />
                  </div>
                </div>
              </section>

              {/* Section Informations Légales */}
              <section className="form-card">
                <div className="section-header-form">
                  <div className="icon-badge"><Info size={18} /></div>
                  <h3>Informations Légales</h3>
                </div>
                <div className="input-field full">
                  <label>TYPE DE DOCUMENT</label>
                  <select
                    value={formData.type_document}
                    onChange={(e) => setFormData({ ...formData, type_document: e.target.value })}
                  >
                    <option value="Carte d'Identité">Carte d'Identité</option>
                    <option value="Passeport">Passeport</option>
                    <option value="Extrait de Naissance">Extrait de Naissance</option>
                    <option value="Permis de Conduire">Permis de Conduire</option>
                  </select>
                </div>
                <div className="input-field full">
                  <label>NUMÉRO D’ACTE DE NAISSANCE</label>
                  <div className="verification-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Ex: 001/RC/MATAM/2023" 
                      value={formData.num_acte}
                      onChange={(e) => setFormData({...formData, num_acte: e.target.value})}
                    />
                    {verificationStatus === 'verified' && <CheckCircle className="verify-icon success" size={20} />}
                    {verificationStatus === 'error' && <AlertCircle className="verify-icon error" size={20} />}
                  </div>
                  <p className="field-hint">Ce numéro se trouve sur le tampon officiel de votre acte de naissance.</p>
                </div>
              </section>

              <div className="form-actions">
                <button className="btn-cancel" onClick={() => navigate('/')}>Annuler la demande</button>
                <button 
                  className="btn-next" 
                  onClick={handleSubmitDemand}
                  disabled={verificationStatus !== 'verified' || isSubmitting}
                  style={{ opacity: verificationStatus !== 'verified' || isSubmitting ? 0.5 : 1 }}
                >
                  {isSubmitting ? 'Soumission...' : "Continuer vers l'étape suivante"}
                </button>
              </div>
              {submitError && (
                <p style={{ color: '#C92A2A', marginTop: '12px', fontSize: '13px' }}>{submitError}</p>
              )}
            </div>

            {/* Sidebar de droite */}
            <aside className="form-sidebar">
              <div className="progression-card">
                <div className="step active">
                  <div className="step-number">1</div>
                  <div className="step-label">Informations de base</div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-label">Justificatifs</div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-label">Paiement & RDV</div>
                </div>
              </div>

              <div className="warning-card">
                <Info size={20} />
                <p>Assurez-vous que les noms correspondent exactement à votre extrait d'acte de naissance.</p>
              </div>

              <div className="preview-card">
                <div className="preview-header">APERCU DU FUTUR TITRE</div>
                <div className="id-card-mock">
                  <img src="https://via.placeholder.com/280x180/006D44/FFFFFF?text=Specimen+CNI" alt="CNI Preview" />
                </div>
                <h4 className="preview-title">Spécimen CNI Biométrique</h4>
              </div>

              <div className="help-card-mini">
                <h4>Besoin d'aide ?</h4>
                <p>Nos conseillers sont disponibles pour vous guider.</p>
                <button className="btn-text">Contacter le support <ChevronRight size={16} /></button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemandForm;
