import React, { createContext, useContext, useState, useEffect } from 'react';
import { clienteAuthAPI } from '../services/apiClient';

// Criando o contexto
const ClienteAuthContext = createContext();

// Hook para usar o contexto
export const useClienteAuth = () => {
  const context = useContext(ClienteAuthContext);
  if (!context) {
    throw new Error('useClienteAuth deve ser usado dentro de ClienteAuthProvider');
  }
  return context;
};

// Provider do contexto
export const ClienteAuthProvider = ({ children }) => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificar se há token salvo ao carregar
  useEffect(() => {
    const verificarAuth = async () => {
      try {
        const token = localStorage.getItem('clienteToken');
        const clienteData = localStorage.getItem('clienteData');
        
        if (token && clienteData) {
          const clienteParsed = JSON.parse(clienteData);
          
          // Verificar se o token ainda é válido
          try {
            const response = await clienteAuthAPI.verificarToken();
            if (response.success) {
              setCliente(clienteParsed);
              setIsLoggedIn(true);
            } else {
              // Token inválido, remover dados
              localStorage.removeItem('clienteToken');
              localStorage.removeItem('clienteData');
            }
          } catch (error) {
            // Erro na verificação, remover dados
            localStorage.removeItem('clienteToken');
            localStorage.removeItem('clienteData');
            console.error('Erro ao verificar token:', error);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    verificarAuth();
  }, []);

  // Função de login
  const login = async (email, senha) => {
    try {
      setLoading(true);
      const response = await clienteAuthAPI.login({ email, senha });
      
      if (response.success) {
        const { token, cliente: clienteData } = response;
        
        // Salvar no localStorage
        localStorage.setItem('clienteToken', token);
        localStorage.setItem('clienteData', JSON.stringify(clienteData));
        
        // Atualizar estado
        setCliente(clienteData);
        setIsLoggedIn(true);
        
        return { success: true, cliente: clienteData };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro ao conectar com o servidor' };
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const register = async (dadosCliente) => {
    try {
      setLoading(true);
      const response = await clienteAuthAPI.register(dadosCliente);
      
      if (response.success) {
        // Após registro bem-sucedido, fazer login automático
        const loginResult = await login(dadosCliente.email, dadosCliente.senha);
        return loginResult;
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, message: 'Erro ao conectar com o servidor' };
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      // Chamar API de logout se necessário
      await clienteAuthAPI.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar dados locais
      localStorage.removeItem('clienteToken');
      localStorage.removeItem('clienteData');
      
      // Atualizar estado
      setCliente(null);
      setIsLoggedIn(false);
    }
  };

  // Função para atualizar dados do cliente
  const atualizarCliente = async (novosDados) => {
    try {
      setLoading(true);
      const response = await clienteAuthAPI.atualizarPerfil(novosDados);
      
      if (response.success) {
        const clienteAtualizado = response.cliente;
        
        // Atualizar localStorage
        localStorage.setItem('clienteData', JSON.stringify(clienteAtualizado));
        
        // Atualizar estado
        setCliente(clienteAtualizado);
        
        return { success: true, cliente: clienteAtualizado };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      return { success: false, message: 'Erro ao conectar com o servidor' };
    } finally {
      setLoading(false);
    }
  };

  // Função para obter pedidos do cliente
  const obterPedidos = async () => {
    try {
      const response = await clienteAuthAPI.obterPedidos();
      
      if (response.success) {
        return { success: true, pedidos: response.data };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erro ao obter pedidos:', error);
      return { success: false, message: 'Erro ao conectar com o servidor' };
    }
  };

  // Função para salvar dados de entrega (útil para checkout)
  const salvarDadosEntrega = (dadosEntrega) => {
    try {
      localStorage.setItem('dadosEntregaCliente', JSON.stringify(dadosEntrega));
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados de entrega:', error);
      return false;
    }
  };

  // Função para obter dados de entrega salvos
  const obterDadosEntrega = () => {
    try {
      const dados = localStorage.getItem('dadosEntregaCliente');
      return dados ? JSON.parse(dados) : null;
    } catch (error) {
      console.error('Erro ao obter dados de entrega:', error);
      return null;
    }
  };

  // Função para verificar se cliente está logado
  const verificarLogin = () => {
    return isLoggedIn && cliente;
  };

  // Função para obter dados básicos do cliente para checkout
  const obterDadosCheckout = () => {
    if (cliente) {
      return {
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        endereco: cliente.endereco
      };
    }
    
    // Se não estiver logado, tentar obter dados salvos anteriormente
    const dadosSalvos = obterDadosEntrega();
    return dadosSalvos || null;
  };

  // Valores do contexto
  const value = {
    // Estados
    cliente,
    loading,
    isLoggedIn,
    
    // Funções de autenticação
    login,
    register,
    logout,
    
    // Funções de dados
    atualizarCliente,
    obterPedidos,
    salvarDadosEntrega,
    obterDadosEntrega,
    obterDadosCheckout,
    
    // Funções de verificação
    verificarLogin
  };

  return (
    <ClienteAuthContext.Provider value={value}>
      {children}
    </ClienteAuthContext.Provider>
  );
};

export default ClienteAuthContext;