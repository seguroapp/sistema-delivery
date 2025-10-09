@echo off
echo ================================
echo    SISTEMA DELIVERY COMPLETO
echo ================================
echo.

echo Verificando dependencias...

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor instale Node.js primeiro.
    pause
    exit /b 1
)

REM Verificar se npm está instalado  
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: npm nao encontrado!
    pause
    exit /b 1
)

echo Node.js e npm encontrados!
echo.

REM Instalar dependências do backend se necessário
echo Verificando dependencias do backend...
if not exist "backend\node_modules" (
    echo Instalando dependencias do backend...
    cd backend
    npm install
    cd ..
    echo Backend: Dependencias instaladas!
) else (
    echo Backend: Dependencias ja instaladas!
)

REM Instalar dependências do frontend se necessário
echo Verificando dependencias do frontend...
if not exist "frontend\node_modules" (
    echo Instalando dependencias do frontend...
    cd frontend
    npm install
    cd ..
    echo Frontend: Dependencias instaladas!
) else (
    echo Frontend: Dependencias ja instaladas!
)

echo.
echo ================================
echo    INICIANDO SISTEMA COMPLETO
echo ================================
echo.

echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo Admin: http://localhost:3000/admin/login
echo.

echo Abrindo terminais...
echo.

REM Iniciar backend em nova janela
start "SISTEMA DELIVERY - BACKEND" cmd /k "cd /d %cd%\backend && echo Iniciando servidor backend... && node server-mock.js"

REM Aguardar alguns segundos
timeout /t 3 /nobreak >nul

REM Iniciar frontend em nova janela
start "SISTEMA DELIVERY - FRONTEND" cmd /k "cd /d %cd%\frontend && echo Iniciando servidor frontend... && npm start"

echo.
echo Sistema iniciado com sucesso!
echo.
echo CREDENCIAIS DO ADMIN:
echo Usuario: admin
echo Senha: admin123
echo.
echo Aguarde alguns segundos para os servidores iniciarem...
echo O navegador abrirá automaticamente.
echo.

REM Aguardar mais alguns segundos e abrir o navegador
timeout /t 8 /nobreak >nul
start http://localhost:3000

echo.
echo ================================
echo    SISTEMA DELIVERY ATIVO!
echo ================================
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul