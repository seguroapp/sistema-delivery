const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simulação de banco de dados para clientes
let clientes = [
  {
    _id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '11999999999',
    senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    endereco: {
      cep: '01234-567',
      rua: 'Rua das Flores, 123',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      pontoReferencia: 'Próximo ao mercado'
    },
    dataCadastro: new Date('2024-01-15'),
    ativo: true
  }
];

// Chave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'cliente_secret_key_123';

// Middleware para verificar token do cliente
const verificarTokenCliente = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acesso requerido'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.clienteId = decoded.clienteId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Função para gerar token
const gerarToken = (clienteId) => {
  return jwt.sign({ clienteId }, JWT_SECRET, { expiresIn: '7d' });
};

// Função para gerar ID único
const gerarId = () => {
  return (clientes.length + 1).toString();
};

// Função para encontrar cliente por email
const encontrarClientePorEmail = (email) => {
  return clientes.find(cliente => cliente.email === email && cliente.ativo);
};

// Função para encontrar cliente por ID
const encontrarClientePorId = (id) => {
  return clientes.find(cliente => cliente._id === id && cliente.ativo);
};

// Rota para registro de cliente
router.post('/register', async (req, res) => {
  try {
    const {
      nome,
      email,
      telefone,
      senha,
      endereco
    } = req.body;

    // Validações básicas
    if (!nome || !email || !telefone || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }

    // Verificar se email já existe
    const clienteExistente = encontrarClientePorEmail(email);
    if (clienteExistente) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está cadastrado'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    // Validar telefone
    const telefoneNumeros = telefone.replace(/\D/g, '');
    if (telefoneNumeros.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Telefone inválido'
      });
    }

    // Validar senha
    if (senha.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    // Criptografar senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Criar novo cliente
    const novoCliente = {
      _id: gerarId(),
      nome,
      email: email.toLowerCase(),
      telefone: telefoneNumeros,
      senha: senhaCriptografada,
      endereco: endereco || {},
      dataCadastro: new Date(),
      ativo: true
    };

    // Adicionar à lista
    clientes.push(novoCliente);

    // Retornar sucesso (sem a senha)
    const { senha: _, ...clienteSemSenha } = novoCliente;

    res.status(201).json({
      success: true,
      message: 'Cliente cadastrado com sucesso',
      cliente: clienteSemSenha
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para login de cliente
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validações básicas
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Encontrar cliente
    const cliente = encontrarClientePorEmail(email.toLowerCase());
    if (!cliente) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Gerar token
    const token = gerarToken(cliente._id);

    // Retornar sucesso (sem a senha)
    const { senha: _, ...clienteSemSenha } = cliente;

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      cliente: clienteSemSenha
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para verificar token
router.get('/verify', verificarTokenCliente, (req, res) => {
  try {
    const cliente = encontrarClientePorId(req.clienteId);
    
    if (!cliente) {
      return res.status(401).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    const { senha: _, ...clienteSemSenha } = cliente;

    res.json({
      success: true,
      cliente: clienteSemSenha
    });

  } catch (error) {
    console.error('Erro na verificação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para logout
router.post('/logout', verificarTokenCliente, (req, res) => {
  // Em um sistema real, você invalidaria o token aqui
  // Como estamos usando JWT, o token expira naturalmente
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

// Rota para obter perfil do cliente
router.get('/profile', verificarTokenCliente, (req, res) => {
  try {
    const cliente = encontrarClientePorId(req.clienteId);
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    const { senha: _, ...clienteSemSenha } = cliente;

    res.json({
      success: true,
      cliente: clienteSemSenha
    });

  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para atualizar perfil do cliente
router.put('/profile', verificarTokenCliente, async (req, res) => {
  try {
    const {
      nome,
      telefone,
      endereco,
      senhaAtual,
      novaSenha
    } = req.body;

    const cliente = encontrarClientePorId(req.clienteId);
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    // Se quiser alterar senha
    if (novaSenha) {
      if (!senhaAtual) {
        return res.status(400).json({
          success: false,
          message: 'Senha atual é obrigatória para alterar a senha'
        });
      }

      const senhaAtualValida = await bcrypt.compare(senhaAtual, cliente.senha);
      if (!senhaAtualValida) {
        return res.status(400).json({
          success: false,
          message: 'Senha atual incorreta'
        });
      }

      if (novaSenha.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'A nova senha deve ter pelo menos 6 caracteres'
        });
      }

      cliente.senha = await bcrypt.hash(novaSenha, 10);
    }

    // Atualizar outros dados
    if (nome) cliente.nome = nome;
    if (telefone) cliente.telefone = telefone.replace(/\D/g, '');
    if (endereco) cliente.endereco = { ...cliente.endereco, ...endereco };

    const { senha: _, ...clienteSemSenha } = cliente;

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      cliente: clienteSemSenha
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para obter pedidos do cliente
router.get('/pedidos', verificarTokenCliente, (req, res) => {
  try {
    // Buscar pedidos do mockData
    const mockData = require('../mockData');
    const todosPedidos = mockData.pedidos;
    
    const cliente = encontrarClientePorId(req.clienteId);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    // Filtrar pedidos do cliente por email ou telefone
    const pedidosCliente = todosPedidos.filter(pedido => 
      pedido.dadosCliente.email === cliente.email ||
      pedido.dadosCliente.telefone === cliente.telefone
    );

    // Ordenar por data (mais recente primeiro)
    pedidosCliente.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));

    res.json({
      success: true,
      data: pedidosCliente
    });

  } catch (error) {
    console.error('Erro ao obter pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Exportar clientes (para uso em outros módulos se necessário)
const obterClientes = () => clientes;
const obterClientePorId = (id) => encontrarClientePorId(id);
const obterClientePorEmail = (email) => encontrarClientePorEmail(email);

module.exports = {
  router,
  obterClientes,
  obterClientePorId,
  obterClientePorEmail,
  verificarTokenCliente
};