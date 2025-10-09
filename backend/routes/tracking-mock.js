const express = require('express');
const mockData = require('../mockData');

const router = express.Router();

// GET /api/tracking/:numeroOrToken - Rastrear pedido por número ou token
router.get('/:numeroOrToken', (req, res) => {
  try {
    const { numeroOrToken } = req.params;

    // Buscar por número do pedido ou token
    const pedido = mockData.pedidos.find(p => 
      p.numero === numeroOrToken || 
      p.trackingToken === numeroOrToken ||
      p._id === numeroOrToken
    );

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado. Verifique o número do pedido.'
      });
    }

    // Retornar apenas informações necessárias para o cliente
    const pedidoTracking = {
      numero: pedido.numero,
      status: pedido.status,
      dataHoraPedido: pedido.dataHoraPedido,
      dataHoraConfirmacao: pedido.dataHoraConfirmacao,
      dataHoraEntrega: pedido.dataHoraEntrega,
      valorTotal: pedido.valorTotal,
      formaPagamento: pedido.formaPagamento,
      tempoEstimado: calcularTempoEstimado(pedido),
      itens: pedido.itens.map(item => ({
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco,
        subtotal: item.subtotal,
        observacoes: item.observacoes
      })),
      endereco: {
        rua: pedido.dadosCliente.endereco.rua,
        numero: pedido.dadosCliente.endereco.numero,
        bairro: pedido.dadosCliente.endereco.bairro,
        cidade: pedido.dadosCliente.endereco.cidade
      },
      historico: pedido.historico || [],
      proximaEtapa: getProximaEtapa(pedido.status)
    };

    res.json({
      success: true,
      data: pedidoTracking
    });

  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/tracking/buscar - Buscar pedido por dados do cliente
router.post('/buscar', (req, res) => {
  try {
    const { telefone, email, cpf } = req.body;

    if (!telefone && !email && !cpf) {
      return res.status(400).json({
        success: false,
        message: 'Informe pelo menos telefone, email ou CPF para buscar o pedido'
      });
    }

    // Buscar pedidos do cliente
    const pedidosCliente = mockData.pedidos.filter(pedido => {
      const cliente = pedido.dadosCliente;
      return (
        (telefone && cliente.telefone === telefone) ||
        (email && cliente.email === email) ||
        (cpf && cliente.cpf === cpf)
      );
    });

    if (pedidosCliente.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nenhum pedido encontrado com os dados informados'
      });
    }

    // Retornar lista resumida dos pedidos
    const pedidosResumo = pedidosCliente.map(pedido => ({
      numero: pedido.numero,
      status: pedido.status,
      dataHoraPedido: pedido.dataHoraPedido,
      valorTotal: pedido.valorTotal,
      trackingUrl: `/acompanhar/${pedido.numero}`
    }));

    res.json({
      success: true,
      data: pedidosResumo,
      total: pedidosResumo.length
    });

  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Função auxiliar para calcular tempo estimado
function calcularTempoEstimado(pedido) {
  const agora = new Date();
  const criadoEm = new Date(pedido.dataHoraPedido);
  const tempoDecorrido = Math.floor((agora - criadoEm) / (1000 * 60)); // em minutos

  switch (pedido.status) {
    case 'Pendente':
      return 'Aguardando confirmação';
    case 'Confirmado':
      return 'Estimativa: 25-35 minutos';
    case 'Preparando':
      const restante = Math.max(30 - tempoDecorrido, 5);
      return `Estimativa: ${restante} minutos`;
    case 'Saiu para Entrega':
      return 'Estimativa: 10-15 minutos';
    case 'Entregue':
      return 'Pedido entregue';
    case 'Cancelado':
      return 'Pedido cancelado';
    default:
      return 'Aguardando atualização';
  }
}

// Função auxiliar para próxima etapa
function getProximaEtapa(status) {
  const etapas = {
    'Pendente': 'Confirmação do pedido',
    'Confirmado': 'Início do preparo',
    'Preparando': 'Saída para entrega',
    'Saiu para Entrega': 'Entrega do pedido',
    'Entregue': 'Pedido finalizado',
    'Cancelado': 'Pedido cancelado'
  };

  return etapas[status] || 'Atualização em breve';
}

module.exports = router;