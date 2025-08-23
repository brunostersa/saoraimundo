import { NextRequest, NextResponse } from 'next/server'
import { getDoacoes, createDoacao } from '@/lib/database'

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
    const { valor, observacao, data } = body
    
    if (!valor || valor <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Valor é obrigatório e deve ser maior que zero'
      }, { status: 400 })
    }
    
    console.log('💰 Criando nova doação:', { valor, observacao, data })
    
    // Tentar inicializar o banco PostgreSQL se necessário
    const dbType = process.env.DATABASE_TYPE || 'sqlite'
    if (dbType === 'postgres') {
      try {
        const { getDatabase } = await import('@/lib/database-postgres')
        const db = getDatabase()
        await db.initialize()
        console.log('✅ Banco PostgreSQL inicializado para doação')
      } catch (initError) {
        console.error('❌ Erro ao inicializar PostgreSQL:', initError)
      }
    }
    
    const doacaoId = await createDoacao({
      valor,
      observacao,
      data
    })
    
    console.log('✅ Doação criada com sucesso:', doacaoId)
    
    return NextResponse.json({
      success: true,
      message: 'Doação criada com sucesso',
      data: { id: doacaoId }
    }, { status: 201 })
    
  } catch (error) {
    console.error('❌ Erro ao criar doação:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao criar doação'
    }, { status: 500 })
  }
}
