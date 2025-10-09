const express = require('express');
const { body, validationResult } = require('express-validator');
const { Cardapio } = require('../models');
const { authAdmin } = require('../middleware/auth');

const router = express.Router();

// Validações
const cardapioValidation = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório').isLength({ max: 100 }).withMessage('Nome não pode ter mais de 100 caracteres'),
  body('descricao').trim().notEmpty().withMessage('Descrição é obrigatória').isLength({ max: 500 }).withMessage('Descrição não pode ter mais de 500 caracteres'),
  body('preco').isFloat({ min: 0.01 }).withMessage('Preço deve ser maior que zero'),
  body('categoria').isIn(['Lanches', 'Pizzas', 'Bebidas', 'Sobremesas', 'Pratos Principais', 'Entradas', 'Acompanhamentos']).withMessage('Categoria inválida'),
  body('disponivel').optional().isBoolean().withMessage('Disponível deve ser true ou false'),
  body('tempoPreparoMinutos').optional().isInt({ min: 1 }).withMessage('Tempo de preparo deve ser no mínimo 1 minuto')
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

// GET /api/cardapio - Listar itens do cardápio (público)
router.get('/', async (req, res) => {
  try {
    const { categoria, disponivel, search } = req.query;
    let query = {};

    // Filtros
    if (categoria) query.categoria = categoria;
    if (disponivel !== undefined) query.disponivel = disponivel === 'true';

    // Busca textual
    if (search) {
      query.$text = { $search: search };
    }

    const itens = await Cardapio.find(query).sort({ categoria: 1, nome: 1 });

    res.json({
      success: true,
      data: itens,
      total: itens.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar cardápio',
      error: error.message
    });
  }
});

// GET /api/cardapio/categorias - Listar categorias (público)
router.get('/categorias', async (req, res) => {
  try {
    const categorias = await Cardapio.distinct('categoria');
    
    res.json({
      success: true,
      data: categorias
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar categorias',
      error: error.message
    });
  }
});

// GET /api/cardapio/:id - Buscar item específico (público)
router.get('/:id', async (req, res) => {
  try {
    const item = await Cardapio.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item não encontrado'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar item',
      error: error.message
    });
  }
});

// POST /api/cardapio - Criar novo item (admin)
router.post('/', authAdmin, cardapioValidation, checkValidation, async (req, res) => {
  try {
    const novoItem = new Cardapio(req.body);
    const itemSalvo = await novoItem.save();

    res.status(201).json({
      success: true,
      message: 'Item criado com sucesso',
      data: itemSalvo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar item',
      error: error.message
    });
  }
});

// PUT /api/cardapio/:id - Atualizar item (admin)
router.put('/:id', authAdmin, cardapioValidation, checkValidation, async (req, res) => {
  try {
    const itemAtualizado = await Cardapio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!itemAtualizado) {
      return res.status(404).json({
        success: false,
        message: 'Item não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Item atualizado com sucesso',
      data: itemAtualizado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar item',
      error: error.message
    });
  }
});

// DELETE /api/cardapio/:id - Deletar item (admin)
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const itemDeletado = await Cardapio.findByIdAndDelete(req.params.id);

    if (!itemDeletado) {
      return res.status(404).json({
        success: false,
        message: 'Item não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Item deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar item',
      error: error.message
    });
  }
});

// PATCH /api/cardapio/:id/disponibilidade - Alterar disponibilidade (admin)
router.patch('/:id/disponibilidade', authAdmin, async (req, res) => {
  try {
    const { disponivel } = req.body;
    
    const item = await Cardapio.findByIdAndUpdate(
      req.params.id,
      { disponivel },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item não encontrado'
      });
    }

    res.json({
      success: true,
      message: `Item ${disponivel ? 'disponibilizado' : 'indisponibilizado'} com sucesso`,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar disponibilidade',
      error: error.message
    });
  }
});

module.exports = router;