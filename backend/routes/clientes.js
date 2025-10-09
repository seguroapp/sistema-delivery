const express = require('express');
const { body, validationResult } = require('express-validator');
const { Cliente } = require('../models');
const { authAdmin } = require('../middleware/auth');

const router = express.Router();

// Validações
const clienteValidation = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório').isLength({ max: 100 }).withMessage('Nome não pode ter mais de 100 caracteres'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('telefone').matches(/^(\+55|55)?[\s-]?(\(?\d{2}\)?[\s-]?)?[\s-]?9?\d{4}[\s-]?\d{4}$/).withMessage('Telefone inválido'),
  body('endereco.rua').trim().notEmpty().withMessage('Rua é obrigatória'),
  body('endereco.numero').trim().notEmpty().withMessage('Número é obrigatório'),
  body('endereco.bairro').trim().notEmpty().withMessage('Bairro é obrigatório'),
  body('endereco.cidade').trim().notEmpty().withMessage('Cidade é obrigatória'),
  body('endereco.cep').matches(/^\d{5}-?\d{3}$/).withMessage('CEP inválido')
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

// POST /api/clientes - Cadastrar novo cliente (público)
router.post('/', clienteValidation, checkValidation, async (req, res) => {
  try {
    // Verificar se cliente já existe por email ou telefone
    const clienteExistente = await Cliente.findOne({
      $or: [
        { email: req.body.email },
        { telefone: req.body.telefone }
      ]
    });

    if (clienteExistente) {
      return res.status(400).json({
        success: false,
        message: 'Cliente já cadastrado com este email ou telefone'
      });
    }

    const novoCliente = new Cliente(req.body);
    const clienteSalvo = await novoCliente.save();

    // Remover dados sensíveis da resposta
    const clienteResposta = clienteSalvo.toObject();
    
    res.status(201).json({
      success: true,
      message: 'Cliente cadastrado com sucesso',
      data: clienteResposta
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar cliente',
      error: error.message
    });
  }
});

// GET /api/clientes - Listar clientes (admin)
router.get('/', authAdmin, async (req, res) => {
  try {
    const { search, cidade, ativo, page = 1, limit = 20 } = req.query;
    let query = {};

    // Filtros
    if (ativo !== undefined) query.ativo = ativo === 'true';
    if (cidade) query['endereco.cidade'] = new RegExp(cidade, 'i');

    // Busca por nome, email ou telefone
    if (search) {
      query.$or = [
        { nome: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { telefone: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const clientes = await Cliente.find(query)
      .sort({ dataCadastro: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Cliente.countDocuments(query);

    res.json({
      success: true,
      data: clientes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar clientes',
      error: error.message
    });
  }
});

// GET /api/clientes/:id - Buscar cliente específico (admin)
router.get('/:id', authAdmin, async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    res.json({
      success: true,
      data: cliente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar cliente',
      error: error.message
    });
  }
});

// GET /api/clientes/email/:email - Buscar cliente por email (público - para checkout)
router.get('/email/:email', async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ email: req.params.email, ativo: true });
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    res.json({
      success: true,
      data: cliente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar cliente',
      error: error.message
    });
  }
});

// PUT /api/clientes/:id - Atualizar cliente (admin)
router.put('/:id', authAdmin, clienteValidation, checkValidation, async (req, res) => {
  try {
    const clienteAtualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!clienteAtualizado) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Cliente atualizado com sucesso',
      data: clienteAtualizado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar cliente',
      error: error.message
    });
  }
});

// PATCH /api/clientes/:id/status - Ativar/Desativar cliente (admin)
router.patch('/:id/status', authAdmin, async (req, res) => {
  try {
    const { ativo } = req.body;
    
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { ativo },
      { new: true }
    );

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    res.json({
      success: true,
      message: `Cliente ${ativo ? 'ativado' : 'desativado'} com sucesso`,
      data: cliente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar status do cliente',
      error: error.message
    });
  }
});

// DELETE /api/clientes/:id - Deletar cliente (admin)
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const clienteDeletado = await Cliente.findByIdAndDelete(req.params.id);

    if (!clienteDeletado) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Cliente deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar cliente',
      error: error.message
    });
  }
});

module.exports = router;