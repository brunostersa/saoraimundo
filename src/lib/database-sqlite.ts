import Database from 'better-sqlite3'
import path from 'path'

// Interfaces
export interface Doacao {
  id: number
  valor: number
  data: Date
  observacao?: string
  createdAt: Date
  updatedAt: Date
}

export interface AtualizacaoDiaria {
  id: number
  data: string // YYYY-MM-DD format
  valorInicial: number
  valorAtual: number
  observacoes: string[] // Array de observações
  status: 'aberto' | 'fechado' | string
  createdAt: Date
  updatedAt: Date
}

export interface Totais {
  totalGeral: number
  totalHoje: number
  statusHoje: 'aberto' | 'fechado' | string
}

// Tipos para as linhas do banco
interface DoacaoRow {
  id: number
  valor: number
  data: string
  observacao?: string
  createdAt: string
  updatedAt: string
}

interface AtualizacaoRow {
  id: number
  data: string
  valorInicial: number
  valorAtual: number
  observacoes: string
  status: string
  createdAt: string
  updatedAt: string
}

// Classe para gerenciar o banco SQLite
class SQLiteDatabase {
  private db: Database.Database

  constructor() {
    const dbPath = path.join(process.cwd(), 'database.db')
    this.db = new Database(dbPath)
    this.initDatabase()
  }

