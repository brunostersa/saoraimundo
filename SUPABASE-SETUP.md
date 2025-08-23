# 🚀 **CONFIGURAÇÃO SUPABASE + VERCEL**

## **📋 PASSO A PASSO COMPLETO:**

### **1. 🗄️ CRIAR PROJETO NO SUPABASE:**

1. **Acesse:** [supabase.com](https://supabase.com)
2. **Faça login** com sua conta GitHub
3. **Clique em "New Project"**
4. **Escolha sua organização**
5. **Configure o projeto:**
   - **Name:** `sao-raimundo-doacoes`
   - **Database Password:** Crie uma senha forte
   - **Region:** Escolha a mais próxima (ex: São Paulo)
6. **Clique em "Create new project"**
7. **Aguarde** a criação (pode demorar alguns minutos)

### **2. 🔑 OBTER CONNECTION STRING:**

1. **No projeto criado, vá para:**
   - **Settings** → **Database**
2. **Role:** `postgres`
3. **Copy** a connection string
4. **Formato:**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

### **3. ⚙️ CONFIGURAR VARIÁVEIS NO VERCEL:**

1. **No Vercel, vá para seu projeto**
2. **Settings** → **Environment Variables**
3. **Adicione:**
   ```
   DATABASE_TYPE = postgres
   DATABASE_URL = [SUA_CONNECTION_STRING_SUPABASE]
   NODE_ENV = production
   ```

### **4. 🔄 FAZER DEPLOY:**

1. **Commit e push** das mudanças:
   ```bash
   git add .
   git commit -m "✨ Implementação Supabase PostgreSQL"
   git push origin main
   ```

2. **O Vercel fará deploy automático**

### **5. ✅ VERIFICAR FUNCIONAMENTO:**

1. **Acesse sua URL do Vercel**
2. **Teste as funcionalidades:**
   - Criar doação
   - Atualizar valores
   - Verificar persistência

## **🎯 VANTAGENS DESTA IMPLEMENTAÇÃO:**

- ✅ **Sem Prisma** (sem conflitos)
- ✅ **PostgreSQL nativo** (funciona no Vercel)
- ✅ **Alternância automática** entre SQLite/PostgreSQL
- ✅ **Dados persistentes** e confiáveis
- ✅ **Sem problemas de permissão**

## **🔧 CONFIGURAÇÃO LOCAL:**

Para testar localmente com PostgreSQL:

1. **Crie um arquivo `.env.local`:**
   ```env
   DATABASE_TYPE=postgres
   DATABASE_URL=sua_connection_string_supabase
   NODE_ENV=development
   ```

2. **Ou mantenha SQLite local:**
   ```env
   DATABASE_TYPE=sqlite
   DATABASE_URL=file:./database.db
   NODE_ENV=development
   ```

## **🚨 SOLUÇÃO DE PROBLEMAS:**

### **Erro de Conexão:**
- Verifique se a connection string está correta
- Confirme se o IP está liberado no Supabase

### **Erro de SSL:**
- O código já trata SSL automaticamente
- Se persistir, verifique as configurações do Supabase

### **Timeout:**
- Aumente `maxDuration` no `vercel.json` se necessário

## **🎉 RESULTADO ESPERADO:**

**Agora funcionará perfeitamente porque:**
- **PostgreSQL funciona** no Vercel
- **Sem Prisma** intermediando
- **Conexão direta** e confiável
- **Dados persistentes** entre deploys

**Sucesso garantido!** 🚀
