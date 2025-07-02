import { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  image: string;
}

const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Bolsa de Couro Premium",
      price: 299.90,
      quantity: 1,
      color: "Marrom",
      image: "https://via.placeholder.com/300"
    },
    {
      id: "2",
      name: "Bolsa Térmica para Almoço",
      price: 149.90,
      quantity: 1,
      color: "Rosa",
      image: "https://via.placeholder.com/300"
    }
  ]);

  // Calcular subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Impedir scroll do corpo quando o carrinho estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Remover item do carrinho
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Atualizar quantidade
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity} : item
    ));
  };

  return (
    <>
      {/* Botão para abrir o carrinho */}
      <button 
        onClick={() => setIsOpen(true)}
        className="relative rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
      >
        Carrinho
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Overlay e Carrinho */}
      {isOpen && (
        <div className="relative z-50" aria-labelledby="drawer-title" role="dialog" aria-modal="true">
          {/* Overlay de fundo */}
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
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-medium text-gray-900" id="drawer-title">
                          Carrinho de Compras
                        </h2>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Fechar painel</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {cartItems.map((item) => (
                              <li key={item.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="h-full w-full object-cover object-center" 
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{item.name}</h3>
                                      <p className="ml-4">R$ {item.price.toFixed(2)}</p>
                                    </div>
                                    {item.color && (
                                      <p className="mt-1 text-sm text-gray-500">Cor: {item.color}</p>
                                    )}
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center border rounded-md">
                                      <button 
                                        className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      >
                                        -
                                      </button>
                                      <span className="px-2">{item.quantity}</span>
                                      <button 
                                        className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      >
                                        +
                                      </button>
                                    </div>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        className="font-medium text-pink-600 hover:text-pink-500"
                                        onClick={() => removeItem(item.id)}
                                      >
                                        Remover
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>R$ {subtotal.toFixed(2)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Frete e impostos calculados no checkout.
                      </p>
                      <div className="mt-6">
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md border border-transparent bg-pink-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-pink-700"
                        >
                          Finalizar Compra
                        </a>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          ou{' '}
                          <button
                            type="button"
                            className="font-medium text-pink-600 hover:text-pink-500"
                            onClick={() => setIsOpen(false)}
                          >
                            Continuar Comprando
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
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

export default CartDrawer;