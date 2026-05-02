import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronRight, FileCode2, Download, Shield } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { supabase } from '../lib/supabase';

const Documents = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Données de secours pour la démo si la DB est vide
  const MOCK_DOCUMENTS = [
    {
      id: 'demo-1',
      id_acte: '001/RC/CK/2026',
      statut: 'GENERE',
      date_generation: new Date().toISOString(),
      hash_document: 'sha256:7f83b1627ff26b'
    },
    {
      id: 'demo-2',
      id_acte: '085/MA/2024',
      statut: 'GENERE',
      date_generation: new Date(Date.now() - 86400000 * 5).toISOString(),
      hash_document: 'sha256:a82c3d4e5f6g7h'
    }
  ];

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const targetId = user?.id;
        
        if (targetId) {
          const { data, error } = await supabase
            .from('documents_certifies')
            .select('id, id_acte, statut, created_at, date_generation, pdf_url, qr_code_url, hash_document')
            .eq('citoyen_id', targetId)
            .order('date_generation', { ascending: false });

          if (!error && data && data.length > 0) {
            setDocuments(data);
          } else {
            // Fallback sur les mocks si vide
            setDocuments(MOCK_DOCUMENTS);
          }
        } else {
          setDocuments(MOCK_DOCUMENTS);
        }
      } catch (err) {
        setDocuments(MOCK_DOCUMENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user?.id]);

  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    try {
      setIsSimulating(true);
      const targetUserId = user?.id || 'd3b07384-d113-4ec2-8830-4b99cc739314'; // Fallback ID for demo
      
      console.log("Simulating documents for user:", targetUserId);

      const testDocs = [
        {
          citoyen_id: targetUserId,
          id_acte: '001/RC/CK/2026',
          statut: 'GENERE',
          date_generation: new Date().toISOString(),
          hash_document: 'sha256:7f83b1627ff26b'
        },
        {
          citoyen_id: targetUserId,
          id_acte: '085/MA/2024',
          statut: 'GENERE',
          date_generation: new Date(Date.now() - 86400000 * 5).toISOString(),
          hash_document: 'sha256:a82c3d4e5f6g7h'
        }
      ];

      const { error } = await supabase.from('documents_certifies').insert(testDocs);
      
      if (error) {
        console.error("Simulation error:", error);
        alert("Erreur lors de la simulation : " + error.message);
      } else {
        alert("Documents simulés avec succès !");
        window.location.reload();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  const formatDate = (dateValue) =>
    new Date(dateValue).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

  return (
    <div className="layout-wrapper">
      <Sidebar />
      <main className="main-content">
        <Header />
        
        <div className="processing-content animate-fade-in" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <nav className="breadcrumbs animate-slide-up">
              <span>TABLEAU DE BORD</span> <ChevronRight size={14} />
              <span className="active">MES DOCUMENTS</span>
            </nav>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#059669', backgroundColor: '#ecfdf5', padding: '4px 10px', borderRadius: '100px', border: '1px solid #059669' }}>
              MODE DÉMO ACTIF
            </div>
          </div>
          
          <h2 className="page-title animate-slide-up" style={{ marginTop: '16px', marginBottom: '8px' }}>
            Vos documents sécurisés
          </h2>
          <p className="page-subtitle animate-slide-up" style={{ marginBottom: '32px' }}>
            Retrouvez tous vos documents officiels certifiés par NaissanceChain.
          </p>

          {loading ? (
             <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}>
               <p>Chargement des documents sécurisés...</p>
             </div>
          ) : (
            <div className="services-grid animate-slide-up" style={{ width: '100%' }}>
              {documents.map((doc) => (
                <div key={doc.id} className="form-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ padding: '12px', backgroundColor: '#E7F6F0', color: '#006D44', borderRadius: '12px', display: 'inline-block' }}>
                      <FileCode2 size={24} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: '#006D44', backgroundColor: '#E7F6F0', padding: '4px 8px', borderRadius: '100px' }}>
                      <Shield size={12} /> VÉRIFIÉ
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                      {doc.id_acte ? `Acte ${doc.id_acte}` : 'Document certifié'}
                    </h4>
                    <p style={{ fontSize: '13px', color: '#868E96' }}>
                      Généré le {formatDate(doc.date_generation || doc.created_at)}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    <Link to="/document-genere" state={{ documentType: 'extrait_naissance' }} style={{ flex: 1, textAlign: 'center', padding: '12px', backgroundColor: '#F8F9FA', color: '#1A1A1A', borderRadius: '100px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
                      Consulter
                    </Link>
                    <button style={{ padding: '12px', backgroundColor: '#F8F9FA', color: '#1A1A1A', borderRadius: '100px', border: 'none', cursor: 'pointer' }}>
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Documents;
