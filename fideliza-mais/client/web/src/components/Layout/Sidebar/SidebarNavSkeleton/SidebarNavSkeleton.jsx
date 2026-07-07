import React from 'react';
import './SidebarNavSkeleton.css';

export default function SidebarNavSkeleton() {
  // Array de 5 itens para preencher visualmente o menu de recentes
  const skeletonItems = Array(5).fill(null);

  return (
    <div className="sidebar-skeleton-list" aria-hidden="true">
      {skeletonItems.map((_, index) => (
        <div key={index} className="sidebar-skeleton-item">
          {/* Círculo do Anel de Progresso Falso */}
          <div className="sidebar-skeleton-ring"></div>
          
          {/* Linha de Texto do Título Falso */}
          <div className="sidebar-skeleton-line"></div>
        </div>
      ))}
    </div>
  );
}