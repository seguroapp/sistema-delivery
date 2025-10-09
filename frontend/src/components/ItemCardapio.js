import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useCarrinho } from '../context/CarrinhoContext';
import { formatarMoeda } from '../services/api';

const ItemCardapio = ({ item }) => {
  const { adicionarItem, obterQuantidadeItem } = useCarrinho();
  const [dialogAberto, setDialogAberto] = useState(false);
  const [quantidade, setQuantidade] = useState(1);
  const [observacoes, setObservacoes] = useState('');
  const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(0);

  // Atualizar quantidade no carrinho quando carrinho mudar
  useEffect(() => {
    setQuantidadeCarrinho(obterQuantidadeItem(item._id, observacoes));
  }, [item._id, observacoes, obterQuantidadeItem]);

  const handleAbrirDialog = () => {
    setQuantidade(1);
    setObservacoes('');
    setDialogAberto(true);
  };

  const handleFecharDialog = () => {
    setDialogAberto(false);
    setQuantidade(1);
    setObservacoes('');
  };

  const handleAdicionarAoCarrinho = () => {
    adicionarItem(item, quantidade, observacoes);
    handleFecharDialog();
  };

  const handleAdicionarRapido = () => {
    adicionarItem(item, 1, '');
  };

  const aumentarQuantidade = () => {
    setQuantidade(prev => prev + 1);
  };

  const diminuirQuantidade = () => {
    if (quantidade > 1) {
      setQuantidade(prev => prev - 1);
    }
  };

  return (
    <>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
          },
        }}
      >
        {/* Badge de quantidade no carrinho */}
        {quantidadeCarrinho > 0 && (
          <Badge
            badgeContent={quantidadeCarrinho}
            color="primary"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <CartIcon />
          </Badge>
        )}

        {/* Chip de disponibilidade */}
        {!item.disponivel && (
          <Chip
            label="Indisponível"
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 1,
            }}
          />
        )}

        {/* Imagem do item */}
        <CardMedia
          component="img"
          height="200"
          image={item.imagem || '/images/placeholder-food.jpg'}
          alt={item.nome}
          sx={{
            objectFit: 'cover',
            filter: !item.disponivel ? 'grayscale(100%) opacity(0.7)' : 'none',
          }}
        />

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Nome e categoria */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {item.nome}
            </Typography>
            <Chip 
              label={item.categoria} 
              size="small" 
              variant="outlined" 
              color="primary"
            />
          </Box>

          {/* Descrição */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2, 
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {item.descricao}
          </Typography>

          {/* Ingredientes */}
          {item.ingredientes && item.ingredientes.length > 0 && (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ mb: 1, fontStyle: 'italic' }}
            >
              Ingredientes: {item.ingredientes.join(', ')}
            </Typography>
          )}

          {/* Tempo de preparo */}
          {item.tempoPreparoMinutos && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              ⏱️ {item.tempoPreparoMinutos} min
            </Typography>
          )}

          {/* Preço e botões */}
          <Box sx={{ mt: 'auto' }}>
            <Typography 
              variant="h5" 
              color="primary" 
              fontWeight="bold" 
              sx={{ mb: 2 }}
            >
              {formatarMoeda(item.preco)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleAbrirDialog}
                disabled={!item.disponivel}
                startIcon={<AddIcon />}
              >
                Personalizar
              </Button>
              <Button
                variant="outlined"
                onClick={handleAdicionarRapido}
                disabled={!item.disponivel}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <AddIcon />
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog de personalização */}
      <Dialog 
        open={dialogAberto} 
        onClose={handleFecharDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{item.nome}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              {item.descricao}
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatarMoeda(item.preco)}
            </Typography>
          </Box>

          {/* Controle de quantidade */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Quantidade
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={diminuirQuantidade}
                disabled={quantidade <= 1}
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                {quantidade}
              </Typography>
              <IconButton onClick={aumentarQuantidade}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Observações */}
          <TextField
            label="Observações (opcional)"
            placeholder="Ex: sem cebola, ponto da carne, etc."
            multiline
            rows={3}
            fullWidth
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            inputProps={{ maxLength: 200 }}
            helperText={`${observacoes.length}/200 caracteres`}
          />

          {/* Subtotal */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
            <Typography variant="h6" textAlign="center">
              Subtotal: {formatarMoeda(item.preco * quantidade)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialog}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAdicionarAoCarrinho}
            startIcon={<AddIcon />}
          >
            Adicionar ao Carrinho
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ItemCardapio;