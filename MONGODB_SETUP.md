# Instruções para configurar MongoDB

## Opção 1: MongoDB Atlas (Recomendado - Gratuito)

1. Acesse: https://www.mongodb.com/atlas/database
2. Clique em "Try Free"
3. Crie uma conta com email
4. Crie um cluster gratuito (M0 Sandbox)
5. Configure um usuário:
   - Username: admin
   - Password: admin123 (ou sua escolha)
6. Adicione seu IP à whitelist (ou 0.0.0.0/0 para todos)
7. Pegue a connection string:
   mongodb+srv://admin:admin123@cluster0.mongodb.net/delivery_db

8. Edite o arquivo backend/.env:
   MONGODB_URI=mongodb+srv://admin:admin123@cluster0.mongodb.net/delivery_db

## Opção 2: MongoDB Local

1. Baixe MongoDB Community: https://www.mongodb.com/try/download/community
2. Instale com configurações padrão
3. Inicie o serviço do MongoDB
4. Use a URI local: mongodb://localhost:27017/delivery_db

## Testando a Conexão

Após configurar, reinicie o servidor backend:
1. Pare o servidor (Ctrl+C no terminal)
2. Execute novamente: node server.js
3. Verifique se aparece "MongoDB conectado"