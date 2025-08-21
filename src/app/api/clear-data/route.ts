import { NextRequest, NextResponse } from 'next/server'
import { clearData } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    console.log('🗑️ Solicitando limpeza de dados...')
    
    // Limpar dados do cache global
    await clearData()
    
    console.log('✅ Dados limpos com sucesso')
    
    return NextResponse.json({
      success: true,
      message: 'Todos os dados foram limpos com sucesso!',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro ao limpar dados do sistema',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
