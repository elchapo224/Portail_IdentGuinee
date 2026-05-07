/**
 * DocumentGenere.jsx — Design documents officiels guinéens
 * CNI CEDEAO · Passeport biométrique · Acte de naissance · Permis de conduire
 */
import React, { useState, useEffect, useRef, Component } from 'react';
import Layout from '../components/layout/Layout';
import { ChevronRight, Download, Printer, CheckCircle, Info, X, Smartphone } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import './DocumentGenere.css';

// ── ErrorBoundary ──
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--danger)' }}>
        <h3>Erreur d'affichage du document</h3>
        <p>Veuillez recharger la page.</p>
      </div>
    );
    return this.props.children;
  }
}

// ── Helpers ──
const fmtDate = (v) => v
  ? new Date(v).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  : '—';

const fmtDateLong = (v) => v
  ? new Date(v).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  : '—';

const addYears = (y) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + y);
  return fmtDate(d);
};

const genNIN = (acte) => {
  const seed = (acte?.id_acte || 'GN00000').replace(/\D/g, '').padStart(6, '0');
  return `GIN${seed}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
};

// ══════════════════════════════════════════════════
//  CARTE NATIONALE D'IDENTITÉ CEDEAO — RECTO
// ══════════════════════════════════════════════════
const CarteIdentiteCEDEAO = ({ acte, user }) => {
  const nom    = (acte?.nom    || user?.nom    || 'NOM').toUpperCase();
  const prenom = (acte?.prenom || user?.prenom || 'PRÉNOM').toUpperCase();
  const ddn    = fmtDateLong(acte?.date_naissance || user?.date_naissance);
  const emis   = fmtDateLong(new Date());
  const expire = fmtDateLong(new Date(new Date().setFullYear(new Date().getFullYear() + 5)));
  const nin    = acte?.numero_identifiant_national || genNIN(acte);
  const lieu   = (acte?.lieu_naissance || 'CONAKRY').toUpperCase();
  const genre  = (acte?.genre || 'M').charAt(0).toUpperCase();
  const taille = acte?.taille || '1,75 m';
  const avatarSrc = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(prenom + '+' + nom)}&background=1a4a2a&color=fff&size=120`;

  return (
    <div className="doc-cni-card">
      {/* En-tête orange CEDEAO */}
      <div className="cni-header">
        <div className="cni-header-left">
          <div className="cni-ecowas-logo">🌍</div>
          <div>
            <div className="cni-republic">RÉPUBLIQUE DE GUINÉE</div>
            <div className="cni-type">CARTE D'IDENTITÉ CEDEAO</div>
            <div className="cni-type-en">ECOWAS IDENTITY CARD / BILHETE DE IDENTIDADE CEDEAO</div>
          </div>
        </div>
        <div className="cni-flag">
          <div className="flag-r"></div>
          <div className="flag-g"></div>
          <div className="flag-b"></div>
        </div>
      </div>

      {/* Corps */}
      <div className="cni-body">
        {/* Photo */}
        <div className="cni-photo-col">
          <img src={avatarSrc} alt="Photo" className="cni-photo" />
          <div className="cni-sig-label">Signature / Signature</div>
          <div className="cni-sig-line"></div>
        </div>

        {/* Données */}
        <div className="cni-data-col">
          <div className="cni-field">
            <span className="cni-label">Nom / Surname</span>
            <span className="cni-value bold">{nom}</span>
          </div>
          <div className="cni-field">
            <span className="cni-label">Prénom / First name</span>
            <span className="cni-value bold">{prenom}</span>
          </div>
          <div className="cni-field">
            <span className="cni-label">Nationalité / Nationality</span>
            <span className="cni-value">GUINÉENNE</span>
          </div>
          <div className="cni-field">
            <span className="cni-label">Date de naissance / Date of birth</span>
            <span className="cni-value">{ddn}</span>
          </div>
          <div className="cni-field">
            <span className="cni-label">Date d'émission / Date of issuance</span>
            <span className="cni-value">{emis}</span>
          </div>
          <div className="cni-field">
            <span className="cni-label">Date d'expiration / Date of expiry</span>
            <span className="cni-value">{expire}</span>
          </div>
          <div className="cni-field">
            <span className="cni-label">Numéro d'identité / ID number</span>
            <span className="cni-value mono">{nin}</span>
          </div>
          <div className="cni-field">
            <span className="cni-label">Lieu de délivrance / Place of issuance</span>
            <span className="cni-value">{lieu} / M.S.P.C</span>
          </div>
        </div>

        {/* Sexe & Taille */}
        <div className="cni-right-col">
          <div className="cni-field" style={{ textAlign: 'right' }}>
            <span className="cni-label">Sexe / Sex</span>
            <span className="cni-value bold">{genre}</span>
          </div>
          <div className="cni-field" style={{ textAlign: 'right' }}>
            <span className="cni-label">Taille / Height</span>
            <span className="cni-value">{taille}</span>
          </div>
          <div className="cni-thumb-area">
            <div className="cni-thumb-box">👆</div>
            <div className="cni-thumb-label">Empreinte</div>
          </div>
        </div>
      </div>

      {/* Fond watermark */}
      <div className="cni-watermark">🛡</div>
    </div>
  );
};

// ── Verso CNI ──
const CarteIdentiteVerso = ({ acte }) => {
  const nin    = acte?.numero_identifiant_national || genNIN(acte);
  const region = (acte?.region || 'CONAKRY').toUpperCase();
  const commune= (acte?.commune || 'KALOUM').toUpperCase();
  const quartier= (acte?.quartier || 'CENTRE').toUpperCase();
  const secteur = acte?.secteur || '01';
  const mrzLine1 = `I<GIN${nin.replace(/\D/g,'').substring(0,10).padEnd(10,'<')}<<<<<<<<<<`;
  const mrzLine2 = `${nin.replace(/\D/g,'').substring(0,9).padEnd(9,'<')}GIN<<<<<<<<<<`;
  const mrzLine3 = `${(acte?.nom||'NOM').toUpperCase().replace(/\s/g,'<')}<<${(acte?.prenom||'PRENOM').toUpperCase().replace(/\s/g,'<')}<<<<<<<<`;

  return (
    <div className="doc-cni-verso">
      {/* En-tête verso */}
      <div className="cni-verso-header">
        <div className="cni-chip">📡</div>
        <div className="cni-verso-title">
          <div className="cni-code-pays">GIN</div>
          <div className="cni-autorite">Le Directeur Général de la Police Nationale</div>
          <div className="cni-republic-small">RÉPUBLIQUE DE GUINÉE</div>
        </div>
        <div className="cni-flag-small">
          <div className="flag-r"></div>
          <div className="flag-g"></div>
          <div className="flag-b"></div>
        </div>
      </div>

      {/* NIN */}
      <div className="cni-nin-row">
        <span className="cni-nin-label">NIN</span>
        <span className="cni-nin-val">{nin}</span>
      </div>

      {/* Autorité + signature */}
      <div className="cni-verso-sig">Autorité de délivrance</div>
      <div className="cni-sig-text-verso">Le Directeur Général de la Police Nationale</div>
      <div className="cni-sig-img">〜〜〜〜〜〜〜</div>

      {/* Localisation */}
      <div className="cni-verso-grid">
        <div className="cni-verso-field">
          <span className="cni-label">Lieu de naissance</span>
          <span className="cni-value bold">{(acte?.lieu_naissance||'CONAKRY').toUpperCase()}</span>
        </div>
        <div className="cni-verso-field">
          <span className="cni-label">Région/Region</span>
          <span className="cni-value bold">{region}</span>
          <span className="cni-label" style={{marginTop:4}}>Préfecture</span>
          <span className="cni-value">{region}</span>
        </div>
        <div className="cni-verso-field">
          <span className="cni-label">Sous-préfecture/Commune</span>
          <span className="cni-value bold">{commune}</span>
          <span className="cni-label" style={{marginTop:4}}>Quartier/District</span>
          <span className="cni-value">{quartier}</span>
          <span className="cni-label" style={{marginTop:4}}>Secteur/Village</span>
          <span className="cni-value">{secteur}</span>
        </div>
      </div>

      {/* Bande MRZ */}
      <div className="cni-mrz">
        <div className="mrz-line">{mrzLine1}</div>
        <div className="mrz-line">{mrzLine2}</div>
        <div className="mrz-line">{mrzLine3.substring(0,30)}</div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════
//  PASSEPORT BIOMÉTRIQUE
// ══════════════════════════════════════════════════
const PasseportBiometrique = ({ acte, user, documentId }) => {
  const nom    = (acte?.nom    || user?.nom    || 'NOM').toUpperCase();
  const prenom = (acte?.prenom || user?.prenom || 'PRÉNOM').toUpperCase();
  const ddn    = fmtDateLong(acte?.date_naissance);
  const emis   = new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }).toUpperCase().replace('.','');
  const expire = new Date(new Date().setFullYear(new Date().getFullYear()+10)).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }).toUpperCase().replace('.','');
  const numPasseport = `GN${Math.floor(Math.random()*90000000+10000000)}`;
  const numPersonnel = acte?.numero_identifiant_national || genNIN(acte);
  const lieu   = (acte?.lieu_naissance || 'CONAKRY').toUpperCase();
  const genre  = (acte?.genre || 'M').charAt(0).toUpperCase();
  const avatarSrc = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(prenom + '+' + nom)}&background=1a1a3a&color=fff&size=120`;

  const mrz1 = `P<GIN${nom}<<${prenom}`.substring(0,44).padEnd(44,'<');
  const mrz2 = `${numPasseport}GIN${ddn.replace(/\//g,'').substring(0,6)}M${expire.replace(/\//g,'').substring(0,6)}${numPersonnel.replace(/\D/g,'').substring(0,14).padEnd(14,'<')}`.substring(0,44);

  return (
    <div className="doc-passport">
      {/* Couverture simulée */}
      <div className="passport-cover-strip">
        <span>PASSEPORT / PASSPORT</span>
        <span>REPUBLIQUE DE GUINEE / REPUBLIC OF GUINEA</span>
      </div>

      {/* Page données */}
      <div className="passport-body">
        <div className="passport-header">
          <div>
            <div className="passport-republic">REPUBLIQUE DE GUINEE</div>
            <div className="passport-type-row">
              <div>
                <div className="passport-mini-label">PASSEPORT/PASSPORT</div>
              </div>
              <div>
                <div className="passport-mini-label">Type/Type</div>
                <div className="passport-mini-val">P</div>
              </div>
              <div>
                <div className="passport-mini-label">Code du Pays/Country Code</div>
                <div className="passport-mini-val">GIN</div>
              </div>
              <div>
                <div className="passport-mini-label">Passeport No/Passport No</div>
                <div className="passport-mini-val bold">{numPasseport}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="passport-content">
          {/* Photo + empreinte */}
          <div className="passport-photo-col">
            <img src={avatarSrc} alt="Photo" className="passport-photo" />
            <div className="passport-thumb">
              <div className="passport-thumb-box">👆</div>
              <div className="passport-thumb-label">Empreinte</div>
            </div>
          </div>

          {/* Données biographiques */}
          <div className="passport-data-col">
            <div className="passport-field-row">
              <div className="passport-field">
                <div className="passport-label">Nom/Surname</div>
                <div className="passport-val bold">{nom}</div>
              </div>
            </div>
            <div className="passport-field-row">
              <div className="passport-field">
                <div className="passport-label">Prénom/Given Names</div>
                <div className="passport-val bold">{prenom}</div>
              </div>
            </div>
            <div className="passport-field-row">
              <div className="passport-field">
                <div className="passport-label">Nationalité/Nationality</div>
                <div className="passport-val">GUINÉENNE</div>
              </div>
              <div className="passport-field">
                <div className="passport-label">Numéro Personnel/Personal No</div>
                <div className="passport-val mono">{numPersonnel.substring(0,16)}</div>
              </div>
            </div>
            <div className="passport-field-row">
              <div className="passport-field">
                <div className="passport-label">Sexe/Sex</div>
                <div className="passport-val">{genre}</div>
              </div>
              <div className="passport-field">
                <div className="passport-label">Lieu de Naissance/Place of Birth</div>
                <div className="passport-val">{lieu}</div>
              </div>
            </div>
            <div className="passport-field-row">
              <div className="passport-field">
                <div className="passport-label">Date de Naissance/Date of Birth</div>
                <div className="passport-val">{ddn}</div>
              </div>
              <div className="passport-field">
                <div className="passport-label">Autorité/Authority</div>
                <div className="passport-val">DCPAF</div>
              </div>
            </div>
            <div className="passport-field-row">
              <div className="passport-field">
                <div className="passport-label">Date de Délivrance/Date of Issue</div>
                <div className="passport-val">{emis}</div>
              </div>
              <div className="passport-field">
                <div className="passport-label">Date d'Expiration/Date of Expiry</div>
                <div className="passport-val">{expire}</div>
              </div>
            </div>
          </div>
        </div>

        {/* MRZ */}
        <div className="passport-mrz">
          <div className="mrz-line">{mrz1}</div>
          <div className="mrz-line">{mrz2}</div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════
//  ACTE DE NAISSANCE OFFICIEL
// ══════════════════════════════════════════════════
const ActeNaissance = ({ acte, user, documentId }) => {
  const nom    = (acte?.nom    || user?.nom    || 'Nom').toUpperCase();
  const prenom = (acte?.prenom || user?.prenom || 'Prénom');
  const ddn    = acte?.date_naissance ? new Date(acte.date_naissance).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric' }) + ' ' + '04:00' : '01/01/2000 08:00';
  const lieu   = (acte?.lieu_naissance || 'Conakry').toUpperCase();
  const prefecture = (acte?.region || acte?.lieu_naissance || 'CONAKRY').toUpperCase();
  const commune = (acte?.commune || lieu).toUpperCase();
  const souspref = (acte?.secteur || commune).toUpperCase();
  const nomPere  = (acte?.nom_pere  || 'PÈRE INCONNU').toUpperCase();
  const nomMere  = (acte?.nom_mere  || 'MÈRE INCONNUE').toUpperCase();
  const genre = (acte?.genre === 'F' || acte?.genre === 'Féminin') ? 'FÉMININ' : 'MASCULIN';
  const numCert  = acte?.id_acte || `B${Math.floor(Math.random()*9999999999)}`;
  const numIdNat = acte?.numero_identifiant_national || `${Math.floor(Math.random()*99999999999)}`;
  const officier = acte?.officier_etat_civil || 'OFFICIER DE L\'ÉTAT CIVIL DÉLÉGUÉ';
  const dateDresse = new Date().toLocaleDateString('fr-FR');

  return (
    <div className="doc-acte-naissance">
      {/* Bordure ornementale */}
      <div className="acte-border-outer">
        <div className="acte-border-inner">

          {/* En-tête */}
          <div className="acte-header">
            <div className="acte-barcode">▐▌▌▐▌▐▌▌▐▌▌▐▌▐▌</div>
            <div className="acte-header-refs">
              <div className="acte-ref-line">Numéro de certificat : <strong>{numCert}</strong></div>
              <div className="acte-ref-line">République de Guinée</div>
              <div className="acte-ref-line">Numéro d'identification National : <strong>{numIdNat}</strong></div>
            </div>
          </div>

          {/* Sceau + Titre */}
          <div className="acte-title-block">
            <div className="acte-seal">🦅</div>
            <h1 className="acte-main-title">Acte de Naissance</h1>
            <h2 className="acte-sub-title">Certificate of Birth</h2>
            <h3 className="acte-sub-fr">Acte De Naissance</h3>
          </div>

          {/* Localisation */}
          <div className="acte-location-grid">
            <div className="acte-loc-cell border-right">
              <span className="acte-loc-label">Ville / Préfecture :</span>
              <span className="acte-loc-val">{prefecture}</span>
            </div>
            <div className="acte-loc-cell">
              <span className="acte-loc-label">Je Soussigné(e) :</span>
              <span className="acte-loc-val">{officier}</span>
            </div>
          </div>
          <div className="acte-location-grid" style={{ borderTop: 0 }}>
            <div className="acte-loc-cell">
              <span className="acte-loc-label">Commune :</span>
              <span className="acte-loc-val">{commune}</span>
            </div>
          </div>

          {/* ── ENFANT ── */}
          <div className="acte-section-title">ENFANT</div>
          <div className="acte-data-grid">
            <div className="acte-data-row">
              <div className="acte-data-cell">
                <span className="acte-data-label">Prénom(s) :</span>
                <span className="acte-data-val">{prenom.toUpperCase()}</span>
              </div>
            </div>
            <div className="acte-data-row">
              <div className="acte-data-cell">
                <span className="acte-data-label">Nom :</span>
                <span className="acte-data-val">{nom}</span>
              </div>
            </div>
            <div className="acte-data-row split">
              <div className="acte-data-cell border-right">
                <span className="acte-data-label">Lieu de naissance Région de : {prefecture}</span>
                <span className="acte-data-val">Sous-préfecture: {souspref}</span>
              </div>
              <div className="acte-data-cell">
                <span className="acte-data-label">Date et Heure de Naissance :</span>
                <span className="acte-data-val">{ddn}</span>
              </div>
            </div>
            <div className="acte-data-row split">
              <div className="acte-data-cell border-right">
                <span className="acte-data-label">Sexe :</span>
                <span className="acte-data-val">{genre}</span>
              </div>
              <div className="acte-data-cell">
                <span className="acte-data-label">Nationalité :</span>
                <span className="acte-data-val">GUINÉENNE</span>
              </div>
            </div>
          </div>

          {/* ── PÈRE ── */}
          <div className="acte-section-title">PÈRE</div>
          <div className="acte-data-grid">
            <div className="acte-data-row">
              <div className="acte-data-cell">
                <span className="acte-data-label">Nom :</span>
                <span className="acte-data-val">{nomPere}</span>
              </div>
            </div>
            <div className="acte-data-row split">
              <div className="acte-data-cell border-right">
                <span className="acte-data-label">Date de naissance :</span>
                <span className="acte-data-val">—</span>
              </div>
              <div className="acte-data-cell">
                <span className="acte-data-label">Numéro d'identification :</span>
                <span className="acte-data-val">NA</span>
              </div>
            </div>
            <div className="acte-data-row split">
              <div className="acte-data-cell border-right">
                <span className="acte-data-label">Nationalité :</span>
                <span className="acte-data-val">GUINÉENNE</span>
              </div>
              <div className="acte-data-cell">
                <span className="acte-data-label">Profession :</span>
                <span className="acte-data-val">{(acte?.profession_pere || 'CULTIVATEUR').toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* ── MÈRE ── */}
          <div className="acte-section-title">MÈRE</div>
          <div className="acte-data-grid">
            <div className="acte-data-row">
              <div className="acte-data-cell">
                <span className="acte-data-label">Nom :</span>
                <span className="acte-data-val">{nomMere}</span>
              </div>
            </div>
            <div className="acte-data-row split">
              <div className="acte-data-cell border-right">
                <span className="acte-data-label">Nationalité :</span>
                <span className="acte-data-val">GUINÉENNE</span>
              </div>
              <div className="acte-data-cell">
                <span className="acte-data-label">Profession :</span>
                <span className="acte-data-val">MÉNAGÈRE</span>
              </div>
            </div>
          </div>

          {/* ── DÉCLARANT ── */}
          <div className="acte-section-title">DÉCLARANT</div>
          <div className="acte-data-grid">
            <div className="acte-data-row split">
              <div className="acte-data-cell border-right">
                <span className="acte-data-label">Nom :</span>
                <span className="acte-data-val">{nomPere}</span>
              </div>
              <div className="acte-data-cell">
                <span className="acte-data-label">Lien de Parenté :</span>
                <span className="acte-data-val">PÈRE</span>
              </div>
            </div>
          </div>

          {/* APPROUVÉ PAR */}
          <div className="acte-section-title">APPROUVÉ PAR</div>
          <div className="acte-approved-block">
            <div className="acte-justice-seal">⚖️ JUSTICE</div>
          </div>

          {/* Pied */}
          <div className="acte-footer">
            <div className="acte-footer-left">
              <p className="acte-dresse">Dressé le : {dateDresse}</p>
              <p className="acte-officier-label">{officier}</p>
              <div className="acte-stamp">
                <div className="stamp-circle">
                  <div className="stamp-inner">
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#006D44', textAlign: 'center' }}>
                      Officier de<br />l'état civil<br />Délégué
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="acte-footer-right">
              {documentId && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(window.location.origin + '/verify/' + documentId)}`}
                  alt="QR Vérification"
                  className="acte-qr"
                />
              )}
              <div className="acte-seal-rouge">🔴</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════
//  PERMIS DE CONDUIRE
// ══════════════════════════════════════════════════
const PermisConduire = ({ acte, user, documentId }) => {
  const nom    = (acte?.nom    || user?.nom    || 'NOM').toUpperCase();
  const prenom = (acte?.prenom || user?.prenom || 'Prénom');
  const ddn    = fmtDate(acte?.date_naissance);
  const lieuNaiss = acte?.lieu_naissance || 'Conakry';
  const lieuDeliv = 'Conakry';
  const dateDeliv = fmtDate(new Date());
  const numPC    = Math.floor(Math.random() * 90000000 + 10000000).toString().padStart(8, '0');
  const groupeSang = acte?.groupe_sanguin || 'O+';
  const avatarSrc = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(prenom + '+' + nom)}&background=2a1a0a&color=fff&size=120`;

  const categories = [
    { cat: 'A', img: '🏍', date: null },
    { cat: 'B', img: '🚗', date: dateDeliv },
    { cat: 'C', img: '🚛', date: dateDeliv },
    { cat: 'D', img: '🚌', date: dateDeliv },
    { cat: 'E', img: '🚜', date: null },
    { cat: 'F', img: '🚁', date: null },
    { cat: 'G', img: '🚤', date: null },
  ];

  return (
    <div className="doc-permis">
      {/* Recto */}
      <div className="permis-recto">
        <div className="permis-recto-header">
          <div className="permis-flag-strip">
            <div className="flag-r sm"></div>
            <div className="flag-g sm"></div>
            <div className="flag-b sm"></div>
          </div>
          <div className="permis-title-group">
            <div className="permis-republic">RÉPUBLIQUE DE GUINÉE</div>
            <div className="permis-type">PERMIS DE CONDUIRE</div>
          </div>
          <div className="permis-ecowas">🌍</div>
        </div>

        <div className="permis-body-recto">
          <div className="permis-photo-col">
            <img src={avatarSrc} alt="Photo" className="permis-photo" />
            <div className="permis-sig-label">Signature de titulaire</div>
            <div className="permis-sig-line"></div>
          </div>

          <div className="permis-data-col">
            <div className="permis-field">
              <span className="permis-label">Nom:</span>
              <span className="permis-val bold">{nom}</span>
            </div>
            <div className="permis-field">
              <span className="permis-label">Prénom:</span>
              <span className="permis-val bold">{prenom.toUpperCase()}</span>
            </div>
            <div className="permis-field">
              <span className="permis-label">Date de naissance:</span>
              <span className="permis-val">{ddn}</span>
            </div>
            <div className="permis-field">
              <span className="permis-label">Lieu de naissance:</span>
              <span className="permis-val">{lieuNaiss.toUpperCase()}</span>
            </div>
            <div className="permis-field">
              <span className="permis-label">Lieu de délivrance:</span>
              <span className="permis-val">{lieuDeliv.toUpperCase()}</span>
            </div>
            <div className="permis-field">
              <span className="permis-label">Date de délivrance:</span>
              <span className="permis-val">{dateDeliv}</span>
            </div>
            <div className="permis-field">
              <span className="permis-label">Numéro de PC:</span>
              <span className="permis-val bold red">{numPC}</span>
            </div>
            <div className="permis-field">
              <span className="permis-label">Groupe sanguin:</span>
              <span className="permis-val">{groupeSang}</span>
            </div>
          </div>

          <div className="permis-right-col">
            {documentId && (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${encodeURIComponent(window.location.origin + '/verify/' + documentId)}`}
                alt="QR"
                className="permis-qr"
              />
            )}
          </div>
        </div>
      </div>

      {/* Verso — catégories */}
      <div className="permis-verso">
        <div className="permis-verso-header">
          <div>
            <div className="permis-verso-num">{numPC}</div>
          </div>
          <div className="permis-verso-stamp">
            <div className="permis-stamp-circle">
              <div style={{ fontSize: 8, textAlign: 'center', color: '#006D44' }}>
                Le Directeur<br />National
              </div>
            </div>
          </div>
        </div>

        <div className="permis-categories">
          <div className="permis-cat-header">
            <span>Catégories</span>
            <span>Date d'expiration</span>
          </div>
          {categories.map(c => (
            <div key={c.cat} className="permis-cat-row">
              <div className="permis-cat-code">{c.cat}</div>
              <div className="permis-cat-img">{c.img}</div>
              <div className="permis-cat-date">{c.date || ''}</div>
              <div className="permis-cat-check">{c.date ? '☑' : '☐'}</div>
            </div>
          ))}
        </div>

        <div className="permis-verso-expiry">
          <span>Date fin de validité : </span>
          <span className="bold">{new Date(new Date().setFullYear(new Date().getFullYear()+5)).toLocaleDateString('fr-FR')}</span>
        </div>
        <div className="permis-verso-qr">
          {documentId && (
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.origin + '/verify/' + documentId)}`}
              alt="QR verso"
              className="permis-qr-verso"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════
//  PAGE PRINCIPALE
// ══════════════════════════════════════════════════
const DocumentGenereContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const documentId = location.state?.documentId;
  const typeDoc = location.state?.type_document || "Carte d'Identité";
  const printRef = useRef(null);

  const [docData, setDocData]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!documentId || !user?.id) { setLoading(false); return; }
      try {
        const { data } = await supabase
          .from('documents_certifies')
          .select('*')
          .eq('id', documentId)
          .maybeSingle();
        setDocData(data);
      } catch { /* silencieux */ }
      setLoading(false);
    };
    fetchDocument();
  }, [documentId, user?.id]);

  // Fusionner les données acte + document certifié + user
  const acte = {
    ...( user?.acteData || {}),
    ...(docData || {}),
    nom:    docData?.nom    || user?.acteData?.nom    || user?.nom,
    prenom: docData?.prenom || user?.acteData?.prenom || user?.prenom,
    date_naissance: docData?.date_naissance || user?.acteData?.date_naissance || user?.date_naissance,
    lieu_naissance: docData?.lieu_naissance || user?.acteData?.lieu_naissance || user?.lieu_naissance,
    genre:  docData?.genre  || user?.acteData?.genre  || user?.genre,
    hash_blockchain: docData?.hash_document || user?.acteData?.hash_blockchain,
    id_acte: docData?.id_acte || user?.acteData?.id_acte || user?.id_acte_lie,
  };

  const handlePrint = () => window.print();

  const renderDocument = () => {
    const t = typeDoc.toLowerCase();
    if (t.includes('passeport'))                     return <PasseportBiometrique acte={acte} user={user} documentId={documentId} />;
    if (t.includes('naissance') || t.includes('extrait')) return <ActeNaissance acte={acte} user={user} documentId={documentId} />;
    if (t.includes('permis'))                        return <PermisConduire acte={acte} user={user} documentId={documentId} />;
    // Défaut : CNI CEDEAO (recto + verso)
    return (
      <>
        <CarteIdentiteCEDEAO acte={acte} user={user} />
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 8, fontWeight: 600 }}>VERSO — Carte Nationale d'Identité</p>
          <CarteIdentiteVerso acte={acte} />
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: 64, textAlign: 'center' }}>
          <div className="step-loader" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-faint)', fontSize: 14 }}>Génération du document officiel...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="doc-page-content animate-fade-in">

        {/* Fil d'Ariane */}
        <nav className="breadcrumbs animate-slide-up" style={{ marginBottom: 20 }}>
          <span>MES DOCUMENTS</span>
          <ChevronRight size={13} />
          <span className="active">{typeDoc}</span>
        </nav>

        {/* En-tête */}
        <div className="doc-header-section animate-slide-up">
          <div>
            <h1 className="page-title">Document généré ✅</h1>
            <p className="page-subtitle">Document officiel sécurisé par les services de l'État guinéen — NaissanceChain.</p>
          </div>
          <div className="doc-header-actions">
            <button className="btn-secondary-doc" onClick={handlePrint}>
              <Printer size={16} /> Imprimer
            </button>
            <button className="btn-primary-doc" onClick={handlePrint}>
              <Download size={16} /> Télécharger PDF
            </button>
          </div>
        </div>

        {/* Document */}
        <div className="document-wrapper animate-slide-up" ref={printRef}>
          <ErrorBoundary>
            {renderDocument()}
          </ErrorBoundary>
        </div>

        {/* Hash blockchain */}
        {acte.hash_blockchain && (
          <div className="hash-display animate-slide-up">
            <div className="hash-label">🔗 Empreinte NaissanceChain (SHA-256)</div>
            <div className="hash-value">{acte.hash_blockchain}</div>
          </div>
        )}

        {/* Portefeuille */}
        <div className="wallet-panel animate-slide-up">
          <div className="wallet-info-card">
            <Info size={18} />
            <div>
              <p style={{ fontWeight: 700, margin: 0 }}>Portefeuille numérique</p>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 13 }}>
                Conservez une copie sécurisée de votre document sur votre appareil.
              </p>
            </div>
          </div>
          <button className="btn-secondary-doc" onClick={() => setWalletOpen(true)}>
            <Smartphone size={16} /> Ajouter au portefeuille
          </button>
        </div>

        {walletOpen && (
          <div className="wallet-modal">
            <div className="wallet-modal-card">
              <button className="wallet-close" onClick={() => setWalletOpen(false)}><X size={18} /></button>
              {walletAdded ? (
                <div style={{ textAlign: 'center' }}>
                  <CheckCircle size={42} color="var(--primary)" />
                  <h3 style={{ margin: '12px 0 8px' }}>Document ajouté !</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Votre document est disponible dans votre portefeuille numérique.</p>
                  <button className="btn-primary-doc" onClick={() => { setWalletAdded(false); setWalletOpen(false); }}>Fermer</button>
                </div>
              ) : (
                <>
                  <h3 style={{ margin: '0 0 8px' }}>Ajouter au portefeuille</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 20px' }}>
                    Cette action conserve une copie sécurisée sur votre appareil mobile.
                  </p>
                  <button className="btn-primary-doc" onClick={() => setWalletAdded(true)}>
                    <CheckCircle size={16} /> Ajouter
                  </button>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

const DocumentGenere = () => (
  <ErrorBoundary>
    <DocumentGenereContent />
  </ErrorBoundary>
);

export default DocumentGenere;
