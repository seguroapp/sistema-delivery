import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  Button,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Restaurant as RestaurantIcon,
  Visibility as TrackIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { cardapioAPI } from '../services/api';
import { useClienteAuth } from '../context/ClienteAuthContext';
import ItemCardapio from '../components/ItemCardapio';
import CarrinhoCompras from '../components/CarrinhoCompras';
import ClienteLogin from '../components/ClienteLogin';

const Home = ({ onIrParaCheckout }) => {
  const navigate = useNavigate();
  const { cliente, isLoggedIn, logout } = useClienteAuth();
  
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para menu de usuário
  const [anchorEl, setAnchorEl] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState(0);

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError('');

        // Carregar categorias e itens em paralelo
        const [categoriasResponse, itensResponse] = await Promise.all([
          cardapioAPI.categorias(),
          cardapioAPI.listar({ disponivel: true })
        ]);

        if (categoriasResponse.data.success) {
          setCategorias(['Todas', ...categoriasResponse.data.data]);
        }

        if (itensResponse.data.success) {
          setItens(itensResponse.data.data);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar o cardápio. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Filtrar itens por categoria e busca
  const itensFiltrados = itens.filter(item => {
    const filtroCategoria = categoriaSelecionada === 'Todas' || item.categoria === categoriaSelecionada;
    const filtroBusca = !busca || 
      item.nome.toLowerCase().includes(busca.toLowerCase()) ||
      item.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      (item.ingredientes && item.ingredientes.some(ing => 
        ing.toLowerCase().includes(busca.toLowerCase())
      ));
    
    return filtroCategoria && filtroBusca;
  });

  const handleMudancaCategoria = (event, novaCategoria) => {
    setCategoriaSelecionada(novaCategoria);
  };

  // Funções de menu de usuário
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const handlePerfilClick = () => {
    handleMenuClose();
    navigate('/perfil');
  };

  const handleMudancaBusca = (event) => {
    setBusca(event.target.value);
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
    <>
      {/* Barra superior com navegação */}
      <AppBar position="static" color="transparent" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema Delivery
          </Typography>
          
          <Button
            color="primary"
            variant="outlined"
            startIcon={<TrackIcon />}
            onClick={() => navigate('/acompanhar')}
            sx={{ mr: 2 }}
          >
            Acompanhar Pedido
          </Button>

          {/* Menu de usuário */}
          {isLoggedIn ? (
            <>
              <Button
                color="inherit"
                startIcon={<AccountIcon />}
                onClick={handleMenuOpen}
                sx={{ textTransform: 'none' }}
              >
                {cliente?.nome}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handlePerfilClick}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Meu Perfil
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Sair
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="primary"
                startIcon={<LoginIcon />}
                onClick={() => {
                  setLoginTab(0);
                  setShowLogin(true);
                }}
                sx={{ mr: 1 }}
              >
                Entrar
              </Button>
              <Button
                color="primary"
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => {
                  setLoginTab(1);
                  setShowLogin(true);
                }}
              >
                Cadastrar
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
        {/* Cabeçalho */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            <RestaurantIcon sx={{ fontSize: 48, mr: 2, verticalAlign: 'middle' }} />
            Nosso Cardápio
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Escolha seus pratos favoritos e monte seu pedido
          </Typography>
        </Box>

        {/* Barra de busca */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar por nome, descrição ou ingredientes..."
            value={busca}
            onChange={handleMudancaBusca}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Filtro por categorias */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={categoriaSelecionada}
            onChange={handleMudancaCategoria}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-scrollButtons': {
                '&.Mui-disabled': { opacity: 0.3 },
              },
            }}
          >
            {categorias.map((categoria) => (
              <Tab
                key={categoria}
                label={categoria}
                value={categoria}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Mensagem de erro */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Resultados da busca */}
        {busca && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`${itensFiltrados.length} resultado(s) encontrado(s) para "${busca}"`}
              color="primary"
              variant="outlined"
            />
          </Box>
        )}

        {/* Grid de itens */}
        {itensFiltrados.length > 0 ? (
          <Grid container spacing={3}>
            {itensFiltrados.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <ItemCardapio item={item} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {busca 
                ? `Nenhum item encontrado para "${busca}"`
                : categoriaSelecionada === 'Todas' 
                  ? 'Nenhum item disponível no momento'
                  : `Nenhum item encontrado na categoria "${categoriaSelecionada}"`
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {busca && 'Tente buscar por outros termos ou navegue pelas categorias'}
            </Typography>
          </Box>
        )}

        {/* Informações adicionais */}
        <Box sx={{ mt: 6, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            🍕 Como fazer seu pedido:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            <ol style={{ paddingLeft: 20 }}>
              <li>Escolha seus itens favoritos do cardápio</li>
              <li>Adicione ao carrinho com observações se necessário</li>
              <li>Revise seu pedido no carrinho</li>
              <li>Preencha seus dados no checkout</li>
              <li>Confirme e seu pedido será enviado via WhatsApp!</li>
            </ol>
          </Typography>
        </Box>
      </Container>

      {/* Carrinho flutuante */}
      <CarrinhoCompras onFinalizarPedido={onIrParaCheckout} />

      {/* Dialog de Login */}
      <ClienteLogin
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
        initialTab={loginTab}
      />
    </>
  );
};

export default Home;