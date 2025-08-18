# Igreja São Raimundo - Sistema de Doações

Sistema moderno para gerenciar e exibir doações da Igreja São Raimundo, desenvolvido com Next.js, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

### Painel Público (para telões)
- **Contador em tempo real** das doações do dia
- **Total geral** de todas as doações
- **Histórico visual** dos últimos 7 dias
- **QR Code** para acesso ao painel administrativo
- **Atualização automática** a cada 30 segundos
- Design responsivo e otimizado para telões

### Painel Administrativo
- **Formulário simples** para registrar doações
- **Validação** de valores
- **Observações opcionais** para cada doação
- **Lista das doações recentes**
- **Interface intuitiva** para uso em dispositivos móveis

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados local
- **date-fns** - Manipulação de datas
- **react-qr-code** - Geração de QR codes

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd sao-raimundo
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o banco de dados**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   - Painel público: http://localhost:3000
   - Painel administrativo: http://localhost:3000/admin

## 🗄️ Estrutura do Banco

O sistema utiliza um banco SQLite com a seguinte estrutura:

```sql
Doacao {
  id: Int (Primary Key)
  valor: Float
  data: DateTime
  observacao: String? (opcional)
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 📱 Uso

### Para Telões (Painel Público)
1. Acesse a URL principal em tela cheia
2. O painel atualiza automaticamente a cada 30 segundos
3. Exibe contadores em tempo real e histórico visual

### Para Administradores
1. Acesse `/admin` ou escaneie o QR Code
2. Preencha o valor da doação
3. Adicione observação (opcional)
4. Clique em "Registrar Doação"

## 🎨 Personalização

### Cores e Tema
- O sistema usa um tema azul escuro com gradientes
- Cores podem ser personalizadas no arquivo `tailwind.config.js`
- Componentes utilizam classes utilitárias do Tailwind

### Logo
- Substitua o arquivo `logo.png` na raiz do projeto
- O logo será exibido no cabeçalho das páginas

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
- O projeto é compatível com qualquer plataforma que suporte Next.js
- Configure a variável `DATABASE_URL` para seu banco de dados

## 📊 Monitoramento

- **Logs** são exibidos no console do servidor
- **Erros** são capturados e exibidos na interface
- **Validações** garantem integridade dos dados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é desenvolvido para uso da Igreja São Raimundo.

## 📞 Suporte

Para dúvidas ou suporte técnico, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para a Igreja São Raimundo**
