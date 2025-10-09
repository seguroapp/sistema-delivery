const mongoose = require('mongoose');

const cardapioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do item é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    maxlength: [500, 'Descrição não pode ter mais de 500 caracteres']
  },
  preco: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço deve ser maior que zero']
  },
  categoria: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: {
      values: [
        'Lanches', 
        'Pizzas', 
        'Bebidas', 
        'Sobremesas', 
        'Pratos Principais', 
        'Entradas', 
        'Acompanhamentos'
      ],
      message: 'Categoria deve ser uma das opções válidas'
    }
  },
  imagem: {
    type: String,
    default: null // URL da imagem do produto
  },
  disponivel: {
    type: Boolean,
    default: true
  },
  tempoPreparoMinutos: {
    type: Number,
    default: 30,
    min: [1, 'Tempo de preparo deve ser no mínimo 1 minuto']
  },
  ingredientes: [{
    type: String,
    trim: true
  }],
  observacoes: {
    type: String,
    maxlength: [200, 'Observações não podem ter mais de 200 caracteres']
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Índices para otimizar consultas
cardapioSchema.index({ categoria: 1 });
cardapioSchema.index({ disponivel: 1 });
cardapioSchema.index({ nome: 'text', descricao: 'text' }); // Para busca textual

module.exports = mongoose.model('Cardapio', cardapioSchema);