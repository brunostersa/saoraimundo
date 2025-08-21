import { NextRequest, NextResponse } from 'next/server'
import { getDoacoes, createDoacao } from '@/lib/database'

export async function GET() {
  try {
    console.log('🔍 Buscando doações...')
    const doacoes = await getDoacoes()
    console.log('📊 Doações encontradas:', doacoes.length)
    return NextResponse.json(doacoes)
  } catch (error) {
    console.error('❌ Erro ao buscar doações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { valor, observacao, data } = body

    if (!valor || typeof valor !== 'number' || valor <= 0) {
      return NextResponse.json(
        { error: 'Valor inválido' },
        { status: 400 }
      )
    }

    console.log('➕ Criando nova doação...')
    console.log('💰 Valor:', valor)
    console.log('📝 Observação:', observacao)
    console.log('📅 Data:', data)

    const novaDoacao = await createDoacao(valor, observacao)
    
    if (!novaDoacao) {
      return NextResponse.json(
        { error: 'Erro ao criar doação' },
        { status: 500 }
      )
    }

    console.log('✅ Doação criada:', novaDoacao.id)
    return NextResponse.json(novaDoacao, { status: 201 })
    
  } catch (error) {
    console.error('❌ Erro ao criar doação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
