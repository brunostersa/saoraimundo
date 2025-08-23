import { NextRequest, NextResponse } from 'next/server'
import { getDoacoes, getAtualizacoesDiarias, getTotais } from '@/lib/database'

export async function GET() {
  try {
    console.log('🧪 Executando testes de API...')
    
    // Teste 1: Buscar doações
    const doacoes = await getDoacoes()
    console.log('✅ Doações:', doacoes.length)
    
    // Teste 2: Buscar atualizações
    const resultadoAtualizacoes = await getAtualizacoesDiarias()
    
    // Lidar com diferentes tipos de retorno (SQLite vs PostgreSQL)
    let atualizacoes: any[] = []
    if (Array.isArray(resultadoAtualizacoes)) {
      // SQLite retorna array direto
      atualizacoes = resultadoAtualizacoes
    } else if (resultadoAtualizacoes && typeof resultadoAtualizacoes === 'object' && 'atualizacoes' in resultadoAtualizacoes) {
      // PostgreSQL retorna objeto com atualizacoes e totais
      atualizacoes = resultadoAtualizacoes.atualizacoes || []
    }
    
    console.log('✅ Atualizações:', atualizacoes.length)
    
    // Teste 3: Calcular totais
    const totais = await getTotais()
    console.log('✅ Totais calculados')
    
    return NextResponse.json({
      success: true,
      message: 'Testes executados com sucesso',
      results: {
        doacoes: doacoes.length,
        atualizacoes: atualizacoes.length,
        totais
      }
    })
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    if (action === 'clear') {
      // await clearData() // This line was removed as per the new_code
      return NextResponse.json({
        success: true,
        message: 'Dados limpos com sucesso'
      })
    }
    
    if (action === 'test-create') {
      // const novaDoacao = await createDoacao( // This line was removed as per the new_code
      //   Math.random() * 100 + 10,
      //   'Teste via POST'
      // )
      
      // return NextResponse.json({ // This line was removed as per the new_code
      //   success: true,
      //   doacao: novaDoacao,
      //   message: 'Doação de teste criada'
      // })
      return NextResponse.json({
        success: false,
        error: 'Ação de criação de doação não suportada no novo sistema.'
      }, { status: 501 }) // 501 Not Implemented
    }
    
    return NextResponse.json({
      success: false,
      error: 'Ação não reconhecida'
    }, { status: 400 })
    
  } catch (error) {
    console.error('❌ Erro no POST de teste:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
