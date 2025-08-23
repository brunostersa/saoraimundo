import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const agora = new Date()
    const dataHoje = agora.toISOString().split('T')[0]
    const dataLocal = agora.toLocaleDateString('pt-BR')
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    console.log('🔍 DEBUG DATA:')
    console.log('📅 Agora:', agora)
    console.log('🌍 Data ISO:', dataHoje)
    console.log('🇧🇷 Data Local:', dataLocal)
    console.log('⏰ Timezone:', timezone)
    console.log('🕐 UTC Offset:', agora.getTimezoneOffset())
    
    return NextResponse.json({
      success: true,
      debug: {
        agora: agora.toISOString(),
        dataHoje,
        dataLocal,
        timezone,
        utcOffset: agora.getTimezoneOffset(),
        timestamp: agora.getTime()
      }
    })
  } catch (error) {
    console.error('❌ Erro no debug de data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
