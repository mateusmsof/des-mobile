import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateCampaign() {
  const [formData, setFormData] = useState({ title: '', max_stamps: 0, rewards: '' });
  const navigate = useNavigate();

  const inputStyle = {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #C7D0D8',
    marginBottom: '16px',
    fontFamily: 'Poppins, sans-serif'
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Poppins, sans-serif', color: '#333C48' }}>
      <h2 style={{ fontWeight: '700' }}>Criar Nova Campanha</h2>
      
      <form style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
        <label>Título:</label>
        <input style={inputStyle} type="text" onChange={(e) => setFormData({...formData, title: e.target.value})} />

        <label>Quantidade de Selos:</label>
        <input style={inputStyle} type="number" onChange={(e) => setFormData({...formData, max_stamps: parseInt(e.target.value)})} />

        <label>Prêmios:</label>
        <textarea style={inputStyle} onChange={(e) => setFormData({...formData, rewards: e.target.value})} />

        <button type="submit" style={{ backgroundColor: '#227C9D', color: '#FFFFFF', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
          Salvar Campanha
        </button>
      </form>
    </div>
  );
}