# Health Pressure - Blood Pressure Monitoring App

React Native app for monitoring blood pressure with multiple users.

## 🎯 Features

- ✅ **User Management**: Add and select multiple users
- ✅ **Measurement Recording**: Store systolic, diastolic pressure and BPM
- ✅ **WHO Classification**: Automatic blood pressure classification
- ✅ **Statistics**: BMI calculation, averages and analysis
- ✅ **Local Database**: SQLite for persistent storage
- ✅ **Share Reports**: Generate and share detailed health reports

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
cd ios
pod install
cd ..
npm run ios
```

## 📂 Estrutura do Projeto

```
HealthPressure/
├── src/
│   ├── models/           # Interfaces TypeScript
│   ├── screens/          # Telas do app
│   │   ├── UserSelectionScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── AddMeasurementScreen.tsx
│   │   └── StatisticsScreen.tsx
│   ├── services/         # Serviços (DatabaseService)
│   ├── utils/            # Funções utilitárias (cálculos)
│   └── navigation/       # Configuração de navegação
├── App.tsx               # Componente principal
└── package.json
```

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework mobile
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação entre telas
- **SQLite** - Banco de dados local
- **React Native Safe Area Context** - Gerenciamento de áreas seguras

## 📊 Funcionalidades Detalhadas

### Tela de Usuários
- Adicionar novos usuários com nome, idade, peso e altura
- Selecionar usuário para visualizar suas medições
- Cálculo automático do IMC

### Tela Inicial (Home)
- Lista de todas as medições do usuário
- Visualização com código de cores por classificação
- Excluir medições (pressionar e segurar)
- Botão para adicionar nova medição

### Tela de Nova Medição
- Campos para sistólica, diastólica e BPM
- Classificação em tempo real
- Campo opcional para observações
- Validação de valores

### Tela de Estatísticas
- Total de medições registradas
- IMC e classificação
- Médias de pressão arterial e BPM
- Classificação geral baseada nas médias
- Guia de referência das classificações

## 🎨 Características

- Interface limpa e intuitiva
- Código de cores para fácil identificação
- Validação de dados
- Armazenamento persistente
- Suporte a múltiplos usuários

## 📝 Próximas Melhorias (Sugestões)

- Gráficos de evolução temporal
- Exportar dados em PDF/CSV
- Lembretes para medições
- Integração com wearables
- Modo escuro
- Backup na nuvem

## 👨‍💻 Desenvolvido por

Bruno - Dezembro 2025

---

**Nota**: Este app é para fins de monitoramento pessoal. Sempre consulte um profissional de saúde para orientações médicas.
