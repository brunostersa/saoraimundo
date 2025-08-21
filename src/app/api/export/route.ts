import { NextResponse } from 'next/server'
import { exportData } from '@/lib/database'

export async function GET() {
  try {
    console.log('📤 Solicitando exportação de dados...')
    const data = await exportData()
    
    console.log('✅ Dados exportados com sucesso')
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao exportar dados:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao exportar dados do sistema',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
