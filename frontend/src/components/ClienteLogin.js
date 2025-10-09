import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Grid
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';
import { clienteAuthAPI } from '../services/apiClient';

const ClienteLogin = ({ open, onClose, onLoginSuccess, initialTab = 0 }) => {
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados do formulário de login
  const [loginData, setLoginData] = useState({
    email: '',
    senha: ''
  });

  // Estados do formulário de cadastro
  const [registerData, setRegisterData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: 'São Paulo',
      estado: 'SP',
      pontoReferencia: ''
    }
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setMessage('');
  };

  const handleLoginChange = useCallback((field) => (event) => {
    setLoginData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  }, []);

  const handleRegisterChange = useCallback((field) => (event) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setRegisterData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: event.target.value
        }
      }));
    } else {
      setRegisterData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    }
  }, []);

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
          setRegisterData({
            ...registerData,
            endereco: {
              ...registerData.endereco,
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

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarFormularioLogin = () => {
    if (!loginData.email || !loginData.senha) {
      setMessage('Por favor, preencha todos os campos.');
      return false;
    }

    if (!validarEmail(loginData.email)) {
      setMessage('Por favor, insira um email válido.');
      return false;
    }

    return true;
  };

  const validarFormularioCadastro = () => {
    if (!registerData.nome || !registerData.email || !registerData.telefone || 
        !registerData.senha || !registerData.confirmarSenha) {
      setMessage('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    if (!validarEmail(registerData.email)) {
      setMessage('Por favor, insira um email válido.');
      return false;
    }

    if (registerData.telefone.replace(/\D/g, '').length < 10) {
      setMessage('Por favor, insira um telefone válido.');
      return false;
    }

    if (registerData.senha.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    if (registerData.senha !== registerData.confirmarSenha) {
      setMessage('As senhas não coincidem.');
      return false;
    }

    if (!registerData.endereco.cep || !registerData.endereco.rua || 
        !registerData.endereco.numero || !registerData.endereco.bairro) {
      setMessage('Por favor, preencha o endereço completo.');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validarFormularioLogin()) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await clienteAuthAPI.login(loginData);
      
      if (response.success) {
        localStorage.setItem('clienteToken', response.token);
        localStorage.setItem('clienteData', JSON.stringify(response.cliente));
        
        setMessage('Login realizado com sucesso!');
        
        setTimeout(() => {
          onLoginSuccess && onLoginSuccess(response.cliente);
          onClose();
        }, 1000);
      } else {
        setMessage(response.message || 'Erro ao fazer login.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setMessage('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validarFormularioCadastro()) return;

    setLoading(true);
    setMessage('');

    try {
      const dadosParaEnvio = {
        ...registerData,
        telefone: registerData.telefone.replace(/\D/g, '')
      };

      const response = await clienteAuthAPI.register(dadosParaEnvio);
      
      if (response.success) {
        setMessage('Cadastro realizado com sucesso! Fazendo login...');
        
        // Fazer login automático após cadastro
        setTimeout(async () => {
          try {
            const loginResponse = await clienteAuthAPI.login({
              email: registerData.email,
              senha: registerData.senha
            });
            
            if (loginResponse.success) {
              localStorage.setItem('clienteToken', loginResponse.token);
              localStorage.setItem('clienteData', JSON.stringify(loginResponse.cliente));
              
              onLoginSuccess && onLoginSuccess(loginResponse.cliente);
              onClose();
            }
          } catch (error) {
            console.error('Erro no login automático:', error);
            setCurrentTab(0);
            setMessage('Cadastro realizado! Por favor, faça login.');
          }
        }, 1000);
      } else {
        setMessage(response.message || 'Erro ao fazer cadastro.');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setMessage('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const FormularioLogin = () => (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={loginData.email}
        onChange={handleLoginChange('email')}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <TextField
        fullWidth
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        value={loginData.senha}
        onChange={handleLoginChange('senha')}
        margin="normal"
        InputProps={{
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

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleLogin}
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Entrar'}
      </Button>

      <Divider sx={{ my: 2 }}>ou</Divider>

      <Button
        fullWidth
        variant="outlined"
        onClick={() => setCurrentTab(1)}
        sx={{ mb: 1 }}
      >
        Criar Nova Conta
      </Button>
    </Box>
  );

  const FormularioCadastro = () => (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {/* Dados Pessoais */}
        <Grid item xs={12}>
          <Typography variant="h6" color="primary" gutterBottom>
            Dados Pessoais
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nome Completo *"
            value={registerData.nome}
            onChange={handleRegisterChange('nome')}
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
            label="Email *"
            type="email"
            value={registerData.email}
            onChange={handleRegisterChange('email')}
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
            label="Telefone/WhatsApp *"
            value={registerData.telefone}
            onChange={(e) => {
              const formatted = formatarTelefone(e.target.value);
              handleRegisterChange('telefone')({target: {value: formatted}});
            }}
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
            label="Senha *"
            type={showPassword ? 'text' : 'password'}
            value={registerData.senha}
            onChange={handleRegisterChange('senha')}
            helperText="Mínimo 6 caracteres"
            InputProps={{
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

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Confirmar Senha *"
            type={showConfirmPassword ? 'text' : 'password'}
            value={registerData.confirmarSenha}
            onChange={handleRegisterChange('confirmarSenha')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Endereço */}
        <Grid item xs={12}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
            Endereço de Entrega
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="CEP *"
            value={registerData.endereco.cep}
            onChange={(e) => {
              const formatted = formatarCEP(e.target.value);
              handleRegisterChange('endereco.cep')({target: {value: formatted}});
              buscarCEP(formatted);
            }}
            placeholder="00000-000"
          />
        </Grid>

        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Rua *"
            value={registerData.endereco.rua}
            onChange={handleRegisterChange('endereco.rua')}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Número *"
            value={registerData.endereco.numero}
            onChange={handleRegisterChange('endereco.numero')}
          />
        </Grid>

        <Grid item xs={12} sm={9}>
          <TextField
            fullWidth
            label="Complemento"
            value={registerData.endereco.complemento}
            onChange={handleRegisterChange('endereco.complemento')}
            placeholder="Apartamento, bloco, etc."
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Bairro *"
            value={registerData.endereco.bairro}
            onChange={handleRegisterChange('endereco.bairro')}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Cidade *"
            value={registerData.endereco.cidade}
            onChange={handleRegisterChange('endereco.cidade')}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="UF *"
            value={registerData.endereco.estado}
            onChange={handleRegisterChange('endereco.estado')}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Ponto de Referência"
            value={registerData.endereco.pontoReferencia}
            onChange={handleRegisterChange('endereco.pontoReferencia')}
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
      </Grid>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleRegister}
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Criar Conta'}
      </Button>

      <Divider sx={{ my: 2 }}>ou</Divider>

      <Button
        fullWidth
        variant="outlined"
        onClick={() => setCurrentTab(0)}
        sx={{ mb: 1 }}
      >
        Já tenho conta - Fazer Login
      </Button>
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="center">
          <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="span">
            {currentTab === 0 ? 'Entrar na Conta' : 'Criar Conta'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            centered
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Login" />
            <Tab label="Cadastrar" />
          </Tabs>
        </Box>

        {message && (
          <Alert 
            severity={message.includes('sucesso') ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        {currentTab === 0 ? <FormularioLogin /> : <FormularioCadastro />}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClienteLogin;