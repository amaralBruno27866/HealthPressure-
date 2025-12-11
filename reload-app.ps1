# Script para recarregar o app no dispositivo
# Use este script quando o Metro já estiver rodando

Write-Host "🔄 Recarregando Health Pressure App..." -ForegroundColor Cyan
Write-Host ""

# Configurar variáveis de ambiente
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"

# Configurar port forwarding
Write-Host "🔌 Configurando conexão..." -ForegroundColor Yellow
adb reverse tcp:8081 tcp:8081

# Reiniciar o app
Write-Host "📱 Reiniciando app no dispositivo..." -ForegroundColor Yellow
adb shell am force-stop com.healthpressure
Start-Sleep -Seconds 1
adb shell am start -n com.healthpressure/.MainActivity

Write-Host ""
Write-Host "✅ App reiniciado!" -ForegroundColor Green
Write-Host "   Verifique seu dispositivo." -ForegroundColor Gray
Write-Host ""
