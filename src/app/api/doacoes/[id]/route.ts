import { NextRequest, NextResponse } from 'next/server'
import { getDoacoes, deleteDoacao } from '@/lib/database'

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
    
    const doacoes = await getDoacoes()
    const doacao = doacoes.find((d: any) => d.id === doacaoId)
    
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
    
    const success = await deleteDoacao(doacaoId)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Doação não encontrada ou erro ao deletar'
      }, { status: 404 })
    }
    
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
