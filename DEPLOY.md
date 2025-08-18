# 🚀 Guia de Deploy - Sistema de Doações São Raimundo

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Vercel (recomendado) ou outra plataforma de hosting
- Banco de dados (SQLite para desenvolvimento, PostgreSQL/MySQL para produção)

## 🎯 Deploy no Vercel (Recomendado)

### 1. Preparação do Repositório
```bash
# Certifique-se de que o projeto está no GitHub/GitLab
git add .
git commit -m "Preparando para deploy"
git push origin main
```

### 2. Conectar ao Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub/GitLab
3. Clique em "New Project"
4. Importe o repositório `sao-raimundo`

### 3. Configuração das Variáveis de Ambiente
No painel do Vercel, configure:

```env
# Para SQLite (desenvolvimento)
DATABASE_URL="file:./dev.db"

# Para PostgreSQL (produção - recomendado)
DATABASE_URL="postgresql://usuario:senha@host:porta/banco"
```

### 4. Deploy Automático
- O Vercel fará deploy automático a cada push
- Acesse a URL fornecida pelo Vercel

## 🗄️ Configuração do Banco de Dados

### Opção 1: SQLite (Desenvolvimento)
```bash
# O banco será criado automaticamente
npm run db:push
```

### Opção 2: PostgreSQL (Produção)
1. Crie um banco PostgreSQL (Vercel Postgres, Supabase, etc.)
2. Configure a variável `DATABASE_URL`
3. Execute as migrações:
```bash
npm run db:push
```

### Opção 3: MySQL (Produção)
1. Crie um banco MySQL
2. Atualize o `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```
3. Configure a variável `DATABASE_URL`
4. Execute as migrações

## 🔧 Scripts Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor local
npm run build        # Build de produção
npm run start        # Inicia servidor de produção

# Banco de dados
npm run db:studio    # Abre Prisma Studio
npm run db:push      # Sincroniza banco
npm run db:generate  # Gera cliente Prisma
npm run db:reset     # Reseta banco (cuidado!)
```

## 📱 Configuração para Telões

### 1. Modo Tela Cheia
- Acesse a URL principal em um navegador
- Pressione F11 (Chrome) ou Cmd+Shift+F (Safari)
- Configure para não dormir

### 2. Atualização Automática
- O painel atualiza a cada 30 segundos
- Para mudar o intervalo, edite `src/app/page.tsx`

### 3. Responsividade
- O design é otimizado para telões
- Funciona em qualquer resolução

## 🔒 Segurança

### 1. Variáveis de Ambiente
- Nunca commite arquivos `.env`
- Use variáveis de ambiente no servidor
- Configure `.gitignore` corretamente

### 2. Banco de Dados
- Use conexões seguras (SSL)
- Configure usuários com permissões mínimas
- Faça backups regulares

### 3. API
- Considere adicionar autenticação para `/admin`
- Implemente rate limiting se necessário
- Valide todas as entradas

## 📊 Monitoramento

### 1. Logs
- Vercel: Painel de controle
- Outros: Configure ferramentas de logging

### 2. Métricas
- Performance: Vercel Analytics
- Erros: Sentry ou similar
- Uptime: UptimeRobot ou similar

## 🚨 Troubleshooting

### Problema: Banco não conecta
```bash
# Verifique a variável DATABASE_URL
echo $DATABASE_URL

# Teste a conexão
npm run db:studio
```

### Problema: Build falha
```bash
# Limpe cache
rm -rf .next
npm run build
```

### Problema: Página não carrega
- Verifique os logs do servidor
- Confirme se a API está funcionando
- Teste localmente primeiro

## 📞 Suporte

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Prisma**: [pris.ly/d/support](https://pris.ly/d/support)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

## 🎉 Próximos Passos

1. **Teste localmente** antes do deploy
2. **Configure o banco** de produção
3. **Teste todas as funcionalidades**
4. **Configure monitoramento**
5. **Documente para usuários finais**

---

**Boa sorte com o deploy! 🚀**
