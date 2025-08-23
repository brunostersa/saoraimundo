import { NextResponse } from 'next/server'
import { getDoacoes, getAtualizacoesDiarias } from '@/lib/database'
import type { AtualizacaoDiaria } from '@/lib/database-sqlite'

export async function GET() {
  try {
    console.log('📤 Exportando dados...')
    
    const doacoes = await getDoacoes()
    const resultadoAtualizacoes = await getAtualizacoesDiarias()
    
    // Lidar com diferentes tipos de retorno (SQLite vs PostgreSQL)
    let atualizacoes: AtualizacaoDiaria[] = []
    if (Array.isArray(resultadoAtualizacoes)) {
      // SQLite retorna array direto
      atualizacoes = resultadoAtualizacoes
    } else if (resultadoAtualizacoes && typeof resultadoAtualizacoes === 'object' && 'atualizacoes' in resultadoAtualizacoes) {
      // PostgreSQL retorna objeto com atualizacoes e totais
      atualizacoes = (resultadoAtualizacoes as { atualizacoes: AtualizacaoDiaria[] }).atualizacoes || []
    }
    
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
