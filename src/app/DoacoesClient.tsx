'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Doacao {
  id: number
  valor: number
  data: string
  observacao?: string
  createdAt: string
  updatedAt: string
}

interface AtualizacaoDiaria {
  id: number
  data: string
  valorInicial: number
  valorAtual: number
  valorFinal?: number
  observacoes: string[]
  status: 'aberto' | 'fechado'
  createdAt: string
  updatedAt: string
}

interface Totais {
  totalGeral: number
  totalHoje: number
  statusHoje: string
}

export default function DoacoesClient() {
  const [loading, setLoading] = useState(true)
  const [totais, setTotais] = useState<Totais>({ totalGeral: 0, totalHoje: 0, statusHoje: 'sem_registro' })
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar apenas atualizações diárias para os totais
      const atualizacoesResponse = await fetch('/api/atualizacoes')
      if (atualizacoesResponse.ok) {
        const atualizacoesData = await atualizacoesResponse.json()
        setTotais(atualizacoesData.data.totais)
      }

      setLastUpdate(format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }))
    } catch (err) {
      console.error('Erro ao buscar dados:', err)
      setError('Erro ao carregar dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return 'text-green-600 bg-green-100'
      case 'fechado': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aberto': return '🟢 Aberto'
      case 'fechado': return '🔴 Fechado'
      default: return '⚪ Sem registro'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Erro ao carregar dados</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Paróquia São Raimundo Nonato</h1>
          <p className="text-gray-600">Contador de doações</p>
          <p className="text-sm text-gray-500 mt-2">Última atualização: {lastUpdate}</p>
        </div>

        {/* Cards de Totais */}
        <div className="space-y-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Geral</p>
                <p className="text-4xl font-bold text-blue-600">{formatarValor(totais.totalGeral)}</p>
                <p className="text-sm text-gray-500 mt-2">Soma acumulada de todos os dias</p>
              </div>
              <div className="text-6xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Hoje</p>
                <p className="text-4xl font-bold text-green-600">{formatarValor(totais.totalHoje)}</p>
                <p className={`text-sm px-3 py-1 rounded-full inline-block mt-2 ${getStatusColor(totais.statusHoje)}`}>
                  {getStatusText(totais.statusHoje)}
                </p>
                <p className="text-sm text-gray-500 mt-2">Valor atual do dia</p>
              </div>
              <div className="text-6xl">📅</div>
            </div>
          </div>
        </div>

        {/* Informação sobre acesso ao admin */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Para gerenciar doações e atualizações, acesse o painel administrativo
          </p>
        </div>
      </div>
    </div>
  )
}
