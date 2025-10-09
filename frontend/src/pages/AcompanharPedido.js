import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CardActions
} from '@mui/material';
import {
  Search as SearchIcon,
  LocalShipping as DeliveryIcon,
  Restaurant as RestaurantIcon,
  CheckCircle as CheckIcon,
  Schedule as ClockIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import whatsappService from '../services/whatsappService';

const AcompanharPedido = () => {
  const { numero } = useParams();
  const navigate = useNavigate();
  
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(numero || '');
  const [searchType, setSearchType] = useState('numero');

  // Buscar pedido ao carregar se número for fornecido na URL
  useEffect(() => {
    if (numero) {
      buscarPedido(numero);
    }
  }, [numero]);

  const buscarPedido = async (termoBusca = searchTerm) => {
    if (!termoBusca.trim()) {
      setError('Informe o número do pedido ou seus dados');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Se for busca por número, usar a rota direta
      if (searchType === 'numero' || numero) {
        const response = await fetch(`http://localhost:5000/api/tracking/${termoBusca}`);
        const data = await response.json();

        if (data.success) {
          setPedido(data.data);
        } else {
          setError(data.message);
        }
      } else {
        // Busca por dados do cliente
        const response = await fetch('http://localhost:5000/api/tracking/buscar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            [searchType]: termoBusca
          })
        });

        const data = await response.json();

        if (data.success && data.data.length > 0) {
          // Se houver múltiplos pedidos, mostrar o mais recente
          const pedidoMaisRecente = data.data[0];
          navigate(`/acompanhar/${pedidoMaisRecente.numero}`);
        } else {
          setError(data.message || 'Nenhum pedido encontrado');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Não definido';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pendente':
        return <ClockIcon color="warning" />;
      case 'Confirmado':
        return <CheckIcon color="info" />;
      case 'Preparando':
        return <RestaurantIcon color="primary" />;
      case 'Saiu para Entrega':
        return <DeliveryIcon color="secondary" />;
      case 'Entregue':
        return <CheckIcon color="success" />;
      default:
        return <ClockIcon />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pendente': 'warning',
      'Confirmado': 'info',
      'Preparando': 'primary',
      'Saiu para Entrega': 'secondary',
      'Entregue': 'success',
      'Cancelado': 'error'
    };
    return colors[status] || 'default';
  };

  const getStepIndex = (status) => {
    const steps = ['Pendente', 'Confirmado', 'Preparando', 'Saiu para Entrega', 'Entregue'];
    return steps.indexOf(status);
  };

  const StatusTimeline = () => {
    const steps = [
      { label: 'Pedido Recebido', status: 'Pendente' },
      { label: 'Confirmado', status: 'Confirmado' },
      { label: 'Preparando', status: 'Preparando' },
      { label: 'Saiu para Entrega', status: 'Saiu para Entrega' },
      { label: 'Entregue', status: 'Entregue' }
    ];

    const activeStep = getStepIndex(pedido?.status);

    return (
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => {
          const stepTime = pedido?.historico?.find(h => h.status === step.status);
          
          return (
            <Step key={step.status}>
              <StepLabel
                icon={getStatusIcon(step.status)}
                optional={
                  stepTime && (
                    <Typography variant="caption">
                      {formatDateTime(stepTime.dataHora)}
                    </Typography>
                  )
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary">
                  {stepTime?.observacao || `${step.label} do seu pedido`}
                </Typography>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Cabeçalho */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Acompanhar Pedido
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Digite o número do seu pedido ou seus dados para acompanhar em tempo real
        </Typography>
      </Paper>

      {/* Formulário de Busca */}
      {!pedido && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Número do pedido, telefone ou email"
                placeholder="Ex: 000001, (11) 99999-9999 ou email@exemplo.com"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && buscarPedido()}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => buscarPedido()}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Informações do Pedido */}
      {pedido && (
        <Grid container spacing={3}>
          {/* Status Principal */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h5">
                    Pedido #{pedido.numero}
                  </Typography>
                  <Chip
                    label={pedido.status}
                    color={getStatusColor(pedido.status)}
                    icon={getStatusIcon(pedido.status)}
                    size="large"
                  />
                </Box>

                <Typography variant="h6" color="primary" gutterBottom>
                  {pedido.tempoEstimado}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Próxima etapa: {pedido.proximaEtapa}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Timeline de Status */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Progresso do Pedido
                </Typography>
                <StatusTimeline />
              </CardContent>
            </Card>
          </Grid>

          {/* Detalhes do Pedido */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detalhes do Pedido
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Data/Hora do Pedido
                  </Typography>
                  <Typography variant="body1">
                    {formatDateTime(pedido.dataHoraPedido)}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Valor Total
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatMoney(pedido.valorTotal)}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Forma de Pagamento
                  </Typography>
                  <Typography variant="body1">
                    {pedido.formaPagamento}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Endereço de Entrega
                  </Typography>
                  <Typography variant="body1">
                    {pedido.endereco.rua}, {pedido.endereco.numero}
                  </Typography>
                  <Typography variant="body1">
                    {pedido.endereco.bairro}, {pedido.endereco.cidade}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Itens do Pedido */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Itens do Pedido
                </Typography>
                
                <List>
                  {pedido.itens.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={`${item.quantidade}x ${item.nome}`}
                          secondary={item.observacoes || 'Sem observações'}
                        />
                        <Typography variant="body1" color="primary">
                          {formatMoney(item.subtotal)}
                        </Typography>
                      </ListItem>
                      {index < pedido.itens.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Ações */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Precisa de Ajuda?
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<PhoneIcon />}
                      onClick={() => whatsappService.ligar()}
                    >
                      Ligar para a Loja
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<WhatsAppIcon />}
                      onClick={() => {
                        const url = whatsappService.gerarMensagemPedido(pedido);
                        whatsappService.abrir(url);
                      }}
                    >
                      Falar no WhatsApp
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<HomeIcon />}
                      onClick={() => navigate('/')}
                      sx={{ mt: 1 }}
                    >
                      Voltar ao Cardápio
                    </Button>
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  variant="text"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setPedido(null);
                    setSearchTerm('');
                    navigate('/acompanhar');
                  }}
                >
                  Buscar Outro Pedido
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default AcompanharPedido;