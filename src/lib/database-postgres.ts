import { Pool, PoolClient } from 'pg'

// Interfaces
export interface Doacao {
  id: number
  valor: number
  observacao?: string
  data: string
  createdAt: string
}

export interface AtualizacaoDiaria {
  id: number
  data: string
  valorInicial: number
  valorAtual: number
  observacoes: string[]
  createdAt: string
  updatedAt: string
}

export interface Totais {
  totalGeral: number
  totalHoje: number
  statusHoje: 'sem_registro' | 'com_registro'
}

export interface CriarDoacaoData {
  valor: number
  observacao?: string
  data?: string
}

export interface CriarAtualizacaoData {
  data: string
  valorInicial: number
  observacao?: string
}

export interface AtualizarValorData {
  data: string
  novoValor: number
  observacao?: string
}

// Classe principal do banco PostgreSQL
export class PostgreSQLDatabase {
  private pool: Pool

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }

  // Inicializar banco e tabelas
  async initialize(): Promise<void> {
    const client = await this.pool.connect()
    
    try {
      // Criar tabela de doações
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Doacao" (
          id SERIAL PRIMARY KEY,
          valor DECIMAL(10,2) NOT NULL,
          observacao TEXT,
          data DATE NOT NULL DEFAULT CURRENT_DATE,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Criar tabela de atualizações diárias
      await client.query(`
        CREATE TABLE IF NOT EXISTS "AtualizacaoDiaria" (
          id SERIAL PRIMARY KEY,
          data DATE UNIQUE NOT NULL,
          "valorInicial" DECIMAL(10,2) NOT NULL,
          "valorAtual" DECIMAL(10,2) NOT NULL,
          observacoes JSONB NOT NULL DEFAULT '[]',
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `)

      console.log('✅ Banco PostgreSQL inicializado com sucesso')
    } catch (error) {
      console.error('❌ Erro ao inicializar banco PostgreSQL:', error)
      throw error
    } finally {
      client.release()
    }
  }

  // Testar conexão
  async testConnection(): Promise<boolean> {
    try {
      const client = await this.pool.connect()
      await client.query('SELECT NOW()')
      client.release()
      return true
    } catch (error) {
      console.error('❌ Erro na conexão PostgreSQL:', error)
      return false
    }
  }

  // Fechar conexões
  async close(): Promise<void> {
    await this.pool.end()
  }

  // Garantir que as tabelas existam
  private async ensureTablesExist(client: PoolClient): Promise<void> {
    try {
      // Criar tabela de doações
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Doacao" (
          id SERIAL PRIMARY KEY,
          valor DECIMAL(10,2) NOT NULL,
          observacao TEXT,
          data DATE NOT NULL DEFAULT CURRENT_DATE,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Criar tabela de atualizações diárias
      await client.query(`
        CREATE TABLE IF NOT EXISTS "AtualizacaoDiaria" (
          id SERIAL PRIMARY KEY,
          data DATE UNIQUE NOT NULL,
          "valorInicial" DECIMAL(10,2) NOT NULL,
          "valorAtual" DECIMAL(10,2) NOT NULL,
          observacoes JSONB NOT NULL DEFAULT '[]',
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `)
    } catch (error) {
      console.error('❌ Erro ao criar tabelas:', error)
      // Não lançar erro para não quebrar a aplicação
    }
  }

  // ===== DOAÇÕES =====

  async getDoacoes(): Promise<Doacao[]> {
    const client = await this.pool.connect()
    
    try {
      // Verificar se as tabelas existem e criar se necessário
      await this.ensureTablesExist(client)
      
      const result = await client.query(`
        SELECT id, valor, observacao, data, "createdAt"
        FROM "Doacao"
        ORDER BY "createdAt" DESC
      `)
      
      return result.rows.map(row => ({
        ...row,
        valor: parseFloat(row.valor),
        data: row.data.toISOString().split('T')[0],
        createdAt: row.createdAt.toISOString()
      }))
    } finally {
      client.release()
    }
  }

  async createDoacao(data: CriarDoacaoData): Promise<number> {
    const client = await this.pool.connect()
    
    try {
      const result = await client.query(`
        INSERT INTO "Doacao" (valor, observacao, data)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [data.valor, data.observacao || null, data.data || new Date().toISOString().split('T')[0]])
      
      return result.rows[0].id
    } finally {
      client.release()
    }
  }

  async deleteDoacao(id: number): Promise<boolean> {
    const client = await this.pool.connect()
    
    try {
      const result = await client.query(`
        DELETE FROM "Doacao"
        WHERE id = $1
      `, [id])
      
      return result.rowCount ? result.rowCount > 0 : false
    } finally {
      client.release()
    }
  }

  // ===== ATUALIZAÇÕES DIÁRIAS =====

  async getAtualizacoesDiarias(): Promise<{ atualizacoes: AtualizacaoDiaria[], totais: Totais }> {
    const client = await this.pool.connect()
    
    try {
      // Verificar se as tabelas existem e criar se necessário
      await this.ensureTablesExist(client)
      
      // Buscar todas as atualizações
      const atualizacoesResult = await client.query(`
        SELECT id, data, "valorInicial", "valorAtual", observacoes, "createdAt", "updatedAt"
        FROM "AtualizacaoDiaria"
        ORDER BY data DESC
      `)

      const atualizacoes = atualizacoesResult.rows.map(row => ({
        ...row,
        valorInicial: parseFloat(row.valorInicial),
        valorAtual: parseFloat(row.valorAtual),
        observacoes: Array.isArray(row.observacoes) ? row.observacoes : [],
        data: row.data.toISOString().split('T')[0],
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
      }))

      // Calcular totais
      const totais = await this.calcularTotais(client)

      return { atualizacoes, totais }
    } finally {
      client.release()
    }
  }

  async getAtualizacaoDoDia(data: string): Promise<AtualizacaoDiaria | null> {
    const client = await this.pool.connect()
    
    try {
      const result = await client.query(`
        SELECT id, data, "valorInicial", "valorAtual", observacoes, "createdAt", "updatedAt"
        FROM "AtualizacaoDiaria"
        WHERE data = $1
      `, [data])
      
      if (result.rows.length === 0) return null
      
      const row = result.rows[0]
      return {
        ...row,
        valorInicial: parseFloat(row.valorInicial),
        valorAtual: parseFloat(row.valorAtual),
        observacoes: Array.isArray(row.observacoes) ? row.observacoes : [],
        data: row.data.toISOString().split('T')[0],
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
      }
    } finally {
      client.release()
    }
  }

  async criarAtualizacaoDiaria(data: CriarAtualizacaoData): Promise<number> {
    const client = await this.pool.connect()
    
    try {
      const observacoes = [data.observacao || 'Inicialização do dia']
      
      const result = await client.query(`
        INSERT INTO "AtualizacaoDiaria" (data, "valorInicial", "valorAtual", observacoes)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [data.data, data.valorInicial, data.valorInicial, observacoes])
      
      return result.rows[0].id
    } finally {
      client.release()
    }
  }

  async atualizarValorDoDia(data: AtualizarValorData): Promise<boolean> {
    const client = await this.pool.connect()
    
    try {
      // Buscar atualização existente
      const atualizacao = await this.getAtualizacaoDoDia(data.data)
      
      if (!atualizacao) {
        // Se não existir, criar uma nova
        await this.criarAtualizacaoDiaria({
          data: data.data,
          valorInicial: 0,
          observacao: data.observacao || 'Criação automática'
        })
      }
      
      // Atualizar valor e adicionar observação
      const observacoes = atualizacao?.observacoes || []
      if (data.observacao) {
        observacoes.push(data.observacao)
      }
      
      const result = await client.query(`
        UPDATE "AtualizacaoDiaria"
        SET "valorAtual" = $1, observacoes = $2, "updatedAt" = CURRENT_TIMESTAMP
        WHERE data = $3
      `, [data.novoValor, observacoes, data.data])
      
      return result.rowCount ? result.rowCount > 0 : false
    } finally {
      client.release()
    }
  }

  // ===== TOTAIS =====

  async getTotais(): Promise<Totais> {
    const client = await this.pool.connect()
    
    try {
      return await this.calcularTotais(client)
    } finally {
      client.release()
    }
  }

  private async calcularTotais(client: PoolClient): Promise<Totais> {
    // Total geral (soma de todas as doações)
    const doacoesResult = await client.query(`
      SELECT COALESCE(SUM(valor), 0) as total
      FROM "Doacao"
    `)
    
    const totalGeral = parseFloat(doacoesResult.rows[0].total)
    
    // Total de hoje
    const hoje = new Date().toISOString().split('T')[0]
    const hojeResult = await client.query(`
      SELECT COALESCE(SUM(valor), 0) as total
      FROM "Doacao"
      WHERE data = $1
    `, [hoje])
    
    const totalHoje = parseFloat(hojeResult.rows[0].total)
    
    // Status de hoje
    const statusHoje: 'sem_registro' | 'com_registro' = totalHoje > 0 ? 'com_registro' : 'sem_registro'
    
    return { totalGeral, totalHoje, statusHoje }
  }

  // ===== UTILIDADES =====

  async clearData(): Promise<void> {
    const client = await this.pool.connect()
    
    try {
      await client.query('DELETE FROM "Doacao"')
      await client.query('DELETE FROM "AtualizacaoDiaria"')
      console.log('✅ Todos os dados foram limpos')
    } finally {
      client.release()
    }
  }

  async getDatabaseStats(): Promise<{ doacoes: number, atualizacoes: number }> {
    const client = await this.pool.connect()
    
    try {
      const doacoesResult = await client.query('SELECT COUNT(*) as count FROM "Doacao"')
      const atualizacoesResult = await client.query('SELECT COUNT(*) as count FROM "AtualizacaoDiaria"')
      
      return {
        doacoes: parseInt(doacoesResult.rows[0].count),
        atualizacoes: parseInt(atualizacoesResult.rows[0].count)
      }
    } finally {
      client.release()
    }
  }
}

