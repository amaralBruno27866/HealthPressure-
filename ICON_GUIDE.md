# App Icon Generation Guide

## Icon Design Concept
For **Health Pressure** app, the icon should represent:
- ❤️ Heart (health monitoring)
- 📊 Blood pressure (medical/health)
- 🩺 Professional medical look

## Recommended Design
A **red heart** with a **pulse line** running through it, on a **blue gradient background** (matching app colors: #3498db to #2980b9)

---

## Quick Solution: Use Icon Generator (5 minutes)

### Method 1: AppIcon.co (FREE & Easy)
1. Go to: https://www.appicon.co/
2. Design Requirements:
   - Size: 1024x1024px minimum
   - Format: PNG with transparent background OR solid color
   - Design: Red heart (♥) with pulse wave line
3. Upload your 1024x1024 icon
4. Download both Android and iOS sets
5. Follow installation instructions below

### Method 2: Canva (FREE)
1. Go to: https://www.canva.com/
2. Create 1024x1024px design
3. Use elements:
   - Heart icon (search "heart")
   - Pulse line (search "heartbeat" or "pulse")
   - Background: Blue gradient (#3498db)
4. Download as PNG
5. Use AppIcon.co to generate all sizes

### Method 3: Figma (FREE)
1. Create 1024x1024 artboard
2. Design with:
   - Circle background (blue gradient)
   - Red heart icon centered
   - White pulse line overlay
3. Export as PNG
4. Use AppIcon.co for resizing

---

## Icon Specifications

### Android (./android/app/src/main/res/)
```
mipmap-mdpi/ic_launcher.png        (48x48)
mipmap-hdpi/ic_launcher.png        (72x72)
mipmap-xhdpi/ic_launcher.png       (96x96)
mipmap-xxhdpi/ic_launcher.png      (144x144)
mipmap-xxxhdpi/ic_launcher.png     (192x192)
```

### iOS (./ios/HealthPressure/Images.xcassets/AppIcon.appiconset/)
```
Icon-20@2x.png      (40x40)
Icon-20@3x.png      (60x60)
Icon-29@2x.png      (58x58)
Icon-29@3x.png      (87x87)
Icon-40@2x.png      (80x80)
Icon-40@3x.png      (120x120)
Icon-60@2x.png      (120x120)
Icon-60@3x.png      (180x180)
Icon-1024.png       (1024x1024)
```

---

## Installation Instructions

### For Android:

1. Navigate to: `android/app/src/main/res/`

2. Replace files in each mipmap folder:
   ```
   mipmap-mdpi/ic_launcher.png
   mipmap-hdpi/ic_launcher.png
   mipmap-xhdpi/ic_launcher.png
   mipmap-xxhdpi/ic_launcher.png
   mipmap-xxxhdpi/ic_launcher.png
   ```

3. Clean and rebuild:
   ```powershell
   cd android
   ./gradlew clean
   cd ..
   ```

4. Rebuild app:
   ```powershell
   .\run-android.ps1
   ```

### For iOS:

1. Navigate to: `ios/HealthPressure/Images.xcassets/AppIcon.appiconset/`

2. Replace all icon files according to Contents.json

3. Rebuild in Xcode or via command line

---

## Alternative: Simple Text-Based Icon (Temporary)

If you need something quick for testing, you can:

1. Use emoji as icon (not professional but works):
   - ❤️ or 🩺 or 📊

2. Create simple colored square:
   - Blue background (#3498db)
   - White "HP" text (Health Pressure)

---

## Design Tips

### Color Palette (from app):
- Primary Blue: `#3498db`
- Dark Blue: `#2980b9`
- Red (Heart): `#e74c3c`
- White text: `#ffffff`

### Icon Design Rules:
✅ Simple and recognizable at small sizes
✅ No text (unless large and bold)
✅ High contrast
✅ Consistent with app theme
✅ Square canvas with rounded corners (system applies)

❌ Don't use gradients that are too subtle
❌ Don't include thin lines (won't show at small sizes)
❌ Don't use too many colors

---

## Testing Your Icon

After installation:

1. Uninstall old app from device
2. Rebuild and install new version
3. Check home screen for new icon
4. Test at different sizes/backgrounds

---

## Quick Command After Replacing Files

```powershell
# Clean build
cd android
./gradlew clean
cd ..

# Reinstall app
.\run-android.ps1
```

---

## Need Help?

If you have a 1024x1024 PNG icon ready, I can help you:
1. Update the Android configuration
2. Update the iOS configuration
3. Set up the proper file references

Just place your icon file in the project and let me know!
