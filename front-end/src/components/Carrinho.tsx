import { useState, useEffect } from 'react';
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  image: string;
}

const Carrinho = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Bolsa de Couro Premium",
      price: 299.90,
      quantity: 1,
      color: "Preto",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "2",
      name: "Bolsa Térmica para Almoço",
      price: 149.90,
      quantity: 1,
      color: "Rosa",
      image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "3",
      name: "Mochila Executiva",
      price: 349.90,
      quantity: 1,
      color: "Preto",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80"
    }
  ]);

  // Calcular subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Gerenciar scroll do body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset' };
  }, [isOpen]);

  // Funções de manipulação do carrinho
  const removerItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const atualizarQuantidade = (id: string, quantidade: number) => {
    if (quantidade < 1) {
      removerItem(id);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: quantidade} : item
    ));
  };

  // Componente de item do carrinho
  const ItemCarrinho = ({ item }: { item: CartItem }) => (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-full w-full object-contain object-center p-1" 
          onError={(e) => {
            // Fallback para imagem quebrada
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://via.placeholder.com/300x300/075336/ffffff?text=${encodeURIComponent(item.name.substring(0, 15))}`;
          }}
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3 className="line-clamp-1 pr-2">{item.name}</h3>
            <p className="ml-4 whitespace-nowrap">R$ {item.price.toFixed(2)}</p>
          </div>
          {item.color && (
            <p className="mt-1 text-sm text-gray-500">Cor: {item.color}</p>
          )}
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center border border-[#075336] rounded-md">
            <button 
              className="px-2 py-1 text-[#075336] hover:text-[#053c27] hover:bg-[#075336]/10 transition-colors"
              onClick={() => atualizarQuantidade(item.id, item.quantity - 1)}
            >
              -
            </button>
            <span className="px-2 text-[#075336] font-medium">{item.quantity}</span>
            <button 
              className="px-2 py-1 text-[#075336] hover:text-[#053c27] hover:bg-[#075336]/10 transition-colors"
              onClick={() => atualizarQuantidade(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>

          <div className="flex">
            <button
              type="button"
              className="font-medium text-[#075336] hover:text-[#053c27]"
              onClick={() => removerItem(item.id)}
            >
              Remover
            </button>
          </div>
        </div>
      </div>
    </li>
  );

  // Componente de carrinho vazio
  const CarrinhoVazio = () => (
    <div className="text-center py-12">
      <ShoppingCartIcon className="mx-auto h-16 w-16 text-gray-300" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">Seu carrinho está vazio</h3>
      <p className="mt-1 text-gray-500">Adicione produtos para continuar</p>
      <button
        type="button"
        className="mt-6 rounded-md border border-transparent bg-[#075336] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#053c27] transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Continuar Comprando
      </button>
    </div>
  );

  // Componente de rodapé do carrinho
  const RodapeCarrinho = () => (
    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
      <div className="flex justify-between text-base font-medium text-[#075336]">
        <p>Subtotal</p>
        <p>R$ {subtotal.toFixed(2)}</p>
      </div>
      <p className="mt-0.5 text-sm text-gray-500">
        Frete e impostos calculados no checkout.
      </p>
      <div className="mt-6">
        <button
          className="w-full rounded-md border border-transparent bg-[#075336] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[#053c27] transition-colors"
          onClick={() => alert('Compra finalizada com sucesso!')}
        >
          Finalizar Compra
        </button>
      </div>
      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
        <p>
          ou{' '}
          <button
            type="button"
            className="font-medium text-[#075336] hover:text-[#053c27]"
            onClick={() => setIsOpen(false)}
          >
            Continuar Comprando
            <span aria-hidden="true"> &rarr;</span>
          </button>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Botão do carrinho */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-full hover:bg-[#075336]/10 transition-colors"
      >
        <ShoppingCartIcon className="h-6 w-6 text-[#075336]" />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#075336] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Drawer do carrinho */}
      {isOpen && (
        <div className="relative z-50" aria-labelledby="drawer-title" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity" 
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <div className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    {/* Cabeçalho */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-medium text-[#075336]" id="drawer-title">
                          Carrinho de Compras
                        </h2>
                        <button
                          type="button"
                          className="relative -m-2 p-2 text-[#075336] hover:text-[#053c27] hover:bg-[#075336]/10 rounded-full transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="sr-only">Fechar painel</span>
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      {/* Lista de itens */}
                      <div className="mt-8">
                        {cartItems.length === 0 ? (
                          <CarrinhoVazio />
                        ) : (
                          <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              {cartItems.map(item => (
                                <ItemCarrinho key={item.id} item={item} />
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    {cartItems.length > 0 && <RodapeCarrinho />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Carrinho;