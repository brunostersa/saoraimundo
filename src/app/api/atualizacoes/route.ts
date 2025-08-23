import { NextRequest, NextResponse } from 'next/server'
import { 
  getAtualizacoesDiarias, 
  getAtualizacaoDoDia, 
  criarAtualizacaoDiaria, 
  atualizarValorDoDia, 
  getTotais 
} from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const data = searchParams.get('data')
    
    if (data) {
      // Buscar atualização de uma data específica
      console.log('📅 Buscando atualização para data:', data)
      const atualizacao = await getAtualizacaoDoDia(data)
      
      if (!atualizacao) {
        return NextResponse.json({
          success: false,
          message: 'Data não encontrada',
          data: null
        }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        data: atualizacao
      })
    }
    
    // Buscar todas as atualizações
    console.log('📅 Buscando todas as atualizações diárias')
    const resultado = await getAtualizacoesDiarias()
    
    // Lidar com diferentes tipos de retorno (SQLite vs PostgreSQL)
    let atualizacoes: any[] = []
    if (Array.isArray(resultado)) {
      // SQLite retorna array direto
      atualizacoes = resultado
    } else if (resultado && typeof resultado === 'object' && 'atualizacoes' in resultado) {
      // PostgreSQL retorna objeto com atualizacoes e totais
      atualizacoes = resultado.atualizacoes || []
    }
    
    // Se não há atualizações, criar uma inicial
    if (atualizacoes.length === 0) {
      console.log('🚀 Banco vazio detectado, criando atualização inicial...')
      const hoje = new Date().toISOString().split('T')[0]
      
      try {
        // Tentar inicializar o banco PostgreSQL se necessário
        const dbType = process.env.DATABASE_TYPE || 'sqlite'
        if (dbType === 'postgres') {
          try {
            const { getDatabase } = await import('@/lib/database-postgres')
            const db = getDatabase()
            await db.initialize()
            console.log('✅ Banco PostgreSQL inicializado')
          } catch (initError) {
            console.error('❌ Erro ao inicializar PostgreSQL:', initError)
          }
        }
        
        const atualizacaoInicial = await criarAtualizacaoDiaria({
          data: hoje,
          valorInicial: 0,
          observacao: 'Banco inicializado automaticamente'
        })
        
        if (atualizacaoInicial) {
          console.log('✅ Atualização inicial criada:', atualizacaoInicial.id)
          atualizacoes = [atualizacaoInicial]
        }
      } catch (initError) {
        console.error('❌ Erro ao criar atualização inicial:', initError)
      }
    }
    
    const totais = await getTotais()
    
    return NextResponse.json({
      success: true,
      data: {
        atualizacoes,
        totais,
        count: atualizacoes.length
      }
    })
    
  } catch (error) {
    console.error('❌ Erro ao buscar atualizações:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body
    
    console.log('📝 Ação solicitada:', action)
    console.log('📋 Dados recebidos:', data)
    
    switch (action) {
      case 'criar':
        // Criar nova atualização diária
        if (!data.data || data.valorInicial === undefined) {
          return NextResponse.json({
            success: false,
            error: 'Data e valor inicial são obrigatórios'
          }, { status: 400 })
        }
        
        const novaAtualizacao = await criarAtualizacaoDiaria({
          data: data.data,
          valorInicial: data.valorInicial,
          observacao: data.observacao
        })
        
        return NextResponse.json({
          success: true,
          message: 'Atualização diária criada com sucesso',
          data: novaAtualizacao
        }, { status: 201 })
        
      case 'atualizar':
        // Atualizar valor do dia
        if (!data.data || data.novoValor === undefined || !data.observacao) {
          return NextResponse.json({
            success: false,
            error: 'Data, novo valor e observação são obrigatórios'
          }, { status: 400 })
        }
        
        const atualizacao = await atualizarValorDoDia({
          data: data.data,
          novoValor: data.novoValor,
          observacao: data.observacao
        })
        
        return NextResponse.json({
          success: true,
          message: 'Valor do dia atualizado com sucesso',
          data: atualizacao
        })
        

      case 'totais':
        // Obter totais
        const totais = await getTotais()
        
        return NextResponse.json({
          success: true,
          data: totais
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Ação não reconhecida. Use: criar, atualizar, ou totais'
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('❌ Erro na operação:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