// Instância singleton
let database: PostgreSQLDatabase | null = null

export function getDatabase(): PostgreSQLDatabase {
  if (!database) {
    database = new PostgreSQLDatabase()
  }
  return database
}

// Funções de conveniência
export async function getDoacoes(): Promise<Doacao[]> {
  const db = getDatabase()
  return await db.getDoacoes()
}

export async function createDoacao(data: CriarDoacaoData): Promise<number> {
  const db = getDatabase()
  return await db.createDoacao(data)
}

export async function deleteDoacao(id: number): Promise<boolean> {
  const db = getDatabase()
  return await db.deleteDoacao(id)
}

export async function getAtualizacoesDiarias(): Promise<{ atualizacoes: AtualizacaoDiaria[], totais: Totais }> {
  const db = getDatabase()
  return await db.getAtualizacoesDiarias()
}

export async function getAtualizacaoDoDia(data: string): Promise<AtualizacaoDiaria | null> {
  const db = getDatabase()
  return await db.getAtualizacaoDoDia(data)
}

export async function criarAtualizacaoDiaria(data: CriarAtualizacaoData): Promise<number> {
  const db = getDatabase()
  return await db.criarAtualizacaoDiaria(data)
}

export async function atualizarValorDoDia(data: AtualizarValorData): Promise<boolean> {
  const db = getDatabase()
  return await db.atualizarValorDoDia(data)
}

export async function getTotais(): Promise<Totais> {
  const db = getDatabase()
  return await db.getTotais()
}

export async function clearData(): Promise<void> {
  const db = getDatabase()
  return await db.clearData()
}

export async function getDatabaseStats(): Promise<{ doacoes: number, atualizacoes: number }> {
  const db = getDatabase()
  return await db.getDatabaseStats()
}
