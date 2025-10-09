# Sistema Delivery - Script de Inicialização
# Desenvolvido para Windows PowerShell

Write-Host "================================" -ForegroundColor Green
Write-Host "    SISTEMA DELIVERY COMPLETO" -ForegroundColor Green  
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Verificar se Node.js está instalado
Write-Host "Verificando dependências..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERRO: Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Por favor instale Node.js primeiro." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✓ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERRO: npm não encontrado!" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Instalar dependências do backend
Write-Host "Verificando dependências do backend..." -ForegroundColor Yellow
if (!(Test-Path "backend\node_modules")) {
    Write-Host "Instalando dependências do backend..." -ForegroundColor Cyan
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "✓ Backend: Dependências instaladas!" -ForegroundColor Green
} else {
    Write-Host "✓ Backend: Dependências já instaladas!" -ForegroundColor Green
}

# Instalar dependências do frontend  
Write-Host "Verificando dependências do frontend..." -ForegroundColor Yellow
if (!(Test-Path "frontend\node_modules")) {
    Write-Host "Instalando dependências do frontend..." -ForegroundColor Cyan
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "✓ Frontend: Dependências instaladas!" -ForegroundColor Green
} else {
    Write-Host "✓ Frontend: Dependências já instaladas!" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "    INICIANDO SISTEMA COMPLETO" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

Write-Host "🌐 URLs do Sistema:" -ForegroundColor Cyan
Write-Host "   Backend: http://localhost:5000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White  
Write-Host "   Admin: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host ""

Write-Host "🔑 Credenciais do Admin:" -ForegroundColor Cyan
Write-Host "   Usuário: admin" -ForegroundColor White
Write-Host "   Senha: admin123" -ForegroundColor White
Write-Host ""

# Função para iniciar em nova janela PowerShell
function Start-NewPowerShell {
    param($Title, $Command)
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {Write-Host '$Title' -ForegroundColor Green; Write-Host ''; $Command}"
}

# Iniciar backend
Write-Host "📡 Iniciando servidor backend..." -ForegroundColor Yellow
Start-NewPowerShell "SISTEMA DELIVERY - BACKEND" "Set-Location '$PWD\backend'; node server-mock.js"

# Aguardar alguns segundos
Start-Sleep -Seconds 3

# Iniciar frontend
Write-Host "🖥️  Iniciando servidor frontend..." -ForegroundColor Yellow
Start-NewPowerShell "SISTEMA DELIVERY - FRONTEND" "Set-Location '$PWD\frontend'; npm start"

Write-Host ""
Write-Host "✅ Sistema iniciado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Aguarde alguns segundos para os servidores iniciarem..." -ForegroundColor Yellow
Write-Host "🌐 O navegador abrirá automaticamente em http://localhost:3000" -ForegroundColor Yellow

# Aguardar e abrir navegador
Start-Sleep -Seconds 8
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "    SISTEMA DELIVERY ATIVO!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

Write-Host "💡 Dicas:" -ForegroundColor Cyan
Write-Host "   • Para parar os servidores, feche as janelas ou use Ctrl+C" -ForegroundColor White
Write-Host "   • Logs aparecem nas janelas dos servidores" -ForegroundColor White
Write-Host "   • Acesse /admin/login para o painel administrativo" -ForegroundColor White
Write-Host ""

Read-Host "Pressione Enter para fechar esta janela"