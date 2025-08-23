import { NextResponse } from 'next/server'
import { getDoacoes, getTotais } from '@/lib/database'
import { getDatabaseType } from '@/lib/database-config'

export async function GET() {
  try {
    console.log('🔍 DEBUG: Investigando problema dos totais...')
    
    const dbType = getDatabaseType()
    console.log('📊 Tipo de banco:', dbType)
    
    // Buscar todas as doações
    const doacoes = await getDoacoes()
    console.log('💰 Doações encontradas:', doacoes.length)
    console.log('📋 Dados das doações:', JSON.stringify(doacoes, null, 2))
    
    // Calcular totais manualmente
    const totalGeral = doacoes.reduce((sum, doacao) => sum + doacao.valor, 0)
    console.log('🧮 Total geral calculado manualmente:', totalGeral)
    
    // Buscar totais via função
    const totais = await getTotais()
    console.log('📊 Totais via função getTotais:', totais)
    
    // Verificar data de hoje
    const hoje = new Date().toISOString().split('T')[0]
    const doacoesHoje = doacoes.filter(d => d.data === hoje)
    const totalHoje = doacoesHoje.reduce((sum, doacao) => sum + doacao.valor, 0)
    console.log('🗓️ Data de hoje:', hoje)
    console.log('📅 Doações de hoje:', doacoesHoje.length)
    console.log('🧮 Total de hoje calculado manualmente:', totalHoje)
    
    return NextResponse.json({
      success: true,
      debug: {
        databaseType: dbType,
        doacoesCount: doacoes.length,
        doacoes: doacoes,
        totalGeralManual: totalGeral,
        totalHojeManual: totalHoje,
        dataHoje: hoje,
        totaisViaFuncao: totais
      }
    })
    
  } catch (error) {
    console.error('❌ Erro no debug:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
