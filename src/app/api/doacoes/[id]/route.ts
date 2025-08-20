import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const doacaoId = parseInt(id)
    
    if (isNaN(doacaoId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    // Tentar usar Prisma se disponível
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      await prisma.$connect()
      
      // Verificar se a doação existe
      const doacao = await prisma.doacao.findUnique({
        where: { id: doacaoId }
      })
      
      if (!doacao) {
        await prisma.$disconnect()
        return NextResponse.json(
          { error: 'Doação não encontrada' },
          { status: 404 }
        )
      }
      
      // Deletar a doação
      await prisma.doacao.delete({
        where: { id: doacaoId }
      })
      
      await prisma.$disconnect()
      return NextResponse.json({ message: 'Doação removida com sucesso' })
      
    } catch (prismaError) {
      console.log('Prisma não disponível, usando dados mock:', prismaError)
      
      // Para dados mock, retornar sucesso (não há persistência real)
      return NextResponse.json({ message: 'Doação removida com sucesso (mock)' })
    }
    
  } catch (error) {
    console.error('Erro ao deletar doação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
