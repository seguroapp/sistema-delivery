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
  
  clientes: [
    {
      _id: '1',
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '31987654321',
      endereco: {
        rua: 'Rua das Flores',
        numero: '123',
        complemento: 'Apt 101',
        bairro: 'Centro',
        cidade: 'Belo Horizonte',
        cep: '30112-000',
        pontoReferencia: 'Próximo à padaria'
      },
      ativo: true,
      dataCadastro: new Date('2024-10-01')
    },
    {
      _id: '2',
      nome: 'Maria Santos',
      email: 'maria@email.com',
      telefone: '31912345678',
      endereco: {
        rua: 'Avenida Brasil',
        numero: '456',
        complemento: '',
        bairro: 'Savassi',
        cidade: 'Belo Horizonte',
        cep: '30112-001',
        pontoReferencia: 'Em frente ao shopping'
      },
      ativo: true,
      dataCadastro: new Date('2024-10-02')
    }
  ],
  
  pedidos: [
    {
      _id: '1',
      numero: '000001',
      cliente: '1',
      dadosCliente: {
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '31987654321',
        endereco: {
          rua: 'Rua das Flores',
          numero: '123',
          complemento: 'Apt 101',
          bairro: 'Centro',
          cidade: 'Belo Horizonte',
          cep: '30112-000',
          pontoReferencia: 'Próximo à padaria'
        }
      },
      itens: [
        {
          cardapio: '1',
          nome: 'Pizza Margherita',
          preco: 45.90,
          quantidade: 1,
          observacoes: 'Sem cebola',
          subtotal: 45.90
        },
        {
          cardapio: '13',
          nome: 'Refrigerante coca cola zero lata 350ml',
          preco: 7.40,
          quantidade: 2,
          observacoes: '',
          subtotal: 14.80
        }
      ],
      valorSubtotal: 60.70,
      valorTaxa: 5.00,
      valorDesconto: 0,
      valorTotal: 65.70,
      status: 'Pendente',
      formaPagamento: 'Cartão de Crédito',
      observacoes: 'Favor tocar o interfone',
      dataHoraPedido: new Date(),
      whatsappEnviado: false,
      historico: [{
        status: 'Pendente',
        dataHora: new Date(),
        observacao: 'Pedido criado'
      }],
      urlWhatsapp: 'https://api.whatsapp.com/send?phone=5531983218662&text=...'
    },
    {
      _id: '2',
      numero: '000002',
      cliente: '2',
      dadosCliente: {
        nome: 'Maria Santos',
        email: 'maria@email.com',
        telefone: '31912345678',
        endereco: {
          rua: 'Avenida Brasil',
          numero: '456',
          complemento: '',
          bairro: 'Savassi',
          cidade: 'Belo Horizonte',
          cep: '30112-001',
          pontoReferencia: 'Em frente ao shopping'
        }
      },
      itens: [
        {
          cardapio: '5',
          nome: 'Hambúrguer Artesanal',
          preco: 28.90,
          quantidade: 2,
          observacoes: 'Ponto bem passado',
          subtotal: 57.80
        }
      ],
      valorSubtotal: 57.80,
      valorTaxa: 4.50,
      valorDesconto: 5.00,
      valorTotal: 57.30,
      status: 'Confirmado',
      formaPagamento: 'Dinheiro',
      observacoes: '',
      dataHoraPedido: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
      whatsappEnviado: true,
      historico: [
        {
          status: 'Pendente',
          dataHora: new Date(Date.now() - 30 * 60 * 1000),
          observacao: 'Pedido criado'
        },
        {
          status: 'Confirmado',
          dataHora: new Date(Date.now() - 25 * 60 * 1000),
          observacao: 'Pedido confirmado pelo restaurante'
        }
      ],
      urlWhatsapp: 'https://api.whatsapp.com/send?phone=5531983218662&text=...'
    },
    {
      _id: '3',
      numero: '000003',
      cliente: '1',
      dadosCliente: {
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '31987654321',
        endereco: {
          rua: 'Rua das Flores',
          numero: '123',
          complemento: 'Apt 101',
          bairro: 'Centro',
          cidade: 'Belo Horizonte',
          cep: '30112-000',
          pontoReferencia: 'Próximo à padaria'
        }
      },
      itens: [
        {
          cardapio: '11',
          nome: 'Filé De Frango Empanado',
          preco: 24.90,
          quantidade: 1,
          observacoes: '',
          subtotal: 24.90
        },
        {
          cardapio: '14',
          nome: 'Coca-Cola Lata 350ml',
          preco: 7.40,
          quantidade: 1,
          observacoes: '',
          subtotal: 7.40
        }
      ],
      valorSubtotal: 32.30,
      valorTaxa: 3.50,
      valorDesconto: 0,
      valorTotal: 35.80,
      status: 'Entregue',
      formaPagamento: 'PIX',
      observacoes: '',
      dataHoraPedido: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      whatsappEnviado: true,
      historico: [
        {
          status: 'Pendente',
          dataHora: new Date(Date.now() - 2 * 60 * 60 * 1000),
          observacao: 'Pedido criado'
        },
        {
          status: 'Confirmado',
          dataHora: new Date(Date.now() - 115 * 60 * 1000),
          observacao: 'Pedido confirmado'
        },
        {
          status: 'Preparando',
          dataHora: new Date(Date.now() - 110 * 60 * 1000),
          observacao: 'Iniciando preparo'
        },
        {
          status: 'Pronto',
          dataHora: new Date(Date.now() - 80 * 60 * 1000),
          observacao: 'Pedido pronto para entrega'
        },
        {
          status: 'Saiu para Entrega',
          dataHora: new Date(Date.now() - 75 * 60 * 1000),
          observacao: 'Entregador saiu para entrega'
        },
        {
          status: 'Entregue',
          dataHora: new Date(Date.now() - 60 * 60 * 1000),
          observacao: 'Pedido entregue com sucesso'
        }
      ],
      urlWhatsapp: 'https://api.whatsapp.com/send?phone=5531983218662&text=...'
    }
  ],
  
  // Contadores para IDs
  nextClienteId: 3,
  nextPedidoId: 4,
  nextPedidoNumero: 4
};

module.exports = mockData;