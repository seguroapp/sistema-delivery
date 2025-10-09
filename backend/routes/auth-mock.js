const express = require('express');
const jwt = require('jsonwebtoken');
const mockData = require('../mockData');

const router = express.Router();

// Mock admin data
const adminMock = {
  _id: 'admin1',
  nome: 'Administrador',
  email: 'admin@delivery.com',
  senha: 'admin123', // Em produção seria hash
  ativo: true,
  ultimoLogin: new Date()
};

// Gerar token JWT mock
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'mock_secret', {
    expiresIn: '7d'
  });
};

// POST /api/auth/login - Login do admin
router.post('/login', (req, res) => {
  try {
    const { email, senha, password } = req.body; // Aceitar ambos os formatos
    const senhaFinal = senha || password; // Usar senha se disponível, senão password

    console.log('🔍 Login attempt:', { email, senhaRecebida: senhaFinal });

    // Validação de entrada
    if (!email || !senhaFinal) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Verificar credenciais mock
    if (email === adminMock.email && senhaFinal === adminMock.senha) {
      const token = gerarToken(adminMock._id);
      
      console.log('✅ Login successful for:', email);
      
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        token, // Mudança: retornar token diretamente
        admin: {
          id: adminMock._id,
          nome: adminMock.nome,
          email: adminMock.email,
          ultimoLogin: new Date()
        }
      });
    } else {
      console.log('❌ Login failed:', { 
        emailReceived: email, 
        expectedEmail: adminMock.email,
        senhaReceived: senhaFinal,
        expectedSenha: adminMock.senha 
      });
      
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro no login',
      error: error.message
    });
  }
});

// POST /api/auth/register - Cadastrar primeiro admin
router.post('/register', (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    
    const token = gerarToken(adminMock._id);
    
    res.status(201).json({
      success: true,
      message: 'Administrador criado com sucesso',
      data: {
        admin: {
          id: adminMock._id,
          nome: nome || adminMock.nome,
          email: email || adminMock.email
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar administrador',
      error: error.message
    });
  }
});

// GET /api/auth/me - Obter dados do admin logado
router.get('/me', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        admin: {
          id: adminMock._id,
          nome: adminMock.nome,
          email: adminMock.email,
          ultimoLogin: adminMock.ultimoLogin,
          createdAt: new Date('2025-01-01')
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do usuário',
      error: error.message
    });
  }
});

module.exports = router;