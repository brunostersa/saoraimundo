import { NextRequest, NextResponse } from 'next/server'
import { getDoacoes, clearData, getCacheInfo, forceSyncWithDatabase, checkDatabaseSync } from '@/lib/database'

export async function GET() {
  try {
    console.log('🔄 Iniciando sincronização...')
    
    // Verificar status de sincronização
    const syncStatus = await checkDatabaseSync()
    console.log('📊 Status de sincronização:', syncStatus)
    
    // Obter informações atuais do cache
    const cacheInfo = await getCacheInfo()
    console.log('💾 Cache atual:', cacheInfo)
    
    // Forçar busca do banco (ignorando cache)
    const doacoes = await getDoacoes()
    console.log('📊 Doações encontradas no banco:', doacoes.length)
    
    return NextResponse.json({
      success: true,
      message: 'Sincronização concluída',
      syncStatus,
      cacheInfo,
      doacoesCount: doacoes.length,
      doacoes: doacoes.slice(0, 5) // Mostrar apenas as primeiras 5
    })
    
  } catch (error) {
    console.error('❌ Erro na sincronização:', error)
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
    
    if (action === 'force-sync') {
      console.log('🔄 Forçando sincronização completa...')
      
      // Forçar sincronização com banco
      const doacoes = await forceSyncWithDatabase()
      console.log('📊 Sincronização forçada concluída:', doacoes.length)
      
      // Verificar status após sincronização
      const syncStatus = await checkDatabaseSync()
      
      return NextResponse.json({
        success: true,
        message: 'Sincronização forçada concluída',
        doacoesCount: doacoes.length,
        doacoes: doacoes.slice(0, 5),
        syncStatus
      })
    }
    
    if (action === 'clear-cache') {
      console.log('🗑️ Limpando cache local...')
      await clearData()
      
      return NextResponse.json({
        success: true,
        message: 'Cache local limpo com sucesso'
      })
    }
    
    if (action === 'status') {
      const cacheInfo = await getCacheInfo()
      const syncStatus = await checkDatabaseSync()
      const doacoes = await getDoacoes()
      
      return NextResponse.json({
        success: true,
        cacheInfo,
        syncStatus,
        doacoesCount: doacoes.length,
        lastSync: new Date().toISOString()
      })
    }
    
    if (action === 'check-sync') {
      console.log('🔍 Verificando sincronização...')
      const syncStatus = await checkDatabaseSync()
      
      return NextResponse.json({
        success: true,
        syncStatus,
        message: syncStatus.inSync ? 'Cache e banco estão sincronizados' : 'Há diferenças entre cache e banco'
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Ação não reconhecida. Use: force-sync, clear-cache, status, ou check-sync'
    }, { status: 400 })
    
  } catch (error) {
    console.error('❌ Erro na operação:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
