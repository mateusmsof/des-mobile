import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import './Operational.css';

// ==========================================
// 1. SUBCOMPONENTE: MODAL DE CÓDIGO / QR CODE
// ==========================================
const ModalCodigo = ({ voucher, aoFechar }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const gerarQRCode = async () => {
      if (voucher && voucher.codigo && canvasRef.current) {
        try {
          await QRCode.toCanvas(canvasRef.current, voucher.codigo, {
            width: 220,
            margin: 1,
            color: {
              dark: '#1e293b',
              light: '#f8fafc'
            }
          });
        } catch (err) {
          console.error('Erro ao gerar QR Code:', err);
        }
      }
    };

    gerarQRCode();
  }, [voucher]);

  return (
    <div className="op-modal-wrapper">
      <div className="op-code-display-overlay">
        <button className="op-close-btn" onClick={aoFechar}>&times;</button>
        
        <h3>Código para o Cliente</h3>
        <p className="op-points-badge">
          Vale <strong>Selos</strong> para o cliente
        </p>
    
        <div className="op-qr-code-area">
          <canvas ref={canvasRef} className="op-canvas-element"></canvas>
        </div>
    
        <div className="op-manual-code">
          {voucher?.codigo || '---'}
        </div>
    
        <button className="op-btn-modal-continue" onClick={aoFechar}>Continuar</button>
      </div>
    </div>
  );
};

// ==========================================
// 2. SUBCOMPONENTE: FORMULÁRIO DE EMISSÃO
// ==========================================
const GerarSelosForm = ({ aoFinalizar }) => {
  const [valorCompra, setValorCompra] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const mockCodigoVoucher = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    aoFinalizar({
      sucesso: true,
      dados: {
        codigo: mockCodigoVoucher,
        valor: valorCompra
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="op-form-gerar-selos">
      <div className="op-form-group">
        <label htmlFor="valorCompra">Valor da Compra (R$)</label>
        <input
          id="valorCompra"
          type="number"
          step="0.01"
          placeholder="0,00"
          value={valorCompra}
          onChange={(e) => setValorCompra(e.target.value)}
          className="op-input-valor"
        />
      </div>
      <button type="submit" className="op-btn-submit-emissao">
        Emitir Selos
      </button>
    </form>
  );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL: PAGINA OPERATIONAL
// ==========================================
export default function Operational() {
  const [exibirCodigo, setExibirCodigo] = useState(false);
  const [dadosVoucher, setDadosVoucher] = useState(null);
  // Estado adicionado para servir de identificador único e limpar o formulário
  const [formResetKey, setFormResetKey] = useState(0);
  const navigate = useNavigate();

  const handleVoucherGerado = (evento) => {
    if (evento.sucesso) {
      setDadosVoucher(evento.dados);
      setExibirCodigo(true);
    }
  };

  const handleFecharModal = () => {
    setExibirCodigo(false);
    setDadosVoucher(null);
    // Incrementa o número identificador para destruir e recriar o formulário com o campo limpo
    setFormResetKey(prev => prev + 1);
  };

  const handleIrParaAdministrativo = () => {
    navigate('/'); 
  };

  return (
    <div className="op-gerar-pontos-container">
      <button 
        className="op-btn-admin-top" 
        onClick={handleIrParaAdministrativo}
      >
        ←
      </button>

      {/* A propriedade key força a limpeza do estado interno do input assim que o valor dela muda */}
      <GerarSelosForm key={formResetKey} aoFinalizar={handleVoucherGerado} />

      {exibirCodigo && (
        <ModalCodigo 
          voucher={dadosVoucher} 
          aoFechar={handleFecharModal} 
        />
      )}
    </div>
  );
}
