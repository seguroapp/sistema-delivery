const express = require('express');
const mockData = require('../mockData');

const router = express.Router();

// Função para gerar número do pedido
const gerarNumeroPedido = () => {
  return String(mockData.nextPedidoNumero).padStart(6, '0');
};

// Função para gerar mensagem do WhatsApp
const gerarMensagemWhatsApp = (pedido) => {
  const { nome, telefone, endereco } = pedido.dadosCliente;
  const enderecoCompleto = `${endereco.rua}, ${endereco.numero}${endereco.complemento ? ', ' + endereco.complemento : ''} - ${endereco.bairro}, ${endereco.cidade} - CEP: ${endereco.cep}`;
  
  let mensagem = `🍕 *NOVO PEDIDO - #${pedido.numero}*\n\n`;
  mensagem += `👤 *Cliente:* ${nome}\n`;
  mensagem += `📱 *Telefone:* ${telefone}\n`;
  mensagem += `📍 *Endereço:* ${enderecoCompleto}\n\n`;
  
  if (endereco.pontoReferencia) {
    mensagem += `🏷️ *Ponto de Referência:* ${endereco.pontoReferencia}\n\n`;
  }
  
  mensagem += `🛒 *Itens do Pedido:*\n`;
  pedido.itens.forEach((item, index) => {
    mensagem += `${index + 1}. ${item.nome} - Qtd: ${item.quantidade} - R$ ${item.subtotal.toFixed(2)}\n`;
    if (item.observacoes) {
      mensagem += `   👉 _${item.observacoes}_\n`;
    }
  });
  
  mensagem += `\n💰 *Subtotal:* R$ ${pedido.valorSubtotal.toFixed(2)}`;
  if (pedido.valorTaxa > 0) {
    mensagem += `\n🚚 *Taxa de Entrega:* R$ ${pedido.valorTaxa.toFixed(2)}`;
  }
  if (pedido.valorDesconto > 0) {
    mensagem += `\n🎁 *Desconto:* -R$ ${pedido.valorDesconto.toFixed(2)}`;
  }
  mensagem += `\n💵 *TOTAL:* R$ ${pedido.valorTotal.toFixed(2)}`;
  
  mensagem += `\n\n💳 *Forma de Pagamento:* ${pedido.formaPagamento}`;
  
  if (pedido.observacoes) {
    mensagem += `\n\n📝 *Observações:* ${pedido.observacoes}`;
  }
  
  mensagem += `\n\n⏰ *Pedido realizado em:* ${pedido.dataHoraPedido.toLocaleString('pt-BR')}`;
  mensagem += `\n⏱️ *Tempo estimado:* 45 minutos`;
  
  return encodeURIComponent(mensagem);
};

