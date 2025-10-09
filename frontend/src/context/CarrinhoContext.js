import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial do carrinho
const initialState = {
  itens: [],
  total: 0,
  quantidade: 0,
};

// Ações do carrinho
const ACTIONS = {
  ADICIONAR_ITEM: 'ADICIONAR_ITEM',
  REMOVER_ITEM: 'REMOVER_ITEM',
  ATUALIZAR_QUANTIDADE: 'ATUALIZAR_QUANTIDADE',
  LIMPAR_CARRINHO: 'LIMPAR_CARRINHO',
  CARREGAR_CARRINHO: 'CARREGAR_CARRINHO',
};

// Reducer do carrinho
const carrinhoReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADICIONAR_ITEM: {
      const { item, quantidade = 1, observacoes = '' } = action.payload;
      const itemExistente = state.itens.find(i => i.id === item._id && i.observacoes === observacoes);

      let novosItens;
      if (itemExistente) {
        // Se item já existe com as mesmas observações, aumenta a quantidade
        novosItens = state.itens.map(i =>
          i.id === item._id && i.observacoes === observacoes
            ? { ...i, quantidade: i.quantidade + quantidade }
            : i
        );
      } else {
        // Adiciona novo item
        const novoItem = {
          id: item._id,
          nome: item.nome,
          preco: item.preco,
          quantidade,
          observacoes,
          subtotal: item.preco * quantidade,
        };
        novosItens = [...state.itens, novoItem];
      }

      const novoState = calcularTotais({ ...state, itens: novosItens });
      salvarNoLocalStorage(novoState);
      return novoState;
    }

    case ACTIONS.REMOVER_ITEM: {
      const novosItens = state.itens.filter((item, index) => index !== action.payload);
      const novoState = calcularTotais({ ...state, itens: novosItens });
      salvarNoLocalStorage(novoState);
      return novoState;
    }

    case ACTIONS.ATUALIZAR_QUANTIDADE: {
      const { index, quantidade } = action.payload;
      
      if (quantidade <= 0) {
        // Se quantidade for 0 ou negativa, remove o item
        return carrinhoReducer(state, { type: ACTIONS.REMOVER_ITEM, payload: index });
      }

      const novosItens = state.itens.map((item, i) =>
        i === index
          ? { ...item, quantidade, subtotal: item.preco * quantidade }
          : item
      );

      const novoState = calcularTotais({ ...state, itens: novosItens });
      salvarNoLocalStorage(novoState);
      return novoState;
    }

    case ACTIONS.LIMPAR_CARRINHO: {
      const novoState = { ...initialState };
      salvarNoLocalStorage(novoState);
      return novoState;
    }

    case ACTIONS.CARREGAR_CARRINHO: {
      return calcularTotais(action.payload);
    }

    default:
      return state;
  }
};

// Função para calcular totais
const calcularTotais = (state) => {
  const total = state.itens.reduce((acc, item) => acc + item.subtotal, 0);
  const quantidade = state.itens.reduce((acc, item) => acc + item.quantidade, 0);
  
  return {
    ...state,
    total: parseFloat(total.toFixed(2)),
    quantidade,
  };
};

// Função para salvar no localStorage
const salvarNoLocalStorage = (state) => {
  try {
    localStorage.setItem('carrinho', JSON.stringify(state));
  } catch (error) {
    console.error('Erro ao salvar carrinho no localStorage:', error);
  }
};

// Função para carregar do localStorage
const carregarDoLocalStorage = () => {
  try {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      return JSON.parse(carrinhoSalvo);
    }
  } catch (error) {
    console.error('Erro ao carregar carrinho do localStorage:', error);
  }
  return initialState;
};

// Context
const CarrinhoContext = createContext();

// Provider do contexto
export const CarrinhoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carrinhoReducer, initialState);

  // Carregar carrinho do localStorage na inicialização
  useEffect(() => {
    const carrinhoSalvo = carregarDoLocalStorage();
    if (carrinhoSalvo.itens.length > 0) {
      dispatch({ type: ACTIONS.CARREGAR_CARRINHO, payload: carrinhoSalvo });
    }
  }, []);

  // Funções de ação
  const adicionarItem = (item, quantidade = 1, observacoes = '') => {
    dispatch({
      type: ACTIONS.ADICIONAR_ITEM,
      payload: { item, quantidade, observacoes },
    });
  };

  const removerItem = (index) => {
    dispatch({
      type: ACTIONS.REMOVER_ITEM,
      payload: index,
    });
  };

  const atualizarQuantidade = (index, quantidade) => {
    dispatch({
      type: ACTIONS.ATUALIZAR_QUANTIDADE,
      payload: { index, quantidade },
    });
  };

  const limparCarrinho = () => {
    dispatch({ type: ACTIONS.LIMPAR_CARRINHO });
  };

  const obterQuantidadeItem = (itemId, observacoes = '') => {
    const item = state.itens.find(i => i.id === itemId && i.observacoes === observacoes);
    return item ? item.quantidade : 0;
  };

  const value = {
    // Estado
    itens: state.itens,
    total: state.total,
    quantidade: state.quantidade,
    
    // Ações
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    obterQuantidadeItem,
    
    // Computed
    temItens: state.itens.length > 0,
  };

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  );
};

// Hook para usar o contexto
export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
};

export default CarrinhoContext;