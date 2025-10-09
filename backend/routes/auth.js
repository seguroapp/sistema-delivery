const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { Admin } = require('../models');
const { authAdmin } = require('../middleware/auth');

const router = express.Router();

// Validações
const loginValidation = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('senha').notEmpty().withMessage('Senha é obrigatória')
];

const adminValidation = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
];

// Função para verificar erros de validação
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
  }
  next();
};

// Função para gerar token JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// POST /api/auth/login - Login do admin
router.post('/login', loginValidation, checkValidation, async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Buscar admin por email
    const admin = await Admin.findOne({ email });
    if (!admin || !admin.ativo) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar senha
    const senhaCorreta = await admin.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Atualizar último login
    admin.ultimoLogin = new Date();
    await admin.save();

    // Gerar token
    const token = gerarToken(admin._id);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        admin: {
          id: admin._id,
          nome: admin.nome,
          email: admin.email,
          ultimoLogin: admin.ultimoLogin
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro no login',
      error: error.message
    });
  }
});

// POST /api/auth/register - Cadastrar primeiro admin (apenas se não houver nenhum)
router.post('/register', adminValidation, checkValidation, async (req, res) => {
  try {
    // Verificar se já existe algum admin
    const adminExistente = await Admin.countDocuments();
    if (adminExistente > 0) {
      return res.status(400).json({
        success: false,
        message: 'Sistema já possui administrador. Use o endpoint de criação protegido.'
      });
    }

    const { nome, email, senha } = req.body;

    // Verificar se email já está em uso
    const emailExistente = await Admin.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }

    // Criar admin
    const novoAdmin = new Admin({
      nome,
      email,
      senha
    });

    await novoAdmin.save();

    // Gerar token
    const token = gerarToken(novoAdmin._id);

    res.status(201).json({
      success: true,
      message: 'Administrador criado com sucesso',
      data: {
        admin: {
          id: novoAdmin._id,
          nome: novoAdmin.nome,
          email: novoAdmin.email
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
router.get('/me', authAdmin, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        admin: {
          id: req.admin._id,
          nome: req.admin.nome,
          email: req.admin.email,
          ultimoLogin: req.admin.ultimoLogin,
          createdAt: req.admin.createdAt
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

// POST /api/auth/criar-admin - Criar novo admin (apenas admin logado)
router.post('/criar-admin', authAdmin, adminValidation, checkValidation, async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificar se email já está em uso
    const emailExistente = await Admin.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }

    // Criar admin
    const novoAdmin = new Admin({
      nome,
      email,
      senha
    });

    await novoAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Administrador criado com sucesso',
      data: {
        admin: {
          id: novoAdmin._id,
          nome: novoAdmin.nome,
          email: novoAdmin.email
        }
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

// PATCH /api/auth/alterar-senha - Alterar senha do admin logado
router.patch('/alterar-senha', authAdmin, [
  body('senhaAtual').notEmpty().withMessage('Senha atual é obrigatória'),
  body('novaSenha').isLength({ min: 6 }).withMessage('Nova senha deve ter pelo menos 6 caracteres')
], checkValidation, async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;

    // Verificar senha atual
    const senhaCorreta = await req.admin.compararSenha(senhaAtual);
    if (!senhaCorreta) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Atualizar senha
    req.admin.senha = novaSenha;
    await req.admin.save();

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar senha',
      error: error.message
    });
  }
});

// GET /api/auth/admins - Listar todos os admins (apenas admin logado)
router.get('/admins', authAdmin, async (req, res) => {
  try {
    const admins = await Admin.find({ ativo: true })
      .select('-senha')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar administradores',
      error: error.message
    });
  }
});

// PATCH /api/auth/admins/:id/status - Ativar/Desativar admin
router.patch('/admins/:id/status', authAdmin, async (req, res) => {
  try {
    const { ativo } = req.body;
    
    // Não permitir desativar a si mesmo
    if (req.params.id === req.admin._id.toString() && !ativo) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível desativar seu próprio usuário'
      });
    }

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { ativo },
      { new: true }
    ).select('-senha');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrador não encontrado'
      });
    }

    res.json({
      success: true,
      message: `Administrador ${ativo ? 'ativado' : 'desativado'} com sucesso`,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar status do administrador',
      error: error.message
    });
  }
});

module.exports = router;