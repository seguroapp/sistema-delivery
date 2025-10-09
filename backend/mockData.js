// Dados mockados para teste sem MongoDB
const mockData = {
  cardapio: [
    // === MAIS VENDIDOS DA CASA ===
    {
      _id: '1',
      nome: 'Parmegiana c/ Fritas',
      descricao: 'Filé de Frango Empanado coberto por molho de Tomate e Queijo Muçarela... Serve até 1 pessoa (aprox.500ml)',
      preco: 15.00,
      precoOriginal: 33.20,
      categoria: 'Mais Vendidos da Casa',
      disponivel: true,
      tempoPreparoMinutos: 25,
      promocao: 'Promoção para 1º pedido',
      desconto: 55,
      ingredientes: ['Filé de Frango', 'Molho de Tomate', 'Queijo Muçarela', 'Batata Frita'],
      imagem: null
    },
    {
      _id: '2',
      nome: 'Tropeiro Completo',
      descricao: 'Feijão Tropeiro, Arroz Branco, Couve, Ovo Frito e Torresmo (enviado fora da marmita)',
      preco: 24.90,
      precoOriginal: 33.20,
      categoria: 'Mais Vendidos da Casa',
      disponivel: true,
      tempoPreparoMinutos: 30,
      desconto: 25,
      ingredientes: ['Feijão Tropeiro', 'Arroz Branco', 'Couve', 'Ovo Frito', 'Torresmo'],
      imagem: null
    },
    {
      _id: '3',
      nome: 'Strogonoff De Frango',
      descricao: 'Strogonoff de Frango cremoso, acompanha Arroz Branco e Batata Palha',
      preco: 24.90,
      precoOriginal: 33.20,
      categoria: 'Mais Vendidos da Casa',
      disponivel: true,
      tempoPreparoMinutos: 25,
      desconto: 25,
      ingredientes: ['Frango', 'Creme de Leite', 'Champignon', 'Arroz Branco', 'Batata Palha'],
      imagem: null
    },
    {
      _id: '4',
      nome: 'Filé de Frango Empanado com Fritas',
      descricao: 'Filé de Frango Empanado, Arroz Branco, Feijão Carioca, Batata Frita',
      preco: 15.00,
      precoOriginal: 33.20,
      categoria: 'Mais Vendidos da Casa',
      disponivel: true,
      tempoPreparoMinutos: 20,
      promocao: 'Promoção para 1º pedido',
      desconto: 55,
      ingredientes: ['Filé de Frango Empanado', 'Arroz Branco', 'Feijão Carioca', 'Batata Frita'],
      imagem: null
    },

    // === QUERIDINHOS DA VOVÔ ===
    {
      _id: '5',
      nome: 'Feijão Tropeiro Puro',
      descricao: 'Muito Mais Feijão Tropeiro Para Você! (Feijão, Farinha de Milho, Ovo Mexido, Linguiça...)',
      preco: 15.00,
      precoOriginal: 39.90,
      categoria: 'Queridinhos da Vovô',
      disponivel: true,
      tempoPreparoMinutos: 20,
      promocao: 'Promoção para 1º pedido',
      desconto: 62,
      ingredientes: ['Feijão', 'Farinha de Milho', 'Ovo Mexido', 'Linguiça'],
      imagem: null
    },
    {
      _id: '6',
      nome: 'Macarrão ao Molho Bolonhesa',
      descricao: 'Macarrão espaguete ao molho bolonhesa.',
      preco: 24.90,
      precoOriginal: 34.90,
      categoria: 'Queridinhos da Vovô',
      disponivel: true,
      tempoPreparoMinutos: 25,
      desconto: 29,
      ingredientes: ['Macarrão Espaguete', 'Molho Bolonhesa', 'Carne Moída'],
      imagem: null
    },
    {
      _id: '7',
      nome: 'Macarrão Na Chapa Bacon e Calabresa',
      descricao: 'Macarrão espaguete feito na chapa com Bacon, Calabresa, Milho, Pimentão e Cebola.',
      preco: 24.90,
      precoOriginal: 34.90,
      categoria: 'Queridinhos da Vovô',
      disponivel: true,
      tempoPreparoMinutos: 25,
      desconto: 29,
      ingredientes: ['Macarrão Espaguete', 'Bacon', 'Calabresa', 'Milho', 'Pimentão', 'Cebola'],
      imagem: null
    },
    {
      _id: '8',
      nome: 'Macarrão Na Chapa Alho e Bacon',
      descricao: 'Macarrão espaguete feito na chapa com alho, bacon e azeite e cebolinha.',
      preco: 15.00,
      precoOriginal: 34.90,
      categoria: 'Queridinhos da Vovô',
      disponivel: true,
      tempoPreparoMinutos: 20,
      promocao: 'Promoção para 1º pedido',
      desconto: 57,
      ingredientes: ['Macarrão Espaguete', 'Alho', 'Bacon', 'Azeite', 'Cebolinha'],
      imagem: null
    },

    // === BOM E BARATO ===
    {
      _id: '9',
      nome: 'Parmegiana De Frango',
      descricao: 'Filé de Frango Empanado coberto por molho de Tomate e Queijo Muçarela...',
      preco: 24.90,
      precoOriginal: 38.31,
      categoria: 'Bom e Barato - Tudo a 24,90',
      disponivel: true,
      tempoPreparoMinutos: 25,
      desconto: 35,
      ingredientes: ['Filé de Frango Empanado', 'Molho de Tomate', 'Queijo Muçarela'],
      imagem: null
    },
    {
      _id: '10',
      nome: 'Tropeiro Completo',
      descricao: 'Feijão Tropeiro, Arroz Branco, Couve, Ovo Frito e Torresmo (enviado fora da marmita)',
      preco: 24.90,
      precoOriginal: 38.31,
      categoria: 'Bom e Barato - Tudo a 24,90',
      disponivel: true,
      tempoPreparoMinutos: 30,
      desconto: 35,
      ingredientes: ['Feijão Tropeiro', 'Arroz Branco', 'Couve', 'Ovo Frito', 'Torresmo'],
      imagem: null
    },
    {
      _id: '11',
      nome: 'Filé de Frango Empanado Com Fritas',
      descricao: 'Filé de Frango Empanado, Arroz Branco, Feijão Carioca, Batata Frita',
      preco: 24.90,
      precoOriginal: 38.31,
      categoria: 'Bom e Barato - Tudo a 24,90',
      disponivel: true,
      tempoPreparoMinutos: 20,
      desconto: 35,
      ingredientes: ['Filé de Frango Empanado', 'Arroz Branco', 'Feijão Carioca', 'Batata Frita'],
      imagem: null
    },
    {
      _id: '12',
      nome: 'Strogonoff De Frango',
      descricao: 'Strogonoff de Frango cremoso, acompanha Arroz Branco e Batata Palha',
      preco: 24.90,
      precoOriginal: 38.31,
      categoria: 'Bom e Barato - Tudo a 24,90',
      disponivel: true,
      tempoPreparoMinutos: 25,
      desconto: 35,
      ingredientes: ['Frango', 'Creme de Leite', 'Champignon', 'Arroz Branco', 'Batata Palha'],
      imagem: null
    },

    // === BEBIDAS ===
    {
      _id: '13',
      nome: 'Refrigerante coca cola zero lata 350ml',
      descricao: 'Coca-Cola Zero 350ml gelada',
      preco: 7.40,
      categoria: 'Bebidas',
      disponivel: true,
      tempoPreparoMinutos: 1,
      ingredientes: [],
      imagem: null
    },
    {
      _id: '14',
      nome: 'Coca-Cola Lata 350ml',
      descricao: 'Coca-Cola Original 350ml gelada',
      preco: 7.40,
      categoria: 'Bebidas',
      disponivel: true,
      tempoPreparoMinutos: 1,
      ingredientes: [],
      imagem: null
    },
    {
      _id: '15',
      nome: 'Refrigerante Guaraná Antarctica 350ml',
      descricao: 'Guaraná Antarctica 350ml gelado',
      preco: 7.40,
      categoria: 'Bebidas',
      disponivel: true,
      tempoPreparoMinutos: 1,
      ingredientes: [],
      imagem: null
    },
    {
      _id: '16',
      nome: 'Refrigerante Guaraná Mate Couro 1 Litro',
      descricao: 'Guaraná Mate Couro 1L',
      preco: 9.80,
      categoria: 'Bebidas',
      disponivel: true,
      tempoPreparoMinutos: 1,
      ingredientes: [],
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