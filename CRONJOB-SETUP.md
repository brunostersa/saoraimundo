# 🕐 Configuração do Cronjob de Sincronização

## 🎯 Objetivo

Manter os dados do sistema de doações sempre sincronizados entre o banco de dados (Supabase) e o cache local do Vercel.

## 🔧 Como Funciona

### **1. API de Sincronização**
- **Endpoint**: `/api/sync`
- **Métodos**: GET e POST
- **Ações disponíveis**:
  - `check-sync` - Verifica se cache e banco estão sincronizados
  - `force-sync` - Força sincronização completa
  - `clear-cache` - Limpa cache local
  - `status` - Mostra status completo

### **2. Script de Cronjob**
- **Arquivo**: `scripts/sync-cron.sh`
- **Função**: Executa sincronização automática
- **Logs**: Salva em `/tmp/doacoes-sync.log`

## 📋 Configuração do Cronjob

### **Passo 1: Tornar o script executável**
```bash
chmod +x scripts/sync-cron.sh
```

### **Passo 2: Editar o script**
```bash
nano scripts/sync-cron.sh
```

**Alterar a URL do Vercel:**
```bash
VERCEL_URL="https://sua-app.vercel.app"  # Sua URL real
```

### **Passo 3: Configurar o cronjob**
```bash
crontab -e
```

**Adicionar uma das opções:**

#### **Opção A: Sincronização a cada 5 minutos**
```bash
*/5 * * * * /caminho/completo/para/scripts/sync-cron.sh
```

#### **Opção B: Sincronização a cada hora**
```bash
0 * * * * /caminho/completo/para/scripts/sync-cron.sh
```

#### **Opção C: Sincronização a cada 6 horas**
```bash
0 */6 * * * /caminho/completo/para/scripts/sync-cron.sh
```

### **Passo 4: Verificar se está funcionando**
```bash
# Ver logs
tail -f /tmp/doacoes-sync.log

# Ver cronjobs ativos
crontab -l
```

## 🧪 Teste Manual

### **1. Verificar Status**
```bash
curl -X POST https://sua-app.vercel.app/api/sync \
  -H "Content-Type: application/json" \
  -d '{"action": "check-sync"}'
```

### **2. Forçar Sincronização**
```bash
curl -X POST https://sua-app.vercel.app/api/sync \
  -H "Content-Type: application/json" \
  -d '{"action": "force-sync"}'
```

### **3. Ver Status Completo**
```bash
curl -X POST https://sua-app.vercel.app/api/sync \
  -H "Content-Type: application/json" \
  -d '{"action": "status"}'
```

## 🔍 Monitoramento

### **Logs do Cronjob**
```bash
# Ver logs em tempo real
tail -f /tmp/doacoes-sync.log

# Ver últimos 50 logs
tail -n 50 /tmp/doacoes-sync.log

# Buscar por erros
grep "❌" /tmp/doacoes-sync.log
```

### **Verificar Cronjob**
```bash
# Listar cronjobs ativos
crontab -l

# Ver logs do sistema cron
grep CRON /var/log/syslog
```

## 🚀 Alternativas ao Cronjob

### **1. GitHub Actions (Recomendado para Vercel)**
Criar `.github/workflows/sync.yml`:
```yaml
name: Sync Database
on:
  schedule:
    - cron: '*/30 * * * *'  # A cada 30 minutos
  workflow_dispatch:  # Execução manual

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Sync Database
        run: |
          curl -X POST ${{ secrets.VERCEL_URL }}/api/sync \
            -H "Content-Type: application/json" \
            -d '{"action": "force-sync"}'
```

### **2. Vercel Cron Jobs (Se disponível)**
```json
{
  "crons": [
    {
      "path": "/api/sync?action=force-sync",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

## ⚠️ Considerações Importantes

### **1. Rate Limiting**
- Vercel tem limites de requisições
- Não executar mais que a cada 5 minutos
- Monitorar logs para erros 429

### **2. Segurança**
- Script deve ser executado em servidor seguro
- Considerar autenticação na API se necessário
- Logs podem conter informações sensíveis

### **3. Performance**
- Sincronização pode demorar alguns segundos
- Banco pode estar temporariamente indisponível
- Script tem timeout e retry automático

## 🎉 Benefícios

- ✅ **Dados sempre sincronizados**
- ✅ **Cache atualizado automaticamente**
- ✅ **Problemas detectados rapidamente**
- ✅ **Logs para troubleshooting**
- ✅ **Execução automática e confiável**

---

**🚀 Com o cronjob configurado, seus dados estarão sempre sincronizados entre o banco e o cache!**
