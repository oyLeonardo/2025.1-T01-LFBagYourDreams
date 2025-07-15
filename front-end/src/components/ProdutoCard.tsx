// src/components/ProdutoCard.tsx
import React from 'react';
import { type Produto } from '../types/produto'; // ou onde estiver sua interface
import { getCorClass } from '../utils/getCorClass';

interface ProdutoCardProps {
    produto: Produto;
    mostrarDescricao?: boolean;
    mostrarMaterial?: boolean;
    mostrarEstoque?: boolean;
    onClick?: () => void;
}

const ProdutoCard: React.FC<ProdutoCardProps> = ({
    produto,
    //mostrarDescricao = true,
    mostrarMaterial = true,
    mostrarEstoque = true,
    onClick
}) => {

    return (
        <div
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full w-[240px]"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
        >
            <div className="relative aspect-square bg-gray-50">
                <img
                    src={produto.imagens.length > 0 ? produto.imagens[0].url : 'https://via.placeholder.com/300x300?text=Sem+imagem'}
                    alt={produto.titulo}
                    className="absolute top-0 left-0 w-full h-full object-cover p-2" // Adicionei padding interno
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Imagem+não+carregada';
                    }}
                />
                {mostrarEstoque && produto.quantidade <= 5 && (
                    <p className="absolute top-2 left-2 bg-green-800 text-white text-xs font-medium px-2 py-1 rounded-full z-10">
                        Últimas {produto.quantidade} unidades!
                    </p>
                )}
            </div>

            <div className="p-3 flex-grow flex flex-col space-y-2">
                <h3 className="font-medium text-gray-800 text-x line-clamp-2">
                    {produto.titulo.charAt(0).toUpperCase() + produto.titulo.slice(1)}
                </h3>
{/*
                {mostrarDescricao && (
                    <p className="text-gray-500 text-xs line-clamp-2">
                        {produto.descricao}
                    </p>
                )}
*/}
                {mostrarMaterial && (
                    <div className="mt-1">
                        <span className="text-[13px] bg-gray-50 text-gray-600 px-2 py-1 rounded inline-flex items-center gap-1">
                            {produto.material} 
                            <span className="inline-flex items-center">
                                <span
                                    className={`w-3.5 h-3.5 rounded-full inline-block mr-1 border border-gray-200 ${getCorClass(produto.cor_padrao)}`}
                                ></span>
                                {produto.cor_padrao}
                            </span>
                        </span>
                    </div>
                )}

                <div className="pt-1">
                    <p className="font-bold text-green-800 text-[16px]">
                        R$ {produto.preco.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProdutoCard;
