#!/bin/bash

# Script de sincronização automática para o sistema de doações
# Pode ser executado como cronjob para manter dados sincronizados

# Configurações
VERCEL_URL="https://saoraimundo.vercel.app"  # Substitua pela sua URL do Vercel
SYNC_ENDPOINT="/api/sync"
LOG_FILE="/tmp/doacoes-sync.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] 🔄 Iniciando sincronização automática..." >> $LOG_FILE

# Verificar status de sincronização
echo "[$DATE] 📊 Verificando status de sincronização..." >> $LOG_FILE
STATUS_RESPONSE=$(curl -s -X POST "$VERCEL_URL$SYNC_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"action": "check-sync"}')

if [ $? -eq 0 ]; then
    echo "[$DATE] ✅ Status verificado com sucesso" >> $LOG_FILE
    echo "[$DATE] 📋 Resposta: $STATUS_RESPONSE" >> $LOG_FILE
else
    echo "[$DATE] ❌ Erro ao verificar status" >> $LOG_FILE
fi

# Forçar sincronização se necessário
echo "[$DATE] 🔄 Forçando sincronização..." >> $LOG_FILE
SYNC_RESPONSE=$(curl -s -X POST "$VERCEL_URL$SYNC_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"action": "force-sync"}')

if [ $? -eq 0 ]; then
    echo "[$DATE] ✅ Sincronização forçada concluída" >> $LOG_FILE
    echo "[$DATE] 📋 Resposta: $SYNC_RESPONSE" >> $LOG_FILE
else
    echo "[$DATE] ❌ Erro na sincronização forçada" >> $LOG_FILE
fi

# Verificar status final
echo "[$DATE] 🔍 Verificando status final..." >> $LOG_FILE
FINAL_STATUS=$(curl -s -X POST "$VERCEL_URL$SYNC_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"action": "status"}')

if [ $? -eq 0 ]; then
    echo "[$DATE] ✅ Status final verificado" >> $LOG_FILE
    echo "[$DATE] 📋 Resposta: $FINAL_STATUS" >> $LOG_FILE
else
    echo "[$DATE] ❌ Erro ao verificar status final" >> $LOG_FILE
fi

echo "[$DATE] 🎯 Sincronização automática concluída" >> $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE

# Manter apenas os últimos 1000 logs
tail -n 1000 $LOG_FILE > $LOG_FILE.tmp && mv $LOG_FILE.tmp $LOG_FILE
