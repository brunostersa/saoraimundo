# 🚀 **CONFIGURAÇÃO FINAL PARA PRODUÇÃO - Igreja São Raimundo**

## 🎯 **SITUAÇÃO ATUAL:**
✅ **Projeto funcionando localmente** com SQLite  
❌ **Banco online não configurado** (ainda aponta para local)  
✅ **Código preparado** para alternar automaticamente  

## 🔧 **PASSO A PASSO PARA RESOLVER:**

### **1️⃣ CRIAR BANCO POSTGRESQL ONLINE:**

#### **Opção A: Supabase (Recomendado - Gratuito)**
1. Acesse: [https://supabase.com](https://supabase.com)
2. Login com GitHub
3. **New Project** → `sao-raimundo-doacoes`
4. **Database Password**: Crie uma senha forte
5. **Region**: São Paulo (mais próxima)
6. **Create new project**
7. Aguarde criação (2-5 minutos)

#### **Opção B: PlanetScale (Gratuito)**
1. Acesse: [https://planetscale.com](https://planetscale.com)
2. Login com GitHub
3. **New Database** → `sao-raimundo-doacoes`
4. **Region**: São Paulo
5. **Create database**

#### **Opção C: Neon (Gratuito)**
1. Acesse: [https://neon.tech](https://neon.tech)
2. Login com GitHub
3. **New Project** → `sao-raimundo-doacoes`
4. **Region**: São Paulo
5. **Create project**

### **2️⃣ OBTER CONNECTION STRING:**

#### **Supabase:**
- Projeto → **Settings** → **Database**
- **Connection string** → **URI**
- Formato: `postgresql://postgres:[SENHA]@db.[PROJETO].supabase.co:5432/postgres`

#### **PlanetScale:**
- Database → **Connect** → **Connect with Prisma**
- Copie a **DATABASE_URL**

#### **Neon:**
- Project → **Connection Details**
- Copie a **Connection string**

### **3️⃣ CONFIGURAR NO VERCEL:**

1. Acesse: [https://vercel.com](https://vercel.com)
2. Seu projeto → **Settings** → **Environment Variables**
3. **Add** as seguintes variáveis:

```bash
# OBRIGATÓRIO
DATABASE_TYPE = postgres
DATABASE_URL = [SUA_CONNECTION_STRING_AQUI]
NODE_ENV = production

# OPCIONAL
NEXT_PUBLIC_APP_URL = https://seu-app.vercel.app
```

### **4️⃣ FAZER DEPLOY:**

```bash
# Commit das mudanças
git add .
git commit -m "🚀 Configuração PostgreSQL para produção"
git push origin main

# O Vercel fará deploy automático
```

### **5️⃣ VERIFICAR FUNCIONAMENTO:**

1. **Acesse sua URL do Vercel**
2. **Teste o endpoint**: `/api/test-connection`
3. **Crie uma doação** para testar persistência
4. **Verifique os logs** no Vercel

## 🔍 **TESTE DE CONEXÃO:**

### **Local (SQLite):**
```bash
curl http://localhost:3000/api/test-connection
# Deve retornar: "type": "sqlite"
```

### **Produção (PostgreSQL):**
```bash
curl https://seu-app.vercel.app/api/test-connection
# Deve retornar: "type": "postgres"
```

## 🎯 **RESULTADO ESPERADO:**

✅ **Local**: SQLite funcionando  
✅ **Produção**: PostgreSQL funcionando  
✅ **Alternância automática** baseada em NODE_ENV  
✅ **Dados persistentes** entre deploys  
✅ **Sistema funcionando** 24/7 online  

## 🚨 **SOLUÇÃO DE PROBLEMAS:**

### **Erro: "Database connection failed"**
- Verifique se a `DATABASE_URL` está correta
- Confirme se o IP está liberado no banco
- Teste a conexão localmente primeiro

### **Erro: "Build failed"**
- Verifique os logs do Vercel
- Teste o build local: `npm run build`
- Confirme se todas as variáveis estão configuradas

### **Erro: "Prisma Client not generated"**
- ✅ **Já resolvido** no código atual
- O sistema não usa mais Prisma

## 📱 **URLS IMPORTANTES:**

- **GitHub**: https://github.com/brunostersa/saoraimundo
- **Vercel**: Será gerada após deploy
- **Admin**: `/admin` (ex: https://seu-app.vercel.app/admin)
- **Teste**: `/api/test-connection`

## 🎉 **APÓS CONFIGURAR:**

**O sistema funcionará perfeitamente porque:**
- ✅ **PostgreSQL funciona** no Vercel
- ✅ **Código preparado** para alternância automática
- ✅ **Sem Prisma** intermediando
- ✅ **Conexão direta** e confiável
- ✅ **Dados persistentes** entre deploys

**Sucesso garantido!** 🚀

---

## 📞 **PRECISA DE AJUDA?**

1. **Verifique os logs** do Vercel
2. **Teste localmente** primeiro
3. **Use o endpoint** `/api/test-connection`
4. **Confirme as variáveis** de ambiente
5. **Verifique a connection string** do banco

**O projeto está 95% pronto, só falta configurar o banco online!** 🎯
