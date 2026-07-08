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
      // Ajustado para ler a propriedade correta retornada pela API (voucherCode)
      if (voucher && voucher.voucherCode && canvasRef.current) {
        try {
          await QRCode.toCanvas(canvasRef.current, voucher.voucherCode, {
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
          {voucher?.voucherCode || '---'}
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
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    // ID da loja padrão definido com base no seed de demonstração do seu banco
    const storeId = 1;

    try {
      const resposta = await fetch(`https://ubiquitous-spork-wjpgvqqxqjj2w79-3000.app.github.dev/api/stores/${storeId}/vouchers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: valorCompra // Caso precise enviar o valor de compra para logs futuros
        })
      });

      const resultado = await resposta.json();

      if (resposta.ok && resultado.success === 'success') {
        aoFinalizar({
          sucesso: true,
          dados: resultado.data // Passa o objeto do voucher retornado pela API
        });
      } else {
        setErro(resultado.message || 'Falha ao emitir voucher.');
      }
    } catch (err) {
      console.error('Erro ao conectar com a API:', err);
      setErro('Erro de rede ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
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
          disabled={carregando}
        />
      </div>
      
      {erro && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{erro}</div>}

      <button type="submit" className="op-btn-submit-emissao" disabled={carregando}>
        {carregando ? 'Emitindo...' : 'Emitir Selos'}
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
