const express = require('express');
const mockData = require('../mockData');

const router = express.Router();

// Adicionar alguns pedidos de exemplo para o dashboard
const adicionarPedidosExemplo = () => {
  if (mockData.pedidos.length === 0) {
    // Cliente exemplo
    const clienteExemplo = {
      _id: 'cliente1',
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999',
      endereco: {
        rua: 'Rua das Flores',
        numero: '123',
        complemento: 'Apto 45',
        bairro: 'Centro',
        cidade: 'São Paulo',
        cep: '01234-567',
        pontoReferencia: 'Próximo ao mercado'
      },
      dataCadastro: new Date(),
      ativo: true
    };
    
    mockData.clientes.push(clienteExemplo);

    // Pedidos exemplo
    const pedidosExemplo = [
      {
        _id: 'pedido1',
        numero: '000001',
        cliente: 'cliente1',
        dadosCliente: clienteExemplo,
        itens: [
          {
            cardapio: '1',
            nome: 'Pizza Margherita',
            preco: 35.90,
            quantidade: 1,
            observacoes: '',
            subtotal: 35.90
          },
          {
            cardapio: '3',
            nome: 'Coca-Cola 2L',
            preco: 8.99,
            quantidade: 2,
            observacoes: '',
            subtotal: 17.98
          }
        ],
        valorSubtotal: 53.88,
        valorTaxa: 5.00,
        valorDesconto: 0,
        valorTotal: 58.88,
        status: 'Pendente',
        formaPagamento: 'PIX',
        observacoes: 'Entrega rápida, por favor',
        dataHoraPedido: new Date(Date.now() - 10 * 60 * 1000), // 10 min atrás
        whatsappEnviado: false,
        urlWhatsapp: 'https://api.whatsapp.com/send?phone=5511999999999&text=...',
        historico: [{
          status: 'Pendente',
          dataHora: new Date(),
          observacao: 'Pedido criado'
        }]
      },
      {
        _id: 'pedido2',
        numero: '000002',
        cliente: 'cliente1',
        dadosCliente: {
          nome: 'Maria Santos',
          email: 'maria@email.com',
          telefone: '(11) 88888-8888',
          endereco: {
            rua: 'Av. Paulista',
            numero: '456',
            complemento: '',
            bairro: 'Bela Vista',
            cidade: 'São Paulo',
            cep: '01310-100',
            pontoReferencia: 'Em frente ao shopping'
          }
        },
        itens: [
          {
            cardapio: '2',
            nome: 'Hambúrguer Artesanal',
            preco: 28.50,
            quantidade: 2,
            observacoes: 'Sem cebola',
            subtotal: 57.00
          }
        ],
        valorSubtotal: 57.00,
        valorTaxa: 5.00,
        valorDesconto: 0,
        valorTotal: 62.00,
        status: 'Confirmado',
        formaPagamento: 'Cartão de Crédito',
        observacoes: '',
        dataHoraPedido: new Date(Date.now() - 25 * 60 * 1000), // 25 min atrás
        whatsappEnviado: true,
        urlWhatsapp: 'https://api.whatsapp.com/send?phone=5511999999999&text=...',
        historico: [
          {
            status: 'Pendente',
            dataHora: new Date(Date.now() - 25 * 60 * 1000),
            observacao: 'Pedido criado'
          },
          {
            status: 'Confirmado',
            dataHora: new Date(Date.now() - 20 * 60 * 1000),
            observacao: 'Pedido confirmado'
          }
        ]
      },
      {
        _id: 'pedido3',
        numero: '000003',
        cliente: 'cliente1',
        dadosCliente: {
          nome: 'Carlos Oliveira',
          email: 'carlos@email.com',
          telefone: '(11) 77777-7777',
          endereco: {
            rua: 'Rua Augusta',
            numero: '789',
            complemento: 'Casa 2',
            bairro: 'Consolação',
            cidade: 'São Paulo',
            cep: '01305-000',
            pontoReferencia: 'Portão verde'
          }
        },
        itens: [
          {
            cardapio: '4',
            nome: 'Açaí 500ml',
            preco: 15.90,
            quantidade: 1,
            observacoes: 'Extra granola',
            subtotal: 15.90
          }
        ],
        valorSubtotal: 15.90,
        valorTaxa: 5.00,
        valorDesconto: 2.00,
        valorTotal: 18.90,
        status: 'Entregue',
        formaPagamento: 'Dinheiro',
        observacoes: 'Cliente pagou R$ 20,00',
        dataHoraPedido: new Date(Date.now() - 60 * 60 * 1000), // 1h atrás
        dataHoraEntrega: new Date(Date.now() - 15 * 60 * 1000), // 15 min atrás
        whatsappEnviado: true,
        urlWhatsapp: 'https://api.whatsapp.com/send?phone=5511999999999&text=...',
        historico: [
          {
            status: 'Pendente',
            dataHora: new Date(Date.now() - 60 * 60 * 1000),
            observacao: 'Pedido criado'
          },
          {
            status: 'Confirmado',
            dataHora: new Date(Date.now() - 55 * 60 * 1000),
            observacao: 'Pedido confirmado'
          },
          {
            status: 'Preparando',
            dataHora: new Date(Date.now() - 45 * 60 * 1000),
            observacao: 'Iniciou preparo'
          },
          {
            status: 'Saiu para Entrega',
            dataHora: new Date(Date.now() - 30 * 60 * 1000),
            observacao: 'Saiu para entrega'
          },
          {
            status: 'Entregue',
            dataHora: new Date(Date.now() - 15 * 60 * 1000),
            observacao: 'Pedido entregue'
          }
        ]
      }
    ];

    mockData.pedidos.push(...pedidosExemplo);
    mockData.nextPedidoId = 4;
    mockData.nextPedidoNumero = 4;
  }
};

