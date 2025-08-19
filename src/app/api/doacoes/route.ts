import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET() {
  try {
    // Verificar se o Prisma Client está funcionando
    await prisma.$connect()
    
    const doacoes = await prisma.doacao.findMany({
      orderBy: {
        data: 'desc'
      }
    })
    
    return NextResponse.json(doacoes)
  } catch (error) {
    console.error('Erro ao buscar doações:', error)
    
    // Se for erro de conexão com banco, retornar erro específico
    if (error instanceof Error && error.message.includes('Prisma')) {
      return NextResponse.json(
        { error: 'Erro de conexão com banco de dados' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se o Prisma Client está funcionando
    await prisma.$connect()
    
    const body = await request.json()
    const { valor, observacao, data } = body

    if (!valor || typeof valor !== 'number' || valor <= 0) {
      return NextResponse.json(
        { error: 'Valor inválido' },
        { status: 400 }
      )
    }

    const doacao = await prisma.doacao.create({
      data: {
        valor,
        observacao,
        data: data ? new Date(data) : new Date()
      }
    })

    return NextResponse.json(doacao, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar doação:', error)
    
    // Se for erro de conexão com banco, retornar erro específico
    if (error instanceof Error && error.message.includes('Prisma')) {
      return NextResponse.json(
        { error: 'Erro de conexão com banco de dados' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
