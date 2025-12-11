# Script para executar o app React Native no Android
# Este script inicia o Metro em um terminal separado e depois executa o app

Write-Host "🚀 Iniciando Health Pressure App..." -ForegroundColor Cyan
Write-Host ""

# Configurar variáveis de ambiente
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"

# Verificar se o dispositivo está conectado
Write-Host "📱 Verificando dispositivo Android..." -ForegroundColor Yellow
$devices = adb devices | Select-String "device$"
if ($devices.Count -eq 0) {
    Write-Host "❌ Nenhum dispositivo Android encontrado!" -ForegroundColor Red
    Write-Host "   Conecte um dispositivo ou inicie um emulador." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dispositivo conectado!" -ForegroundColor Green
Write-Host ""

# Matar processos anteriores do Metro
Write-Host "🧹 Limpando processos anteriores..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Iniciar Metro em um novo terminal
Write-Host "📦 Iniciando Metro Bundler..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd '$PWD'; npm start"
Write-Host "   Aguardando Metro inicializar..." -ForegroundColor Gray

# Aguardar o Metro iniciar (15 segundos)
$seconds = 15
for ($i = $seconds; $i -gt 0; $i--) {
    Write-Host "   $i segundos..." -ForegroundColor Gray
    Start-Sleep -Seconds 1
}
Write-Host "✅ Metro deve estar pronto!" -ForegroundColor Green
Write-Host ""

# Configurar port forwarding
Write-Host "🔌 Configurando conexão com Metro..." -ForegroundColor Yellow
adb reverse tcp:8081 tcp:8081
Write-Host "✅ Port forwarding configurado!" -ForegroundColor Green
Write-Host ""

# Compilar e instalar o app
Write-Host "🔨 Compilando e instalando o app..." -ForegroundColor Yellow
Write-Host "   Isso pode levar alguns minutos na primeira vez..." -ForegroundColor Gray
Write-Host ""

npm run android

Write-Host ""
Write-Host "✨ Processo concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Dicas:" -ForegroundColor Cyan
Write-Host "   - O Metro está rodando em outro terminal" -ForegroundColor Gray
Write-Host "   - Para recarregar o app, agite o dispositivo e clique em 'Reload'" -ForegroundColor Gray
Write-Host "   - Para parar o Metro, feche o terminal separado" -ForegroundColor Gray
Write-Host ""
