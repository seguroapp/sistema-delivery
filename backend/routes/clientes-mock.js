const express = require('express');
const mockData = require('../mockData');

const router = express.Router();

// POST /api/clientes - Cadastrar novo cliente (público)
router.post('/', (req, res) => {
  try {
    const novoCliente = {
      _id: mockData.nextClienteId.toString(),
      ...req.body,
      dataCadastro: new Date(),
      ativo: true
    };
    
    // Verificar se cliente já existe por email
    const clienteExistente = mockData.clientes.find(c => c.email === req.body.email);
    if (clienteExistente) {
      return res.status(400).json({
        success: false,
        message: 'Cliente já cadastrado com este email'
      });
    }

    mockData.clientes.push(novoCliente);
    mockData.nextClienteId++;
    
    res.status(201).json({
      success: true,
      message: 'Cliente cadastrado com sucesso',
      data: novoCliente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar cliente',
      error: error.message
    });
  }
});

// GET /api/clientes/email/:email - Buscar cliente por email (público)
router.get('/email/:email', (req, res) => {
  try {
    const cliente = mockData.clientes.find(c => c.email === req.params.email && c.ativo);
    
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

module.exports = router;