import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Inicializando banco de dados online...')
    
    // Verificar se já existem dados
    const existingData = await prisma.atualizacaoDiaria.findMany()
    
    if (existingData.length > 0) {
      console.log('✅ Banco já possui dados, não é necessário inicializar')
      return NextResponse.json({
        success: true,
        message: 'Banco já inicializado',
        dataCount: existingData.length
      })
    }
    
    // Criar dados iniciais
    const hoje = new Date().toISOString().split('T')[0]
    
    const atualizacaoInicial = await prisma.atualizacaoDiaria.create({
      data: {
        data: hoje,
        valorInicial: 0,
        valorAtual: 0,
        observacoes: JSON.stringify(['Banco inicializado online']),
        status: 'aberto'
      }
    })
    
    console.log('✅ Banco inicializado com sucesso:', atualizacaoInicial.id)
    
    return NextResponse.json({
      success: true,
      message: 'Banco inicializado com sucesso',
      data: atualizacaoInicial
    })
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  try {
    console.log('🔍 Verificando status do banco online...')
    
    const doacoes = await prisma.doacao.findMany()
    const atualizacoes = await prisma.atualizacaoDiaria.findMany()
    
    return NextResponse.json({
      success: true,
      message: 'Status do banco verificado',
      doacoesCount: doacoes.length,
      atualizacoesCount: atualizacoes.length,
      doacoes: doacoes.slice(0, 5), // Primeiras 5 doações
      atualizacoes: atualizacoes
    })
    
  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
