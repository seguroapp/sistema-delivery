import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Badge,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  ShoppingCart as OrderIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Notifications as NotificationIcon,
  Refresh as RefreshIcon,
  WhatsApp as WhatsAppIcon,
  CheckCircle as CheckIcon,
  AccessTime as TimeIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { pedidosAPI, formatarMoeda } from '../../services/api';

const STATUS_COLORS = {
  'Pendente': 'warning',
  'Confirmado': 'info',
  'Preparando': 'primary',
  'Pronto': 'success',
  'Saiu para Entrega': 'secondary',
  'Entregue': 'success',
  'Cancelado': 'error',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [pedidosPendentes, setPedidosPendentes] = useState([]);
  const [pedidosRecentes, setPedidosRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [notificationSound] = useState(new Audio('/sounds/notification.mp3'));

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 30000);
    return () => clearInterval(interval);
  }, []);

  // Verificar novos pedidos pendentes para notificação sonora
  useEffect(() => {
    const pedidosPendentesAnteriores = JSON.parse(localStorage.getItem('pedidosPendentes') || '[]');
    const novosPedidosIds = pedidosPendentes
      .filter(pedido => !pedidosPendentesAnteriores.includes(pedido._id))
      .map(pedido => pedido._id);

    if (novosPedidosIds.length > 0 && pedidosPendentesAnteriores.length > 0) {
      // Tocar som de notificação
      playNotificationSound();
      
      // Mostrar notificação do navegador se permitido
      if (Notification.permission === 'granted') {
        new Notification('Novo Pedido!', {
          body: `${novosPedidosIds.length} novo(s) pedido(s) recebido(s)`,
          icon: '/icon-192x192.png'
        });
      }
    }

    localStorage.setItem('pedidosPendentes', JSON.stringify(pedidosPendentes.map(p => p._id)));
  }, [pedidosPendentes]);

  // Solicitar permissão para notificações
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const playNotificationSound = () => {
    try {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(e => console.log('Erro ao tocar som:', e));
    } catch (error) {
      console.log('Erro ao tocar som de notificação:', error);
    }
  };

  const carregarDados = async () => {
    try {
      setError('');
      
      const [statsResponse, pendentesResponse, recentesResponse] = await Promise.all([
        pedidosAPI.estatisticas(),
        pedidosAPI.listarPendentes(),
        pedidosAPI.listar({ limit: 10, sortBy: 'dataHoraPedido', sortOrder: 'desc' })
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      if (pendentesResponse.data.success) {
        setPedidosPendentes(pendentesResponse.data.data);
      }

      if (recentesResponse.data.success) {
        setPedidosRecentes(recentesResponse.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatusPedido = async (pedidoId, novoStatus) => {
    try {
      await pedidosAPI.atualizarStatus(pedidoId, novoStatus);
      carregarDados(); // Recarregar dados após atualização
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const reenviarWhatsApp = async (pedidoId) => {
    try {
      const response = await pedidosAPI.reenviarWhatsApp(pedidoId);
      if (response.data.success && response.data.data.whatsappUrl) {
        window.open(response.data.data.whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Erro ao reenviar WhatsApp:', error);
    }
  };

  const formatarTempoDecorrido = (data) => {
    const agora = new Date();
    const datapedido = new Date(data);
    const diff = agora - datapedido;
    const minutos = Math.floor(diff / 60000);
    
    if (minutos < 60) {
      return `${minutos}min atrás`;
    } else {
      const horas = Math.floor(minutos / 60);
      return `${horas}h ${minutos % 60}min atrás`;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={carregarDados}
        >
          Atualizar
        </Button>
      </Box>

      {/* Mensagem de erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Cards de estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <OrderIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pedidos Hoje
                  </Typography>
                  <Typography variant="h4">
                    {stats?.pedidosHoje || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MoneyIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Faturamento Hoje
                  </Typography>
                  <Typography variant="h4">
                    {formatarMoeda(stats?.faturamentoHoje || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge badgeContent={pedidosPendentes.length} color="error">
                  <NotificationIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                </Badge>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pendentes
                  </Typography>
                  <Typography variant="h4">
                    {pedidosPendentes.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Pedidos
                  </Typography>
                  <Typography variant="h4">
                    {stats?.totalPedidos || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Pedidos pendentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              <Badge badgeContent={pedidosPendentes.length} color="error">
                <NotificationIcon sx={{ mr: 1 }} />
              </Badge>
              Pedidos Pendentes
            </Typography>
            
            {pedidosPendentes.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                <Typography color="text.secondary">
                  Nenhum pedido pendente
                </Typography>
              </Box>
            ) : (
              <List>
                {pedidosPendentes.map((pedido) => (
                  <ListItem 
                    key={pedido._id}
                    sx={{ 
                      border: 1, 
                      borderColor: 'divider', 
                      borderRadius: 1, 
                      mb: 1,
                      bgcolor: 'warning.50'
                    }}
                  >
                    <ListItemIcon>
                      <TimeIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography fontWeight="bold">
                            Pedido #{pedido.numero}
                          </Typography>
                          <Chip 
                            label={pedido.status} 
                            color={STATUS_COLORS[pedido.status]}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {pedido.dadosCliente.nome} - {formatarMoeda(pedido.valorTotal)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatarTempoDecorrido(pedido.dataHoraPedido)}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => atualizarStatusPedido(pedido._id, 'Confirmado')}
                        title="Confirmar pedido"
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => reenviarWhatsApp(pedido._id)}
                        title="Abrir WhatsApp"
                      >
                        <WhatsAppIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Pedidos recentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              <RestaurantIcon sx={{ mr: 1 }} />
              Pedidos Recentes
            </Typography>
            
            <List>
              {pedidosRecentes.slice(0, 8).map((pedido) => (
                <ListItem key={pedido._id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          #{pedido.numero}
                        </Typography>
                        <Chip 
                          label={pedido.status} 
                          color={STATUS_COLORS[pedido.status]}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          {pedido.dadosCliente.nome} - {formatarMoeda(pedido.valorTotal)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatarTempoDecorrido(pedido.dataHoraPedido)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Estatísticas por status */}
      {stats?.pedidosPorStatus && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Status dos Pedidos
          </Typography>
          <Grid container spacing={2}>
            {stats.pedidosPorStatus.map((item) => (
              <Grid item xs={6} sm={4} md={2} key={item._id}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {item.count}
                  </Typography>
                  <Chip 
                    label={item._id} 
                    color={STATUS_COLORS[item._id]}
                    size="small"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default Dashboard;