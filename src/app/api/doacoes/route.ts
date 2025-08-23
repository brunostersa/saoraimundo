import { NextRequest, NextResponse } from 'next/server'
import { getDoacoes, createDoacao } from '@/lib/database-sqlite'

export async function GET() {
  try {
    console.log('🔍 Buscando doações...')
    
    const doacoes = await getDoacoes()
    console.log('📊 Doações encontradas:', doacoes.length)
    
    return NextResponse.json({
      success: true,
      data: doacoes,
      count: doacoes.length
    })
    
  } catch (error) {
    console.error('❌ Erro ao buscar doações:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { valor, observacao } = body
    
    if (!valor || typeof valor !== 'number') {
      return NextResponse.json({
        success: false,
        error: 'Valor é obrigatório e deve ser um número'
      }, { status: 400 })
    }
    
    console.log('💰 Criando nova doação:', { valor, observacao })
    
    const doacao = await createDoacao(valor, observacao)
    
    if (!doacao) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao criar doação'
      }, { status: 500 })
    }
    
    console.log('✅ Doação criada com sucesso:', doacao.id)
    
    return NextResponse.json({
      success: true,
      message: 'Doação criada com sucesso',
      data: doacao
    }, { status: 201 })
    
  } catch (error) {
    console.error('❌ Erro ao criar doação:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
