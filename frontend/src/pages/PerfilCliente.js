import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  History as HistoryIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  ExitToApp as LogoutIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useClienteAuth } from '../context/ClienteAuthContext';
import whatsappService from '../services/whatsappService';

const PerfilCliente = () => {
  const navigate = useNavigate();
  const { 
    cliente, 
    loading, 
    isLoggedIn, 
    atualizarCliente, 
    obterPedidos, 
    logout 
  } = useClienteAuth();

  const [currentTab, setCurrentTab] = useState(0);
  const [editando, setEditando] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [message, setMessage] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pontoReferencia: ''
    },
    senhaAtual: '',
    novaSenha: '',
    confirmarNovaSenha: ''
  });

  // Verificar se está logado
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/');
    }
  }, [loading, isLoggedIn, navigate]);

  // Carregar dados do cliente
  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome || '',
        telefone: cliente.telefone || '',
        endereco: {
          cep: cliente.endereco?.cep || '',
          rua: cliente.endereco?.rua || '',
          numero: cliente.endereco?.numero || '',
          complemento: cliente.endereco?.complemento || '',
          bairro: cliente.endereco?.bairro || '',
          cidade: cliente.endereco?.cidade || '',
          estado: cliente.endereco?.estado || '',
          pontoReferencia: cliente.endereco?.pontoReferencia || ''
        },
        senhaAtual: '',
        novaSenha: '',
        confirmarNovaSenha: ''
      });
    }
  }, [cliente]);

  // Carregar pedidos quando a aba for selecionada
  useEffect(() => {
    if (currentTab === 1 && pedidos.length === 0) {
      carregarPedidos();
    }
  }, [currentTab]);

  const carregarPedidos = async () => {
    setLoadingPedidos(true);
    try {
      const response = await obterPedidos();
      if (response.success) {
        setPedidos(response.pedidos);
      } else {
        setMessage('Erro ao carregar pedidos: ' + response.message);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      setMessage('Erro ao conectar com o servidor');
    } finally {
      setLoadingPedidos(false);
    }
  };

  const handleChange = (field) => (event) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: event.target.value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: event.target.value
      });
    }
  };

  const formatarTelefone = (telefone) => {
    const apenasNumeros = telefone.replace(/\D/g, '');
    if (apenasNumeros.length <= 10) {
      return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const formatarCEP = (cep) => {
    const apenasNumeros = cep.replace(/\D/g, '');
    return apenasNumeros.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const buscarCEP = async (cep) => {
    if (cep.length === 9) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData({
            ...formData,
            endereco: {
              ...formData.endereco,
              cep: cep,
              rua: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              estado: data.uf
            }
          });
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setMessage('Nome é obrigatório');
      return false;
    }

    if (!formData.telefone.trim()) {
      setMessage('Telefone é obrigatório');
      return false;
    }

    // Se quer alterar senha
    if (formData.novaSenha) {
      if (!formData.senhaAtual) {
        setMessage('Senha atual é obrigatória para alterar a senha');
        return false;
      }

      if (formData.novaSenha.length < 6) {
        setMessage('A nova senha deve ter pelo menos 6 caracteres');
        return false;
      }

      if (formData.novaSenha !== formData.confirmarNovaSenha) {
        setMessage('A confirmação da nova senha não confere');
        return false;
      }
    }

    return true;
  };

  const handleSalvar = async () => {
    if (!validarFormulario()) return;

    setLoadingUpdate(true);
    setMessage('');

    try {
      const dadosParaEnvio = {
        nome: formData.nome,
        telefone: formData.telefone.replace(/\D/g, ''),
        endereco: formData.endereco
      };

      // Adicionar dados de senha se fornecidos
      if (formData.novaSenha) {
        dadosParaEnvio.senhaAtual = formData.senhaAtual;
        dadosParaEnvio.novaSenha = formData.novaSenha;
      }

      const response = await atualizarCliente(dadosParaEnvio);
      
      if (response.success) {
        setMessage('Perfil atualizado com sucesso!');
        setEditando(false);
        
        // Limpar campos de senha
        setFormData({
          ...formData,
          senhaAtual: '',
          novaSenha: '',
          confirmarNovaSenha: ''
        });
      } else {
        setMessage(response.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage('Erro ao conectar com o servidor');
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleLogout = async () => {
    setConfirmLogout(false);
    await logout();
    navigate('/');
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente': return 'warning';
      case 'Confirmado': return 'info';
      case 'Preparando': return 'primary';
      case 'Saiu para Entrega': return 'secondary';
      case 'Entregue': return 'success';
      case 'Cancelado': return 'error';
      default: return 'default';
    }
  };

  const abrirWhatsAppPedido = (pedido) => {
    const url = whatsappService.gerarMensagemPedido(pedido);
    whatsappService.abrir(url);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const DadosPessoais = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h6" color="primary">
            Dados Pessoais
          </Typography>
          {!editando ? (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditando(true)}
            >
              Editar
            </Button>
          ) : (
            <Box>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  setEditando(false);
                  setMessage('');
                }}
                sx={{ mr: 1 }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSalvar}
                disabled={loadingUpdate}
              >
                {loadingUpdate ? <CircularProgress size={20} /> : 'Salvar'}
              </Button>
            </Box>
          )}
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Nome Completo"
          value={formData.nome}
          onChange={handleChange('nome')}
          disabled={!editando}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          value={cliente?.email || ''}
          disabled
          helperText="O email não pode ser alterado"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Telefone/WhatsApp"
          value={formData.telefone}
          onChange={(e) => {
            if (editando) {
              const formatted = formatarTelefone(e.target.value);
              handleChange('telefone')({target: {value: formatted}});
            }
          }}
          disabled={!editando}
          placeholder="(11) 99999-9999"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <WhatsAppIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Membro desde"
          value={cliente?.dataCadastro ? formatarData(cliente.dataCadastro) : ''}
          disabled
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <HistoryIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* Endereço */}
      <Grid item xs={12}>
        <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 2 }}>
          Endereço de Entrega
        </Typography>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="CEP"
          value={formData.endereco.cep}
          onChange={(e) => {
            if (editando) {
              const formatted = formatarCEP(e.target.value);
              handleChange('endereco.cep')({target: {value: formatted}});
              buscarCEP(formatted);
            }
          }}
          disabled={!editando}
          placeholder="00000-000"
        />
      </Grid>

      <Grid item xs={12} sm={8}>
        <TextField
          fullWidth
          label="Rua"
          value={formData.endereco.rua}
          onChange={handleChange('endereco.rua')}
          disabled={!editando}
        />
      </Grid>

      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Número"
          value={formData.endereco.numero}
          onChange={handleChange('endereco.numero')}
          disabled={!editando}
        />
      </Grid>

      <Grid item xs={12} sm={9}>
        <TextField
          fullWidth
          label="Complemento"
          value={formData.endereco.complemento}
          onChange={handleChange('endereco.complemento')}
          disabled={!editando}
          placeholder="Apartamento, bloco, etc."
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Bairro"
          value={formData.endereco.bairro}
          onChange={handleChange('endereco.bairro')}
          disabled={!editando}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Cidade"
          value={formData.endereco.cidade}
          onChange={handleChange('endereco.cidade')}
          disabled={!editando}
        />
      </Grid>

      <Grid item xs={12} sm={2}>
        <TextField
          fullWidth
          label="UF"
          value={formData.endereco.estado}
          onChange={handleChange('endereco.estado')}
          disabled={!editando}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Ponto de Referência"
          value={formData.endereco.pontoReferencia}
          onChange={handleChange('endereco.pontoReferencia')}
          disabled={!editando}
          placeholder="Ex: Próximo ao mercado, esquina com a padaria..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* Alteração de Senha */}
      {editando && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 2 }}>
              Alterar Senha (Opcional)
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Senha Atual"
              type={showPassword ? 'text' : 'password'}
              value={formData.senhaAtual}
              onChange={handleChange('senhaAtual')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Nova Senha"
              type={showNewPassword ? 'text' : 'password'}
              value={formData.novaSenha}
              onChange={handleChange('novaSenha')}
              helperText="Mínimo 6 caracteres"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Confirmar Nova Senha"
              type={showNewPassword ? 'text' : 'password'}
              value={formData.confirmarNovaSenha}
              onChange={handleChange('confirmarNovaSenha')}
            />
          </Grid>
        </>
      )}
    </Grid>
  );

  const HistoricoPedidos = () => (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h6" color="primary">
          Meus Pedidos ({pedidos.length})
        </Typography>
        <Button
          variant="outlined"
          onClick={carregarPedidos}
          disabled={loadingPedidos}
        >
          {loadingPedidos ? <CircularProgress size={20} /> : 'Atualizar'}
        </Button>
      </Box>

      {loadingPedidos ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : pedidos.length === 0 ? (
        <Box textAlign="center" p={4}>
          <Typography variant="body1" color="text.secondary">
            Você ainda não fez nenhum pedido
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Ver Cardápio
          </Button>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pedido</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido._id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      #{pedido.numero}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatarData(pedido.dataHora)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={pedido.status}
                      color={getStatusColor(pedido.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      R$ {pedido.valorTotal.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        onClick={() => navigate(`/acompanhar/${pedido.numero}`)}
                      >
                        Acompanhar
                      </Button>
                      <Button
                        size="small"
                        color="success"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => abrirWhatsAppPedido(pedido)}
                      >
                        WhatsApp
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4">
                Olá, {cliente?.nome}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gerencie seus dados e acompanhe seus pedidos
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => setConfirmLogout(true)}
          >
            Sair
          </Button>
        </Box>
      </Paper>

      {/* Mensagem */}
      {message && (
        <Alert 
          severity={message.includes('sucesso') ? 'success' : 'error'}
          sx={{ mb: 3 }}
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      )}

      {/* Conteúdo Principal */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Meu Perfil" />
            <Tab label="Meus Pedidos" />
          </Tabs>
        </Box>

        {currentTab === 0 && <DadosPessoais />}
        {currentTab === 1 && <HistoricoPedidos />}
      </Paper>

      {/* Dialog de Confirmação de Logout */}
      <Dialog open={confirmLogout} onClose={() => setConfirmLogout(false)}>
        <DialogTitle>Confirmar Saída</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja sair da sua conta?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmLogout(false)}>
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Sair
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PerfilCliente;