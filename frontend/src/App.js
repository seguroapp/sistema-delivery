import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
} from '@mui/material';
import { CarrinhoProvider } from './context/CarrinhoContext';
import { AuthProvider } from './context/AuthContext';
import { ClienteAuthProvider } from './context/ClienteAuthContext';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import AcompanharPedido from './pages/AcompanharPedido';
import PerfilCliente from './pages/PerfilCliente';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Tema Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f', // Vermelho para delivery/restaurante
    },
    secondary: {
      main: '#ff9800', // Laranja
    },
    success: {
      main: '#25d366', // Verde WhatsApp
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  const [paginaAtual, setPaginaAtual] = useState('home');

  const irParaCheckout = () => {
    setPaginaAtual('checkout');
  };

  const voltarParaHome = () => {
    setPaginaAtual('home');
  };

  const renderPaginaCliente = () => {
    switch (paginaAtual) {
      case 'checkout':
        return <Checkout onVoltar={voltarParaHome} />;
      default:
        return <Home onIrParaCheckout={irParaCheckout} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ClienteAuthProvider>
          <CarrinhoProvider>
            <Router>
              <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
                <Routes>
                  {/* Rotas do cliente */}
                  <Route
                    path="/"
                    element={renderPaginaCliente()}
                  />
                  
                  {/* Perfil do cliente */}
                  <Route
                    path="/perfil"
                    element={<PerfilCliente />}
                  />
                  
                  {/* Acompanhamento de pedidos */}
                <Route
                  path="/acompanhar"
                  element={<AcompanharPedido />}
                />
                <Route
                  path="/acompanhar/:numero"
                  element={<AcompanharPedido />}
                />
                
                {/* Rotas do admin */}
                <Route
                  path="/admin/login"
                  element={<AdminLogin />}
                />
                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboard />}
                />
                <Route
                  path="/admin"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                
                {/* Redirecionamentos */}
                <Route
                  path="/cardapio"
                  element={<Navigate to="/" replace />}
                />
                
                {/* Página não encontrada */}
                <Route
                  path="*"
                  element={<Navigate to="/" replace />}
                />
              </Routes>
              
              {/* Botão WhatsApp flutuante - disponível em todas as páginas */}
              <FloatingWhatsApp />
            </Box>
          </Router>
        </CarrinhoProvider>
      </ClienteAuthProvider>
    </AuthProvider>
  </ThemeProvider>
);
}

export default App;