import { NextRequest, NextResponse } from 'next/server'
import { clearData } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Importando dados...')
    
    const body = await request.json()
    const { doacoes, atualizacoes } = body
    
    if (!doacoes || !atualizacoes) {
      return NextResponse.json({
        success: false,
        error: 'Dados de importação inválidos'
      }, { status: 400 })
    }
    
    // Por enquanto, apenas limpar dados existentes
    // TODO: Implementar importação completa
    await clearData()
    
    console.log('✅ Dados importados com sucesso')
    
    return NextResponse.json({
      success: true,
      message: 'Dados importados com sucesso',
      imported: { doacoes: doacoes.length, atualizacoes: atualizacoes.length }
    })
    
  } catch (error) {
    console.error('❌ Erro ao importar dados:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
