import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Button,
  Badge,
  Fab,
  Paper,
  Alert,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useCarrinho } from '../context/CarrinhoContext';
import { formatarMoeda } from '../services/api';

const CarrinhoCompras = ({ onFinalizarPedido }) => {
  const { 
    itens, 
    total, 
    quantidade, 
    temItens, 
    atualizarQuantidade, 
    removerItem, 
    limparCarrinho 
  } = useCarrinho();
  
  const [drawerAberto, setDrawerAberto] = useState(false);

  const handleAbrirDrawer = () => {
    setDrawerAberto(true);
  };

  const handleFecharDrawer = () => {
    setDrawerAberto(false);
  };

  const handleFinalizarPedido = () => {
    if (temItens) {
      handleFecharDrawer();
      onFinalizarPedido();
    }
  };

  return (
    <>
      {/* Botão flutuante do carrinho */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1200,
        }}
        onClick={handleAbrirDrawer}
      >
        <Badge badgeContent={quantidade} color="error">
          <CartIcon />
        </Badge>
      </Fab>

      {/* Drawer do carrinho */}
      <Drawer
        anchor="right"
        open={drawerAberto}
        onClose={handleFecharDrawer}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Cabeçalho */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2">
              Carrinho ({quantidade} itens)
            </Typography>
            <IconButton onClick={handleFecharDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Lista de itens */}
          {temItens ? (
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <List>
                {itens.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      sx={{ 
                        flexDirection: 'column', 
                        alignItems: 'stretch',
                        px: 0,
                        py: 2,
                      }}
                    >
                      <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatarMoeda(item.preco)} cada
                        </Typography>
                        {item.observacoes && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              fontStyle: 'italic',
                              display: 'block',
                              mt: 0.5,
                            }}
                          >
                            Obs: {item.observacoes}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        width: '100%',
                      }}>
                        {/* Controles de quantidade */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton 
                            size="small"
                            onClick={() => atualizarQuantidade(index, item.quantidade - 1)}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
                            {item.quantidade}
                          </Typography>
                          <IconButton 
                            size="small"
                            onClick={() => atualizarQuantidade(index, item.quantidade + 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>

                        {/* Subtotal e remover */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight="bold">
                            {formatarMoeda(item.subtotal)}
                          </Typography>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => removerItem(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </ListItem>
                    {index < itens.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          ) : (
            <Box sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <CartIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Seu carrinho está vazio
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adicione itens do cardápio para começar
              </Typography>
            </Box>
          )}

          {/* Rodapé com total e ações */}
          {temItens && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              
              {/* Total */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.50' }}>
                <Typography variant="h5" textAlign="center" fontWeight="bold">
                  Total: {formatarMoeda(total)}
                </Typography>
              </Paper>

              {/* Botões de ação */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleFinalizarPedido}
                  sx={{ py: 1.5 }}
                >
                  Finalizar Pedido
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={limparCarrinho}
                >
                  Limpar Carrinho
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default CarrinhoCompras;