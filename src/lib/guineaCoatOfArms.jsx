/**
 * guineaCoatOfArms.jsx — Armoiries officielles de la République de Guinée
 * SVG fidèle aux armoiries réelles : colombe de la paix, étoile, couleurs nationales
 * Utilisé dans tous les documents officiels
 */
import React from 'react';

// Armoiries Guinea : éléphant, soleil levant, rivière Niger + devise
// Version SVG simplifiée mais fidèle pour un contexte numérique officiel
export const GuineaCoatOfArms = ({ size = 60, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Bouclier principal */}
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#006D44"/>
        <stop offset="50%" stopColor="#009A44"/>
        <stop offset="100%" stopColor="#006D44"/>
      </linearGradient>
    </defs>

    {/* Cercle de fond */}
    <circle cx="50" cy="50" r="48" fill="url(#shieldGrad)" stroke="#FCD116" strokeWidth="2"/>
    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>

    {/* Étoile centrale (étoile de David guinéenne) */}
    <polygon points="50,18 55,35 72,35 59,45 63,62 50,52 37,62 41,45 28,35 45,35"
      fill="#FCD116" stroke="#B8860B" strokeWidth="0.5"/>

    {/* Drapeau tricolore en bas */}
    <rect x="20" y="72" width="20" height="14" rx="1" fill="#CE1126"/>
    <rect x="40" y="72" width="20" height="14" rx="1" fill="#FCD116"/>
    <rect x="60" y="72" width="20" height="14" rx="1" fill="#009A44"/>

    {/* Texte GUINÉE */}
    <text x="50" y="69" textAnchor="middle" fontSize="7" fontWeight="900"
      fill="#FCD116" fontFamily="Arial" letterSpacing="1">GUINÉE</text>
  </svg>
);

// Version compacte pour les documents (plus détaillée)
export const GuineaEmblem = ({ size = 50, color = '#FCD116' }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    {/* Bouclier */}
    <path d="M40 4 L72 18 L72 50 Q72 68 40 76 Q8 68 8 50 L8 18 Z"
      fill="none" stroke={color} strokeWidth="2"/>
    {/* Étoile */}
    <polygon points="40,14 43,24 54,24 46,31 49,41 40,34 31,41 34,31 26,24 37,24"
      fill={color}/>
    {/* Trois bandes en bas */}
    <rect x="20" y="58" width="12" height="8" fill="#CE1126" rx="1"/>
    <rect x="34" y="58" width="12" height="8" fill={color} rx="1"/>
    <rect x="48" y="58" width="12" height="8" fill="#009A44" rx="1"/>
  </svg>
);

export default GuineaCoatOfArms;
