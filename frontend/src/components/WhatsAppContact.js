import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Alert
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  Store as StoreIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  Restaurant as RestaurantIcon,
  LocalShipping as DeliveryIcon
} from '@mui/icons-material';

const WhatsAppContact = ({ open, onClose, pedidoNumero = null, clienteNome = '' }) => {
  const [mensagemPersonalizada, setMensagemPersonalizada] = useState('');
  const [tipoContato, setTipoContato] = useState('geral');

  // Configurações do WhatsApp
  const whatsappConfig = {
    numero: process.env.REACT_APP_WHATSAPP_NUMBER || '5531983218662', // Número da loja
    nomeEmpresa: process.env.REACT_APP_EMPRESA_NOME || 'Sistema Delivery',
    horarioFuncionamento: '08:00 às 22:00',
    tempoResposta: '5-10 minutos'
  };

  // Tipos de contato predefinidos
  const tiposContato = [
    {
      id: 'geral',
      titulo: 'Informações Gerais',
      icone: <InfoIcon />,
      cor: 'primary',
      mensagem: `Olá! Gostaria de informações sobre o ${whatsappConfig.nomeEmpresa}.`
    },
    {
      id: 'cardapio',
      titulo: 'Dúvidas sobre Cardápio',
      icone: <RestaurantIcon />,
      cor: 'secondary',
      mensagem: 'Olá! Gostaria de saber mais sobre os pratos do cardápio.'
    },
    {
      id: 'pedido',
      titulo: 'Acompanhar Pedido',
      icone: <DeliveryIcon />,
      cor: 'info',
      mensagem: pedidoNumero 
        ? `Olá! Gostaria de informações sobre meu pedido ${pedidoNumero}.`
        : 'Olá! Gostaria de acompanhar meu pedido.'
    },
    {
      id: 'suporte',
      titulo: 'Suporte Técnico',
      icone: <HelpIcon />,
      cor: 'warning',
      mensagem: 'Olá! Preciso de ajuda com o sistema de delivery.'
    },
    {
      id: 'reclamacao',
      titulo: 'Reclamação/Sugestão',
      icone: <MessageIcon />,
      cor: 'error',
      mensagem: 'Olá! Gostaria de fazer uma reclamação/sugestão.'
    }
  ];

  const handleTipoChange = (tipo) => {
    setTipoContato(tipo.id);
    setMensagemPersonalizada(tipo.mensagem);
  };

  const abrirWhatsApp = (mensagem) => {
    const mensagemFinal = mensagem || mensagemPersonalizada;
    const url = `https://api.whatsapp.com/send?phone=${whatsappConfig.numero}&text=${encodeURIComponent(mensagemFinal)}`;
    window.open(url, '_blank');
  };

  const criarMensagemCompleta = () => {
    let mensagem = mensagemPersonalizada;
    
    // Adicionar informações do cliente se disponível
    if (clienteNome) {
      mensagem = `Olá! Meu nome é ${clienteNome}. ${mensagem}`;
    }
    
    // Adicionar timestamp
    const agora = new Date().toLocaleString('pt-BR');
    mensagem += `\n\n📅 Enviado em: ${agora}`;
    
    return mensagem;
  };

  const ligarParaLoja = () => {
    window.open(`tel:+${whatsappConfig.numero}`, '_self');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <WhatsAppIcon sx={{ fontSize: 40, color: '#25D366', mr: 1 }} />
        <Typography variant="h5" component="span">
          Entrar em Contato
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Informações da Loja */}
        <Card sx={{ mb: 3, bgcolor: '#E8F5E8' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: '#25D366', mr: 2 }}>
                <StoreIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{whatsappConfig.nomeEmpresa}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Horário: {whatsappConfig.horarioFuncionamento}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tempo de resposta: {whatsappConfig.tempoResposta}
                </Typography>
              </Box>
            </Box>
            
            <Alert severity="success" icon={<WhatsAppIcon />}>
              <Typography variant="body2">
                <strong>WhatsApp Ativo!</strong> Responderemos sua mensagem rapidamente.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* Tipos de Contato */}
        <Typography variant="h6" gutterBottom>
          Escolha o tipo de contato:
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {tiposContato.map((tipo) => (
            <Grid item xs={12} sm={6} key={tipo.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: tipoContato === tipo.id ? 2 : 1,
                  borderColor: tipoContato === tipo.id ? `${tipo.cor}.main` : 'grey.300',
                  '&:hover': { 
                    boxShadow: 3,
                    borderColor: `${tipo.cor}.main`
                  }
                }}
                onClick={() => handleTipoChange(tipo)}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                    {tipo.icone}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {tipo.titulo}
                    </Typography>
                  </Box>
                  {tipoContato === tipo.id && (
                    <Chip 
                      label="Selecionado" 
                      color={tipo.cor} 
                      size="small"
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Mensagem Personalizada */}
        <Typography variant="h6" gutterBottom>
          Personalize sua mensagem:
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Sua mensagem"
          value={mensagemPersonalizada}
          onChange={(e) => setMensagemPersonalizada(e.target.value)}
          placeholder="Digite sua mensagem aqui..."
          helperText="Descreva sua dúvida ou necessidade para um atendimento mais rápido"
          sx={{ mb: 2 }}
        />

        {/* Preview da Mensagem */}
        {mensagemPersonalizada && (
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Preview da mensagem:
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontStyle: 'italic' }}>
              {criarMensagemCompleta()}
            </Typography>
          </Box>
        )}

        {/* Mensagens Rápidas */}
        <Typography variant="h6" gutterBottom>
          Ou use uma mensagem rápida:
        </Typography>
        
        <List dense>
          <ListItem 
            button 
            onClick={() => abrirWhatsApp('Olá! Gostaria de fazer um pedido.')}
          >
            <ListItemIcon><RestaurantIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Fazer um pedido" secondary="Quero encomendar algo" />
          </ListItem>
          
          <ListItem 
            button 
            onClick={() => abrirWhatsApp('Olá! Qual o tempo de entrega para minha região?')}
          >
            <ListItemIcon><DeliveryIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Consultar entrega" secondary="Tempo e área de entrega" />
          </ListItem>
          
          <ListItem 
            button 
            onClick={() => abrirWhatsApp('Olá! Vocês têm promoções hoje?')}
          >
            <ListItemIcon><InfoIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Promoções" secondary="Ofertas e descontos" />
          </ListItem>
        </List>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<PhoneIcon />}
              onClick={ligarParaLoja}
            >
              Ligar
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<WhatsAppIcon />}
              onClick={() => abrirWhatsApp(criarMensagemCompleta())}
              disabled={!mensagemPersonalizada.trim()}
            >
              WhatsApp
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default WhatsAppContact;