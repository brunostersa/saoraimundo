import { PrismaClient } from '@prisma/client'

// Interface para doações
export interface Doacao {
  id: number
  valor: number
  data: Date
  observacao?: string
  createdAt: Date
  updatedAt: Date
}

// Interface para atualizações diárias
export interface AtualizacaoDiaria {
  id: number
  data: string // YYYY-MM-DD format
  valorInicial: number
  valorAtual: number
  observacoes: string[] // Array de observações
  status: 'aberto' | 'fechado' | string // Permitir outros status
  createdAt: Date
  updatedAt: Date
}

// Interface para totais
export interface Totais {
  totalGeral: number
  totalHoje: number
  statusHoje: 'aberto' | 'fechado' | string // Permitir outros status
}

// Cliente Prisma global
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!(global as { prisma?: PrismaClient }).prisma) {
    (global as { prisma?: PrismaClient }).prisma = new PrismaClient()
  }
  prisma = (global as { prisma?: PrismaClient }).prisma!
}

// Funções para doações
export async function getDoacoes(): Promise<Doacao[]> {
  try {
    const doacoes = await prisma.doacao.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return doacoes.map(d => ({
      ...d,
      observacao: d.observacao || undefined
    }))
  } catch (error) {
    console.error('Erro ao buscar doações:', error)
    return []
  }
}

export async function createDoacao(valor: number, observacao?: string): Promise<Doacao | null> {
  try {
    const doacao = await prisma.doacao.create({
      data: {
        valor,
        observacao: observacao || 'Doação individual'
      }
    })
    return {
      ...doacao,
      observacao: doacao.observacao || undefined
    }
  } catch (error) {
    console.error('Erro ao criar doação:', error)
    return null
  }
}

// Funções para atualizações diárias
export async function getAtualizacoesDiarias(): Promise<AtualizacaoDiaria[]> {
  try {
    const atualizacoes = await prisma.atualizacaoDiaria.findMany({
      orderBy: { data: 'desc' }
    })
    
    return atualizacoes.map((update) => ({
      ...update,
      observacoes: JSON.parse(update.observacoes)
    }))
  } catch (error) {
    console.error('Erro ao buscar atualizações diárias:', error)
    return []
  }
}

export async function getAllAtualizacoesDiarias(): Promise<AtualizacaoDiaria[]> {
  try {
    const atualizacoes = await prisma.atualizacaoDiaria.findMany({
      orderBy: { data: 'desc' }
    })
    
    return atualizacoes.map((update) => ({
      ...update,
      observacoes: JSON.parse(update.observacoes)
    }))
  } catch (error) {
    console.error('Erro ao buscar atualizações diárias:', error)
    return []
  }
}

export async function getAtualizacaoDoDia(data: string): Promise<AtualizacaoDiaria | null> {
  try {
    const atualizacao = await prisma.atualizacaoDiaria.findUnique({
      where: { data }
    })
    
    if (!atualizacao) return null
    
    return {
      ...atualizacao,
      observacoes: JSON.parse(atualizacao.observacoes)
    }
  } catch (error) {
    console.error('Erro ao buscar atualização do dia:', error)
    return null
  }
}

export async function criarAtualizacaoDiaria(data: { data: string; valorInicial: number; observacao?: string }): Promise<AtualizacaoDiaria | null> {
  try {
    const atualizacao = await prisma.atualizacaoDiaria.create({
      data: {
        data: data.data,
        valorInicial: data.valorInicial,
        valorAtual: data.valorInicial,
        observacoes: JSON.stringify([data.observacao || 'Inicialização do dia']),
        status: 'aberto'
      }
    })
    
    return {
      ...atualizacao,
      observacoes: [data.observacao || 'Inicialização do dia']
    }
  } catch (error) {
    console.error('Erro ao criar atualização diária:', error)
    return null
  }
}

export async function createAtualizacaoDiaria(
  data: string,
  valorInicial: number,
  observacao: string
): Promise<AtualizacaoDiaria | null> {
  try {
    const atualizacao = await prisma.atualizacaoDiaria.create({
      data: {
        data,
        valorInicial,
        valorAtual: valorInicial,
        observacoes: JSON.stringify([observacao]),
        status: 'aberto'
      }
    })
    
    return {
      ...atualizacao,
      observacoes: [observacao]
    }
  } catch (error) {
    console.error('Erro ao criar atualização diária:', error)
    return null
  }
}

