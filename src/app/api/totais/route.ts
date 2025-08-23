import { NextResponse } from 'next/server'
import { getTotais } from '@/lib/database'

export async function GET() {
  try {
    console.log('💰 Buscando totais de doações...')
    
    const totais = await getTotais()
    
    console.log('✅ Totais obtidos:', totais)
    
    return NextResponse.json({
      success: true,
      data: totais
    })
    
  } catch (error) {
    console.error('❌ Erro ao buscar totais:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
