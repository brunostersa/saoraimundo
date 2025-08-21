'use client'

import { useState, useEffect } from 'react'

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
        setLastUpdate(new Date().toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }))
      }
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
    // Garante que o valor seja um número inteiro
    const valorInteiro = Math.round(valor)
    
    if (valorInteiro >= 1000000) {
      // Para milhões: 1.500.000 -> 1,50 milhões
      return <span><span className="text-2xl">R$</span> {(valorInteiro / 1000000).toFixed(2).replace('.', ',')} milhões</span>
    } else if (valorInteiro >= 1000) {
      // Para milhares: 15.000 -> 15,0 mil
      return <span><span className="text-2xl">R$</span> {(valorInteiro / 1000).toFixed(1).replace('.', ',')} mil</span>
    } else {
      // Para valores menores que 1000, usa formatação com pontos
      return <span><span className="text-2xl">R$</span> {valorInteiro.toLocaleString('pt-BR')}</span>
    }
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
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-4">
        <div className="text-center p-4">
          <div className="text-red-500 text-2xl mb-2">❌</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-600 text-sm mb-3">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Cards de Totais */}
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-12 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-7xl mr-10">💰</div>
            <div className="flex-1">
              <p className="text-xl font-bold text-gray-700 mb-6 leading-[0.8]">Total Geral</p>
              <p className="text-5xl font-bold text-blue-600 mb-6 leading-[0.7]">{formatarValor(totais.totalGeral)}</p>
              <p className="text-sm text-gray-500 leading-[1.0]">Soma acumulada de todos os dias</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-12 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-7xl mr-10">🗓️</div>
            <div className="flex-1">
              <p className="text-xl font-bold text-gray-700 mb-6 leading-[0.8]">Total Hoje</p>
              <p className="text-5xl font-bold text-green-600 mb-6 leading-[0.7]">{formatarValor(totais.totalHoje)}</p>
              <p className={`text-lg px-6 py-4 rounded-full inline-block mb-6 leading-[0.9] ${getStatusColor(totais.statusHoje)}`}>
                {getStatusText(totais.statusHoje)}
              </p>
              <p className="text-sm text-gray-500 leading-[1.0]">Valor atual do dia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


