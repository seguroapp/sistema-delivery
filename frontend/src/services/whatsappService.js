// Serviço para integração com WhatsApp
class WhatsAppService {
  constructor() {
    this.config = {
      numero: process.env.REACT_APP_WHATSAPP_NUMBER || '5531983218662',
      nomeEmpresa: process.env.REACT_APP_EMPRESA_NOME || 'Sistema Delivery',
      mensagemPadrao: 'Olá! Como posso ajudá-lo?',
      horarioFuncionamento: {
        inicio: '08:00',
        fim: '22:00',
        diasSemana: [1, 2, 3, 4, 5, 6, 0] // 0 = domingo, 1 = segunda...
      }
    };
  }

  // Verificar se a loja está aberta
  isLojaAberta() {
    const agora = new Date();
    const horaAtual = agora.getHours() * 100 + agora.getMinutes();
    const diaAtual = agora.getDay();
    
    const horaInicio = parseInt(this.config.horarioFuncionamento.inicio.replace(':', ''));
    const horaFim = parseInt(this.config.horarioFuncionamento.fim.replace(':', ''));
    
    const dentroHorario = horaAtual >= horaInicio && horaAtual <= horaFim;
    const diaFuncionamento = this.config.horarioFuncionamento.diasSemana.includes(diaAtual);
    
    return dentroHorario && diaFuncionamento;
  }

  // Gerar URL do WhatsApp
  gerarURL(mensagem, opcoes = {}) {
    const { 
      adicionarHorario = true,
      adicionarNome = false,
      nomeCliente = '',
      formatarMensagem = true
    } = opcoes;

    let mensagemFinal = mensagem;

    // Adicionar nome do cliente
    if (adicionarNome && nomeCliente) {
      mensagemFinal = `Olá! Meu nome é ${nomeCliente}. ${mensagemFinal}`;
    }

    // Adicionar horário se solicitado
    if (adicionarHorario) {
      const agora = new Date().toLocaleString('pt-BR');
      mensagemFinal += `\n\n📅 Enviado em: ${agora}`;
    }

    // Adicionar status da loja
    if (formatarMensagem) {
      const statusLoja = this.isLojaAberta() 
        ? '🟢 Loja Aberta - Resposta rápida!'
        : '🔴 Fora do horário - Responderemos em breve!';
      
      mensagemFinal += `\n\n${statusLoja}`;
    }

    return `https://api.whatsapp.com/send?phone=${this.config.numero}&text=${encodeURIComponent(mensagemFinal)}`;
  }

  // Mensagens predefinidas
  getMensagensPredefinidas() {
    return {
      geral: {
        titulo: 'Informações Gerais',
        mensagem: `Olá! Gostaria de informações sobre o ${this.config.nomeEmpresa}.`
      },
      pedido: {
        titulo: 'Fazer Pedido',
        mensagem: 'Olá! Gostaria de fazer um pedido.'
      },
      cardapio: {
        titulo: 'Cardápio',
        mensagem: 'Olá! Gostaria de ver o cardápio e preços.'
      },
      entrega: {
        titulo: 'Informações de Entrega',
        mensagem: 'Olá! Qual o tempo e taxa de entrega para minha região?'
      },
      promocoes: {
        titulo: 'Promoções',
        mensagem: 'Olá! Vocês têm alguma promoção ou desconto hoje?'
      },
      acompanhar: {
        titulo: 'Acompanhar Pedido',
        mensagem: 'Olá! Gostaria de acompanhar meu pedido.'
      },
      suporte: {
        titulo: 'Suporte',
        mensagem: 'Olá! Preciso de ajuda com o sistema.'
      },
      reclamacao: {
        titulo: 'Reclamação/Sugestão',
        mensagem: 'Olá! Gostaria de fazer uma reclamação ou sugestão.'
      }
    };
  }

  // Mensagem específica para pedido
  gerarMensagemPedido(pedido) {
    const { numero, valorTotal, status, cliente } = pedido;
    
    let mensagem = `🛍️ *PEDIDO #${numero}*\n\n`;
    
    if (cliente?.nome) {
      mensagem += `👤 Cliente: ${cliente.nome}\n`;
    }
    
    mensagem += `📊 Status: ${status}\n`;
    mensagem += `💰 Total: R$ ${valorTotal.toFixed(2)}\n\n`;
    mensagem += `Preciso de informações sobre este pedido.`;
    
    return this.gerarURL(mensagem, { formatarMensagem: true });
  }

  // Mensagem de novo pedido para a loja
  gerarMensagemNovaComanda(itens, cliente, total) {
    let mensagem = `🆕 *NOVA COMANDA*\n\n`;
    
    mensagem += `👤 *Cliente:* ${cliente.nome}\n`;
    mensagem += `📞 *Telefone:* ${cliente.telefone}\n\n`;
    
    mensagem += `🍽️ *Itens:*\n`;
    itens.forEach(item => {
      mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${item.subtotal.toFixed(2)}\n`;
    });
    
    mensagem += `\n💰 *Total: R$ ${total.toFixed(2)}*\n\n`;
    mensagem += `📍 *Endereço:*\n${cliente.endereco.rua}, ${cliente.endereco.numero}\n`;
    mensagem += `${cliente.endereco.bairro}, ${cliente.endereco.cidade}`;
    
    if (cliente.endereco.pontoReferencia) {
      mensagem += `\n🏠 Referência: ${cliente.endereco.pontoReferencia}`;
    }
    
    return mensagem;
  }

  // Abrir WhatsApp
  abrir(mensagem, opcoes = {}) {
    const url = typeof mensagem === 'string' 
      ? this.gerarURL(mensagem, opcoes)
      : mensagem; // Se já for uma URL
    
    window.open(url, '_blank');
  }

  // Ligar diretamente
  ligar() {
    window.open(`tel:+${this.config.numero}`, '_self');
  }

  // Verificar se WhatsApp está disponível no dispositivo
  isWhatsAppDisponivel() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Obter informações da empresa
  getInfoEmpresa() {
    return {
      nome: this.config.nomeEmpresa,
      numero: this.config.numero,
      numeroFormatado: this.formatarNumero(this.config.numero),
      horario: `${this.config.horarioFuncionamento.inicio} às ${this.config.horarioFuncionamento.fim}`,
      status: this.isLojaAberta() ? 'Aberta' : 'Fechada',
      tempoResposta: this.isLojaAberta() ? '5-10 minutos' : '1-2 horas'
    };
  }

  // Formatar número para exibição
  formatarNumero(numero) {
    // Remove o código do país e formata
    const numeroLimpo = numero.replace('55', '');
    return `(${numeroLimpo.substr(0, 2)}) ${numeroLimpo.substr(2, 5)}-${numeroLimpo.substr(7)}`;
  }
}

// Instância singleton
const whatsappService = new WhatsAppService();

export default whatsappService;