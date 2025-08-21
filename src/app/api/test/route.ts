import { NextRequest, NextResponse } from 'next/server'
import { getDoacoes, createDoacao, clearData, isVercel, hasPostgreSQL, getCacheInfo } from '@/lib/database'

export async function GET() {
  try {
    console.log('🧪 Testando sistema de banco...')
    
    const environment = {
      isVercel: isVercel(),
      hasPostgreSQL: hasPostgreSQL(),
      timestamp: new Date().toISOString()
    }
    
    console.log('🌍 Ambiente:', environment)
    
    // Obter informações do cache
    const cacheInfo = await getCacheInfo()
    console.log('💾 Info do cache:', cacheInfo)
    
    // Testar busca de doações
    const doacoes = await getDoacoes()
    console.log('📊 Doações encontradas:', doacoes.length)
    
    // Testar criação de doação
    const novaDoacao = await createDoacao({
      valor: 99.99,
      observacao: 'Teste automático',
      data: new Date().toISOString()
    })
    console.log('✅ Nova doação criada:', novaDoacao.id)
    
    // Buscar novamente para confirmar
    const doacoesAposCriacao = await getDoacoes()
    console.log('📊 Doações após criação:', doacoesAposCriacao.length)
    
    // Obter info atualizada do cache
    const cacheInfoAtualizado = await getCacheInfo()
    
    return NextResponse.json({
      success: true,
      environment,
      cacheInfo,
      cacheInfoAtualizado,
      testResults: {
        doacoesIniciais: doacoes.length,
        novaDoacaoId: novaDoacao.id,
        doacoesAposCriacao: doacoesAposCriacao.length,
        sistemaFuncionando: true
      },
      message: 'Sistema de banco funcionando perfeitamente!'
    })
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      environment: {
        isVercel: isVercel(),
        hasPostgreSQL: hasPostgreSQL(),
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    if (action === 'clear') {
      await clearData()
      return NextResponse.json({
        success: true,
        message: 'Dados limpos com sucesso'
      })
    }
    
    if (action === 'test-create') {
      const novaDoacao = await createDoacao({
        valor: Math.random() * 100 + 10,
        observacao: 'Teste via POST',
        data: new Date().toISOString()
      })
      
      return NextResponse.json({
        success: true,
        doacao: novaDoacao,
        message: 'Doação de teste criada'
      })
    }
    
    if (action === 'cache-info') {
      const cacheInfo = await getCacheInfo()
      return NextResponse.json({
        success: true,
        cacheInfo,
        message: 'Informações do cache obtidas'
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Ação não reconhecida'
    }, { status: 400 })
    
  } catch (error) {
    console.error('❌ Erro no POST de teste:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
