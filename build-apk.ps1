# Build APK Script for Distribution
# Generates release APK for Health Pressure app

Write-Host "📦 Building Health Pressure APK for Distribution..." -ForegroundColor Cyan
Write-Host ""

# Set environment variables
$env:ANDROID_HOME = "C:\Users\Bruno\AppData\Local\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:Path"

# Check if we're in the right directory
if (-not (Test-Path "android\app\build.gradle")) {
    Write-Host "❌ Error: Run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
Push-Location android
& .\gradlew.bat clean | Out-Null
Pop-Location

Write-Host "✅ Clean complete!" -ForegroundColor Green
Write-Host ""

# Build APK
Write-Host "🔨 Building Release APK..." -ForegroundColor Yellow
Write-Host "   This may take 2-5 minutes..." -ForegroundColor Gray
Write-Host ""

Push-Location android
& .\gradlew.bat assembleRelease

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Common issues:" -ForegroundColor Yellow
    Write-Host "   1. Missing keystore file (for signed release)" -ForegroundColor White
    Write-Host "   2. Try building debug APK instead: .\gradlew.bat assembleDebug" -ForegroundColor White
    Write-Host ""
    Pop-Location
    exit 1
}

Pop-Location

# Find the generated APK
$apkPath = "android\app\build\outputs\apk\release\app-release.apk"

if (Test-Path $apkPath) {
    $apkInfo = Get-Item $apkPath
    $apkSizeMB = [math]::Round($apkInfo.Length / 1MB, 2)
    
    Write-Host ""
    Write-Host "✅ APK built successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Location: $apkPath" -ForegroundColor Cyan
    Write-Host "📊 Size: $apkSizeMB MB" -ForegroundColor Cyan
    Write-Host ""
    
    # Copy to root for easy access
    $outputPath = "HealthPressure-release.apk"
    Copy-Item $apkPath -Destination $outputPath -Force
    
    Write-Host "✅ APK copied to: $outputPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Test the APK on your device" -ForegroundColor White
    Write-Host "   2. Create a GitHub Release" -ForegroundColor White
    Write-Host "   3. Upload the APK file" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 To install on device:" -ForegroundColor Cyan
    Write-Host "   Transfer APK to phone and open it to install" -ForegroundColor White
    Write-Host "   OR run: adb install $outputPath" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "⚠️  Release APK not found. Building debug APK instead..." -ForegroundColor Yellow
    Write-Host ""
    
    # Try building debug APK
    Push-Location android
    & .\gradlew.bat assembleDebug
    Pop-Location
    
    $debugApkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
    
    if (Test-Path $debugApkPath) {
        $apkInfo = Get-Item $debugApkPath
        $apkSizeMB = [math]::Round($apkInfo.Length / 1MB, 2)
        
        $outputPath = "HealthPressure-debug.apk"
        Copy-Item $debugApkPath -Destination $outputPath -Force
        
        Write-Host ""
        Write-Host "✅ Debug APK built successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📍 Location: $outputPath" -ForegroundColor Cyan
        Write-Host "📊 Size: $apkSizeMB MB" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "⚠️  Note: This is a DEBUG build (larger size)" -ForegroundColor Yellow
        Write-Host "   For production, configure signing and use release build" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "❌ Failed to build APK" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✨ Done!" -ForegroundColor Green
Write-Host ""
