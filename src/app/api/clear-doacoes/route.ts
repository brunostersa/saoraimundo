import { NextResponse } from 'next/server'
import { clearDoacoes } from '@/lib/database'

export async function POST() {
  try {
    console.log('🗑️ Limpando doações individuais...')
    await clearDoacoes()
    console.log('✅ Doações individuais limpas com sucesso')
    
    return NextResponse.json({
      success: true,
      message: 'Doações individuais foram limpas com sucesso!'
    })
  } catch (error) {
    console.error('❌ Erro ao limpar doações:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
