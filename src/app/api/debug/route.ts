import { NextResponse } from 'next/server'
import { getDatabaseType, getDatabaseStatus } from '@/lib/database-config'
import { getDatabaseInfo } from '@/lib/database'

export async function GET() {
  try {
    const dbType = getDatabaseType()
    const dbStatus = getDatabaseStatus()
    const dbInfo = getDatabaseInfo()
    
    console.log('🔍 DEBUG - Informações do banco:')
    console.log('📊 Tipo detectado:', dbType)
    console.log('📋 Status:', dbStatus)
    console.log('ℹ️ Info:', dbInfo)
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV)
    console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'Não configurado')
    console.log('🏷️ DATABASE_TYPE:', process.env.DATABASE_TYPE || 'Não definido')
    
    // Testar se conseguimos importar os bancos
    let sqliteAvailable = false
    let postgresAvailable = false
    
    try {
      await import('@/lib/database-sqlite')
      sqliteAvailable = true
      console.log('✅ SQLite disponível')
    } catch (error) {
      console.log('❌ SQLite não disponível:', error)
    }
    
    try {
      await import('@/lib/database-postgres')
      postgresAvailable = true
      console.log('✅ PostgreSQL disponível')
    } catch (error) {
      console.log('❌ PostgreSQL não disponível:', error)
    }
    
    return NextResponse.json({
      success: true,
      debug: {
        databaseType: dbType,
        databaseStatus: dbStatus,
        databaseInfo: dbInfo,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          DATABASE_URL: process.env.DATABASE_URL ? 'Configurado' : 'Não configurado',
          DATABASE_TYPE: process.env.DATABASE_TYPE || 'Não definido'
        },
        modules: {
          sqliteAvailable,
          postgresAvailable
        }
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
