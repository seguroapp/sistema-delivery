const express = require('express');
const { body, validationResult } = require('express-validator');
const { Pedido, Cliente, Cardapio } = require('../models');
const { authAdmin } = require('../middleware/auth');

const router = express.Router();

// Validações para criar pedido
const pedidoValidation = [
  body('cliente').isMongoId().withMessage('ID do cliente inválido'),
  body('itens').isArray({ min: 1 }).withMessage('Deve haver pelo menos um item no pedido'),
  body('itens.*.cardapio').isMongoId().withMessage('ID do item do cardápio inválido'),
  body('itens.*.quantidade').isInt({ min: 1 }).withMessage('Quantidade deve ser no mínimo 1'),
  body('formaPagamento').isIn(['Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 'PIX', 'Vale Refeição']).withMessage('Forma de pagamento inválida'),
  body('valorTaxa').optional().isFloat({ min: 0 }).withMessage('Taxa deve ser maior ou igual a zero'),
  body('valorDesconto').optional().isFloat({ min: 0 }).withMessage('Desconto deve ser maior ou igual a zero')
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

// POST /api/pedidos - Criar novo pedido (público)
router.post('/', pedidoValidation, checkValidation, async (req, res) => {
  try {
    const { cliente: clienteId, itens, formaPagamento, valorTaxa = 0, valorDesconto = 0, observacoes } = req.body;

    // Verificar se cliente existe
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    // Validar e processar itens
    const itensProcessados = [];
    for (const item of itens) {
      const itemCardapio = await Cardapio.findById(item.cardapio);
      
      if (!itemCardapio) {
        return res.status(404).json({
          success: false,
          message: `Item do cardápio não encontrado: ${item.cardapio}`
        });
      }

      if (!itemCardapio.disponivel) {
        return res.status(400).json({
          success: false,
          message: `Item não disponível: ${itemCardapio.nome}`
        });
      }

      itensProcessados.push({
        cardapio: itemCardapio._id,
        nome: itemCardapio.nome,
        preco: itemCardapio.preco,
        quantidade: item.quantidade,
        observacoes: item.observacoes || '',
        subtotal: itemCardapio.preco * item.quantidade
      });
    }

    // Criar pedido
    const novoPedido = new Pedido({
      cliente: cliente._id,
      dadosCliente: {
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        endereco: cliente.endereco
      },
      itens: itensProcessados,
      formaPagamento,
      valorTaxa,
      valorDesconto,
      observacoes
    });

    const pedidoSalvo = await novoPedido.save();

    // Gerar URL do WhatsApp
    const numeroWhatsApp = process.env.WHATSAPP_NUMBER || '5531983218662';
    const urlWhatsApp = pedidoSalvo.gerarUrlWhatsApp(numeroWhatsApp);
    
    // Atualizar pedido com URL do WhatsApp
    await Pedido.findByIdAndUpdate(pedidoSalvo._id, { 
      urlWhatsapp: urlWhatsApp,
      whatsappEnviado: false 
    });

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: {
        pedido: pedidoSalvo,
        whatsappUrl: urlWhatsApp
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar pedido',
      error: error.message
    });
  }
});

// GET /api/pedidos - Listar pedidos (admin)
router.get('/', authAdmin, async (req, res) => {
  try {
    const { 
      status, 
      dataInicio, 
      dataFim, 
      cliente, 
      page = 1, 
      limit = 20,
      sortBy = 'dataHoraPedido',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    // Filtros
    if (status) query.status = status;
    if (cliente) query.cliente = cliente;
    
    // Filtro por data
    if (dataInicio || dataFim) {
      query.dataHoraPedido = {};
      if (dataInicio) query.dataHoraPedido.$gte = new Date(dataInicio);
      if (dataFim) query.dataHoraPedido.$lte = new Date(dataFim);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const pedidos = await Pedido.find(query)
      .populate('cliente', 'nome email telefone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Pedido.countDocuments(query);

    // Estatísticas rápidas
    const stats = await Pedido.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalPedidos: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          valorMedio: { $avg: '$valorTotal' }
        }
      }
    ]);

    res.json({
      success: true,
      data: pedidos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      stats: stats[0] || { totalPedidos: 0, valorTotal: 0, valorMedio: 0 }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedidos',
      error: error.message
    });
  }
});

// GET /api/pedidos/pendentes - Buscar pedidos pendentes (admin)
router.get('/pendentes', authAdmin, async (req, res) => {
  try {
    const pedidosPendentes = await Pedido.find({ status: 'Pendente' })
      .populate('cliente', 'nome telefone')
      .sort({ dataHoraPedido: -1 });

    res.json({
      success: true,
      data: pedidosPendentes,
      total: pedidosPendentes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedidos pendentes',
      error: error.message
    });
  }
});

// GET /api/pedidos/:id - Buscar pedido específico (admin)
router.get('/:id', authAdmin, async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('cliente')
      .populate('itens.cardapio');
    
    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    res.json({
      success: true,
      data: pedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedido',
      error: error.message
    });
  }
});

