import { NextResponse } from 'next/server'
import { getDatabaseType } from '@/lib/database-config'

export async function POST() {
  try {
    const dbType = getDatabaseType()
    
    console.log('🚀 Inicializando banco de dados...')
    console.log('📊 Tipo de banco:', dbType)
    
    if (dbType === 'postgres') {
      // Para PostgreSQL, vamos usar a função de inicialização
      const { getDatabase } = await import('@/lib/database-postgres')
      const db = getDatabase()
      
      try {
        await db.initialize()
        console.log('✅ Banco PostgreSQL inicializado com sucesso')
        
        return NextResponse.json({
          success: true,
          message: 'Banco PostgreSQL inicializado com sucesso',
          database: 'postgres',
          tables: ['Doacao', 'AtualizacaoDiaria']
        })
      } catch (initError) {
        console.error('❌ Erro ao inicializar PostgreSQL:', initError)
        return NextResponse.json({
          success: false,
          error: 'Erro ao inicializar banco PostgreSQL',
          details: initError instanceof Error ? initError.message : 'Erro desconhecido'
        }, { status: 500 })
      }
    } else {
      // Para SQLite, não precisa inicializar
      return NextResponse.json({
        success: true,
        message: 'SQLite não precisa de inicialização',
        database: 'sqlite'
      })
    }
    
  } catch (error) {
    console.error('❌ Erro na inicialização:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
