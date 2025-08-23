import { NextResponse } from 'next/server'
import { getDatabaseInfo } from '@/lib/database'
import { getDatabaseType } from '@/lib/database-config'

export async function GET() {
  try {
    const dbInfo = getDatabaseInfo()
    const dbType = getDatabaseType()
    
    console.log('🔍 Testando conexão do banco...')
    console.log('📊 Tipo de banco:', dbType)
    console.log('🌍 Ambiente:', process.env.NODE_ENV)
    console.log('🔗 DATABASE_URL configurado:', !!process.env.DATABASE_URL)
    
    return NextResponse.json({
      success: true,
      database: {
        type: dbType,
        name: dbInfo.name,
        environment: dbInfo.environment,
        configured: !!process.env.DATABASE_URL,
        url: process.env.DATABASE_URL ? 'Configurado' : 'Não configurado'
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_TYPE: process.env.DATABASE_TYPE,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      }
    })
    
  } catch (error) {
    console.error('❌ Erro ao testar conexão:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
