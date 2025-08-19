# 🚀 Deploy no Vercel - Igreja São Raimundo

## ✅ Problemas Resolvidos

### 1. **Erro do Prisma no Vercel**
- ✅ Adicionado `prisma generate` no script de build
- ✅ Configurado PostgreSQL como provider principal
- ✅ Instalado `pg` e `@types/pg` para PostgreSQL

### 2. **Configurações Aplicadas**
- ✅ `package.json`: Build script atualizado
- ✅ `vercel.json`: Configuração otimizada
- ✅ `prisma/schema.prisma`: PostgreSQL como provider

## 🔧 Configuração do Banco de Dados

### **Opção 1: PlanetScale (Recomendado - Gratuito)**
1. Acesse: https://planetscale.com
2. Crie uma conta gratuita
3. Crie um novo banco de dados
4. Copie a URL de conexão
5. Configure no Vercel como variável de ambiente

### **Opção 2: Supabase (Gratuito)**
1. Acesse: https://supabase.com
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Vá em Settings > Database
5. Copie a connection string

### **Opção 3: Neon (Gratuito)**
1. Acesse: https://neon.tech
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a connection string

## 📋 Passos para Deploy no Vercel

### **1. Acesse o Vercel**
- URL: https://vercel.com
- Faça login com sua conta GitHub

### **2. Importe o Projeto**
- Clique em "New Project"
- Selecione o repositório: `brunostersa/saoraimundo`
- Clique em "Import"

### **3. Configure as Variáveis de Ambiente**
```
DATABASE_URL=sua_url_do_banco_aqui
```

### **4. Configure o Build**
- **Framework Preset**: Next.js (deve ser detectado automaticamente)
- **Build Command**: `npm run build` (já configurado)
- **Output Directory**: `.next` (já configurado)
- **Install Command**: `npm install` (já configurado)

### **5. Deploy**
- Clique em "Deploy"
- Aguarde o build completar

## 🗄️ Configuração do Banco PostgreSQL

### **Estrutura da Tabela**
```sql
CREATE TABLE "Doacao" (
  "id" INTEGER NOT NULL,
  "valor" REAL NOT NULL,
  "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "observacao" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Doacao_pkey" PRIMARY KEY ("id")
);
```

### **Prisma Migration (se necessário)**
```bash
npx prisma migrate dev --name init
npx prisma db push
```

## 🔍 Troubleshooting

### **Erro: "Prisma Client not generated"**
- ✅ **Resolvido**: Adicionado `prisma generate` no build script

### **Erro: "Database connection failed"**
- Verifique se a `DATABASE_URL` está correta
- Teste a conexão localmente primeiro

### **Erro: "Build failed"**
- Verifique os logs do Vercel
- Teste o build localmente: `npm run build`

## 📱 URLs do Projeto

- **GitHub**: https://github.com/brunostersa/saoraimundo
- **Vercel**: Será gerada após o deploy
- **Admin**: `/admin` (ex: https://seu-app.vercel.app/admin)

## 🎯 Funcionalidades

- ✅ **Painel Público**: Responsivo para telões da igreja
- ✅ **Painel Admin**: Para registrar totais diários
- ✅ **QR Code**: Para doações
- ✅ **Histórico**: Visualização de doações
- ✅ **Design**: Cores personalizadas da igreja

## 🚀 Status

**PROJETO PRONTO PARA DEPLOY!** 🎉

Todas as configurações necessárias foram aplicadas e testadas localmente.
