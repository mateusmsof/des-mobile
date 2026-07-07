import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CampaignDashboard.css';

export default function CampaignDashboard() {
  // Mock estruturado simulando tb_loyalty_card_templates contendo imagens e todos os status
  const [templates, setTemplates] = useState([
    {
      id: 1,
      external_id: 'a8b1c2d3-e4f5-6a7b-8c9d-0e1f2a3b4c5d',
      title: 'Cartão Fidelidade: Combo Burguer Clássico',
      max_stamps: 10,
      status: 'published', // 'published', 'draft', 'archived'
      image_url: null
    },
    {
      id: 2,
      external_id: 'b9c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e',
      title: 'Cartão Promocional: Milkshake de Ovomaltine',
      max_stamps: 6,
      status: 'draft',
      image_url: null // Cenário onde não há imagem vinculada
    },
    {
      id: 3,
      external_id: 'c0d3e4f5-a6b7-8c9d-0e1f-2a3b4c5d6e7f',
      title: 'Fidelidade Antiga: Batata Rústica Grande',
      max_stamps: 8,
      status: 'archived',
      image_url: null
    }
  ]);

  const navigate = useNavigate();

  // Ações de alteração de estados reativos baseados nos comandos de botões
  const handlePublish = (id) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, status: 'published' } : t));
  };

  const handleArchive = (id) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, status: 'archived' } : t));
  };

  const handleDelete = (id) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // Mapeamento semântico de status
  const statusConfig = {
    draft: { text: 'Rascunho', class: 'status-badge--draft' },
    published: { text: 'Publicado', class: 'status-badge--published' },
    archived: { text: 'Arquivado', class: 'status-badge--archived' }
  };

  return (
    <div className="dashboard-container">
      {/* CABEÇALHO */}
      <header className="dashboard-header">
        <div className="dashboard-title-group">
          <h1 className="dashboard-title">Campanhas</h1>
          <p className="dashboard-subtitle">Configure e gerencie as regras de selos e recompensas dos seus clientes.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/create-campaign')}>
          <span className="material-symbols-outlined">add_circle</span>
          Novo Template
        </button>
      </header>

      {/* RENDERIZAÇÃO PRINCIPAL */}
      {templates.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined empty-icon">local_offer</span>
          <h3 style={{ margin: 0, fontWeight: 700 }}>Nenhum template encontrado</h3>
          <p style={{ margin: 0, color: '#a0aab2' }}>Crie seu primeiro modelo de cartão com selos para seus clientes acumularem.</p>
          <button className="btn-primary" onClick={() => navigate('/create-campaign')}>
            <span className="material-symbols-outlined">add_circle</span>
            Criar Cartão
          </button>
        </div>
      ) : (
        <div className="campaigns-grid">
          {templates.map((t) => (
            <article key={t.id} className="campaign-card">
              
              {/* ESTRUTURA DE CONTEÚDO SUPERIOR */}
              <div className="card-content-wrapper">
                {/* LÓGICA DA IMAGEM DO CARD (COMPORTA IMAGEM OU PLACEHOLDER SE NÃO TIVER) */}
                {t.image_url ? (
                  <img src={t.image_url} alt={t.title} className="card-thumbnail" />
                ) : (
                  <div className="card-thumbnail-placeholder">
                    <span className="material-symbols-outlined">image</span>
                  </div>
                )}

                <div className="card-text-block">
                  <h2 className="card-title">{t.title}</h2>
                  
                  <div className="status-container">
                    <span className={`status-badge ${statusConfig[t.status].class}`}>
                      {statusConfig[t.status].text}
                    </span>
                    <span className="detail-stamps">
                      • {t.max_stamps} selos
                    </span>
                  </div>
                </div>
              </div>

              {/* RODAPÉ E REGRAS DE EXIBIÇÃO DE BOTÕES POR STATUS */}
              <div className="card-footer">
                
                {/* DRAFT: Edit, Publish, Delete */}
                {t.status === 'draft' && (
                  <>
                    <button className="btn-action-icon" aria-label="Editar">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="btn-action-icon btn-action-icon--delete" onClick={() => handleDelete(t.id)} aria-label="Excluir">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <button className="btn-publish-action" onClick={() => handlePublish(t.id)}>
                      <span className="material-symbols-outlined">publish</span>
                      Publicar
                    </button>
                  </>
                )}

                {/* PUBLISHED: Edit, Archive */}
                {t.status === 'published' && (
                  <>
                    <button className="btn-action-icon" aria-label="Editar">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="btn-action-icon" onClick={() => handleArchive(t.id)} aria-label="Arquivar">
                      <span className="material-symbols-outlined">archive</span>
                    </button>
                  </>
                )}

                {/* ARCHIVED: Delete */}
                {t.status === 'archived' && (
                  <button className="btn-action-icon btn-action-icon--delete" onClick={() => handleDelete(t.id)} aria-label="Excluir">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                )}

              </div>

            </article>
          ))}
        </div>
      )}
    </div>
  );
}
