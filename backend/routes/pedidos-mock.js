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

module.exports = router;