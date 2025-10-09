# 🚀 Sistema de Delivery Completo

Sistema completo de delivery com **integração WhatsApp**, painel administrativo e rastreamento em tempo real.

## ⚡ Quick Start

### 🎯 Execução Automática
```bash
# Duplo clique em um dos arquivos:
INICIAR_SISTEMA.bat     # Para Windows
INICIAR_SISTEMA.ps1     # Para PowerShell
```

### 🔧 Execução Manual

**1. Backend:**
```bash
cd backend
npm install
node server-mock.js
```

**2. Frontend:**
```bash
cd frontend  
npm install
npm start
```

## 🌐 Acessos

- **🛒 Cliente**: http://localhost:3000
- **👨‍💼 Admin**: http://localhost:3000/admin/login
  - **Usuário**: `admin`
  - **Senha**: `admin123`
cd backend
npm install
```

## ✨ Funcionalidades

### Para Clientes 🛍️
- ✅ Catálogo completo com carrinho
- ✅ Checkout com dados de entrega  
- ✅ Rastreamento em tempo real
- ✅ **Contato direto via WhatsApp**
- ✅ Interface responsiva

### Para Administradores 👨‍💼
- ✅ Dashboard com estatísticas
- ✅ Gestão completa de pedidos
- ✅ **Notificações automáticas WhatsApp**
- ✅ Controle de status em tempo real

## 📱 Módulo WhatsApp

### 🎯 Novidades Implementadas
- **Botão Flutuante**: Sempre visível para contato
- **Mensagens Personalizadas**: Templates inteligentes
- **Status da Loja**: Verifica horário de funcionamento
- **Integração Total**: Com todos os módulos do sistema

### 📞 Tipos de Contato
- 📋 Informações Gerais
- 🛒 Fazer Pedido  
- 📋 Ver Cardápio
- 🚚 Informações de Entrega
- 🎁 Promoções
- 📍 Acompanhar Pedido
- 🛠️ Suporte
- 💬 Reclamações/Sugestões

## ⚙️ Configuração WhatsApp

Editar arquivo `frontend/.env`:
```env
REACT_APP_WHATSAPP_NUMBER=5531983218662
REACT_APP_EMPRESA_NOME=Sistema Delivery
```

## 🛠️ Stack Tecnológica

- **Frontend**: React + Material-UI
- **Backend**: Node.js + Express  
- **Dados**: Sistema Mock (memória)
- **Integração**: WhatsApp API
- **Autenticação**: JWT

## 🔄 Fluxo de Pedidos

1. **Cliente**: Escolhe produtos → Checkout → Pedido criado
2. **Sistema**: Notificação WhatsApp automática
3. **Admin**: Gerencia status pelo dashboard
4. **Cliente**: Acompanha em tempo real + WhatsApp

## � Status dos Pedidos

- 🔵 **Pendente** - Aguardando confirmação
- 🟡 **Confirmado** - Aceito pela loja
- 🟠 **Preparando** - Em preparação  
- 🚚 **Saiu para Entrega** - A caminho
- ✅ **Entregue** - Finalizado

## 🎨 Interface

- **Design**: Material Design + cores delivery
- **Responsivo**: Mobile-first
- **UX**: Intuitivo e moderno
- **Performance**: Otimizado

## 📁 Estrutura

```
Sistema Delivery/
├── INICIAR_SISTEMA.bat          # 🚀 Startup automático
├── INICIAR_SISTEMA.ps1          # 🚀 Startup PowerShell  
├── SISTEMA_COMPLETO.md          # 📚 Documentação completa
├── backend/
│   ├── server-mock.js           # 🌐 Servidor principal
│   └── routes/                  # 🛣️ APIs REST
└── frontend/
    ├── src/
    │   ├── components/          # 🧩 Componentes React
    │   │   ├── FloatingWhatsApp.js     # 📱 Botão flutuante  
    │   │   └── WhatsAppContact.js      # 💬 Dialog de contato
    │   ├── services/
    │   │   └── whatsappService.js      # 🔧 Serviço WhatsApp
    │   └── pages/               # 📄 Páginas principais
    └── .env                     # ⚙️ Configurações
```

## 🆘 Problemas Comuns

### Porta Ocupada
```bash
# Verificar o que está usando a porta
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

### WhatsApp não Abre
- Verificar formato do número no `.env`
- Testar em dispositivo móvel

