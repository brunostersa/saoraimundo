// Tipos unificados para SQLite e PostgreSQL
export interface AtualizacaoDiaria {
  id: number
  data: string
  valorInicial: number
  valorFinal?: number
  observacao?: string
  createdAt: string
  updatedAt: string
  status?: string // Opcional para compatibilidade
}

export interface Doacao {
  id: number
  valor: number
  data: string
  observacao?: string
  createdAt: string
  updatedAt: string
}

export interface Totais {
  totalGeral: number
  totalHoje: number
  statusHoje: 'sem_registro' | 'com_registro'
}

// Interfaces para operações
export interface CriarDoacaoData {
  valor: number
  observacao?: string
}

export interface CriarAtualizacaoData {
  data: string
  valorInicial: number
  observacao?: string
}

export interface AtualizarValorData {
  data: string
  novoValor: number
  observacao: string
}

// Tipo de retorno unificado para getAtualizacoesDiarias
export type AtualizacoesResult = AtualizacaoDiaria[] | { atualizacoes: AtualizacaoDiaria[], totais: Totais }
