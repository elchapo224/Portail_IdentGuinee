import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, ArrowRight, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Login.css';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    identifiant: '',
    nom: '',
    prenom: '',
    date_naissance: '',
    lieu_naissance: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLoginMode) {
        if (!formData.identifiant) {
          setErrorMsg('Veuillez saisir votre email ou votre numéro de téléphone.');
          setLoading(false);
          return;
        }

        // Mode Connexion
        let query = supabase
          .from('citoyens')
          .select('*')
          .eq('password', formData.password)
          .or(`email.eq.${formData.identifiant},telephone.eq.${formData.identifiant}`);

        const { data, error } = await query.single();

        if (error || !data) {
          setErrorMsg('Identifiant ou mot de passe incorrect.');
          setLoading(false);
          return;
        }

        // Connexion réussie
        const profileAvatar = data.avatar || data.avatar_url || data.photo_url || `https://ui-avatars.com/api/?name=${data.prenom}+${data.nom}&background=006D44&color=fff`;
        login({
          id: data.id,
          nom: data.nom,
          prenom: data.prenom,
          matricule: `GN-${data.id || Math.floor(Math.random() * 10000)}`, // On simule un matricule avec l'ID
          avatar: profileAvatar
        });
        navigate('/');

      } else {
        // Mode Inscription
        if (formData.password !== formData.confirmPassword) {
          setErrorMsg('Les mots de passe ne correspondent pas.');
          setLoading(false);
          return;
        }

        // 1. Vérifier si l'email existe déjà
        const { data: existingUser } = await supabase
          .from('citoyens')
          .select('email, telephone')
          .or(`email.eq.${formData.email},telephone.eq.${formData.telephone}`)
          .maybeSingle();

        if (existingUser) {
          setErrorMsg('Cet email est déjà utilisé.');
          setLoading(false);
          return;
        }

        // 2. Insérer le nouvel utilisateur
        const { data: newUser, error } = await supabase
          .from('citoyens')
          .insert([
            { 
              email: formData.email, 
              telephone: formData.telephone,
              nom: formData.nom, 
              prenom: formData.prenom, 
              date_naissance: formData.date_naissance,
              lieu_naissance: formData.lieu_naissance,
              password: formData.password 
            }
          ])
          .select()
          .single();

        if (error) {
          console.error("Supabase error:", error);
          setErrorMsg(`Erreur Supabase: ${error.message}`);
          setLoading(false);
          return;
        }

        // Inscription réussie, on connecte directement
        const profileAvatar = newUser.avatar || newUser.avatar_url || newUser.photo_url || `https://ui-avatars.com/api/?name=${formData.prenom}+${formData.nom}&background=006D44&color=fff`;
        login({
          id: newUser.id,
          nom: newUser.nom || formData.nom,
          prenom: newUser.prenom || formData.prenom,
          matricule: `GN-${newUser.id || Math.floor(Math.random() * 10000)}`,
          avatar: profileAvatar
        });
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Une erreur inattendue est survenue.');
    }
    
    setLoading(false);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrorMsg('');
    setFormData((prev) => ({ ...prev, password: '', confirmPassword: '', identifiant: '' }));
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in">
        <div className="login-brand">
          <div className="brand-icon">
            <Shield size={32} />
          </div>
          <h1>Identi<span>Guinée</span></h1>
          <p>Portail Citoyen Sécurisé</p>
        </div>

        <div className="auth-toggle">
          <button 
            className={`toggle-btn ${isLoginMode ? 'active' : ''}`} 
            onClick={() => toggleMode()}
            type="button"
          >
            Connexion
          </button>
          <button 
            className={`toggle-btn ${!isLoginMode ? 'active' : ''}`} 
            onClick={() => toggleMode()}
            type="button"
          >
            Inscription
          </button>
        </div>

        {errorMsg && (
          <div className="error-alert animate-slide-up">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLoginMode && (
            <>
              <div className="input-group animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <label><User size={16} /> Prénom</label>
                <input 
                  type="text" 
                  placeholder="Ex: Amadou" 
                  required={!isLoginMode}
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                />
              </div>

              <div className="input-group animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <label><User size={16} /> Nom</label>
                <input 
                  type="text" 
                  placeholder="Ex: Diallo" 
                  required={!isLoginMode}
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                />
              </div>

              <div className="input-group animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <label><User size={16} /> Date de naissance</label>
                <input
                  type="date"
                  required={!isLoginMode}
                  value={formData.date_naissance}
                  onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                />
              </div>

              <div className="input-group animate-slide-up" style={{ animationDelay: '0.35s' }}>
                <label><User size={16} /> Lieu de naissance</label>
                <input
                  type="text"
                  placeholder="Ex: Conakry"
                  required={!isLoginMode}
                  value={formData.lieu_naissance}
                  onChange={(e) => setFormData({ ...formData, lieu_naissance: e.target.value })}
                />
              </div>
            </>
          )}

          {isLoginMode ? (
            <div className="input-group animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <label><Mail size={16} /> Email ou Téléphone</label>
              <input
                type="text"
                placeholder="Ex: amadou@email.com ou +224620000000"
                required
                value={formData.identifiant}
                onChange={(e) => setFormData({ ...formData, identifiant: e.target.value })}
              />
            </div>
          ) : (
            <>
              <div className="input-group animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <label><User size={16} /> Téléphone</label>
                <input
                  type="text"
                  placeholder="Ex: +224620000000"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
              </div>

              <div className="input-group animate-slide-up" style={{ animationDelay: '0.45s' }}>
                <label><Mail size={16} /> Email Citoyen</label>
                <input 
                  type="email" 
                  placeholder="Ex: amadou@email.com" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </>
          )}

          <div className="input-group animate-slide-up" style={{ animationDelay: isLoginMode ? '0.3s' : '0.5s' }}>
            <label><Lock size={16} /> Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#868E96',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLoginMode && (
            <div className="input-group animate-slide-up" style={{ animationDelay: '0.52s' }}>
              <label><Lock size={16} /> Confirmer le mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#868E96',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="login-button animate-slide-up" 
            style={{ animationDelay: isLoginMode ? '0.4s' : '0.55s' }}
            disabled={loading}
          >
            {loading ? 'Traitement...' : (isLoginMode ? 'Se connecter' : 'Créer mon compte')} 
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <p className="login-footer">
          Système protégé par <strong>NaissanceChain</strong>
        </p>
      </div>
      
      <div className="login-bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
      </div>
    </div>
  );
};

export default Login;
