// Banco de dados unificado que alterna entre SQLite e PostgreSQL
import { getDatabaseType } from './database-config'

// Importar ambos os bancos
import * as SQLiteDB from './database-sqlite'
import * as PostgresDB from './database-postgres'

// Importar tipos
import type {
  Doacao,
  AtualizacaoDiaria,
  Totais,
  CriarDoacaoData,
  CriarAtualizacaoData,
  AtualizarValorData
} from './types'

// Re-exportar tipos
export type {
  Doacao,
  AtualizacaoDiaria,
  Totais,
  CriarDoacaoData,
  CriarAtualizacaoData,
  AtualizarValorData
}

// Função para obter o banco ativo
function getActiveDatabase() {
  const type = getDatabaseType()
  
  if (type === 'postgres') {
    return PostgresDB
  }
  
  return SQLiteDB
}

// Funções de conveniência que usam o banco ativo
export async function getDoacoes() {
  const db = getActiveDatabase()
  return await db.getDoacoes()
}

export async function createDoacao(data: CriarDoacaoData) {
  const db = getActiveDatabase()
  const type = getDatabaseType()
  
  if (type === 'postgres') {
    return await (db as any).createDoacao(data)
  } else {
    // SQLite espera (valor, observacao)
    return await (db as any).createDoacao(data.valor, data.observacao)
  }
}

export async function deleteDoacao(id: number) {
  const db = getActiveDatabase()
  const type = getDatabaseType()
  
  if (type === 'postgres') {
    return await (db as any).deleteDoacao(id)
  } else {
    // SQLite não tem deleteDoacao, retornar false
    console.warn('❌ deleteDoacao não implementado no SQLite')
    return false
  }
}

export async function getAtualizacoesDiarias() {
  const db = getActiveDatabase()
  return await db.getAtualizacoesDiarias()
}

export async function getAtualizacaoDoDia(data: string) {
  const db = getActiveDatabase()
  return await db.getAtualizacaoDoDia(data)
}

export async function criarAtualizacaoDiaria(data: CriarAtualizacaoData) {
  const db = getActiveDatabase()
  const type = getDatabaseType()
  
  if (type === 'postgres') {
    return await (db as any).criarAtualizacaoDiaria(data)
  } else {
    // SQLite espera (data, valorInicial, observacao)
    return await (db as any).criarAtualizacaoDiaria(data.data, data.valorInicial, data.observacao)
  }
}

export async function atualizarValorDoDia(data: AtualizarValorData) {
  const db = getActiveDatabase()
  const type = getDatabaseType()
  
  if (type === 'postgres') {
    return await (db as any).atualizarValorDoDia(data)
  } else {
    // SQLite espera (data, novoValor, observacao)
    return await (db as any).atualizarValorDoDia(data.data, data.novoValor, data.observacao)
  }
}

export async function getTotais() {
  const db = getActiveDatabase()
  return await db.getTotais()
}

export async function clearData() {
  const db = getActiveDatabase()
  return await db.clearData()
}

export async function clearDoacoes() {
  const db = getActiveDatabase()
  return await db.clearDoacoes()
}

export async function getDatabaseStats() {
  const db = getActiveDatabase()
  const type = getDatabaseType()
  
  if (type === 'postgres') {
    return await (db as any).getDatabaseStats()
  } else {
    // SQLite não tem getDatabaseStats, retornar dados básicos
    const doacoes = await db.getDoacoes()
    const atualizacoes = await db.getAtualizacoesDiarias()
    return {
      doacoes: doacoes.length,
      atualizacoes: Array.isArray(atualizacoes) ? atualizacoes.length : 0
    }
  }
}

// Função para obter informações do banco ativo
export function getDatabaseInfo() {
  const type = getDatabaseType()
  return {
    type,
    name: type === 'postgres' ? 'PostgreSQL' : 'SQLite',
    environment: process.env.NODE_ENV || 'development'
  }
}
