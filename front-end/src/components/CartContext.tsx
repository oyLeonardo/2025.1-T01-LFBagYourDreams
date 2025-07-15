import  { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import apiClient from '../api'; // Ajuste o caminho para o seu apiClient se necessário

// --- Interfaces ---

export interface CartItem {
  id: number | string;
  titulo: string;
  preco: number;
  quantidade: number;
  imagem_url: string;
  cor_padrao?: string;
}

interface CartContextType {
  cartId: number | null;
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number | string) => void;
  updateQuantity: (itemId: number | string, quantidade: number) => void;
  clearCart: () => void;
}


// --- Criação do Contexto ---

const CartContext = createContext<CartContextType | undefined>(undefined);


// --- Componente Provider ---

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartId, setCartId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Efeito para inicializar o carrinho (obter ID) ao carregar a aplicação
  useEffect(() => {
    const initializeCart = async () => {
      const savedCartId = localStorage.getItem('cartId');

      if (savedCartId) {
        const parsedCartId = JSON.parse(savedCartId);
        setCartId(parsedCartId);
        console.log(`Carrinho recuperado do localStorage. ID: ${parsedCartId}`);
        // Opcional: Você pode buscar os itens deste carrinho aqui para sincronizar o estado
        // Ex: fetchCartItems(parsedCartId);
      } else {
        console.log("Nenhum ID de carrinho encontrado, criando um novo no backend...");
        try {
          // Usa a rota /api/carrinhos/criar/ que criámos no backend
          const response = await apiClient.post('api/carrinhos/criar/');
          const newCartId = response.data.id;

          if (newCartId) {
            setCartId(newCartId);
            localStorage.setItem('cartId', JSON.stringify(newCartId));
            console.log(`Novo carrinho criado com sucesso no backend! ID: ${newCartId}`);
          }
        } catch (error) {
          console.error("Falha catastrófica ao criar um novo carrinho no backend:", error);
        }
      }
    };

    initializeCart();
  }, []); // O array vazio [] garante que isto só executa uma vez

  // Efeito para atualizar a contagem total de itens
  useEffect(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantidade, 0);
    setCartCount(totalItems);
  }, [cartItems]);


  // --- Funções de Manipulação do Carrinho ---
  // NOTA: Estas funções devem ser atualizadas para fazer chamadas à API
  // e manter o carrinho do backend sincronizado.

  const addToCart = (itemToAdd: CartItem) => {
    // TODO: Fazer chamada à API (ex: POST /api/carts/{cartId}/items/) para adicionar o item no backend
    // e depois usar a resposta para atualizar o estado `setCartItems`.
    
    // Lógica temporária para a UI funcionar:
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemToAdd.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === itemToAdd.id
            ? { ...item, quantidade: item.quantidade + itemToAdd.quantidade }
            : item
        );
      }
      return [...prevItems, itemToAdd];
    });
    console.log("Adicionando item (lógica de UI):", itemToAdd);
  };

  const removeFromCart = (itemId: number | string) => {
    // TODO: Fazer chamada à API (ex: DELETE /api/carts/{cartId}/items/{itemId}/)
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number | string, quantidade: number) => {
    // TODO: Fazer chamada à API (ex: PUT /api/carts/{cartId}/items/{itemId}/)
    if (quantidade <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantidade } : item
      )
    );
  };

  const clearCart = () => {
    // TODO: Fazer chamada à API (ex: POST /api/carts/{cartId}/clear/)
    setCartItems([]);
  };

  // Valor que será fornecido pelo Contexto
  const contextValue = {
    cartId,
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};


// --- Hook Customizado ---

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};