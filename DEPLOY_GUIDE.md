# 🚀 Guia Completo de Deploy - Sistema Delivery

## 📋 **Pré-requisitos**
- [ ] Conta no GitHub (gratuita)
- [ ] Sistema funcionando localmente
- [ ] WhatsApp configurado (✅ FEITO)

---

## 🗄️ **ETAPA 1: MongoDB Atlas (Banco na Nuvem)**

### 1.1 Criar Conta
1. Acesse: https://www.mongodb.com/cloud/atlas
2. Clique em **"Start Free"**
3. Crie conta com Google/GitHub ou email

### 1.2 Criar Cluster Gratuito
1. Escolha **"M0 Sandbox"** (GRATUITO)
2. Região: **AWS / N. Virginia (us-east-1)**
3. Nome do cluster: `delivery-cluster`
4. Clique em **"Create Cluster"**

### 1.3 Configurar Acesso
1. **Database Access**:
   - Username: `delivery-admin`
   - Password: **[ANOTAR SENHA SEGURA]**
   - Database User Privileges: `Read and write to any database`

2. **Network Access**:
   - Clique em **"Add IP Address"**
   - Selecione **"Allow access from anywhere"** (`0.0.0.0/0`)

### 1.4 Obter String de Conexão
1. Clique em **"Connect"** no cluster
2. Escolha **"Connect your application"**
3. Driver: **Node.js**, Version: **4.1 or later**
4. Copie a connection string:
   ```
   mongodb+srv://delivery-admin:<password>@delivery-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## 🔧 **ETAPA 2: Preparar Código para Deploy**

### 2.1 Subir para GitHub
```bash
cd "C:\Sistema Delivery"
git init
git add .
git commit -m "Sistema delivery completo"

# Criar repositório no GitHub primeiro
git remote add origin https://github.com/SEU-USUARIO/sistema-delivery.git
git push -u origin main
```

### 2.2 Atualizar Configurações
Editar `backend\.env.production`:
```env
MONGODB_URI=mongodb+srv://delivery-admin:SUA_SENHA@delivery-cluster.xxxxx.mongodb.net/delivery?retryWrites=true&w=majority
JWT_SECRET=chave_jwt_super_secreta_123456789_altere_isso
WHATSAPP_NUMBER=5531983218662
```

---

## 🖥️ **ETAPA 3: Deploy do Backend (API)**

### Opção A: Render (Recomendado)
1. Acesse: https://render.com
2. Faça login com GitHub
3. Clique em **"New +"** → **"Web Service"**
4. Conecte seu repositório GitHub
5. Configurações:
   - **Name**: `delivery-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

6. **Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=sua_string_mongodb_atlas
   JWT_SECRET=sua_chave_jwt_secreta
   WHATSAPP_NUMBER=5531983218662
   ```

7. Clique em **"Create Web Service"**
8. **Anotar URL**: `https://delivery-api-xxxx.onrender.com`

### Opção B: Railway
1. Acesse: https://railway.app
2. Login com GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Selecione seu repositório
5. Configure variáveis de ambiente iguais ao Render

---

## 🌐 **ETAPA 4: Deploy do Frontend**

### Opção A: Netlify (Recomendado)
1. Acesse: https://www.netlify.com
2. Login com GitHub
3. **"New site from Git"** → GitHub → Selecione repositório
4. Configurações:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

5. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://delivery-api-xxxx.onrender.com
   REACT_APP_WHATSAPP_NUMBER=5531983218662
   REACT_APP_EMPRESA_NOME=Sistema Delivery
   ```

6. **Anotar URL**: `https://amazing-name-123456.netlify.app`

### Opção B: Vercel
1. Acesse: https://vercel.com
2. Login com GitHub
3. **"New Project"** → Import seu repositório
4. **Root Directory**: `frontend`
5. Configure mesmas variáveis de ambiente

---

## 🔗 **ETAPA 5: Conectar Frontend e Backend**

### 5.1 Atualizar URLs
1. **Backend** - Adicionar nas variáveis de ambiente:
   ```
   FRONTEND_URL=https://amazing-name-123456.netlify.app
   ```

2. **Frontend** - Verificar se está correto:
   ```
   REACT_APP_API_URL=https://delivery-api-xxxx.onrender.com
   ```

### 5.2 Configurar CORS
O backend já está configurado para aceitar a URL do frontend.

---

## 🎯 **ETAPA 6: Domínio Personalizado (Opcional)**

### 6.1 Comprar Domínio
- **Registro.br** (domínios .com.br)
- **Cloudflare** (domínios internacionais)
- **GoDaddy**, **Namecheap**

### 6.2 Configurar DNS
**Para Netlify:**
1. No painel do Netlify: **Domain settings**
2. **Add custom domain**: `seudelivery.com.br`
3. Configure DNS no seu provedor:
   ```
   CNAME @ amazing-name-123456.netlify.app
   ```

**Para Render (API):**
1. Adicione CNAME: `api.seudelivery.com.br → delivery-api-xxxx.onrender.com`

---

## ✅ **ETAPA 7: Teste Final**

### 7.1 Checklist de Funcionamento
- [ ] Site carrega: `https://seudelivery.com.br`
- [ ] Admin login funciona: `/admin/login`
- [ ] Cardápio carrega produtos
- [ ] Carrinho funciona
- [ ] Checkout processa pedidos
- [ ] WhatsApp abre corretamente
- [ ] Rastreamento funciona

### 7.2 URLs Finais
- **🛒 Loja**: `https://seudelivery.com.br`
- **👨‍💼 Admin**: `https://seudelivery.com.br/admin/login`
- **🔧 API**: `https://api.seudelivery.com.br`

---

## 💰 **Custos**

### Planos Gratuitos Incluem:
- **MongoDB Atlas**: 512MB storage
- **Render**: 750h/mês compute
- **Netlify**: 100GB bandwidth
- **Vercel**: 100GB bandwidth

### Limites dos Planos Gratuitos:
- Render: App "dorme" após 15min inativo
- MongoDB: Máximo 512MB de dados
- Netlify: 300 minutos build/mês

---

## 🆘 **Solução de Problemas**

### API não conecta:
1. Verificar variáveis de ambiente
2. Logs no painel do Render
3. Testar URL da API: `/api/health`

### Frontend não carrega:
1. Verificar build no Netlify
2. Conferir variáveis de ambiente
3. Verificar console do navegador

### MongoDB não conecta:
1. Conferir string de conexão
2. Verificar IP whitelist (0.0.0.0/0)
3. Testar credenciais

---

## 📞 **Suporte**

Em caso de dúvidas:
1. Verificar logs nos painéis das plataformas
2. Documentação oficial de cada serviço
3. GitHub Issues do projeto