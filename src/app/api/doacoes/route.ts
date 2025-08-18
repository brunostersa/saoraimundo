import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const doacoes = await prisma.doacao.findMany({
      orderBy: {
        data: 'desc'
      }
    })
    
    return NextResponse.json(doacoes)
  } catch (error) {
    console.error('Erro ao buscar doações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
