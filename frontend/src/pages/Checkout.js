import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Link,
  Card,
  CardContent,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  WhatsApp as WhatsAppIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  Payment as PaymentIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useCarrinho } from '../context/CarrinhoContext';
import { useClienteAuth } from '../context/ClienteAuthContext';
import { clientesAPI, pedidosAPI, formatarMoeda, validarEmail, validarTelefone, validarCEP, formatarTelefone, formatarCEP } from '../services/api';
import ClienteLogin from '../components/ClienteLogin';

const steps = ['Dados Pessoais', 'Endereço', 'Pagamento', 'Confirmação'];

const Checkout = ({ onVoltar }) => {
  const { itens, total, temItens, limparCarrinho } = useCarrinho();
  const { 
    cliente, 
    isLoggedIn, 
    obterDadosCheckout, 
    salvarDadosEntrega 
  } = useClienteAuth();
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pedidoCriado, setPedidoCriado] = useState(null);
  const [dialogSucesso, setDialogSucesso] = useState(false);

  // Estados para autenticação
  const [showLogin, setShowLogin] = useState(false);
  const [usarDadosLogado, setUsarDadosLogado] = useState(true);
  const [loginTab, setLoginTab] = useState(0); // 0 = login, 1 = cadastro

  // Dados do formulário
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  const [endereco, setEndereco] = useState({
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    cep: '',
    pontoReferencia: '',
  });

  const [dadosPedido, setDadosPedido] = useState({
    formaPagamento: '',
    valorTaxa: 5.00, // Taxa de entrega padrão
    valorDesconto: 0,
    observacoes: '',
  });

  // Verificar se há itens no carrinho
  useEffect(() => {
    if (!temItens) {
      onVoltar();
    }
  }, [temItens, onVoltar]);

  // Carregar dados do cliente logado ou salvos
  useEffect(() => {
    if (isLoggedIn && cliente && usarDadosLogado) {
      setDadosCliente({
        nome: cliente.nome || '',
        email: cliente.email || '',
        telefone: cliente.telefone || '',
      });

      if (cliente.endereco) {
        setEndereco({
          rua: cliente.endereco.rua || '',
          numero: cliente.endereco.numero || '',
          complemento: cliente.endereco.complemento || '',
          bairro: cliente.endereco.bairro || '',
          cidade: cliente.endereco.cidade || '',
          cep: cliente.endereco.cep || '',
          pontoReferencia: cliente.endereco.pontoReferencia || '',
        });
      }
    } else {
      // Tentar carregar dados salvos anteriormente
      const dadosSalvos = obterDadosCheckout();
      if (dadosSalvos) {
        setDadosCliente({
          nome: dadosSalvos.nome || '',
          email: dadosSalvos.email || '',
          telefone: dadosSalvos.telefone || '',
        });

        if (dadosSalvos.endereco) {
          setEndereco({
            rua: dadosSalvos.endereco.rua || '',
            numero: dadosSalvos.endereco.numero || '',
            complemento: dadosSalvos.endereco.complemento || '',
            bairro: dadosSalvos.endereco.bairro || '',
            cidade: dadosSalvos.endereco.cidade || '',
            cep: dadosSalvos.endereco.cep || '',
            pontoReferencia: dadosSalvos.endereco.pontoReferencia || '',
          });
        }
      }
    }
  }, [isLoggedIn, cliente, usarDadosLogado, obterDadosCheckout]);

  const handleMudancaDadosCliente = (campo) => (event) => {
    let valor = event.target.value;
    
    // Formatação automática
    if (campo === 'telefone') {
      valor = formatarTelefone(valor);
    }
    
    setDadosCliente(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleMudancaEndereco = (campo) => (event) => {
    let valor = event.target.value;
    
    // Formatação automática
    if (campo === 'cep') {
      valor = formatarCEP(valor);
    }
    
    setEndereco(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleMudancaPedido = (campo) => (event) => {
    setDadosPedido(prev => ({
      ...prev,
      [campo]: event.target.value
    }));
  };

  // Funções de autenticação
  const handleLoginSuccess = (clienteLogado) => {
    setShowLogin(false);
    setUsarDadosLogado(true);
    
    // Carregar dados do cliente logado
    setDadosCliente({
      nome: clienteLogado.nome || '',
      email: clienteLogado.email || '',
      telefone: clienteLogado.telefone || '',
    });

    if (clienteLogado.endereco) {
      setEndereco({
        rua: clienteLogado.endereco.rua || '',
        numero: clienteLogado.endereco.numero || '',
        complemento: clienteLogado.endereco.complemento || '',
        bairro: clienteLogado.endereco.bairro || '',
        cidade: clienteLogado.endereco.cidade || '',
        cep: clienteLogado.endereco.cep || '',
        pontoReferencia: clienteLogado.endereco.pontoReferencia || '',
      });
    }
  };

  const salvarDadosParaProximaVez = () => {
    const dados = {
      nome: dadosCliente.nome,
      email: dadosCliente.email,
      telefone: dadosCliente.telefone,
      endereco: endereco
    };
    salvarDadosEntrega(dados);
  };

  // Validações por step
  const validarStep = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Dados pessoais
        if (!dadosCliente.nome.trim()) return 'Nome é obrigatório';
        if (!validarEmail(dadosCliente.email)) return 'Email inválido';
        if (!validarTelefone(dadosCliente.telefone)) return 'Telefone inválido';
        return null;

      case 1: // Endereço
        if (!endereco.rua.trim()) return 'Rua é obrigatória';
        if (!endereco.numero.trim()) return 'Número é obrigatório';
        if (!endereco.bairro.trim()) return 'Bairro é obrigatório';
        if (!endereco.cidade.trim()) return 'Cidade é obrigatória';
        if (!validarCEP(endereco.cep)) return 'CEP inválido';
        return null;

      case 2: // Pagamento
        if (!dadosPedido.formaPagamento) return 'Forma de pagamento é obrigatória';
        return null;

      default:
        return null;
    }
  };

  const proximoStep = () => {
    const erro = validarStep(step);
    if (erro) {
      setError(erro);
      return;
    }
    
    setError('');
    setStep(prev => prev + 1);
  };

  const stepAnterior = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const buscarClientePorEmail = async () => {
    if (!validarEmail(dadosCliente.email)) return;

    try {
      setLoading(true);
      const response = await clientesAPI.buscarPorEmail(dadosCliente.email);
      
      if (response.data.success) {
        const cliente = response.data.data;
        setDadosCliente({
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone,
        });
        setEndereco(cliente.endereco);
      }
    } catch (error) {
      // Cliente não encontrado - não é erro
    } finally {
      setLoading(false);
    }
  };

  const finalizarPedido = async () => {
    try {
      setLoading(true);
      setError('');

      // Salvar dados para próxima vez se não estiver logado
      if (!isLoggedIn) {
        salvarDadosParaProximaVez();
      }

      // 1. Cadastrar ou buscar cliente
      let clienteId;
      try {
        const clienteResponse = await clientesAPI.cadastrar({
          ...dadosCliente,
          endereco
        });
        clienteId = clienteResponse.data.data._id;
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.message?.includes('já cadastrado')) {
          // Cliente já existe, buscar por email
          const clienteResponse = await clientesAPI.buscarPorEmail(dadosCliente.email);
          clienteId = clienteResponse.data.data._id;
        } else {
          throw error;
        }
      }

      // 2. Criar pedido
      const pedidoData = {
        cliente: clienteId,
        itens: itens.map(item => ({
          cardapio: item.id,
          quantidade: item.quantidade,
          observacoes: item.observacoes
        })),
        formaPagamento: dadosPedido.formaPagamento,
        valorTaxa: dadosPedido.valorTaxa,
        valorDesconto: dadosPedido.valorDesconto,
        observacoes: dadosPedido.observacoes,
      };

      const pedidoResponse = await pedidosAPI.criar(pedidoData);
      
      if (pedidoResponse.data.success) {
        setPedidoCriado(pedidoResponse.data.data);
        setDialogSucesso(true);
        limparCarrinho();
      }
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      setError(error.response?.data?.message || 'Erro ao criar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const abrirWhatsApp = () => {
    if (pedidoCriado?.whatsappUrl) {
      window.open(pedidoCriado.whatsappUrl, '_blank');
    }
  };

  const valorTotal = total + dadosPedido.valorTaxa - dadosPedido.valorDesconto;

  const renderStep = () => {
    switch (step) {
      case 0: // Dados pessoais
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Dados Pessoais
              </Typography>
            </Grid>
            
            {/* Seção de Login/Cadastro */}
            {!isLoggedIn && (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      💡 Dica: Faça login para facilitar seu pedido
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Tenha seus dados salvos e acompanhe todos os seus pedidos
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<LoginIcon />}
                        onClick={() => {
                          setLoginTab(0);
                          setShowLogin(true);
                        }}
                      >
                        Fazer Login
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<PersonAddIcon />}
                        onClick={() => {
                          setLoginTab(1);
                          setShowLogin(true);
                        }}
                      >
                        Criar Conta
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Dados do cliente logado */}
            {isLoggedIn && (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ✅ Olá, {cliente?.nome}!
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={usarDadosLogado}
                          onChange={(e) => setUsarDadosLogado(e.target.checked)}
                          color="secondary"
                        />
                      }
                      label="Usar meus dados salvos"
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Nome completo"
                value={dadosCliente.nome}
                onChange={handleMudancaDadosCliente('nome')}
                disabled={isLoggedIn && usarDadosLogado}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                value={dadosCliente.email}
                onChange={handleMudancaDadosCliente('email')}
                onBlur={buscarClientePorEmail}
                disabled={isLoggedIn && usarDadosLogado}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Telefone"
                value={dadosCliente.telefone}
                onChange={handleMudancaDadosCliente('telefone')}
                placeholder="(11) 99999-9999"
                disabled={isLoggedIn && usarDadosLogado}
              />
            </Grid>
          </Grid>
        );

      case 1: // Endereço
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                📍 Endereço de Entrega
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                required
                fullWidth
                label="Rua"
                value={endereco.rua}
                onChange={handleMudancaEndereco('rua')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Número"
                value={endereco.numero}
                onChange={handleMudancaEndereco('numero')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Complemento"
                value={endereco.complemento}
                onChange={handleMudancaEndereco('complemento')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Bairro"
                value={endereco.bairro}
                onChange={handleMudancaEndereco('bairro')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Cidade"
                value={endereco.cidade}
                onChange={handleMudancaEndereco('cidade')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="CEP"
                value={endereco.cep}
                onChange={handleMudancaEndereco('cep')}
                placeholder="12345-678"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ponto de referência"
                value={endereco.pontoReferencia}
                onChange={handleMudancaEndereco('pontoReferencia')}
                placeholder="Ex: Próximo ao mercado, portão azul..."
              />
            </Grid>
          </Grid>
        );

      case 2: // Pagamento
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Forma de Pagamento
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Forma de pagamento</InputLabel>
                <Select
                  value={dadosPedido.formaPagamento}
                  onChange={handleMudancaPedido('formaPagamento')}
                  label="Forma de pagamento"
                >
                  <MenuItem value="Dinheiro">💵 Dinheiro</MenuItem>
                  <MenuItem value="Cartão de Débito">💳 Cartão de Débito</MenuItem>
                  <MenuItem value="Cartão de Crédito">💳 Cartão de Crédito</MenuItem>
                  <MenuItem value="PIX">📱 PIX</MenuItem>
                  <MenuItem value="Vale Refeição">🎫 Vale Refeição</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Taxa de entrega"
                type="number"
                value={dadosPedido.valorTaxa}
                onChange={handleMudancaPedido('valorTaxa')}
                InputProps={{
                  startAdornment: 'R$ ',
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Desconto"
                type="number"
                value={dadosPedido.valorDesconto}
                onChange={handleMudancaPedido('valorDesconto')}
                InputProps={{
                  startAdornment: 'R$ ',
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações do pedido"
                multiline
                rows={3}
                value={dadosPedido.observacoes}
                onChange={handleMudancaPedido('observacoes')}
                placeholder="Alguma observação especial sobre o pedido?"
              />
            </Grid>
          </Grid>
        );

      case 3: // Confirmação
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Confirmar Pedido
            </Typography>
            
            {/* Resumo do pedido */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                <CartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Itens do Pedido
              </Typography>
              <List dense>
                {itens.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={`${item.quantidade}x ${item.nome}`}
                      secondary={item.observacoes || undefined}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {formatarMoeda(item.subtotal)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>{formatarMoeda(total)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Taxa de entrega:</Typography>
                <Typography>{formatarMoeda(dadosPedido.valorTaxa)}</Typography>
              </Box>
              {dadosPedido.valorDesconto > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Desconto:</Typography>
                  <Typography color="success.main">-{formatarMoeda(dadosPedido.valorDesconto)}</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold">Total:</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {formatarMoeda(valorTotal)}
                </Typography>
              </Box>
            </Paper>

            {/* Dados do cliente */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                👤 Dados do Cliente
              </Typography>
              <Typography><strong>Nome:</strong> {dadosCliente.nome}</Typography>
              <Typography><strong>Email:</strong> {dadosCliente.email}</Typography>
              <Typography><strong>Telefone:</strong> {dadosCliente.telefone}</Typography>
            </Paper>

            {/* Endereço */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                📍 Endereço de Entrega
              </Typography>
              <Typography>
                {endereco.rua}, {endereco.numero}
                {endereco.complemento && `, ${endereco.complemento}`}
              </Typography>
              <Typography>
                {endereco.bairro}, {endereco.cidade} - {endereco.cep}
              </Typography>
              {endereco.pontoReferencia && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Ponto de referência:</strong> {endereco.pontoReferencia}
                </Typography>
              )}
            </Paper>

            {/* Pagamento */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                💳 Pagamento
              </Typography>
              <Chip label={dadosPedido.formaPagamento} color="primary" />
              {dadosPedido.observacoes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Observações:</strong> {dadosPedido.observacoes}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  if (!temItens) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Cabeçalho */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onVoltar}
            sx={{ mb: 2 }}
          >
            Voltar ao Cardápio
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            Finalizar Pedido
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Mensagem de erro */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Conteúdo do step */}
        <Box sx={{ mb: 4 }}>
          {renderStep()}
        </Box>

        {/* Botões de navegação */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={step === 0}
            onClick={stepAnterior}
          >
            Anterior
          </Button>
          
          {step === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={finalizarPedido}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <WhatsAppIcon />}
              size="large"
            >
              {loading ? 'Criando Pedido...' : 'Finalizar Pedido'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={proximoStep}
            >
              Próximo
            </Button>
          )}
        </Box>
      </Paper>

      {/* Dialog de sucesso */}
      <Dialog 
        open={dialogSucesso} 
        onClose={() => setDialogSucesso(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'success.main' }}>
          <CheckCircleIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h5" component="div">
            Pedido Criado com Sucesso!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pedido #{pedidoCriado?.pedido?.numero}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Total: {formatarMoeda(valorTotal)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Agora você será redirecionado para o WhatsApp para confirmar seu pedido com o restaurante.
            </Typography>
            
            {/* Link de acompanhamento */}
            <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="subtitle2" gutterBottom>
                📱 Acompanhe seu pedido em tempo real:
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => window.open(`/acompanhar/${pedidoCriado?.pedido?.numero}`, '_blank')}
                sx={{ mt: 1 }}
              >
                Acompanhar Pedido
              </Button>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Grid container spacing={2} sx={{ maxWidth: 400 }}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => window.open(`/acompanhar/${pedidoCriado?.pedido?.numero}`, '_blank')}
              >
                Ver Status
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<WhatsAppIcon />}
                onClick={abrirWhatsApp}
              >
                WhatsApp
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

      {/* Dialog de Login */}
      <ClienteLogin
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
        initialTab={loginTab}
      />
    </Container>
  );
};

export default Checkout;