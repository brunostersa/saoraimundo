// Banco de dados unificado que alterna entre SQLite e PostgreSQL
import { getDatabaseType } from './database-config'

// Importar ambos os bancos
import * as SQLiteDB from './database-sqlite'
import * as PostgresDB from './database-postgres'

// Re-exportar todas as interfaces
export type {
  Doacao,
  AtualizacaoDiaria,
  Totais,
  CriarDoacaoData,
  CriarAtualizacaoData,
  AtualizarValorData
} from './database-postgres'

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
  return await db.createDoacao(data)
}

export async function deleteDoacao(id: number) {
  const db = getActiveDatabase()
  return await db.deleteDoacao(id)
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
  return await db.criarAtualizacaoDiaria(data)
}

export async function atualizarValorDoDia(data: AtualizarValorData) {
  const db = getActiveDatabase()
  return await db.atualizarValorDoDia(data)
}

export async function getTotais() {
  const db = getActiveDatabase()
  return await db.getTotais()
}

export async function clearData() {
  const db = getActiveDatabase()
  return await db.clearData()
}

export async function getDatabaseStats() {
  const db = getActiveDatabase()
  return await db.getDatabaseStats()
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