// POST /api/pedidos - Criar novo pedido (público)
router.post('/', (req, res) => {
  try {
    const { cliente: clienteId, itens, formaPagamento, valorTaxa = 0, valorDesconto = 0, observacoes } = req.body;

    // Buscar cliente
    const cliente = mockData.clientes.find(c => c._id === clienteId);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    // Processar itens
    const itensProcessados = [];
    let valorSubtotal = 0;

    for (const item of itens) {
      const itemCardapio = mockData.cardapio.find(c => c._id === item.cardapio);
      
      if (!itemCardapio) {
        return res.status(404).json({
          success: false,
          message: `Item do cardápio não encontrado: ${item.cardapio}`
        });
      }

      const subtotal = itemCardapio.preco * item.quantidade;
      valorSubtotal += subtotal;

      itensProcessados.push({
        cardapio: itemCardapio._id,
        nome: itemCardapio.nome,
        preco: itemCardapio.preco,
        quantidade: item.quantidade,
        observacoes: item.observacoes || '',
        subtotal
      });
    }

    const valorTotal = valorSubtotal + valorTaxa - valorDesconto;
    const numeroPedido = gerarNumeroPedido();

    // Criar pedido
    const novoPedido = {
      _id: mockData.nextPedidoId.toString(),
      numero: numeroPedido,
      cliente: cliente._id,
      dadosCliente: {
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        endereco: cliente.endereco
      },
      itens: itensProcessados,
      valorSubtotal,
      valorTaxa,
      valorDesconto,
      valorTotal,
      status: 'Pendente',
      formaPagamento,
      observacoes: observacoes || '',
      dataHoraPedido: new Date(),
      whatsappEnviado: false,
      historico: [{
        status: 'Pendente',
        dataHora: new Date(),
        observacao: 'Pedido criado'
      }]
    };

    // Gerar URL do WhatsApp
    const numeroWhatsApp = process.env.WHATSAPP_NUMBER || '5531983218662';
    const mensagem = gerarMensagemWhatsApp(novoPedido);
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagem}`;
    
    novoPedido.urlWhatsapp = urlWhatsApp;

    mockData.pedidos.push(novoPedido);
    mockData.nextPedidoId++;
    mockData.nextPedidoNumero++;

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: {
        pedido: novoPedido,
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
router.get('/', (req, res) => {
  try {
    const { limit, sortBy = 'dataHoraPedido', sortOrder = 'desc' } = req.query;
    
    let pedidos = [...mockData.pedidos];
    
    // Ordenar
    pedidos.sort((a, b) => {
      if (sortOrder === 'desc') {
        return new Date(b[sortBy]) - new Date(a[sortBy]);
      }
      return new Date(a[sortBy]) - new Date(b[sortBy]);
    });
    
    // Limitar
    if (limit) {
      pedidos = pedidos.slice(0, parseInt(limit));
    }
    
    res.json({
      success: true,
      data: pedidos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar pedidos',
      error: error.message
    });
  }
});

// GET /api/pedidos/pendentes - Listar pedidos pendentes (admin)
router.get('/pendentes', (req, res) => {
  try {
    const pedidosPendentes = mockData.pedidos.filter(p => 
      ['Pendente', 'Confirmado', 'Preparando', 'Pronto', 'Saiu para Entrega'].includes(p.status)
    );
    
    res.json({
      success: true,
      data: pedidosPendentes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar pedidos pendentes',
      error: error.message
    });
  }
});

// GET /api/pedidos/stats/dashboard - Estatísticas para dashboard (admin)
router.get('/stats/dashboard', (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const pedidosHoje = mockData.pedidos.filter(p => {
      const dataPedido = new Date(p.dataHoraPedido);
      dataPedido.setHours(0, 0, 0, 0);
      return dataPedido.getTime() === hoje.getTime();
    });
    
    const pedidosPendentes = mockData.pedidos.filter(p => 
      ['Pendente', 'Confirmado', 'Preparando', 'Pronto', 'Saiu para Entrega'].includes(p.status)
    );
    
    const faturamentoHoje = pedidosHoje
      .filter(p => p.status !== 'Cancelado')
      .reduce((total, p) => total + p.valorTotal, 0);
    
    const totalPedidos = mockData.pedidos.length;
    
    // Itens mais vendidos
    const itensVendidos = {};
    mockData.pedidos.forEach(pedido => {
      if (pedido.status !== 'Cancelado') {
        pedido.itens.forEach(item => {
          if (!itensVendidos[item.nome]) {
            itensVendidos[item.nome] = 0;
          }
          itensVendidos[item.nome] += item.quantidade;
        });
      }
    });
    
    const itensMaisVendidos = Object.entries(itensVendidos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nome, quantidade]) => ({ nome, quantidade }));
    
    res.json({
      success: true,
      data: {
        pedidosHoje: pedidosHoje.length,
        faturamentoHoje,
        pedidosPendentes: pedidosPendentes.length,
        totalPedidos,
        itensMaisVendidos
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter estatísticas',
      error: error.message
    });
  }
});

// GET /api/pedidos/:id - Buscar pedido por ID
router.get('/:id', (req, res) => {
  try {
    const pedido = mockData.pedidos.find(p => p._id === req.params.id);
    
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

// GET /api/pedidos/numero/:numero - Buscar pedido por número
router.get('/numero/:numero', (req, res) => {
  try {
    const pedido = mockData.pedidos.find(p => p.numero === req.params.numero);
    
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
router.patch('/:id/status', (req, res) => {
  try {
    const { status, observacao } = req.body;
    const pedidoIndex = mockData.pedidos.findIndex(p => p._id === req.params.id);
    
    if (pedidoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }
    
    const pedido = mockData.pedidos[pedidoIndex];
    pedido.status = status;
    
    // Adicionar ao histórico
    pedido.historico.push({
      status,
      dataHora: new Date(),
      observacao: observacao || ''
    });
    
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
router.post('/:id/whatsapp', (req, res) => {
  try {
    const pedido = mockData.pedidos.find(p => p._id === req.params.id);
    
    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }
    
    // Gerar nova URL do WhatsApp
    const numeroWhatsApp = process.env.WHATSAPP_NUMBER || '5531983218662';
    const mensagem = gerarMensagemWhatsApp(pedido);
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagem}`;
    
    res.json({
      success: true,
      message: 'Link do WhatsApp gerado com sucesso',
      data: {
        whatsappUrl: urlWhatsApp
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar link do WhatsApp',
      error: error.message
    });
  }
});

module.exports = router;