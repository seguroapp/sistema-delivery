# Sistema de Delivery Completo 🚀

## 📋 Visão Geral
Sistema completo de delivery com integração WhatsApp, painel administrativo e rastreamento de pedidos em tempo real. Desenvolvido com MERN Stack e componentes Material-UI.

## ✨ Funcionalidades Principais

### 🛍️ Para Clientes
- **Catálogo de Produtos**: Visualização completa do cardápio com preços
- **Carrinho de Compras**: Sistema intuitivo de adição/remoção de itens
- **Checkout Completo**: Processo de finalização com dados de entrega
- **Rastreamento em Tempo Real**: Acompanhamento do status do pedido
- **Integração WhatsApp**: Contato direto com a loja
- **Responsivo**: Funciona perfeitamente em mobile e desktop

### 👨‍💼 Para Administradores
- **Painel de Controle**: Dashboard com estatísticas em tempo real
- **Gestão de Pedidos**: Visualização e controle de todos os pedidos
- **Atualização de Status**: Mudança de status com histórico completo
- **Comunicação WhatsApp**: Notificação automática aos clientes
- **Relatórios**: Estatísticas de vendas e desempenho

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** 18+ com Hooks
- **Material-UI** v5 para interface
- **React Router** para navegação
- **Context API** para gerenciamento de estado
- **Axios** para requisições HTTP

### Backend
- **Node.js** com Express
- **Sistema Mock** para dados em memória
- **CORS** habilitado
- **Middleware** de autenticação JWT
- **API RESTful** completa

### Integrações
- **WhatsApp API** para comunicação
- **Notification System** automatizado
- **Responsive Design** para todos os dispositivos

## 📁 Estrutura do Projeto

```
Sistema Delivery/
├── backend/
│   ├── server-mock.js          # Servidor principal com dados mock
│   ├── routes/                 # Rotas da API
│   ├── models/                 # Modelos de dados
│   └── middleware/             # Middlewares de autenticação
├── frontend/
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── AdminDashboard.js
│   │   │   ├── FloatingWhatsApp.js
│   │   │   └── WhatsAppContact.js
│   │   ├── pages/              # Páginas principais
│   │   │   ├── Home.js
│   │   │   ├── Checkout.js
│   │   │   └── AcompanharPedido.js
│   │   ├── services/           # Serviços e APIs
│   │   │   ├── whatsappService.js
│   │   │   └── apiClient.js
│   │   └── context/            # Contextos React
│   └── public/
└── README.md
```

## 🚀 Como Executar

### 1. Instalar Dependências

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configurar Variáveis de Ambiente

Criar arquivo `.env` no frontend:
```env
REACT_APP_WHATSAPP_NUMBER=5531983218662
REACT_APP_EMPRESA_NOME=Sistema Delivery
REACT_APP_API_URL=http://localhost:5000
```

### 3. Executar o Sistema

