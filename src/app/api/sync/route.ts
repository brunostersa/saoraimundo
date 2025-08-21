import { NextRequest, NextResponse } from 'next/server'
import { getDoacoes, clearData } from '@/lib/database'

export async function GET() {
  try {
    console.log('🔄 Iniciando sincronização...')
    
    // Buscar doações do banco
    const doacoes = await getDoacoes()
    console.log('📊 Doações encontradas no banco:', doacoes.length)
    
    return NextResponse.json({
      success: true,
      message: 'Sincronização concluída',
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
    
    if (action === 'clear-cache') {
      console.log('🗑️ Limpando cache local...')
      await clearData()
      
      return NextResponse.json({
        success: true,
        message: 'Cache local limpo com sucesso'
      })
    }
    
    if (action === 'status') {
      const doacoes = await getDoacoes()
      
      return NextResponse.json({
        success: true,
        doacoesCount: doacoes.length,
        lastSync: new Date().toISOString()
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Ação não reconhecida. Use: clear-cache ou status'
    }, { status: 400 })
    
  } catch (error) {
    console.error('❌ Erro na operação:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
