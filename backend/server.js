const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { logger, errorHandler } = require('./middleware/auth');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
connectDB();

// Inicializar admin padrão (apenas em produção)
if (process.env.NODE_ENV === 'production') {
  const { criarAdminPadrao } = require('./criar-admin');
  
  // Executar após 5 segundos para garantir que o MongoDB conectou
  setTimeout(async () => {
    try {
      await criarAdminPadrao();
    } catch (error) {
      console.log('Admin já existe ou erro na criação:', error.message);
    }
  }, 5000);
}

const app = express();

// Middlewares globais
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://sistemadelivery.netlify.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS permitido para:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS bloqueado para:', origin);
      callback(new Error('CORS não permitido'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(logger);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Teste de conectividade para debug
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Conexão OK',
    cors: 'Funcionando',
    database: 'Conectado',
    frontend_url: process.env.FRONTEND_URL
  });
});

// Rotas da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cardapio', require('./routes/cardapio'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/pedidos', require('./routes/pedidos'));

// Rota para servir arquivos estáticos (futuramente para uploads de imagens)
app.use('/uploads', express.static('uploads'));

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('📋 Rotas disponíveis:');
    console.log('   GET  /api/health - Status da API');
    console.log('   POST /api/auth/register - Cadastrar primeiro admin');
    console.log('   POST /api/auth/login - Login admin');
    console.log('   GET  /api/cardapio - Listar cardápio');
    console.log('   POST /api/clientes - Cadastrar cliente');
    console.log('   POST /api/pedidos - Criar pedido');
  }
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