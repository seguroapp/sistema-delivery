// Dados mockados para teste sem MongoDB
const mockData = {
  cardapio: [
    {
      _id: '1',
      nome: 'Pizza Margherita',
      descricao: 'Pizza tradicional com molho de tomate, mozzarella e manjericão fresco',
      preco: 35.90,
      categoria: 'Pizzas',
      disponivel: true,
      tempoPreparoMinutos: 30,
      ingredientes: ['Molho de tomate', 'Mozzarella', 'Manjericão'],
      imagem: null
    },
    {
      _id: '2',
      nome: 'Hambúrguer Artesanal',
      descricao: 'Hambúrguer 150g com queijo, alface, tomate e molho especial',
      preco: 28.50,
      categoria: 'Lanches',
      disponivel: true,
      tempoPreparoMinutos: 20,
      ingredientes: ['Carne 150g', 'Queijo', 'Alface', 'Tomate', 'Molho especial'],
      imagem: null
    },
    {
      _id: '3',
      nome: 'Coca-Cola 2L',
      descricao: 'Refrigerante Coca-Cola 2 litros',
      preco: 8.99,
      categoria: 'Bebidas',
      disponivel: true,
      tempoPreparoMinutos: 1,
      ingredientes: [],
      imagem: null
    },
    {
      _id: '4',
      nome: 'Açaí 500ml',
      descricao: 'Açaí cremoso 500ml com acompanhamentos',
      preco: 15.90,
      categoria: 'Sobremesas',
      disponivel: true,
      tempoPreparoMinutos: 10,
      ingredientes: ['Açaí', 'Granola', 'Banana', 'Leite condensado'],
      imagem: null
    }
  ],
  
  clientes: [],
  pedidos: [],
  
  // Contadores para IDs
  nextClienteId: 1,
  nextPedidoId: 1,
  nextPedidoNumero: 1
};

module.exports = mockData;