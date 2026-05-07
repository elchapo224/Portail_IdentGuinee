/**
 * NotificationContext — persistance localStorage avec reset par session citoyen.
 * Les notifications NE réapparaissent PAS une fois lues.
 * Le compteur badge est mis à jour en temps réel.
 */
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const NotificationContext = createContext();
const STORAGE_KEY = 'identiguinee_notifications_v2';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-welcome',
    title: 'Bienvenue sur IdentiGuinée',
    subtitle: 'Découvrez tous nos services de documents officiels en ligne.',
    time: 'Maintenant',
    read: false,
    type: 'info',
  },
  {
    id: 'notif-naissance',
    title: 'Vérification NaissanceChain réussie',
    subtitle: 'Votre acte de naissance a été confirmé avec succès dans le registre.',
    time: 'Il y a 1h',
    read: false,
    type: 'success',
  },
  {
    id: 'notif-rdv',
    title: 'Rappel rendez-vous',
    subtitle: 'Votre rendez-vous au centre de Conakry est demain à 10h00.',
    time: 'Hier',
    read: true,
    type: 'warning',
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Valider que c'est un tableau valide
        if (Array.isArray(parsed)) return parsed;
      }
    } catch { /* ignore */ }
    return DEFAULT_NOTIFICATIONS;
  });

  // Persister IMMÉDIATEMENT à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch { /* ignore */ }
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Ajouter une notification dynamique (ex: après génération document)
  const addNotification = useCallback((notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      read: false,
      time: 'À l\'instant',
      type: 'info',
      ...notif,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
