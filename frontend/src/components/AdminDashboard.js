import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Alert,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  WhatsApp as WhatsAppIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  Assignment as OrdersIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI, authAPI } from '../services/apiClient';
import whatsappService from '../services/whatsappService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [pedidos, setPedidos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [observacao, setObservacao] = useState('');
  const [message, setMessage] = useState('');

  // Verificar se está logado
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    carregarDados();
  }, [navigate]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      // Carregar dados em paralelo usando o novo API client
      const [pedidosResponse, statsResponse] = await Promise.all([
        pedidosAPI.listar(),
        pedidosAPI.buscarStats()
      ]);
      
      setPedidos(pedidosResponse.data || []);
      setStats(statsResponse.data || null);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setMessage(`Erro ao carregar dados: ${error.message}`);
      
      // Se erro de autenticação, redirecionar para login
      if (error.message.includes('Sessão expirada') || error.message.includes('401')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    navigate('/admin/login');
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (dateString) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
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

  const handleStatusChange = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/admin/pedidos/${selectedPedido._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          observacao
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Status atualizado com sucesso!');
        carregarDados();
        setStatusDialog(false);
        setSelectedPedido(null);
        setNewStatus('');
        setObservacao('');
      } else {
        setMessage('Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setMessage('Erro ao atualizar status');
    }
  };

  const abrirWhatsApp = (pedido) => {
    const url = whatsappService.gerarMensagemPedido(pedido);
    whatsappService.abrir(url);
  };

  // Componente do Dashboard
  const DashboardContent = () => (
    <Grid container spacing={3}>
      {/* Cards de estatísticas */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary">
              Pedidos Hoje
            </Typography>
            <Typography variant="h3">
              {stats?.pedidosHoje || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary">
              Faturamento Hoje
            </Typography>
            <Typography variant="h3">
              {formatMoney(stats?.faturamentoHoje || 0)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary">
              Pedidos Pendentes
            </Typography>
            <Typography variant="h3" color="warning.main">
              {stats?.pedidosPorStatus?.find(p => p._id === 'Pendente')?.count || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary">
              Total de Pedidos
            </Typography>
            <Typography variant="h3">
              {pedidos.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Pedidos por Status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pedidos por Status
            </Typography>
            {stats?.pedidosPorStatus?.map((item) => (
              <Box key={item._id} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Chip label={item._id} color={getStatusColor(item._id)} size="small" />
                <Typography variant="h6">{item.count}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Itens Mais Vendidos */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Itens Mais Vendidos
            </Typography>
            {stats?.itensMaisVendidos?.map((item, index) => (
              <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography>{item._id}</Typography>
                <Box textAlign="right">
                  <Typography variant="body2">{item.quantidade} un.</Typography>
                  <Typography variant="body2" color="primary">
                    {formatMoney(item.receita)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Componente da lista de pedidos
  const PedidosContent = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Pedido</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Data/Hora</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido._id}>
              <TableCell>#{pedido.numero}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {pedido.dadosCliente.nome}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {pedido.dadosCliente.telefone}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{formatMoney(pedido.valorTotal)}</TableCell>
              <TableCell>
                <Chip
                  label={pedido.status}
                  color={getStatusColor(pedido.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{formatDateTime(pedido.dataHoraPedido)}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setSelectedPedido(pedido);
                    setNewStatus(pedido.status);
                    setStatusDialog(true);
                  }}
                  sx={{ mr: 1 }}
                >
                  Status
                </Button>
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => abrirWhatsApp(pedido)}
                >
                  <WhatsAppIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin - Sistema Delivery
          </Typography>
          <IconButton color="inherit" onClick={carregarDados}>
            <RefreshIcon />
          </IconButton>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        {/* Mensagem de feedback */}
        {message && (
          <Alert 
            severity="info" 
            onClose={() => setMessage('')}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        {/* Tabs de navegação */}
        <Paper sx={{ mb: 2 }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab icon={<DashboardIcon />} label="Dashboard" />
            <Tab icon={<OrdersIcon />} label="Pedidos" />
          </Tabs>
        </Paper>

        {/* Conteúdo das tabs */}
        {currentTab === 0 && <DashboardContent />}
        {currentTab === 1 && <PedidosContent />}

        {/* Dialog para alterar status */}
        <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Alterar Status - Pedido #{selectedPedido?.numero}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="Pendente">Pendente</MenuItem>
                  <MenuItem value="Confirmado">Confirmado</MenuItem>
                  <MenuItem value="Preparando">Preparando</MenuItem>
                  <MenuItem value="Saiu para Entrega">Saiu para Entrega</MenuItem>
                  <MenuItem value="Entregue">Entregue</MenuItem>
                  <MenuItem value="Cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                label="Observação (opcional)"
                multiline
                rows={3}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />

              {selectedPedido && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Detalhes do Pedido:
                  </Typography>
                  <Typography variant="body2">
                    Cliente: {selectedPedido.dadosCliente.nome}
                  </Typography>
                  <Typography variant="body2">
                    Telefone: {selectedPedido.dadosCliente.telefone}
                  </Typography>
                  <Typography variant="body2">
                    Total: {formatMoney(selectedPedido.valorTotal)}
                  </Typography>
                  <Typography variant="body2">
                    Pagamento: {selectedPedido.formaPagamento}
                  </Typography>
                  {selectedPedido.observacoes && (
                    <Typography variant="body2">
                      Obs: {selectedPedido.observacoes}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialog(false)}>Cancelar</Button>
            <Button onClick={handleStatusChange} variant="contained">
              Atualizar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard;