# Translation Guide - Portuguese to English

This guide helps you complete the translation of the Health Pressure app from Portuguese to English.

## Files Already Converted ✅
- `src/models/index.ts` - Type definitions
- `src/utils/calculations.ts` - Classification functions  
- `src/screens/HomeScreen.tsx` - Main screen

## Files to Convert 📝

### 1. AddMeasurementScreen.tsx
**Portuguese → English**
- "Erro" → "Error"
- "Preencha todos os campos obrigatórios" → "Fill in all required fields"
- "Os valores informados estão fora do intervalo normal" → "The values ​​entered are outside the normal range"
- "Sucesso" → "Success"
- "Medição registrada com sucesso!" → "Measurement recorded successfully!"
- "Não foi possível salvar a medição" → "Could not save measurement"
- "Nova Medição" → "New Measurement"
- "Pressão Sistólica (mmHg) *" → "Systolic Pressure (mmHg) *"
- "Pressão Diastólica (mmHg) *" → "Diastolic Pressure (mmHg) *"
- "Frequência Cardíaca (BPM) *" → "Heart Rate (BPM) *"
- "Observações (opcional)" → "Notes (optional)"
- "Salvar Medição" → "Save Measurement"
- "Cancelar" → "Cancel"

### 2. UserSelectionScreen.tsx
**Portuguese → English**
- "Selecione o Usuário" → "Select User"
- "Nenhum usuário cadastrado. Adicione um novo usuário!" → "No user registered. Add a new user!"
- "+ Adicionar Usuário" → "+ Add User"
- "Novo Usuário" → "New User"
- "Editar Usuário" → "Edit User"
- "Nome" → "Name"
- "Idade" → "Age"
- "Peso (kg)" → "Weight (kg)"
- "Altura (cm)" → "Height (cm)"
- "Preencha todos os campos" → "Fill in all fields"
- "Usuário adicionado com sucesso!" → "User added successfully!"
- "Usuário atualizado com sucesso!" → "User updated successfully!"
- "Não foi possível salvar o usuário" → "Could not save user"
- "Confirmar Exclusão" → "Confirm Deletion"
- "Deseja realmente excluir o usuário {name}? Todas as medições associadas também serão excluídas." → "Do you really want to delete user {name}? All associated measurements will also be deleted."
- "Usuário excluído com sucesso!" → "User deleted successfully!"
- "Não foi possível excluir o usuário" → "Could not delete user"
- "anos" → "years"

### 3. StatisticsScreen.tsx
**Portuguese → English**
- "Não foi possível carregar as estatísticas" → "Could not load statistics"
- "Estatísticas" → "Statistics"
- "Medições Totais" → "Total Measurements"
- "IMC (Índice de Massa Corporal)" → "BMI (Body Mass Index)"
- "Pressão Arterial Média" → "Average Blood Pressure"
- "Sistólica" → "Systolic"
- "Diastólica" → "Diastolic"
- "Frequência Cardíaca Média" → "Average Heart Rate"
- "Classificação Geral" → "General Classification"
- "Sobre as Classificações" → "About Classifications"
- "Hipotensão" → "Hypotension"
- "Pré-Hipertensão" → "Pre-Hypertension"
- "Hipertensão Estágio 1" → "Hypertension Stage 1"
- "Hipertensão Estágio 2" → "Hypertension Stage 2"
- "Crise Hipertensiva" → "Hypertensive Crisis"

### 4. AppNavigator.tsx
Check if there are screen titles to translate:
- "Início" → "Home"
- "Estatísticas" → "Statistics"
- "Usuários" → "Users"

### 5. README.md
Full translation needed - see separate section below.

## Quick Search & Replace Commands

You can use VS Code's "Find in Files" (Ctrl+Shift+F) with these patterns:

```
Erro → Error
Sucesso → Success
Cancelar → Cancel
Salvar → Save
Confirmar Exclusão → Confirm Deletion
Preencha todos os campos → Fill in all fields
não foi possível → could not
```

