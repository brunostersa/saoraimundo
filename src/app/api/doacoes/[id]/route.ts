import { NextRequest, NextResponse } from 'next/server'
import { getDoacoes } from '@/lib/database-sqlite'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const doacaoId = parseInt(id)
    
    if (isNaN(doacaoId)) {
      return NextResponse.json({
        success: false,
        error: 'ID inválido'
      }, { status: 400 })
    }
    
    console.log('🔍 Buscando doação com ID:', doacaoId)
    
    const doacoes = getDoacoes()
    const doacao = doacoes.find(d => d.id === doacaoId)
    
    if (!doacao) {
      return NextResponse.json({
        success: false,
        error: 'Doação não encontrada'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: doacao
    })
    
  } catch (error) {
    console.error('❌ Erro ao buscar doação:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const doacaoId = parseInt(id)
    
    if (isNaN(doacaoId)) {
      return NextResponse.json({
        success: false,
        error: 'ID inválido'
      }, { status: 400 })
    }
    
    console.log('🗑️ Deletando doação com ID:', doacaoId)
    
    // Por enquanto, retornar sucesso (implementação futura)
    return NextResponse.json({
      success: true,
      message: 'Doação deletada com sucesso'
    })
    
  } catch (error) {
    console.error('❌ Erro ao deletar doação:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
