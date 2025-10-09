const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, insira um email válido'
    ]
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    trim: true,
    match: [
      /^(\+55|55)?[\s-]?(\(?\d{2}\)?[\s-]?)?[\s-]?9?\d{4}[\s-]?\d{4}$/,
      'Por favor, insira um telefone válido (formato brasileiro)'
    ]
  },
  endereco: {
    rua: {
      type: String,
      required: [true, 'Rua é obrigatória'],
      trim: true,
      maxlength: [200, 'Rua não pode ter mais de 200 caracteres']
    },
    numero: {
      type: String,
      required: [true, 'Número é obrigatório'],
      trim: true,
      maxlength: [10, 'Número não pode ter mais de 10 caracteres']
    },
    complemento: {
      type: String,
      trim: true,
      maxlength: [100, 'Complemento não pode ter mais de 100 caracteres']
    },
    bairro: {
      type: String,
      required: [true, 'Bairro é obrigatório'],
      trim: true,
      maxlength: [100, 'Bairro não pode ter mais de 100 caracteres']
    },
    cidade: {
      type: String,
      required: [true, 'Cidade é obrigatória'],
      trim: true,
      maxlength: [100, 'Cidade não pode ter mais de 100 caracteres']
    },
    cep: {
      type: String,
      required: [true, 'CEP é obrigatório'],
      trim: true,
      match: [
        /^\d{5}-?\d{3}$/,
        'Por favor, insira um CEP válido (formato: 12345-678)'
      ]
    },
    pontoReferencia: {
      type: String,
      trim: true,
      maxlength: [200, 'Ponto de referência não pode ter mais de 200 caracteres']
    }
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  },
  ativo: {
    type: Boolean,
    default: true
  },
  observacoes: {
    type: String,
    maxlength: [300, 'Observações não podem ter mais de 300 caracteres']
  }
}, {
  timestamps: true
});

// Índices para otimizar consultas
clienteSchema.index({ email: 1 });
clienteSchema.index({ telefone: 1 });
clienteSchema.index({ 'endereco.cep': 1 });

// Método para formatar endereço completo
clienteSchema.methods.getEnderecoCompleto = function() {
  const { rua, numero, complemento, bairro, cidade, cep } = this.endereco;
  let endereco = `${rua}, ${numero}`;
  if (complemento) endereco += `, ${complemento}`;
  endereco += ` - ${bairro}, ${cidade} - CEP: ${cep}`;
  return endereco;
};

// Método para formatar telefone para WhatsApp
clienteSchema.methods.getTelefoneWhatsApp = function() {
  return this.telefone.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
};

module.exports = mongoose.model('Cliente', clienteSchema);