## README.md Translation

Replace the entire README content with:

```markdown
# Health Pressure - Blood Pressure Monitoring App

React Native app for monitoring blood pressure with multiple users.

## 🎯 Features

- ✅ **User Management**: Add and select multiple users
- ✅ **Measurement Recording**: Store systolic, diastolic pressure and BPM
- ✅ **WHO Classification**: Automatic blood pressure classification
- ✅ **Statistics**: BMI calculation, averages and analysis
- ✅ **Local Database**: SQLite for persistent storage

## 📱 Blood Pressure Classification (WHO/AHA)

- **Hypotension**: <90/60 mmHg
- **Normal**: <120/80 mmHg
- **Pre-Hypertension**: 120-129/80-84 mmHg
- **Hypertension Stage 1**: 130-139/85-89 mmHg
- **Hypertension Stage 2**: 140-179/90-119 mmHg
- **Hypertensive Crisis**: >180/120 mmHg

## 🚀 How to Run

### Prerequisites

- Node.js installed
- Android Studio (for Android emulator) or physical device
- React Native CLI configured

### Installation

```bash
# Dependencies were already installed during project creation
# If you need to reinstall:
npm install
```

### Run on Android

```bash
# Start Metro Bundler
npm start

# In another terminal, run on Android
npm run android
```

### Run on iOS (macOS only)

```bash
# Install iOS dependencies
cd ios && pod install && cd ..

# Run on iOS
npm run ios
```

## 🏗️ Project Structure

```
HealthPressure/
├── src/
│   ├── components/       # Reusable components
│   ├── models/          # TypeScript type definitions
│   ├── navigation/      # React Navigation configuration
│   ├── screens/         # App screens
│   │   ├── AddMeasurementScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── StatisticsScreen.tsx
│   │   └── UserSelectionScreen.tsx
│   ├── services/        # Business logic
│   │   └── DatabaseService.ts
│   └── utils/           # Utilities and helpers
│       └── calculations.ts
├── android/             # Native Android files
├── ios/                # Native iOS files
└── App.tsx             # Entry point
```

## 🛠️ Technologies

- **React Native 0.83.0** - Mobile framework
- **TypeScript** - Static typing
- **React Navigation** - App navigation
- **SQLite** - Local database
- **react-native-vector-icons** - Icons

## 📊 Database Schema

### Users Table
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- age (INTEGER)
- weight (REAL)
- height (REAL)
- createdAt (TEXT)

### Measurements Table
- id (INTEGER PRIMARY KEY)
- userId (INTEGER)
- systolic (INTEGER)
- diastolic (INTEGER)
- heartRate (INTEGER)
- date (TEXT)
- notes (TEXT)

## 🎨 Features

### User Management
- Create multiple user profiles
- Edit user data (name, age, weight, height)
- Delete users and their measurements
- Switch between users

### Measurements
- Add blood pressure readings
- Include heart rate (BPM)
- Add optional notes
- Long-press to delete measurements

### Statistics
- Automatic BMI calculation
- Average blood pressure
- Average heart rate
- WHO blood pressure classification
- Visual classification cards

### Reports
- Generate detailed reports
- Share via email, WhatsApp, etc.
- Include patient data, statistics, and recent measurements

## 📝 License

This project is for educational purposes.

## 👤 Author

Bruno Amaral
```

## Testing After Translation

1. Run the app: `npm start` and `npm run android`
2. Test all screens
3. Verify all error messages appear in English
4. Check that reports are in English
5. Ensure statistics labels are translated

## Committing Changes

```bash
git add .
git commit -m "feat: Convert app from Portuguese to English"
git push origin main
```

## Notes

- The date format functions use `pt-BR` locale - you may want to change to `en-US`
- Consider adding i18n (internationalization) support for future multi-language features
- Test on both Android emulator and physical device
