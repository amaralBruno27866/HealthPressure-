# GitHub Release Guide - Health Pressure

## Quick Start: Build and Release APK

### Step 1: Build the APK

Run the build script:
```powershell
.\build-apk.ps1
```

This will generate: `HealthPressure-debug.apk` (or `HealthPressure-release.apk`)

---

## Step 2: Create GitHub Release

### Option A: Via GitHub Web Interface (Easiest)

1. **Go to your repository:**
   ```
   https://github.com/amaralBruno27866/HealthPressure-
   ```

2. **Click on "Releases"** (right sidebar)

3. **Click "Create a new release"**

4. **Fill in the details:**
   - **Tag version:** `v1.0.0` (or `v1.0`, `1.0.0`)
   - **Release title:** `Health Pressure v1.0.0 - Initial Release`
   - **Description:** See template below

5. **Upload the APK:**
   - Drag and drop `HealthPressure-debug.apk` into the "Attach binaries" section
   - Or click to browse and select it

6. **Click "Publish release"**

### Release Description Template

Copy and paste this into your GitHub release:

```markdown
# Health Pressure v1.0.0 🩺❤️

Your personal blood pressure monitoring companion.

## 📱 Features

- ✅ Track blood pressure measurements (systolic, diastolic, heart rate)
- ✅ Weekly measurement history with automatic archiving
- ✅ Blood pressure classification (WHO guidelines)
- ✅ BMI calculation and statistics
- ✅ Multiple user profiles
- ✅ Generate and share medical reports
- ✅ Professional UI with Material Design icons

## 📥 Installation

### Android
1. Download `HealthPressure-debug.apk` below
2. Transfer to your Android device
3. Open the APK file to install
4. Allow installation from unknown sources if prompted

**Minimum Requirements:** Android 6.0 (API 23) or higher

## 🎯 How to Use

1. **First Launch:** Create a user profile with your health data
2. **Add Measurements:** Tap the + button to record your blood pressure
3. **View Statistics:** Check your averages and BMI in the Statistics tab
4. **History:** View past weeks' measurements in the History tab
5. **Share Reports:** Tap the share icon to generate a medical report

## 📊 Blood Pressure Classifications

- **Hypotension:** < 90/60 mmHg
- **Normal:** 90-119 / 60-79 mmHg
- **Pre-Hypertension:** 120-139 / 80-89 mmHg
- **Hypertension Stage 1:** 140-159 / 90-99 mmHg
- **Hypertension Stage 2:** 160-179 / 100-109 mmHg
- **Hypertensive Crisis:** ≥ 180 / ≥ 110 mmHg

## 🔒 Privacy

All data is stored locally on your device. No internet connection required. Your health data never leaves your phone.

## 📝 Changelog

### v1.0.0 (2025-12-11)
- Initial release
- Complete blood pressure tracking system
- Weekly history with automatic archiving
- Multi-user support
- Medical report generation
- Full English translation
- Custom app icon and splash screen

## 👨‍💻 Developer

**Bruno Amaral**
- GitHub: [@amaralBruno27866](https://github.com/amaralBruno27866)

## 📄 License

© 2025 Bruno Amaral. All Rights Reserved.

---

**⚠️ Medical Disclaimer:** This app is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider.
```

---

## Option B: Via GitHub CLI (Advanced)

If you have GitHub CLI installed:

```powershell
# Create release
gh release create v1.0.0 `
  --title "Health Pressure v1.0.0 - Initial Release" `
  --notes "See full release notes in README" `
  HealthPressure-debug.apk

# View your release
gh release view v1.0.0
```

---

## Step 3: Update README with Download Link

After creating the release, update your README:

```markdown
## 📥 Download

**Latest Version:** [Health Pressure v1.0.0](https://github.com/amaralBruno27866/HealthPressure-/releases/latest)

[Download APK](https://github.com/amaralBruno27866/HealthPressure-/releases/download/v1.0.0/HealthPressure-debug.apk)
```

---

## Testing the APK

Before uploading to GitHub, test locally:

### Method 1: Transfer to Phone
1. Copy APK to phone via USB, email, or cloud storage
2. Open the APK file on your phone
3. Install and test

### Method 2: ADB Install
```powershell
# Add ADB to path if needed
$env:Path += ";C:\Users\Bruno\AppData\Local\Android\Sdk\platform-tools"

# Install APK
adb install -r HealthPressure-debug.apk

# Launch app
adb shell am start -n com.healthpressure/.MainActivity
```

---

## APK Size Optimization (Optional)

To reduce APK size for release:

1. **Enable ProGuard** (already configured)
2. **Use Release Build** (smaller than debug)
3. **Remove unused resources**

Current size:
- Debug APK: ~30-40 MB
- Release APK: ~20-30 MB (with ProGuard)

---

## Versioning Guide

For future releases, update version in `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        versionCode 2          // Increment this
        versionName "1.1.0"    // Update this
    }
}
```

Then create new release: `v1.1.0`, `v1.2.0`, `v2.0.0`, etc.

---

## Common Issues

### "App not installed" error
- **Solution:** Uninstall old version first
- Or increase `versionCode` in build.gradle

### "Unknown sources" warning
- **Solution:** Enable "Install from unknown sources" in Android settings

### Large file size
- **Solution:** Use release build with ProGuard enabled
- Or use App Bundle (.aab) instead of APK

---

## Distribution Alternatives

### 1. GitHub Releases (Current)
✅ Free
✅ Easy for developers
✅ Direct APK download
❌ Requires "unknown sources" enabled

### 2. Google Play Store (Future)
- Requires developer account ($25 one-time)
- Professional distribution
- Automatic updates
- Trusted source

### 3. F-Droid (Open Source)
- Free and open-source app store
- Requires fully open-source app
- Alternative to Play Store

---

## Publishing Checklist

Before publishing to GitHub:

- [ ] Test APK on multiple devices
- [ ] Update version number
- [ ] Create detailed release notes
- [ ] Include screenshots (optional)
- [ ] Add installation instructions
- [ ] Include medical disclaimer
- [ ] Test download link after publishing
- [ ] Update README with download link

---

## Next Steps

1. Run `.\build-apk.ps1` to generate APK
2. Test the APK on your device
3. Create GitHub Release with APK attachment
4. Share the download link!

**Your release URL will be:**
```
https://github.com/amaralBruno27866/HealthPressure-/releases
```
