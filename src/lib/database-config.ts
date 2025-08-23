// Configuração do banco de dados
export const DATABASE_CONFIG = {
  // Tipo de banco a ser usado
  type: process.env.DATABASE_TYPE || 'sqlite', // 'sqlite' | 'postgres'
  
  // Configurações SQLite (local)
  sqlite: {
    path: process.env.DATABASE_URL || './database.db'
  },
  
  // Configurações PostgreSQL (online)
  postgres: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production',
    maxConnections: 20,
    idleTimeout: 30000,
    connectionTimeout: 2000
  }
}

// Função para determinar qual banco usar
export function getDatabaseType(): 'sqlite' | 'postgres' {
  // Se temos DATABASE_URL que parece ser PostgreSQL, usar PostgreSQL
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql://')) {
    return 'postgres'
  }
  
  // Se temos DATABASE_TYPE definido, usar o especificado
  if (process.env.DATABASE_TYPE) {
    return process.env.DATABASE_TYPE as 'sqlite' | 'postgres'
  }
  
  // Se estamos em produção e temos qualquer DATABASE_URL, usar PostgreSQL
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    return 'postgres'
  }
  
  // Padrão: SQLite para desenvolvimento
  return 'sqlite'
}

// Função para verificar se o banco está configurado
export function isDatabaseConfigured(): boolean {
  const type = getDatabaseType()
  
  if (type === 'postgres') {
    return !!process.env.DATABASE_URL
  }
  
  return true // SQLite sempre funciona localmente
}

// Função para obter mensagem de status do banco
export function getDatabaseStatus(): string {
  const type = getDatabaseType()
  const configured = isDatabaseConfigured()
  
  if (!configured) {
    return '❌ Banco não configurado'
  }
  
  if (type === 'postgres') {
    return '✅ PostgreSQL configurado'
  }
  
  return '✅ SQLite local'
}
