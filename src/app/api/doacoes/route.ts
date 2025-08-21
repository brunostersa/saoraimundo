import { NextRequest, NextResponse } from 'next/server'

// Dados mock para funcionar sem banco inicialmente
const mockDoacoesInicial = [
  {
    id: 1,
    valor: 150.50,
    data: new Date().toISOString(),
    observacao: 'Doação de teste',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Array mutável para armazenar doações
// eslint-disable-next-line prefer-const
let mockDoacoes = [...mockDoacoesInicial]

export async function GET() {
  try {
    // Tentar usar Prisma se disponível
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      // Log para debug - verificar qual banco está sendo usado
      console.log('🔍 Tentando conectar com Prisma...')
      console.log('🌐 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'NÃO configurada')
      
      await prisma.$connect()
      console.log('✅ Conectado com Prisma!')
      
      const doacoes = await prisma.doacao.findMany({
        orderBy: {
          data: 'desc'
        }
      })
      
      console.log('📊 Doações encontradas:', doacoes.length)
      await prisma.$disconnect()
      return NextResponse.json(doacoes)
    } catch (prismaError) {
      console.log('Prisma não disponível, usando dados mock:', prismaError)
      return NextResponse.json(mockDoacoes)
    }
  } catch (error) {
    console.error('Erro ao buscar doações:', error)
    return NextResponse.json(mockDoacoes)
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

    // Tentar usar Prisma se disponível
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      await prisma.$connect()
      const doacao = await prisma.doacao.create({
        data: {
          valor,
          observacao,
          data: data ? new Date(data) : new Date()
        }
      })
      
      await prisma.$disconnect()
      return NextResponse.json(doacao, { status: 201 })
    } catch (prismaError) {
      console.log('Prisma não disponível, usando dados mock:', prismaError)
      
      // Criar doação mock
      const novaDoacao = {
        id: Date.now(),
        valor,
        observacao,
        data: (data ? new Date(data) : new Date()).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockDoacoes.unshift(novaDoacao)
      return NextResponse.json(novaDoacao, { status: 201 })
    }
  } catch (error) {
    console.error('Erro ao criar doação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
