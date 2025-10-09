const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares globais
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Middlewares de segurança
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de validação de entrada
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
});

// Middleware para logs
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando corretamente (MODO TESTE - SEM MONGODB)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas da API (versão mock)
app.use('/api/cardapio', require('./routes/cardapio-mock'));
app.use('/api/clientes', require('./routes/clientes-mock'));
app.use('/api/pedidos', require('./routes/pedidos-mock'));
app.use('/api/auth', require('./routes/auth-mock'));
app.use('/api/cliente-auth', require('./routes/cliente-auth').router);
app.use('/api/admin/pedidos', require('./routes/pedidos-admin-mock'));
app.use('/api/tracking', require('./routes/tracking-mock'));

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor MOCK rodando em http://localhost:${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚠️  MODO TESTE: Usando dados em memória (sem MongoDB)`);
  console.log(`💡 Para usar MongoDB real, configure .env e use server.js`);
  
  console.log('📋 Rotas disponíveis:');
  console.log('   GET  /api/health - Status da API');
  console.log('   GET  /api/cardapio - Listar cardápio');
  console.log('   POST /api/clientes - Cadastrar cliente');
  console.log('   POST /api/pedidos - Criar pedido');
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Promise rejeitada não tratada:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido. Finalizando servidor...');
  server.close(() => {
    console.log('✅ Servidor finalizado.');
    process.exit(0);
  });
});

module.exports = app;