# IdentiGuinée — Portail Citoyen v5.0
## Projet GN-02 · MIABE Hackathon 2026 · Équipe Commit United

---

## 🇬🇳 République de Guinée — Travail · Justice · Solidarité

**IdentiGuinée** est une plateforme officielle d'identité numérique citoyenne basée sur la blockchain NaissanceChain. Elle permet à chaque citoyen guinéen de demander et vérifier ses documents d'identité officiels de façon transparente, sans corruption et sans intermédiaire.

---

## Stack Technique

| Couche | Technologie |
|--------|------------|
| Frontend | React 18 + Vite |
| Base de données | Supabase (PostgreSQL + RLS) |
| Blockchain simulée | NaissanceChain (hachage SHA-256) |
| Auth | Supabase Auth + sessions admin sécurisées |
| Déploiement | Vercel |

---

## Changelog v5.0 (Audit Jury Senior — Mai 2026)

### 🔐 Sécurité & Corrections critiques
- **Numéros de documents stables** : `mkNIN` et `mkPassNum` maintenant déterministes (hash basé sur `id_acte`). Plus de re-génération à chaque render React.
- **Ministère corrigé** : Verify.jsx référençait le "Ministère de la Justice" pour l'état civil → corrigé en **MATD — Direction Nationale de l'État Civil**.
- **Template literals** : tous les `\${}` mal échappés corrigés dans DocumentGenere.jsx.

### 🎨 Design & Authenticité Officielle
- **CNI couleur rose/fuchsia (#9B1B5A)** : conforme au document officiel guinéen (Décret D/95/254). Fonds, bordures, MRZ et textes mis à jour.
- **Armoiries SVG** : remplacement de l'emoji 🦅 par des armoiries SVG fidèles (étoile + drapeau tricolore) dans tous les documents.
- **Drapeau tricolore** (Rouge/Or/Vert) ajouté dans : Login, Sidebar, Header mobile, AdminLayout, HeroBanner, Verifier, DemandForm.
- **Devise nationale** "Travail · Justice · Solidarité" visible dans : Login (tagline), HeroBanner, Sidebar footer, Verifier.

### 📄 Documents Officiels — Conformité
- **Acte de naissance** : mention de la **Loi L/2015/013/AN du 6 Juillet 2015** (modernisation état civil) ajoutée.
- **Passeport** : mention de la norme **OACI 9303** ajoutée.
- **Ordonnance N° 92-027/PRG/SGG du 12 Mai 1992** : maintenue et contextualisée.

### 💰 Tarifs Officiels Harmonisés (conformes aux tarifs guinéens réels)
| Document | Ancien tarif | Nouveau tarif | Délai |
|----------|-------------|---------------|-------|
| CNI Biométrique | Gratuit | **50 000 GNF** | 72h ouvrables |
| Passeport | 500 000 GNF | **500 000 GNF** | 15 jours |
| Extrait de naissance | 15 000 GNF | **10 000 GNF** | 24h ouvrables |
| Permis de conduire | 250 000 GNF | **150 000 GNF** | 7 jours |

### 🏛️ Branding Républicain
- **Login** : drapeau + devise + badge "Projet GN-02 · MIABE Hackathon 2026".
- **Dashboard** : ServiceCards affichent maintenant le prix et le délai de chaque document.
- **AdminDashboard** : titre mis à jour "Surveillance NaissanceChain" + badge République.
- **Processing** : logs de traitement avec terminologie officielle [MATD][RNEC][BIOM][CHAIN].
- **Verifier** : badge "REGISTRE NATIONAL — NAISSANCECHAIN" + drapeau sur les pages de résultat.
- **DemandForm** : disclaimer légal officiel (Ordonnance + Loi L/2015) ajouté avant soumission.
- **Sidebar** : footer République de Guinée + devise nationale.

---

## Structure des entités Supabase

```
naissancechain     → Registre des actes de naissance (blockchain simulée)
citoyens           → Table des citoyens inscrits (auth + profil)
documents_certifies → Documents officiels générés et certifiés
```

---

## Déploiement

```bash
npm install
npm run dev        # Développement (http://localhost:5173)
npm run build      # Production → dist/
```

### Variables d'environnement (.env)
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

---

## Accès de démonstration

| Rôle | Identifiants |
|------|-------------|
| Citoyen | email@demo.gn / password |
| Admin | ⚙️ Section cachée dans Login (5 clics sur le logo) |

---

*© 2026 — Équipe Commit United — MIABE Hackathon — République de Guinée*
