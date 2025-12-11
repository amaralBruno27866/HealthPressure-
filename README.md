# Health Pressure - App de Controle de Pressão Arterial

Aplicativo React Native para monitoramento de pressão arterial com múltiplos usuários.

## 🎯 Funcionalidades

- ✅ **Gerenciamento de Usuários**: Adicionar e selecionar múltiplos usuários
- ✅ **Registro de Medições**: Armazenar pressão sistólica, diastólica e BPM
- ✅ **Classificação OMS**: Classificação automática da pressão arterial
- ✅ **Estatísticas**: Cálculo de IMC, médias e análises
- ✅ **Banco de Dados Local**: SQLite para armazenamento persistente

## 📱 Classificação da Pressão Arterial (OMS/AHA)

- **Hipotensão**: <90/60 mmHg
- **Normal**: <120/80 mmHg
- **Pré-Hipertensão**: 120-129/80-84 mmHg
- **Hipertensão Estágio 1**: 130-139/85-89 mmHg
- **Hipertensão Estágio 2**: 140-179/90-119 mmHg
- **Crise Hipertensiva**: >180/120 mmHg

## 🚀 Como Executar

### Pré-requisitos

- Node.js instalado
- Android Studio (para emulador Android) ou dispositivo físico
- React Native CLI configurado

### Instalação

```bash
# As dependências já foram instaladas durante a criação do projeto
# Caso precise reinstalar:
npm install
```

### Executar no Android

```bash
# Iniciar o Metro Bundler
npm start

# Em outro terminal, executar no Android
npm run android
```

### Executar no iOS (apenas macOS)

```bash
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
