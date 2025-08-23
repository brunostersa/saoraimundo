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
  const [mounted, setMounted] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar totais de doações diretamente
      const totaisResponse = await fetch('/api/totais')
      if (totaisResponse.ok) {
        const totaisData = await totaisResponse.json()
        console.log('💰 Totais recebidos:', totaisData.data)
        setTotais(totaisData.data)
      } else {
        throw new Error('Erro ao buscar totais')
      }
    } catch (err) {
      console.error('Erro ao buscar dados:', err)
      setError('Erro ao carregar dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
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
      return <span><span className="text-lg sm:text-2xl">R$</span> {(valorInteiro / 1000000).toFixed(2).replace('.', ',')} milhões</span>
    } else if (valorInteiro >= 1000) {
      // Para milhares: 15.000 -> 15,0 mil
      return <span><span className="text-lg sm:text-2xl">R$</span> {(valorInteiro / 1000).toFixed(1).replace('.', ',')} mil</span>
    } else {
      // Para valores menores que 1000, usa formatação simples
      return <span><span className="text-lg sm:text-2xl">R$</span> {valorInteiro.toString()}</span>
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

  // Evita hidratação até o componente estar montado
  if (!mounted) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 text-sm">Carregando...</p>
        </div>
      </div>
    )
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
    <div className="space-y-6 sm:space-y-8">
      {/* Cards de Totais */}
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-6">
            <div className="text-4xl sm:text-5xl lg:text-7xl">💰</div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-lg sm:text-xl font-bold text-gray-700 mb-2 sm:mb-4 leading-[0.9]">Total Geral</p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-2 sm:mb-4 leading-[0.8]">{formatarValor(totais.totalGeral)}</p>
              <p className="text-xs sm:text-sm text-gray-500 leading-[1.1]">Soma acumulada de todos os dias</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-6">
            <div className="text-4xl sm:text-5xl lg:text-7xl">🗓️</div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-lg sm:text-xl font-bold text-gray-700 mb-2 sm:mb-4 leading-[0.9]">Total Hoje</p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-2 sm:mb-4 leading-[0.8]">{formatarValor(totais.totalHoje)}</p>
              <p className={`text-sm sm:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full inline-block mb-2 sm:mb-4 leading-[1.0] ${getStatusColor(totais.statusHoje)}`}>
                {getStatusText(totais.statusHoje)}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-[1.1]">Valor atual do dia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


