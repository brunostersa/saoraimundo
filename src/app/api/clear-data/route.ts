import { NextResponse } from 'next/server'
import { clearData } from '@/lib/database-sqlite'

export async function POST() {
  try {
    console.log('🗑️ Limpando todos os dados...')
    
    await clearData()
    
    return NextResponse.json({
      success: true,
      message: 'Todos os dados foram limpos com sucesso!',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