### Erro de Dependências
```bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📞 Suporte

Para dúvidas e suporte:
- 📧 **Email**: Configurar no sistema
- 📱 **WhatsApp**: Testar com o próprio sistema!
- 📚 **Docs**: Consultar `SISTEMA_COMPLETO.md`

---

## 🎯 Próximos Passos

### Para Produção
1. 🗄️ Configurar MongoDB real
2. 🔐 Implementar autenticação robusta  
3. 💳 Integrar gateway de pagamento
4. 📱 Desenvolver app mobile
5. 📊 Adicionar analytics

### Personalização
1. 🎨 Alterar cores em `App.js`
2. 🏪 Configurar dados da empresa
3. 📋 Customizar cardápio
4. 📱 Personalizar mensagens WhatsApp

---

**� Sistema Delivery** - Revolucione suas vendas online! 

**📱 Agora com WhatsApp integrado!** ✨

```
Sistema Delivery/
├── backend/
│   ├── models/          # Esquemas MongoDB
│   ├── routes/          # Rotas da API
│   ├── middleware/      # Middlewares (auth, validação)
│   ├── config/          # Configuração do banco
│   └── server.js        # Servidor principal
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas principais
│   │   ├── context/     # Context API (Carrinho, Auth)
│   │   └── services/    # API calls
│   └── public/
└── README.md
```

## 📊 Modelos de Dados

### Cardápio
- Nome, descrição, preço, categoria
- Ingredientes, tempo de preparo
- Disponibilidade, imagem

### Cliente
- Dados pessoais (nome, email, telefone)
- Endereço completo com validações
- Histórico automático

### Pedido
- Referência ao cliente
- Itens com quantidades e observações
- Status automatizado
- Geração automática de número
- URL do WhatsApp
- Histórico de mudanças

## 🎯 Funcionalidades da Integração WhatsApp

A função `gerarMensagemWhatsApp()` do modelo Pedido cria automaticamente:

```
🍕 NOVO PEDIDO - #000001

👤 Cliente: João Silva
📱 Telefone: (11) 99999-9999
📍 Endereço: Rua das Flores, 123 - Centro, São Paulo - CEP: 01234-567

🛒 Itens do Pedido:
1. Pizza Margherita - Qtd: 1 - R$ 35,00
2. Coca-Cola 2L - Qtd: 2 - R$ 12,00

💰 Subtotal: R$ 47,00
🚚 Taxa de Entrega: R$ 5,00
💵 TOTAL: R$ 52,00

💳 Forma de Pagamento: PIX
⏰ Pedido realizado em: 09/10/2025 14:30:00
⏱️ Tempo estimado: 45 minutos
```

## 🔧 Customizações

### Adicionar novas categorias:
Edite o enum em `backend/models/Cardapio.js`

### Personalizar formas de pagamento:
Edite o enum em `backend/models/Pedido.js`

### Alterar tema:
Modifique as cores em `frontend/src/App.js`

### Configurar notificações:
Ajuste intervalo em `frontend/src/pages/admin/Dashboard.js`

## 🚀 Deploy Gratuito

### Backend - Render.com:
1. Conecte seu repositório
2. Configure variáveis de ambiente
3. Deploy automático

### Frontend - Vercel:
1. `npm run build`
2. Deploy da pasta `build`

### Banco - MongoDB Atlas:
- Tier gratuito: 512MB
- Sem cobrança

## 📋 Endpoints da API

### Públicos:
- `GET /api/cardapio` - Listar cardápio
- `POST /api/clientes` - Cadastrar cliente
- `POST /api/pedidos` - Criar pedido
- `GET /api/pedidos/numero/:numero` - Buscar pedido

### Admin (requer autenticação):
- `POST /api/auth/login` - Login
- `GET /api/pedidos` - Listar todos pedidos
- `PATCH /api/pedidos/:id/status` - Atualizar status
- `POST /api/cardapio` - Criar item do cardápio
- `GET /api/pedidos/stats/dashboard` - Estatísticas

## 🎵 Notificações Sonoras

O sistema inclui:
- Detecção automática de novos pedidos
- Som de notificação personalizado
- Notificações do navegador
- Auto-refresh do dashboard

## 🐛 Troubleshooting

### Backend não conecta ao MongoDB:
- Verifique a string de conexão
- Confirme IP whitelist no Atlas
- Teste conectividade

### Frontend não carrega dados:
- Confirme se backend está rodando
- Verifique CORS configuration
- Inspecione Network tab

### WhatsApp não abre:
- Confirme formato do número (com DDI)
- Teste URL manualmente
- Verifique encoding da mensagem

## 📄 Licença

MIT License - Sinta-se livre para usar em projetos comerciais.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas técnicas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para pequenos negócios**