# Install App Icon Script
# This script will resize and install the icon for Android

param(
    [string]$IconPath = "C:\Users\Bruno\Downloads\*.png"
)

Write-Host "🎨 Installing Health Pressure App Icon..." -ForegroundColor Cyan
Write-Host ""

# Find the PNG file in Downloads
$sourceIcon = Get-ChildItem -Path "C:\Users\Bruno\Downloads" -Filter "*.png" | Select-Object -First 1

if (-not $sourceIcon) {
    Write-Host "❌ No PNG file found in Downloads folder" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Found icon: $($sourceIcon.Name)" -ForegroundColor Green
Write-Host ""

# Define Android icon sizes
$androidSizes = @{
    "mdpi"    = 48
    "hdpi"    = 72
    "xhdpi"   = 96
    "xxhdpi"  = 144
    "xxxhdpi" = 192
}

# Create temp directory for processed icons
$tempDir = "$PSScriptRoot\temp_icons"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Write-Host "🔄 Resizing icon for all densities..." -ForegroundColor Yellow
Write-Host ""

# Copy original to temp
Copy-Item $sourceIcon.FullName -Destination "$tempDir\original.png"

# Android icon generation
foreach ($density in $androidSizes.Keys) {
    $size = $androidSizes[$density]
    $targetDir = "$PSScriptRoot\android\app\src\main\res\mipmap-$density"
    
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    
    $targetPath = "$targetDir\ic_launcher.png"
    
    Write-Host "  📱 Creating $density ($size x $size px)..." -ForegroundColor Gray
    
    # Use .NET to resize (built-in, no external dependencies)
    Add-Type -AssemblyName System.Drawing
    
    $originalImage = [System.Drawing.Image]::FromFile($sourceIcon.FullName)
    $newImage = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($newImage)
    
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $graphics.DrawImage($originalImage, 0, 0, $size, $size)
    
    # Save with high quality
    $newImage.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $newImage.Dispose()
    $originalImage.Dispose()
}

Write-Host ""
Write-Host "✅ Android icons installed successfully!" -ForegroundColor Green
Write-Host ""

# Clean up temp directory
Remove-Item $tempDir -Recurse -Force

Write-Host "🧹 Cleaning Android build cache..." -ForegroundColor Yellow
Push-Location android
& .\gradlew.bat clean | Out-Null
Pop-Location

Write-Host ""
Write-Host "✅ Icon installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Uninstall the old app from your device" -ForegroundColor White
Write-Host "  2. Run: .\run-android.ps1" -ForegroundColor White
Write-Host "  3. Check your device home screen for the new icon!" -ForegroundColor White
Write-Host ""