**Backend (Terminal 1):**
```bash
cd backend
node server-mock.js
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

### 4. Acessar o Sistema
- **Cliente**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login
  - **Usuário**: admin
  - **Senha**: admin123

## 📱 Módulo WhatsApp

### Funcionalidades
- **Botão Flutuante**: Sempre visível para contato rápido
- **Mensagens Personalizadas**: Templates para diferentes situações
- **Status da Loja**: Verifica horário de funcionamento
- **Integração Completa**: Com rastreamento de pedidos

### Tipos de Contato
- 📞 **Informações Gerais**
- 🛒 **Fazer Pedido**
- 📋 **Ver Cardápio**
- 🚚 **Informações de Entrega**
- 🎁 **Promoções**
- 📍 **Acompanhar Pedido**
- 🛠️ **Suporte Técnico**
- 💬 **Reclamações/Sugestões**

## 🔄 Fluxo de Pedidos

### Estados do Pedido
1. **Pendente** - Aguardando confirmação
2. **Confirmado** - Pedido aceito pela loja
3. **Preparando** - Em preparação na cozinha
4. **Saiu para Entrega** - A caminho do cliente
5. **Entregue** - Finalizado com sucesso

### Rastreamento
- **Timeline Visual**: Progresso com ícones e timestamps
- **Notificações WhatsApp**: Automáticas a cada mudança
- **Busca Flexível**: Por número, telefone ou email
- **Tempo Estimado**: Cálculo dinâmico de entrega

## 🎨 Interface de Usuário

### Design System
- **Paleta de Cores**: Vermelho (#d32f2f), Laranja (#ff9800), Verde WhatsApp (#25d366)
- **Tipografia**: Roboto family
- **Componentes**: Material-UI consistente
- **Layout**: Grid responsivo 12 colunas

### Responsividade
- **Mobile First**: Otimizado para dispositivos móveis
- **Tablet**: Layout adaptado para telas médias
- **Desktop**: Experiência completa em telas grandes

## 🔐 Sistema de Autenticação

### Admin
- **JWT Tokens**: Autenticação segura
- **Middleware**: Proteção de rotas sensíveis
- **Session Management**: Persistência de login
- **Logout Seguro**: Limpeza de tokens

## 📊 Dashboard Administrativo

### Métricas
- **Pedidos Hoje**: Contador em tempo real
- **Receita Total**: Soma dos valores
- **Pedidos Pendentes**: Alertas visuais
- **Taxa de Conversão**: Análise de performance

### Gestão
- **Lista de Pedidos**: Tabela com filtros
- **Ações Rápidas**: Botões de status e WhatsApp
- **Detalhes Completos**: Modal com informações
- **Histórico**: Timeline de mudanças

## 🛡️ Segurança

### Medidas Implementadas
- **Validação de Dados**: Frontend e backend
- **Sanitização**: Proteção contra XSS
- **CORS Configurado**: Origens permitidas
- **Headers de Segurança**: Proteções adicionais

## 📞 Suporte e Configuração

### Configuração do WhatsApp
1. Alterar `REACT_APP_WHATSAPP_NUMBER` no `.env`
2. Configurar horário de funcionamento
3. Personalizar mensagens padrão
4. Testar integração

### Personalização
- **Logo da Empresa**: Substituir arquivos em `/public`
- **Cores do Tema**: Modificar `theme` em `App.js`
- **Mensagens**: Editar `whatsappService.js`
- **Cardápio**: Atualizar `mockData.js`

## 🚀 Deployment

### Preparação para Produção
1. **Build do Frontend**: `npm run build`
2. **Variáveis de Ambiente**: Configurar para produção
3. **Servidor Backend**: Deploy em serviços como Heroku
4. **Frontend**: Deploy em Netlify/Vercel
5. **MongoDB**: Configurar banco real se necessário

### Serviços Recomendados (Gratuitos)
- **Backend**: Railway, Render, Heroku
- **Frontend**: Netlify, Vercel, GitHub Pages
- **Banco de Dados**: MongoDB Atlas
- **CDN**: Cloudflare

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login do admin
- `POST /api/auth/logout` - Logout

### Pedidos
- `GET /api/pedidos` - Listar pedidos (admin)
- `POST /api/pedidos` - Criar novo pedido
- `PUT /api/pedidos/:id/status` - Atualizar status
- `GET /api/pedidos/track/:numero` - Rastrear pedido

### Cardápio
- `GET /api/cardapio` - Obter cardápio completo

### Clientes
- `POST /api/clientes` - Cadastrar cliente

## 🔧 Troubleshooting

### Problemas Comuns
1. **Porta ocupada**: Verificar se não há outros serviços rodando
2. **CORS Error**: Configurar origens no backend
3. **WhatsApp não abre**: Verificar formato do número
4. **Build falha**: Verificar versões do Node.js

### Logs e Debug
- **Backend**: Console do Node.js
- **Frontend**: DevTools do browser
- **Network**: Aba Network para requisições
- **Estado**: React DevTools

## 🤝 Contribuição

### Como Contribuir
1. Fork do repositório
2. Criar branch para feature: `git checkout -b feature/nova-funcionalidade`
3. Commit das mudanças: `git commit -m 'Add nova funcionalidade'`
4. Push para branch: `git push origin feature/nova-funcionalidade`
5. Abrir Pull Request

## 📄 Licença

Projeto desenvolvido para fins educacionais. Livre para uso e modificação.

## 🎯 Próximas Funcionalidades

### Planejadas
- [ ] Sistema de cupons de desconto
- [ ] Integração com pagamentos online
- [ ] App mobile React Native
- [ ] Sistema de avaliações
- [ ] Programa de fidelidade
- [ ] Notificações push
- [ ] Analytics avançado
- [ ] Multi-loja

---

**Sistema Delivery** - Desenvolvido com ❤️ para revolucionar vendas online! 🚀