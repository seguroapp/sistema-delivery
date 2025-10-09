import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@delivery.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handlers otimizados para evitar perda de foco
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  // Verificar se já está logado
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validação básica
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor, insira um email válido');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Salvar token no localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        
        // Redirecionar para dashboard
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Erro de conexão. Verifique se o servidor está rodando.');
      } else {
        setError('Erro de conexão. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <LockIcon sx={{ mr: 1, fontSize: 40, color: 'primary.main' }} />
            <Typography component="h1" variant="h4">
              Admin Login
            </Typography>
          </Box>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Sistema Delivery - Área Administrativa
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Entrar'
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1, width: '100%' }}>
            <Typography variant="body2" color="text.secondary" align="center">
              <strong>Credenciais de Teste:</strong>
            </Typography>
            <Typography variant="body2" align="center">
              Email: admin@delivery.com
            </Typography>
            <Typography variant="body2" align="center">
              Senha: admin123
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/')}
            >
              ← Voltar para o site
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin;