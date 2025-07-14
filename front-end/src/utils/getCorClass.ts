  export const getCorClass = (corNome: string): string => {
    const cores: Record<string, string> = {
      // Cores básicas
      'vermelho': 'bg-red-500',
      'azul': 'bg-blue-500',
      'verde': 'bg-green-500',
      'amarelo': 'bg-yellow-400',
      'preto': 'bg-black',
      'branco': 'bg-white border border-gray-300',
      'cinza': 'bg-gray-400',
      
      // Cores adicionais
      'rosa': 'bg-pink-400',
      'roxo': 'bg-purple-500',
      'laranja': 'bg-orange-500',
      'dourado': 'bg-amber-400',
      'prata': 'bg-gray-300',
      
      // Novas cores solicitadas
      'verde militar': 'bg-green-800',
      'vinho': 'bg-red-800',
      'marrom': 'bg-amber-800',
      'bege': 'bg-amber-100 border border-gray-300',
      'turquesa': 'bg-cyan-400',
      'azul marinho': 'bg-blue-800',
      'coral': 'bg-orange-300',
      'lilás': 'bg-purple-300',
      'vermelho escuro': 'bg-red-700',
      'verde claro': 'bg-green-300',
      'azul claro': 'bg-blue-300',
      'amarelo ouro': 'bg-yellow-500',
      'grafite': 'bg-gray-600',
      'caramelo': 'bg-amber-600',
      'champagne': 'bg-amber-50 border border-gray-300',
      'petróleo': 'bg-teal-700',
      'salmão': 'bg-orange-200',
      'vinho tinto': 'bg-red-900',
      'verde musgo': 'bg-green-700',
      'azul celeste': 'bg-blue-200',
      
      // Padrão para cores não mapeadas
    };
    
    return cores[corNome.toLowerCase()] || 'bg-gray-200 border border-gray-300'; // Cor padrão cinza claro
  };