import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TokenEntryPage: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim() !== '') {
      localStorage.setItem('accessToken', token);
      navigate('/admin');
    } else {
      alert('Por favor, insira um token válido.');
    }
  };

  return (
    // Fundo com o mesmo gradiente suave da HomePage
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f8f5] to-[#e4f0ea] p-4">
      {/* Card principal, similar aos blocos da HomePage */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        
        {/* Título com o mesmo estilo de gradiente roxo */}
        <h2 className="text-3xl font-bold text-center mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]">
            Acesso Restrito
          </span>
        </h2>
        
        <p className="text-center text-gray-500 mb-6">
          Por favor, insira o token de acesso fornecido para continuar.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="token-input" className="block text-sm font-medium text-gray-700 mb-2">
              Token de Acesso
            </label>
            <textarea
              id="token-input"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] transition-colors"
              rows={5}
              placeholder="Cole seu token aqui..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>

          {/* Botão com o mesmo gradiente roxo dos botões de ação da HomePage */}
          <button
            type="submit"
            className="w-full bg-[#075336] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#053c27] transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
};

export default TokenEntryPage;