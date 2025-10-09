const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Tentar conectar com MongoDB local primeiro
    let mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/delivery_db';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    
    // Event listeners para conexão
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro na conexão com MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    console.log('💡 Dica: Instale MongoDB local ou configure MongoDB Atlas no .env');
    console.log('📋 Para MongoDB Atlas: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/delivery_db');
    process.exit(1);
  }
};

module.exports = connectDB;