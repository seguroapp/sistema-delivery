const express = require('express');
const mockData = require('../mockData');

const router = express.Router();

// GET /api/cardapio - Listar itens do cardápio (público)
router.get('/', (req, res) => {
  try {
    const { categoria, disponivel, search } = req.query;
    let itens = [...mockData.cardapio];

    // Filtros
    if (categoria && categoria !== 'Todas') {
      itens = itens.filter(item => item.categoria === categoria);
    }
    
    if (disponivel !== undefined) {
      itens = itens.filter(item => item.disponivel === (disponivel === 'true'));
    }

    // Busca textual
    if (search) {
      const searchLower = search.toLowerCase();
      itens = itens.filter(item => 
        item.nome.toLowerCase().includes(searchLower) ||
        item.descricao.toLowerCase().includes(searchLower) ||
        item.ingredientes.some(ing => ing.toLowerCase().includes(searchLower))
      );
    }

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
router.get('/categorias', (req, res) => {
  try {
    const categorias = [...new Set(mockData.cardapio.map(item => item.categoria))];
    
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
router.get('/:id', (req, res) => {
  try {
    const item = mockData.cardapio.find(item => item._id === req.params.id);
    
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

module.exports = router;