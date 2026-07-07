import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose, onOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: '/create-campaign', label: 'Nova Campanha', icon: 'add_circle' },
    { path: '/campaigns', label: 'Campanhas', icon: 'local_offer' },
    { path: '/operational', label: 'Operacional', icon: 'settings' }
  ];

  function handleNavigate(path) {
    navigate(path);
    if (window.innerWidth < 1024) {
      if (onClose) onClose();
    }
  }

  return (
    <>
      {/* Overlay visível apenas no mobile quando aberta */}
      {isOpen && window.innerWidth < 1024 && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside
        className={`sidebar ${isOpen ? 'sidebar--open' : ''} ${
          collapsed ? 'sidebar--collapsed' : ''
        }`}
      >
        {/* GATILHO DE COLAPSAMENTO LATERAL */}
        <button
          className="sidebar-collapse-trigger"
          onClick={() => {
            if (window.innerWidth < 1024) {
              if (isOpen) {
                if (onClose) onClose();
              } else {
                if (onOpen) onOpen();
              }
              return;
            }
            setCollapsed(!collapsed);
          }}
          aria-label={
            window.innerWidth < 1024
              ? isOpen ? 'Fechar menu' : 'Abrir menu'
              : collapsed ? 'Expandir menu' : 'Recolher menu'
          }
        >
          <span className="material-symbols-outlined notranslate">
            {window.innerWidth < 1024
              ? isOpen ? 'chevron_left' : 'chevron_right'
              : collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>

        {/* HEADER BLOCK */}
        <div className="sidebar-header">
          <div className="sidebar-brand" onClick={() => handleNavigate('/')}>
            <span className="material-symbols-outlined notranslate brand-icon">
              celebration
            </span>
            <h1 className="brand-name">Fideliza+</h1>
          </div>
        </div>

        {/* BODY BLOCK */}
        <div className="sidebar-body">
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <div
                key={item.path}
                className={`sidebar-nav-item ${
                  location.pathname === item.path ? 'sidebar-nav-item--active' : ''
                }`}
                onClick={() => handleNavigate(item.path)}
              >
                <span className="material-symbols-outlined notranslate">
                  {item.icon}
                </span>
                <span className="nav-text">{item.label}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* FOOTER BLOCK */}
        <div className="sidebar-footer">
          <button className="sidebar-btn-logout" onClick={() => handleNavigate('/login')}>
            <span className="material-symbols-outlined notranslate">logout</span>
            <span className="nav-text">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