export async function atualizarValorDoDia(
  data: string,
  novoValor: number,
  observacao: string
): Promise<AtualizacaoDiaria | null> {
  try {
    const atualizacao = await prisma.atualizacaoDiaria.findUnique({
      where: { data }
    })
    
    if (!atualizacao) return null
    
    const observacoes = JSON.parse(atualizacao.observacoes)
    observacoes.push(observacao)
    
    const atualizada = await prisma.atualizacaoDiaria.update({
      where: { data },
      data: {
        valorAtual: novoValor,
        observacoes: JSON.stringify(observacoes),
        updatedAt: new Date()
      }
    })
    
    return {
      ...atualizada,
      observacoes
    }
  } catch (error) {
    console.error('Erro ao atualizar valor do dia:', error)
    return null
  }
}

export async function fecharDia(data: string, valorFinal?: number, observacao?: string): Promise<AtualizacaoDiaria | null> {
  try {
    const atualizacao = await prisma.atualizacaoDiaria.findUnique({
      where: { data }
    })
    
    if (!atualizacao) return null
    
    const observacoes = JSON.parse(atualizacao.observacoes)
    if (observacao) {
      observacoes.push(observacao)
    }
    
    const atualizada = await prisma.atualizacaoDiaria.update({
      where: { data },
      data: {
        valorAtual: valorFinal || atualizacao.valorAtual,
        observacoes: JSON.stringify(observacoes),
        status: 'fechado',
        updatedAt: new Date()
      }
    })
    
    return {
      ...atualizada,
      observacoes
    }
  } catch (error) {
    console.error('Erro ao fechar dia:', error)
    return null
  }
}

// Função para calcular totais
export async function getTotais(): Promise<Totais> {
  try {
    const hoje = new Date().toISOString().split('T')[0]
    
    // Buscar atualização de hoje
    const atualizacaoHoje = await getAtualizacaoDoDia(hoje)
    
    // Calcular total geral (soma de TODOS os dias - abertos e fechados)
    const todasAtualizacoes = await getAllAtualizacoesDiarias()
    const totalGeral = todasAtualizacoes
      .reduce((sum, a) => sum + a.valorAtual, 0)  // ✅ Soma TODOS os dias
    
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

// Função para limpar todos os dados
export async function clearData(): Promise<void> {
  try {
    await prisma.doacao.deleteMany()
    await prisma.atualizacaoDiaria.deleteMany()
    console.log('✅ Todos os dados foram limpos')
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error)
    throw error
  }
}

// Função para exportar dados (backup)
export async function exportData(): Promise<{ doacoes: Doacao[], atualizacoes: AtualizacaoDiaria[] }> {
  try {
    const doacoes = await getDoacoes()
    const atualizacoes = await getAllAtualizacoesDiarias()
    
    return { doacoes, atualizacoes }
  } catch (error) {
    console.error('Erro ao exportar dados:', error)
    throw error
  }
}

// Função para importar dados (restore)
export async function importData(data: { doacoes: Doacao[], atualizacoes: AtualizacaoDiaria[] }): Promise<void> {
  try {
    // Limpar dados existentes
    await clearData()
    
    // Importar doações
    for (const doacao of data.doacoes) {
      await prisma.doacao.create({
        data: {
          valor: doacao.valor,
          data: doacao.data,
          observacao: doacao.observacao,
          createdAt: doacao.createdAt,
          updatedAt: doacao.updatedAt
        }
      })
    }
    
    // Importar atualizações diárias
    for (const atualizacao of data.atualizacoes) {
      await prisma.atualizacaoDiaria.create({
        data: {
          data: atualizacao.data,
          valorInicial: atualizacao.valorInicial,
          valorAtual: atualizacao.valorAtual,
          observacoes: JSON.stringify(atualizacao.observacoes),
          status: atualizacao.status,
          createdAt: atualizacao.createdAt,
          updatedAt: atualizacao.updatedAt
        }
      })
    }
    
    console.log('✅ Dados importados com sucesso')
  } catch (error) {
    console.error('❌ Erro ao importar dados:', error)
    throw error
  }
}
