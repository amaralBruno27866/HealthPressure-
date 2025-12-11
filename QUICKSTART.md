# 🚀 Guia Rápido - Health Pressure

## Primeiros Passos

### 1. Configurar o Ambiente Android

Se ainda não tiver o ambiente configurado:

```bash
# Instalar Android Studio
# Baixar de: https://developer.android.com/studio

# Configurar variáveis de ambiente (adicionar ao seu perfil PowerShell):
$env:ANDROID_HOME = "C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"
```

### 2. Abrir Emulador Android

```bash
# Listar emuladores disponíveis
emulator -list-avds

# Iniciar um emulador
emulator -avd NOME_DO_EMULADOR
```

Ou abra o Android Studio e inicie o emulador pela interface gráfica.

### 3. Executar o App

```bash
# Terminal 1 - Iniciar o Metro Bundler
npm start

# Terminal 2 - Executar no Android (com emulador ou dispositivo conectado)
npm run android
```

### 4. Usar o App

1. **Primeira vez**: Clique em "+ Adicionar Usuário" para criar seu perfil
2. **Adicionar usuário**: Preencha nome, idade, peso (kg) e altura (cm)
3. **Selecionar usuário**: Toque no card do usuário criado
4. **Nova medição**: Clique em "+ Nova Medição" e preencha os valores
5. **Ver estatísticas**: Use a aba "Estatísticas" no rodapé

## 🔧 Comandos Úteis

```bash
# Limpar cache
npm start -- --reset-cache

# Limpar build Android
cd android
./gradlew clean
cd ..

# Reinstalar dependências
rm -rf node_modules
npm install

# Verificar erros TypeScript
npx tsc --noEmit
```

## 📱 Testar no Dispositivo Físico

### Android:
1. Ative o modo desenvolvedor no Android
2. Ative "Depuração USB"
3. Conecte o dispositivo via USB
4. Execute: `npm run android`

## ⚠️ Solução de Problemas Comuns

### Erro de conexão com Metro
```bash
adb reverse tcp:8081 tcp:8081
```

### App não instala
```bash
npm run android -- --reset-cache
```

### Erro no SQLite
Verifique se a dependência foi instalada corretamente:
```bash
npm install react-native-sqlite-storage
```

Para Android, o SQLite já vem incluído no React Native.

## 📚 Estrutura de Dados

### Usuário (User)
- id: number
- name: string
- age: number
- weight: number (kg)
- height: number (cm)

### Medição (Measurement)
- id: number
- userId: number
- systolic: number (mmHg)
- diastolic: number (mmHg)
- heartRate: number (BPM)
- date: string (ISO)
- notes?: string

## 🎯 Próximos Passos

1. Teste todas as funcionalidades
2. Adicione múltiplos usuários
3. Registre medições ao longo do tempo
4. Acompanhe suas estatísticas

---

**Dica**: Pressione e segure uma medição para excluí-la!