// GET /api/pedidos/numero/:numero - Buscar pedido por número (público)
router.get('/numero/:numero', async (req, res) => {
  try {
    const pedido = await Pedido.findOne({ numero: req.params.numero })
      .populate('cliente', 'nome telefone')
      .select('-dadosCliente.endereco'); // Ocultar endereço completo
    
    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    res.json({
      success: true,
      data: pedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedido',
      error: error.message
    });
  }
});

// PATCH /api/pedidos/:id/status - Atualizar status do pedido (admin)
router.patch('/:id/status', authAdmin, async (req, res) => {
  try {
    const { status, observacao } = req.body;
    
    const statusValidos = ['Pendente', 'Confirmado', 'Preparando', 'Pronto', 'Saiu para Entrega', 'Entregue', 'Cancelado'];
    
    if (!statusValidos.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }

    const pedido = await Pedido.findById(req.params.id);
    
    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Adicionar entrada no histórico
    if (observacao) {
      pedido.historico.push({
        status,
        dataHora: new Date(),
        observacao
      });
    }

    pedido.status = status;
    await pedido.save();

    res.json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: pedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status',
      error: error.message
    });
  }
});

// POST /api/pedidos/:id/whatsapp - Reenviar WhatsApp (admin)
router.post('/:id/whatsapp', authAdmin, async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    
    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    const numeroWhatsApp = process.env.WHATSAPP_NUMBER || '5531983218662';
    const urlWhatsApp = pedido.gerarUrlWhatsApp(numeroWhatsApp);

    await Pedido.findByIdAndUpdate(pedido._id, { 
      urlWhatsapp: urlWhatsApp,
      whatsappEnviado: true
    });

    res.json({
      success: true,
      message: 'URL do WhatsApp gerada com sucesso',
      data: {
        whatsappUrl: urlWhatsApp
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar WhatsApp',
      error: error.message
    });
  }
});

// GET /api/pedidos/stats/dashboard - Estatísticas para dashboard (admin)
router.get('/stats/dashboard', authAdmin, async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    // Pedidos de hoje
    const pedidosHoje = await Pedido.countDocuments({
      dataHoraPedido: { $gte: hoje, $lt: amanha }
    });

    // Faturamento de hoje
    const faturamentoHoje = await Pedido.aggregate([
      {
        $match: {
          dataHoraPedido: { $gte: hoje, $lt: amanha },
          status: { $ne: 'Cancelado' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$valorTotal' }
        }
      }
    ]);

    // Pedidos por status
    const pedidosPorStatus = await Pedido.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Itens mais vendidos (últimos 30 dias)
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);

    const itensMaisVendidos = await Pedido.aggregate([
      {
        $match: {
          dataHoraPedido: { $gte: trintaDiasAtras },
          status: { $ne: 'Cancelado' }
        }
      },
      { $unwind: '$itens' },
      {
        $group: {
          _id: '$itens.nome',
          quantidade: { $sum: '$itens.quantidade' },
          receita: { $sum: '$itens.subtotal' }
        }
      },
      { $sort: { quantidade: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        pedidosHoje,
        faturamentoHoje: faturamentoHoje[0]?.total || 0,
        pedidosPorStatus,
        itensMaisVendidos
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message
    });
  }
});

module.exports = router;