import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Context
const AuthContext = createContext();

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há token salvo na inicialização
  useEffect(() => {
    const initAuth = async () => {
      try {
        const tokenSalvo = localStorage.getItem('token');
        const adminSalvo = localStorage.getItem('admin');

        if (tokenSalvo && adminSalvo) {
          setToken(tokenSalvo);
          setAdmin(JSON.parse(adminSalvo));
          
          // Verificar se o token ainda é válido
          const response = await authAPI.me();
          if (response.data.success) {
            setAdmin(response.data.data.admin);
          } else {
            // Token inválido, limpar dados
            logout();
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Função de login
  const login = async (email, senha) => {
    try {
      const response = await authAPI.login(email, senha);
      
      if (response.data.success) {
        const { admin: adminData, token: tokenData } = response.data.data;
        
        // Salvar no estado
        setAdmin(adminData);
        setToken(tokenData);
        
        // Salvar no localStorage
        localStorage.setItem('token', tokenData);
        localStorage.setItem('admin', JSON.stringify(adminData));
        
        return { success: true, admin: adminData };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      return { success: false, message };
    }
  };

  // Função de logout
  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  };

  // Função para atualizar dados do admin
  const atualizarAdmin = (dadosAdmin) => {
    setAdmin(dadosAdmin);
    localStorage.setItem('admin', JSON.stringify(dadosAdmin));
  };

  // Função para verificar se está autenticado
  const isAuthenticated = () => {
    return !!(admin && token);
  };

  const value = {
    // Estado
    admin,
    token,
    loading,
    
    // Ações
    login,
    logout,
    atualizarAdmin,
    
    // Computed
    isAuthenticated: isAuthenticated(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;