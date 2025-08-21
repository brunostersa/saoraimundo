import { NextRequest, NextResponse } from 'next/server'
import { importData } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Solicitando importação de dados...')
    const body = await request.json()
    
    if (!body.data || !body.data.doacoes) {
      return NextResponse.json({
        success: false,
        error: 'Dados inválidos para importação'
      }, { status: 400 })
    }
    
    await importData(body.data)
    
    console.log('✅ Dados importados com sucesso')
    return NextResponse.json({
      success: true,
      message: 'Dados importados com sucesso!',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao importar dados:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao importar dados para o sistema',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
