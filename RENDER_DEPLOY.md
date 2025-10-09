# 🚀 Deploy no Render - Backend

## ✅ **MongoDB Configurado:**
String de conexão: `mongodb+srv://alex32:<db_password>@delivery-admin.gzswapr.mongodb.net/...`

---

## 🖥️ **Deploy Backend no Render**

### **1. Acessar Render**
- URL: https://render.com
- Clique em **"Get Started for Free"**
- **Login com GitHub** (recomendado)

### **2. Criar Web Service**
1. No dashboard, clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte sua conta GitHub (se ainda não conectou)
4. Encontre e selecione: **`seguroapp/sistema-delivery`**
5. Clique em **"Connect"**

### **3. Configurações do Deploy**
**Configurações básicas:**
- **Name**: `delivery-api` (ou outro nome de sua escolha)
- **Region**: `Oregon (US West)` ou `Ohio (US East)` 
- **Branch**: `main`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### **4. Variáveis de Ambiente**
Na seção **"Environment Variables"**, adicione:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://alex32:SUA_SENHA_AQUI@delivery-admin.gzswapr.mongodb.net/?retryWrites=true&w=majority&appName=delivery-admin
JWT_SECRET=sua_chave_jwt_super_secreta_delivery_2024_altere_isso
WHATSAPP_NUMBER=5531983218662
```

**⚠️ IMPORTANTE**: Substitua `SUA_SENHA_AQUI` pela senha real que você criou no MongoDB Atlas!

### **5. Criar o Service**
- Clique em **"Create Web Service"**
- Aguarde o deploy (5-10 minutos na primeira vez)
- Anote a URL que será gerada: `https://delivery-api-xxxx.onrender.com`

### **6. Testar a API**
Após o deploy, teste se está funcionando:
- Acesse: `https://sua-url-do-render.onrender.com/api/health`
- Deve retornar: `{"status": "OK", "message": "API funcionando!"}`

---

## 🔧 **Solução de Problemas**

### **Deploy falhou?**
1. Verificar logs no painel do Render
2. Confirmar que todas as variáveis de ambiente estão corretas
3. Verificar se a senha do MongoDB está correta

### **Erro de conexão MongoDB?**
1. Verificar se o IP `0.0.0.0/0` está liberado no MongoDB Atlas
2. Confirmar usuário e senha
3. Testar string de conexão

### **API não responde?**
1. Verificar se o serviço está rodando no painel
2. Aguardar alguns minutos (primeiro deploy é mais lento)
3. Verificar logs de erro

---

## ✅ **Checklist Backend**
- [ ] Conta Render criada
- [ ] Repositório conectado
- [ ] Configurações definidas
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] URL da API anotada
- [ ] Teste de health funcionando

**⏱️ Tempo estimado:** 15 minutos

---

## 🎯 **Próximo Passo**
Após o backend no ar, faremos o deploy do frontend no Netlify!