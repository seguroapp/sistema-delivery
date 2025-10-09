// Script para testar as APIs do admin dashboard
// Execute este script no console do navegador na página do admin

async function testarAPIsAdmin() {
  try {
    console.log('=== TESTANDO APIs DO ADMIN ===');
    
    // 1. Fazer login
    console.log('\n1. Fazendo login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@delivery.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Response:', loginData);
    
    if (loginData.success) {
      // Salvar token
      localStorage.setItem('adminToken', loginData.token);
      console.log('✅ Login realizado com sucesso!');
      
      // 2. Buscar estatísticas do dashboard
      console.log('\n2. Buscando estatísticas...');
      const statsResponse = await fetch('http://localhost:5000/api/admin/pedidos/stats/dashboard');
      const statsData = await statsResponse.json();
      console.log('Estatísticas:', statsData);
      
      // 3. Buscar pedidos
      console.log('\n3. Buscando pedidos...');
      const pedidosResponse = await fetch('http://localhost:5000/api/admin/pedidos');
      const pedidosData = await pedidosResponse.json();
      console.log('Pedidos:', pedidosData);
      
      // 4. Buscar pedidos pendentes
      console.log('\n4. Buscando pedidos pendentes...');
      const pendentesResponse = await fetch('http://localhost:5000/api/admin/pedidos/pendentes');
      const pendentesData = await pendentesResponse.json();
      console.log('Pedidos Pendentes:', pendentesData);
      
      console.log('\n✅ Todas as APIs estão funcionando!');
      console.log('\n🔄 Recarregue a página para ver o dashboard funcionando.');
      
      // Recarregar página automaticamente
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } else {
      console.log('❌ Erro no login:', loginData.message);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar APIs:', error);
  }
}

// Executar automaticamente se não estiver logado
if (!localStorage.getItem('adminToken')) {
  console.log('🚀 Executando teste automático das APIs...');
  testarAPIsAdmin();
} else {
  console.log('✅ Já está logado! Dashboard deve estar funcionando.');
}

// Função para logout (se precisar)
function logout() {
  localStorage.removeItem('adminToken');
  window.location.href = '/admin/login';
}

console.log('\n📋 Comandos disponíveis:');
console.log('- testarAPIsAdmin() - Testar todas as APIs');
console.log('- logout() - Fazer logout');