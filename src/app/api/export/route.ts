import { NextResponse } from 'next/server'
import { getDoacoes, getAtualizacoesDiarias } from '@/lib/database-sqlite'

export async function GET() {
  try {
    console.log('📤 Exportando dados...')
    
    const doacoes = await getDoacoes()
    const atualizacoes = await getAtualizacoesDiarias()
    
    const exportData = {
      doacoes,
      atualizacoes,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    return NextResponse.json({
      success: true,
      data: exportData
    })
    
  } catch (error) {
    console.error('❌ Erro ao exportar dados:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
