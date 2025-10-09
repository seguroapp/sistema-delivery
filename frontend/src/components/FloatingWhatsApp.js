import React, { useState } from 'react';
import {
  Fab,
  Badge,
  Tooltip,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import WhatsAppContact from './WhatsAppContact';

const FloatingWhatsApp = ({ pedidoNumero, clienteNome, showBadge = false }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Estilo do botão flutuante
  const fabStyle = {
    position: 'fixed',
    bottom: isMobile ? 16 : 24,
    right: isMobile ? 16 : 24,
    zIndex: 1000,
    bgcolor: '#25D366',
    color: 'white',
    '&:hover': {
      bgcolor: '#128C7E',
      transform: 'scale(1.1)',
    },
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
    animation: showBadge ? 'pulse 2s infinite' : 'none',
    '@keyframes pulse': {
      '0%': {
        boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.7)'
      },
      '70%': {
        boxShadow: '0 0 0 10px rgba(37, 211, 102, 0)'
      },
      '100%': {
        boxShadow: '0 0 0 0 rgba(37, 211, 102, 0)'
      }
    }
  };

  return (
    <>
      <Tooltip 
        title="Fale conosco no WhatsApp" 
        placement="left"
        arrow
      >
        <Box>
          <Badge 
            badgeContent={showBadge ? "!" : 0} 
            color="error"
            overlap="circular"
          >
            <Fab
              size={isMobile ? "medium" : "large"}
              sx={fabStyle}
              onClick={handleClick}
              aria-label="WhatsApp"
            >
              <WhatsAppIcon sx={{ fontSize: isMobile ? 24 : 32 }} />
            </Fab>
          </Badge>
        </Box>
      </Tooltip>

      <WhatsAppContact
        open={open}
        onClose={handleClose}
        pedidoNumero={pedidoNumero}
        clienteNome={clienteNome}
      />
    </>
  );
};

export default FloatingWhatsApp;