const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Schema do Admin (copiado do modelo)
const adminSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true,
    minlength: 6
  },
  ativo: {
    type: Boolean,
    default: true
  },
  ultimoLogin: Date
}, {
  timestamps: true
});

// Middleware para hash da senha
adminSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
adminSchema.methods.compararSenha = async function(senhaCandidata) {
  return await bcrypt.compare(senhaCandidata, this.senha);
};

const Admin = mongoose.model('Admin', adminSchema);

async function criarAdminPadrao() {
  try {
    // Conectar ao MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://alex32:SUA_SENHA@delivery-admin.gzswapr.mongodb.net/?retryWrites=true&w=majority&appName=delivery-admin';
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB');

    // Verificar se já existe admin
    const adminExistente = await Admin.findOne({ email: 'admin@delivery.com' });
    
    if (adminExistente) {
      console.log('⚠️  Admin já existe:', adminExistente.email);
      return;
    }

    // Criar admin padrão
    const adminPadrao = new Admin({
      nome: 'Administrador',
      email: 'admin@delivery.com',
      senha: 'admin123',
      ativo: true
    });

    await adminPadrao.save();
    console.log('🎉 Admin padrão criado com sucesso!');
    console.log('📧 Email: admin@delivery.com');
    console.log('🔑 Senha: admin123');

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexão fechada');
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  criarAdminPadrao();
}

module.exports = { criarAdminPadrao };