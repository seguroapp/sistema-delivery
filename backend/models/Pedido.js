const mongoose = require('mongoose');

const itemPedidoSchema = new mongoose.Schema({
  cardapio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cardapio',
    required: [true, 'Referência do cardápio é obrigatória']
  },
  nome: {
    type: String,
    required: [true, 'Nome do item é obrigatório']
  },
  preco: {
    type: Number,
    required: [true, 'Preço do item é obrigatório'],
    min: [0, 'Preço deve ser maior que zero']
  },
  quantidade: {
    type: Number,
    required: [true, 'Quantidade é obrigatória'],
    min: [1, 'Quantidade deve ser no mínimo 1']
  },
  observacoes: {
    type: String,
    maxlength: [200, 'Observações não podem ter mais de 200 caracteres']
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const pedidoSchema = new mongoose.Schema({
  numero: {
    type: String,
    unique: true,
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: [true, 'Cliente é obrigatório']
  },
  // Dados do cliente no momento do pedido (para histórico)
  dadosCliente: {
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    endereco: {
      rua: { type: String, required: true },
      numero: { type: String, required: true },
      complemento: String,
      bairro: { type: String, required: true },
      cidade: { type: String, required: true },
      cep: { type: String, required: true },
      pontoReferencia: String
    }
  },
  itens: [itemPedidoSchema],
  valorSubtotal: {
    type: Number,
    required: true,
    min: [0, 'Valor subtotal deve ser maior que zero']
  },
  valorTaxa: {
    type: Number,
    default: 0,
    min: [0, 'Valor da taxa deve ser maior ou igual a zero']
  },
  valorDesconto: {
    type: Number,
    default: 0,
    min: [0, 'Valor do desconto deve ser maior ou igual a zero']
  },
  valorTotal: {
    type: Number,
    required: true,
    min: [0, 'Valor total deve ser maior que zero']
  },
  status: {
    type: String,
    enum: {
      values: [
        'Pendente',          // Pedido recém criado
        'Confirmado',        // Pedido confirmado pelo restaurante
        'Preparando',        // Em preparo
        'Pronto',           // Pronto para entrega
        'Saiu para Entrega', // Saiu para entrega
        'Entregue',         // Entregue ao cliente
        'Cancelado'         // Cancelado
      ],
      message: 'Status deve ser uma das opções válidas'
    },
    default: 'Pendente'
  },
  formaPagamento: {
    type: String,
    enum: {
      values: ['Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 'PIX', 'Vale Refeição'],
      message: 'Forma de pagamento deve ser uma das opções válidas'
    },
    required: [true, 'Forma de pagamento é obrigatória']
  },
  observacoes: {
    type: String,
    maxlength: [500, 'Observações não podem ter mais de 500 caracteres']
  },
  tempoEstimadoMinutos: {
    type: Number,
    default: 45
  },
  dataHoraPedido: {
    type: Date,
    default: Date.now
  },
  dataHoraConfirmacao: Date,
  dataHoraEntrega: Date,
  whatsappEnviado: {
    type: Boolean,
    default: false
  },
  urlWhatsapp: String,
  historico: [{
    status: String,
    dataHora: {
      type: Date,
      default: Date.now
    },
    observacao: String
  }]
}, {
  timestamps: true
});

// Middleware para gerar número do pedido automaticamente
pedidoSchema.pre('save', async function(next) {
  if (this.isNew) {
    const ultimoPedido = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
    const ultimoNumero = ultimoPedido ? parseInt(ultimoPedido.numero) : 0;
    this.numero = String(ultimoNumero + 1).padStart(6, '0'); // Formato: 000001, 000002, etc.
  }
  next();
});

// Middleware para calcular valores automaticamente
pedidoSchema.pre('save', function(next) {
  // Calcular subtotal dos itens
  this.valorSubtotal = this.itens.reduce((total, item) => {
    item.subtotal = item.preco * item.quantidade;
    return total + item.subtotal;
  }, 0);
  
  // Calcular valor total
  this.valorTotal = this.valorSubtotal + this.valorTaxa - this.valorDesconto;
  
  next();
});

// Middleware para atualizar histórico quando status muda
pedidoSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.historico.push({
      status: this.status,
      dataHora: new Date(),
      observacao: `Status alterado para: ${this.status}`
    });
    
    // Atualizar datas específicas baseadas no status
    if (this.status === 'Confirmado' && !this.dataHoraConfirmacao) {
      this.dataHoraConfirmacao = new Date();
    }
    if (this.status === 'Entregue' && !this.dataHoraEntrega) {
      this.dataHoraEntrega = new Date();
    }
  }
  next();
});

// Índices para otimizar consultas
pedidoSchema.index({ numero: 1 });
pedidoSchema.index({ cliente: 1 });
pedidoSchema.index({ status: 1 });
pedidoSchema.index({ dataHoraPedido: -1 });
pedidoSchema.index({ 'dadosCliente.telefone': 1 });

// Método para gerar mensagem do WhatsApp
pedidoSchema.methods.gerarMensagemWhatsApp = function() {
  const { nome, telefone, endereco } = this.dadosCliente;
  const enderecoCompleto = `${endereco.rua}, ${endereco.numero}${endereco.complemento ? ', ' + endereco.complemento : ''} - ${endereco.bairro}, ${endereco.cidade} - CEP: ${endereco.cep}`;
  
  let mensagem = `🍕 *NOVO PEDIDO - #${this.numero}*\n\n`;
  mensagem += `👤 *Cliente:* ${nome}\n`;
  mensagem += `📱 *Telefone:* ${telefone}\n`;
  mensagem += `📍 *Endereço:* ${enderecoCompleto}\n\n`;
  
  if (endereco.pontoReferencia) {
    mensagem += `🏷️ *Ponto de Referência:* ${endereco.pontoReferencia}\n\n`;
  }
  
  mensagem += `🛒 *Itens do Pedido:*\n`;
  this.itens.forEach((item, index) => {
    mensagem += `${index + 1}. ${item.nome} - Qtd: ${item.quantidade} - R$ ${item.subtotal.toFixed(2)}\n`;
    if (item.observacoes) {
      mensagem += `   👉 _${item.observacoes}_\n`;
    }
  });
  
  mensagem += `\n💰 *Subtotal:* R$ ${this.valorSubtotal.toFixed(2)}`;
  if (this.valorTaxa > 0) {
    mensagem += `\n🚚 *Taxa de Entrega:* R$ ${this.valorTaxa.toFixed(2)}`;
  }
  if (this.valorDesconto > 0) {
    mensagem += `\n🎁 *Desconto:* -R$ ${this.valorDesconto.toFixed(2)}`;
  }
  mensagem += `\n💵 *TOTAL:* R$ ${this.valorTotal.toFixed(2)}`;
  
  mensagem += `\n\n💳 *Forma de Pagamento:* ${this.formaPagamento}`;
  
  if (this.observacoes) {
    mensagem += `\n\n📝 *Observações:* ${this.observacoes}`;
  }
  
  mensagem += `\n\n⏰ *Pedido realizado em:* ${this.dataHoraPedido.toLocaleString('pt-BR')}`;
  mensagem += `\n⏱️ *Tempo estimado:* ${this.tempoEstimadoMinutos} minutos`;
  
  return encodeURIComponent(mensagem);
};

// Método para gerar URL do WhatsApp
pedidoSchema.methods.gerarUrlWhatsApp = function(numeroWhatsApp) {
  const mensagem = this.gerarMensagemWhatsApp();
  return `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagem}`;
};

module.exports = mongoose.model('Pedido', pedidoSchema);