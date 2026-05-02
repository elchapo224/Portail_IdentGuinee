import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, BarChart2, ShieldCheck, Lock, Zap } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { supabase } from '../lib/supabase';
import './Processing.css';

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const documentId = location.state?.documentId;
  const documentType = location.state?.documentType;
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animation de la barre de progression
    const progressInterval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return oldProgress + 2;
      });
    }, 100); // 5 secondes au total (100 * 50ms)

    // Gestion des étapes visuelles
    const step2Timer = setTimeout(() => setStep(2), 1500);
    const step3Timer = setTimeout(() => setStep(3), 3500);
    const finishTimer = setTimeout(async () => {
      if (documentId) {
        await supabase
          .from('documents_certifies')
          .update({ statut_demande: 'TERMINEE', statut: 'GENERE' })
          .eq('id', documentId);
      }
      navigate('/document-genere', { state: { documentType } });
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      clearTimeout(finishTimer);
    };
  }, [documentId, navigate]);

  return (
    <div className="layout-wrapper">
      <Sidebar />
      <main className="main-content">
        <Header />
        
        <div className="processing-content animate-fade-in">
          <div className="processing-header">
            <div className="system-status-badge animate-slide-up">
              <span className="pulse-dot"></span> SYSTÈME SÉCURISÉ ACTIF
            </div>
            <h1 className="processing-title animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Traitement en cours...
            </h1>
            <p className="processing-subtitle animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Nous analysons vos informations en temps réel grâce à notre infrastructure souveraine hautement sécurisée.
            </p>
          </div>

          <div className="processing-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="steps-container">
              {/* Etape 1 */}
              <div className={`processing-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <div className="step-icon-wrapper">
                  <CheckCircle size={32} />
                </div>
                <h4>Vérification Registre</h4>
                <div className="step-status">{step > 1 ? 'TERMINÉ' : 'EN COURS'}</div>
                <p>Identification au registre national de naissance guinéen effectuée avec succès.</p>
              </div>

              {/* Etape 2 */}
              <div className={`processing-step ${step >= 2 ? 'active' : 'waiting'} ${step > 2 ? 'completed' : ''}`}>
                <div className="step-icon-wrapper">
                  <BarChart2 size={32} />
                </div>
                <h4>Analyse des données</h4>
                <div className="step-status">{step > 2 ? 'TERMINÉ' : step === 2 ? 'EN COURS' : 'EN ATTENTE'}</div>
                <p>Analyse biométrique et croisement des métadonnées gouvernementales.</p>
              </div>

              {/* Etape 3 */}
              <div className={`processing-step ${step >= 3 ? 'active' : 'waiting'} ${step > 3 ? 'completed' : ''}`}>
                <div className="step-icon-wrapper outline">
                  <ShieldCheck size={32} />
                </div>
                <h4>Validation automatique</h4>
                <div className="step-status">{step === 3 ? 'EN COURS' : 'EN ATTENTE'}</div>
                <p>Délivrance finale du certificat numérique et authentification de la demande.</p>
              </div>
            </div>

            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="info-cards-row animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="info-card warning">
              <div className="info-icon"><Lock size={24} /></div>
              <div className="info-text">
                <h4>Garantie d'intégrité</h4>
                <p><strong>Aucune intervention humaine</strong> n'est requise durant cette étape. Le processus est régi par des protocoles cryptographiques stricts pour garantir la neutralité.</p>
              </div>
            </div>

            <div className="info-card success">
              <div className="info-icon"><Zap size={24} /></div>
              <div className="info-text">
                <h4>Rapidité IdentiGuinée</h4>
                <p>Grâce à l'infrastructure fibre optique nationale, le temps de traitement moyen a été réduit de 14 jours à moins de 30 secondes.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Processing;
