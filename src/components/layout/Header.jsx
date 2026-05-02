import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user } = useAuth();
  const avatarSrc = user?.avatar || `https://ui-avatars.com/api/?name=${user?.prenom || 'Citoyen'}+${user?.nom || ''}&background=006D44&color=fff`;

  return (
    <header className="header animate-fade-in">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Rechercher un dossier, un guide..." 
          className="search-input"
        />
      </div>

      <div className="header-actions">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>

        <div className="user-full-profile">
          <div className="user-details">
            <p className="user-name">{user?.prenom} {user?.nom}</p>
            <p className="user-id">MATRICULE: {user?.matricule}</p>
          </div>
          <div className="avatar-container">
            <img 
              src={avatarSrc} 
              alt="Profile" 
              className="avatar-header" 
            />
            <span className="status-indicator"></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
