#!/usr/bin/env pwsh
# Auto-translation script for Health Pressure app
# Converts remaining Portuguese text to English

Write-Host "🌍 Starting automatic translation..." -ForegroundColor Cyan

$files = @(
    "src/screens/AddMeasurementScreen.tsx",
    "src/screens/UserSelectionScreen.tsx",
    "src/screens/StatisticsScreen.tsx",
    "src/navigation/AppNavigator.tsx"
)

$translations = @{
    # Common terms
    "Erro" = "Error"
    "Sucesso" = "Success"
    "Cancelar" = "Cancel"
    "Salvar" = "Save"
    "Confirmar Exclusão" = "Confirm Deletion"
    "Excluir" = "Delete"
    
    # Form fields
    "Nome" = "Name"
    "Idade" = "Age"
    "Peso \(kg\)" = "Weight (kg)"
    "Altura \(cm\)" = "Height (cm)"
    "Observações" = "Notes"
    
    # Messages
    "Preencha todos os campos obrigatórios" = "Fill in all required fields"
    "Preencha todos os campos" = "Fill in all fields"
    "Não foi possível carregar" = "Could not load"
    "Não foi possível salvar" = "Could not save"
    "Não foi possível excluir" = "Could not delete"
    
    # AddMeasurementScreen
    "Nova Medição" = "New Measurement"
    "Pressão Sistólica" = "Systolic Pressure"
    "Pressão Diastólica" = "Diastolic Pressure"
    "Frequência Cardíaca" = "Heart Rate"
    "opcional" = "optional"
    "Salvar Medição" = "Save Measurement"
    "Medição registrada com sucesso!" = "Measurement recorded successfully!"
    "Os valores informados estão fora do intervalo normal" = "The values entered are outside the normal range"
    "a medição" = "measurement"
    
    # UserSelectionScreen
    "Selecione o Usuário" = "Select User"
    "Nenhum usuário cadastrado\. Adicione um novo usuário!" = "No user registered. Add a new user!"
    "\+ Adicionar Usuário" = "+ Add User"
    "Novo Usuário" = "New User"
    "Editar Usuário" = "Edit User"
    "Usuário adicionado com sucesso!" = "User added successfully!"
    "Usuário atualizado com sucesso!" = "User updated successfully!"
    "Usuário excluído com sucesso!" = "User deleted successfully!"
    "Deseja realmente excluir o usuário" = "Do you really want to delete user"
    "Todas as medições associadas também serão excluídas\." = "All associated measurements will also be deleted."
    "o usuário" = "user"
    "os usuários" = "users"
    "anos" = "years"
    
    # StatisticsScreen
    "Estatísticas" = "Statistics"
    "Medições Totais" = "Total Measurements"
    "IMC \(Índice de Massa Corporal\)" = "BMI (Body Mass Index)"
    "Pressão Arterial Média" = "Average Blood Pressure"
    "Sistólica" = "Systolic"
    "Diastólica" = "Diastolic"
    "Classificação Geral" = "General Classification"
    "Sobre as Classificações" = "About Classifications"
    "as estatísticas" = "statistics"
    
    # Time
    "às" = "at"
    
    # Others
    "Início" = "Home"
}

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $filePath) {
        Write-Host "📝 Processing $file..." -ForegroundColor Yellow
        
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        $originalContent = $content
        
        foreach ($key in $translations.Keys) {
            $value = $translations[$key]
            $content = $content -replace $key, $value
        }
        
        if ($content -ne $originalContent) {
            Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "✅ Updated $file" -ForegroundColor Green
        } else {
            Write-Host "⏭️  No changes needed for $file" -ForegroundColor Gray
        }
    } else {
        Write-Host "⚠️  File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Translation complete!" -ForegroundColor Green
Write-Host "Run './reload-app.ps1' to test the changes." -ForegroundColor Cyan
