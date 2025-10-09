# Script PowerShell para iniciar o servidor
param(
    [string]$Port = "5000"
)

Write-Host "=== INICIANDO SERVIDOR DELIVERY ===" -ForegroundColor Green
Write-Host "Diretório atual: $(Get-Location)" -ForegroundColor Yellow

# Navegar para o diretório backend
$backendPath = "C:\Sistema Delivery\backend"
Set-Location $backendPath
Write-Host "Navegando para: $backendPath" -ForegroundColor Yellow

# Verificar se os arquivos existem
if (!(Test-Path "server-mock.js")) {
    Write-Host "ERRO: server-mock.js não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "Arquivos encontrados:" -ForegroundColor Cyan
Get-ChildItem *.js | ForEach-Object { Write-Host "  - $($_.Name)" }

# Verificar dependências
Write-Host "`nVerificando dependências..." -ForegroundColor Cyan
if (!(Test-Path "node_modules")) {
    Write-Host "Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Iniciar servidor
Write-Host "`nIniciando servidor na porta $Port..." -ForegroundColor Green
$env:PORT = $Port
node server-mock.js