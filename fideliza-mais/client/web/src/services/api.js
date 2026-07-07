import axios from 'axios';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ==========================================================================
   MOCK TEMPORÁRIO PARA O HISTÓRICO DA SIDEBAR
   ========================================================================== */
// Interceptor que captura a requisição antes dela sair para o servidor
api.interceptors.request.use(
  (config) => {
    // Exemplo: const token = localStorage.getItem('token');
    // if (token) { config.headers.Authorization = `Bearer ${token}`; }

    // Se a requisição for para '/analyses', interceptamos e retornamos os dados mocados fictícios
    if (config.url === '/analyses' && config.method === 'get') {
      const mockData = [
        {
          id: 'analise-1',
          title: 'Contrato Social da Silva LTDA',
          confidence: 98 // -> Renderizará a borda VERDE (>= 90)
        },
        {
          id: 'analise-2',
          title: 'Edital Concurso IF Parnamirim',
          confidence: 95 // -> Renderizará a borda VERDE (>= 90)
        },
        {
          id: 'analise-3',
          title: 'Termo de Uso e Serviço - Plataforma Legal',
          confidence: 76 // -> Renderizará a borda AMARELA (70 a 89)
        },
        {
          id: 'analise-4',
          title: 'Contrato de Locação Residencial Urbana',
          confidence: 58 // -> Renderizará a borda LARANJA (50 a 69)
        },
        {
          id: 'analise-5',
          title: 'Acordo de Confidencialidade (NDA) - Devs',
          confidence: 32 // -> Renderizará a borda VERMELHA (< 50)
        },
        {
          id: 'analise-6',
          title: 'Contrato Social da Silva LTDA',
          confidence: 98 // -> Renderizará a borda VERDE (>= 90)
        },
        {
          id: 'analise-7',
          title: 'Edital Concurso IF Parnamirim',
          confidence: 95 // -> Renderizará a borda VERDE (>= 90)
        },
        {
          id: 'analise-8',
          title: 'Termo de Uso e Serviço - Plataforma Legal',
          confidence: 76 // -> Renderizará a borda AMARELA (70 a 89)
        },
        {
          id: 'analise-9',
          title: 'Contrato de Locação Residencial Urbana',
          confidence: 58 // -> Renderizará a borda LARANJA (50 a 69)
        },
        {
          id: 'analise-10',
          title: 'Acordo de Confidencialidade (NDA) - Devs',
          confidence: 32 // -> Renderizará a borda VERMELHA (< 50)
        }
      ];

      // Força o Axios a retornar uma Promise rejeitada com o formato padrão de resposta HTTP (status 200)
      return Promise.reject({
        isMock: true,
        response: {
          data: mockData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        }
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar o truque do desvio do Mock acima com delay artificial
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o erro foi gerado pelo nosso interceptor de requisição (Mock)
    if (error.isMock) {
      // Cria um atraso artificial de 1800ms (1.8s) para ver o esqueleto agindo na tela
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(error.response);
        }, 1800);
      });
    }
    return Promise.reject(error);
  }
);

export default api;