  private initDatabase() {
    // Criar tabelas se não existirem
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS Doacao (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        valor REAL NOT NULL,
        data DATETIME DEFAULT CURRENT_TIMESTAMP,
        observacao TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS AtualizacaoDiaria (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT UNIQUE NOT NULL,
        valorInicial REAL NOT NULL,
        valorAtual REAL NOT NULL,
        observacoes TEXT NOT NULL,
        status TEXT DEFAULT 'aberto',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)
  }

  // Funções para doações
  getDoacoes(): Doacao[] {
    const stmt = this.db.prepare('SELECT * FROM Doacao ORDER BY createdAt DESC')
    const rows = stmt.all() as DoacaoRow[]
    return rows.map(row => ({
      id: row.id,
      valor: row.valor,
      data: new Date(row.data),
      observacao: row.observacao,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }))
  }

  createDoacao(valor: number, observacao?: string): Doacao | null {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO Doacao (valor, observacao) 
        VALUES (?, ?)
      `)
      const result = stmt.run(valor, observacao || 'Doação individual')
      
      if (result.changes > 0) {
        return this.getDoacaoById(result.lastInsertRowid as number)
      }
      return null
    } catch (error) {
      console.error('Erro ao criar doação:', error)
      return null
    }
  }

  private getDoacaoById(id: number): Doacao | null {
    const stmt = this.db.prepare('SELECT * FROM Doacao WHERE id = ?')
    const row = stmt.get(id) as DoacaoRow | undefined
    if (!row) return null
    
    return {
      id: row.id,
      valor: row.valor,
      data: new Date(row.data),
      observacao: row.observacao,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }
  }

  // Funções para atualizações diárias
  getAtualizacoesDiarias(): AtualizacaoDiaria[] {
    const stmt = this.db.prepare('SELECT * FROM AtualizacaoDiaria ORDER BY data DESC')
    const rows = stmt.all() as AtualizacaoRow[]
    return rows.map(row => ({
      id: row.id,
      data: row.data,
      valorInicial: row.valorInicial,
      valorAtual: row.valorAtual,
      observacoes: JSON.parse(row.observacoes),
      status: row.status,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }))
  }

  getAtualizacaoDoDia(data: string): AtualizacaoDiaria | null {
    const stmt = this.db.prepare('SELECT * FROM AtualizacaoDiaria WHERE data = ?')
    const row = stmt.get(data) as AtualizacaoRow | undefined
    if (!row) return null
    
    return {
      id: row.id,
      data: row.data,
      valorInicial: row.valorInicial,
      valorAtual: row.valorAtual,
      observacoes: JSON.parse(row.observacoes),
      status: row.status,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }
  }

  criarAtualizacaoDiaria(data: { data: string; valorInicial: number; observacao?: string }): AtualizacaoDiaria | null {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO AtualizacaoDiaria (data, valorInicial, valorAtual, observacoes) 
        VALUES (?, ?, ?, ?)
      `)
      const observacoes = JSON.stringify([data.observacao || 'Inicialização do dia'])
      const result = stmt.run(data.data, data.valorInicial, data.valorInicial, observacoes)
      
      if (result.changes > 0) {
        return this.getAtualizacaoDoDia(data.data)
      }
      return null
    } catch (error) {
      console.error('Erro ao criar atualização diária:', error)
      return null
    }
  }

  atualizarValorDoDia(data: string, novoValor: number, observacao: string): AtualizacaoDiaria | null {
    try {
      const atual = this.getAtualizacaoDoDia(data)
      if (!atual) return null
      
      const observacoes = [...atual.observacoes, observacao]
      const stmt = this.db.prepare(`
        UPDATE AtualizacaoDiaria 
        SET valorAtual = ?, observacoes = ?, updatedAt = CURRENT_TIMESTAMP 
        WHERE data = ?
      `)
      const result = stmt.run(novoValor, JSON.stringify(observacoes), data)
      
      if (result.changes > 0) {
        return this.getAtualizacaoDoDia(data)
      }
      return null
    } catch (error) {
      console.error('Erro ao atualizar valor do dia:', error)
      return null
    }
  }

  fecharDia(data: string, valorFinal?: number, observacao?: string): AtualizacaoDiaria | null {
    try {
      const atual = this.getAtualizacaoDoDia(data)
      if (!atual) return null
      
      const observacoes = [...atual.observacoes]
      if (observacao) {
        observacoes.push(observacao)
      }
      
      const stmt = this.db.prepare(`
        UPDATE AtualizacaoDiaria 
        SET valorAtual = ?, observacoes = ?, status = 'fechado', updatedAt = CURRENT_TIMESTAMP 
        WHERE data = ?
      `)
      const valorFinalAtual = valorFinal || atual.valorAtual
      const result = stmt.run(valorFinalAtual, JSON.stringify(observacoes), data)
      
      if (result.changes > 0) {
        return this.getAtualizacaoDoDia(data)
      }
      return null
    } catch (error) {
      console.error('Erro ao fechar dia:', error)
      return null
    }
  }

  // Função para calcular totais
  getTotais(): Totais {
    try {
      const hoje = new Date().toISOString().split('T')[0]
      const atualizacaoHoje = this.getAtualizacaoDoDia(hoje)
      
      // Calcular total geral
      const stmt = this.db.prepare('SELECT SUM(valorAtual) as total FROM AtualizacaoDiaria')
      const result = stmt.get() as { total: number | null }
      const totalGeral = result.total || 0
      
      // Total de hoje
      const totalHoje = atualizacaoHoje ? atualizacaoHoje.valorAtual : 0
      const statusHoje = atualizacaoHoje ? atualizacaoHoje.status : 'fechado'
      
      return {
        totalGeral,
        totalHoje,
        statusHoje
      }
    } catch (error) {
      console.error('Erro ao calcular totais:', error)
      return {
        totalGeral: 0,
        totalHoje: 0,
        statusHoje: 'fechado'
      }
    }
  }

  // Função para limpar dados
  clearData(): void {
    try {
      this.db.exec('DELETE FROM Doacao; DELETE FROM AtualizacaoDiaria;')
      console.log('✅ Todos os dados foram limpos')
    } catch (error) {
      console.error('❌ Erro ao limpar dados:', error)
      throw error
    }
  }

  // Fechar conexão
  close(): void {
    this.db.close()
  }
}

// Instância global
let dbInstance: SQLiteDatabase

export function getDatabase(): SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = new SQLiteDatabase()
  }
  return dbInstance
}

// Funções de conveniência
export const getDoacoes = () => getDatabase().getDoacoes()
export const createDoacao = (valor: number, observacao?: string) => getDatabase().createDoacao(valor, observacao)
export const getAtualizacoesDiarias = () => getDatabase().getAtualizacoesDiarias()
export const getAtualizacaoDoDia = (data: string) => getDatabase().getAtualizacaoDoDia(data)
export const criarAtualizacaoDiaria = (data: { data: string; valorInicial: number; observacao?: string }) => getDatabase().criarAtualizacaoDiaria(data)
export const atualizarValorDoDia = (data: string, novoValor: number, observacao: string) => getDatabase().atualizarValorDoDia(data, novoValor, observacao)
export const fecharDia = (data: string, valorFinal?: number, observacao?: string) => getDatabase().fecharDia(data, valorFinal, observacao)
export const getTotais = () => getDatabase().getTotais()
export const clearData = () => getDatabase().clearData()
