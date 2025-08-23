import { NextRequest, NextResponse } from 'next/server'
import { getDoacoes } from '@/lib/database-postgres'

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
    
    // Debug: verificar variáveis de ambiente
    console.log('🔍 DEBUG - Variáveis de ambiente:')
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV)
    console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'Não configurado')
    console.log('🏷️ DATABASE_TYPE:', process.env.DATABASE_TYPE || 'Não definido')
    
    try {
      // Tentar inicializar o banco PostgreSQL
      const { getDatabase } = await import('@/lib/database-postgres')
      const db = getDatabase()
      
      console.log('✅ Banco PostgreSQL importado com sucesso')
      
      // Inicializar banco
      await db.initialize()
      console.log('✅ Banco PostgreSQL inicializado')
      
      // Criar doação
      const doacaoId = await db.createDoacao({
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
      
    } catch (dbError) {
      console.error('❌ Erro no banco PostgreSQL:', dbError)
      return NextResponse.json({
        success: false,
        error: 'Erro no banco PostgreSQL',
        details: dbError instanceof Error ? dbError.message : 'Erro desconhecido'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Erro geral ao criar doação:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro geral ao criar doação',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