// GET /api/pedidos - Listar pedidos (admin)
router.get('/', (req, res) => {
  try {
    adicionarPedidosExemplo();
    
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

    let pedidos = [...mockData.pedidos];

    // Filtros
    if (status) {
      pedidos = pedidos.filter(p => p.status === status);
    }
    
    if (cliente) {
      pedidos = pedidos.filter(p => p.cliente === cliente);
    }
    
    // Filtro por data
    if (dataInicio || dataFim) {
      pedidos = pedidos.filter(p => {
        const dataPedido = new Date(p.dataHoraPedido);
        if (dataInicio && dataPedido < new Date(dataInicio)) return false;
        if (dataFim && dataPedido > new Date(dataFim)) return false;
        return true;
      });
    }

    // Ordenação
    pedidos.sort((a, b) => {
      const aVal = new Date(a[sortBy] || a.dataHoraPedido);
      const bVal = new Date(b[sortBy] || b.dataHoraPedido);
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    // Paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedPedidos = pedidos.slice(skip, skip + parseInt(limit));
    
    // Estatísticas
    const stats = {
      totalPedidos: pedidos.length,
      valorTotal: pedidos.reduce((sum, p) => sum + (p.status !== 'Cancelado' ? p.valorTotal : 0), 0),
      valorMedio: pedidos.length > 0 ? pedidos.reduce((sum, p) => sum + p.valorTotal, 0) / pedidos.length : 0
    };

    res.json({
      success: true,
      data: paginatedPedidos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: pedidos.length,
        pages: Math.ceil(pedidos.length / parseInt(limit))
      },
      stats
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
router.get('/pendentes', (req, res) => {
  try {
    adicionarPedidosExemplo();
    
    const pedidosPendentes = mockData.pedidos.filter(p => p.status === 'Pendente');

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

// GET /api/pedidos/stats/dashboard - Estatísticas para dashboard (admin)
router.get('/stats/dashboard', (req, res) => {
  try {
    adicionarPedidosExemplo();
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    // Pedidos de hoje
    const pedidosHoje = mockData.pedidos.filter(p => {
      const dataPedido = new Date(p.dataHoraPedido);
      return dataPedido >= hoje && dataPedido < amanha;
    }).length;

    // Faturamento de hoje
    const faturamentoHoje = mockData.pedidos
      .filter(p => {
        const dataPedido = new Date(p.dataHoraPedido);
        return dataPedido >= hoje && dataPedido < amanha && p.status !== 'Cancelado';
      })
      .reduce((sum, p) => sum + p.valorTotal, 0);

    // Pedidos por status
    const pedidosPorStatus = mockData.pedidos.reduce((acc, p) => {
      const existing = acc.find(item => item._id === p.status);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ _id: p.status, count: 1 });
      }
      return acc;
    }, []);

    // Itens mais vendidos (simulado)
    const itensMaisVendidos = [
      { _id: 'Pizza Margherita', quantidade: 15, receita: 538.50 },
      { _id: 'Hambúrguer Artesanal', quantidade: 12, receita: 342.00 },
      { _id: 'Coca-Cola 2L', quantidade: 25, receita: 224.75 },
      { _id: 'Açaí 500ml', quantidade: 8, receita: 127.20 }
    ];

    res.json({
      success: true,
      data: {
        pedidosHoje,
        faturamentoHoje,
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

// PATCH /api/pedidos/:id/status - Atualizar status do pedido (admin)
router.patch('/:id/status', (req, res) => {
  try {
    const { status, observacao } = req.body;
    
    const pedido = mockData.pedidos.find(p => p._id === req.params.id);
    
    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    const statusAnterior = pedido.status;

    // Atualizar status
    pedido.status = status;
    
    // Adicionar ao histórico
    pedido.historico.push({
      status,
      dataHora: new Date(),
      observacao: observacao || `Status alterado para: ${status}`
    });

    // Atualizar datas específicas
    if (status === 'Confirmado' && !pedido.dataHoraConfirmacao) {
      pedido.dataHoraConfirmacao = new Date();
    }
    if (status === 'Entregue' && !pedido.dataHoraEntrega) {
      pedido.dataHoraEntrega = new Date();
    }

    // Enviar notificação WhatsApp se status mudou
    if (statusAnterior !== status) {
      enviarNotificacaoWhatsApp(pedido, status);
    }

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

// Função para enviar notificação via WhatsApp
function enviarNotificacaoWhatsApp(pedido, novoStatus) {
  try {
    const numeroCliente = pedido.dadosCliente.telefone.replace(/\D/g, '');
    const nomeCliente = pedido.dadosCliente.nome;
    
    // Mensagens personalizadas por status
    const mensagens = {
      'Confirmado': `✅ Olá ${nomeCliente}! Seu pedido #${pedido.numero} foi CONFIRMADO e já está sendo preparado!\n\n🕒 Tempo estimado: 25-35 minutos\n💰 Total: R$ ${pedido.valorTotal.toFixed(2)}\n\n📱 Acompanhe em: http://localhost:3000/acompanhar/${pedido.numero}`,
      
      'Preparando': `👨‍🍳 ${nomeCliente}, seu pedido #${pedido.numero} está sendo PREPARADO com muito carinho!\n\n🕒 Tempo estimado: 15-25 minutos\n📱 Acompanhe: http://localhost:3000/acompanhar/${pedido.numero}`,
      
      'Saiu para Entrega': `🚚 ${nomeCliente}, seu pedido #${pedido.numero} SAIU PARA ENTREGA!\n\n🕒 Chegará em aproximadamente 10-15 minutos\n📍 Endereço: ${pedido.dadosCliente.endereco.rua}, ${pedido.dadosCliente.endereco.numero}\n📱 Acompanhe: http://localhost:3000/acompanhar/${pedido.numero}`,
      
      'Entregue': `🎉 ${nomeCliente}, seu pedido #${pedido.numero} foi ENTREGUE!\n\n✨ Esperamos que tenha gostado!\n💝 Obrigado pela preferência!\n\n⭐ Avalie nosso atendimento: [link_avaliacao]`,
      
      'Cancelado': `❌ ${nomeCliente}, infelizmente seu pedido #${pedido.numero} foi CANCELADO.\n\n💬 Para mais informações, entre em contato conosco.\n📞 WhatsApp: (11) 99999-9999`
    };

    const mensagem = mensagens[novoStatus] || `📱 ${nomeCliente}, seu pedido #${pedido.numero} foi atualizado para: ${novoStatus}`;
    
    // URL do WhatsApp (simulação - em produção seria integração real)
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=55${numeroCliente}&text=${encodeURIComponent(mensagem)}`;
    
    // Log da notificação (em produção seria envio real)
    console.log(`📱 NOTIFICAÇÃO WHATSAPP ENVIADA:`);
    console.log(`Para: ${numeroCliente} (${nomeCliente})`);
    console.log(`Status: ${novoStatus}`);
    console.log(`URL: ${urlWhatsApp}`);
    console.log(`Mensagem: ${mensagem}`);
    
    // Simular envio bem-sucedido
    pedido.ultimaNotificacao = {
      status: novoStatus,
      dataHora: new Date(),
      canal: 'WhatsApp',
      numero: numeroCliente,
      enviado: true
    };

    return true;
    
  } catch (error) {
    console.error('Erro ao enviar notificação WhatsApp:', error);
    return false;
  }
}

// POST /api/pedidos/:id/whatsapp - Reenviar WhatsApp (admin)
router.post('/:id/whatsapp', (req, res) => {
  try {
    const pedido = mockData.pedidos.find(p => p._id === req.params.id);
    
    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Simular geração de nova URL
    const numeroWhatsApp = process.env.WHATSAPP_NUMBER || '5531983218662';
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=PEDIDO%20${pedido.numero}`;

    pedido.urlWhatsapp = urlWhatsApp;
    pedido.whatsappEnviado = true;

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

module.exports = router;