const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rota de teste simples
app.get('/api/health', (req, res) => {
  console.log('Recebida requisição em /api/health');
  res.json({
    success: true,
    message: 'API funcionando - TESTE SIMPLES'
  });
});

// Rota de login simples
app.post('/api/auth/login', (req, res) => {
  console.log('Recebida requisição de login:', req.body);
  
  const { email, password } = req.body;
  
  if (email === 'admin@delivery.com' && password === 'admin123') {
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token: 'mock-token-123',
      admin: {
        id: 'admin1',
        nome: 'Administrador',
        email: 'admin@delivery.com'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });
  }
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  console.log(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor TESTE rodando em http://localhost:${PORT}`);
  console.log('📋 Rotas disponíveis:');
  console.log('   GET  /api/health - Status da API');
  console.log('   POST /api/auth/login - Login admin');
});

// Tratamento de erros
process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejeição não tratada:', promise, 'reason:', reason);
});