# 🔄 GitHub Actions - Sincronização Automática

## 🎯 Configuração Necessária

### **1. Configurar Secret no GitHub**

1. Vá para seu repositório no GitHub
2. Clique em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**
4. Configure:
   - **Name**: `VERCEL_URL`
   - **Value**: `https://sua-app.vercel.app` (sua URL real)

### **2. Estrutura dos Workflows**

```
.github/
└── workflows/
    ├── sync-database.yml     # Sincronização automática
    └── README.md            # Este arquivo
```

## 🚀 Como Funciona

### **Execução Automática**
- **Frequência**: A cada 30 minutos
- **Trigger**: `schedule: cron: '*/30 * * * *'`
- **Ação**: Verifica e sincroniza base de dados

### **Execução Manual**
- **Trigger**: `workflow_dispatch`
- **Localização**: GitHub → Actions → "🔄 Sincronizar Base de Dados" → Run workflow
- **Opção**: Forçar sincronização completa

### **Execução no Deploy**
- **Trigger**: `push` para branch `main`
- **Ação**: Sincroniza após cada deploy

## 📊 Monitoramento

### **1. Ver Execuções**
- GitHub → Actions → "🔄 Sincronizar Base de Dados"
- Ver histórico completo de execuções
- Logs detalhados de cada passo

### **2. Status das Execuções**
- ✅ **Verde**: Sucesso
- ❌ **Vermelho**: Falha
- 🟡 **Amarelo**: Em execução

### **3. Logs Detalhados**
- Status inicial da sincronização
- Execução da sincronização
- Verificação final
- Resumo completo

## 🔧 Personalização

### **Alterar Frequência**
```yaml
# A cada 15 minutos
schedule:
  - cron: '*/15 * * * *'

# A cada hora
schedule:
  - cron: '0 * * * *'

# A cada 6 horas
schedule:
  - cron: '0 */6 * * *'
```

### **Adicionar Notificações**
```yaml
- name: 📧 Notificar Slack
  if: always()
  run: |
    # Código para notificar Slack/Discord/Email
```

### **Executar em Múltiplos Ambientes**
```yaml
strategy:
  matrix:
    environment: [production, staging]
```

## ⚠️ Considerações

### **Rate Limiting**
- Vercel: Máximo 1000 requests/hora (plano gratuito)
- GitHub Actions: 2000 minutos/mês (plano gratuito)
- **Recomendação**: Não executar mais que a cada 30 minutos

### **Custos**
- **GitHub Actions**: Gratuito até 2000 minutos/mês
- **Vercel**: Gratuito até 1000 requests/hora
- **Sincronização**: ~1-2 minutos por execução

### **Segurança**
- Secrets são criptografados
- Logs não mostram valores sensíveis
- Execução em ambiente isolado

## 🎉 Benefícios

- ✅ **Automático**: Sem intervenção manual
- ✅ **Confiável**: Execução garantida
- ✅ **Monitorável**: Logs detalhados
- ✅ **Flexível**: Execução manual quando necessário
- ✅ **Gratuito**: Dentro dos limites do plano gratuito
- ✅ **Integrado**: Funciona com GitHub e Vercel

## 🚨 Troubleshooting

### **Erro 429 (Rate Limit)**
- Aumentar intervalo entre execuções
- Verificar logs do Vercel
- Considerar upgrade do plano

### **Timeout na Sincronização**
- Verificar conectividade com banco
- Aumentar timeout se necessário
- Verificar logs do Supabase

### **Falha na Verificação**
- Verificar se a API está funcionando
- Verificar logs do Vercel
- Testar endpoint manualmente

---

**🚀 Com o GitHub Actions configurado, sua base estará sempre sincronizada automaticamente!**
