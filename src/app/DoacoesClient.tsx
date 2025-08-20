'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Doacao {
  id: number
  valor: number
  data: string
  observacao?: string
}

export default function DoacoesClient() {
  const [doacoes, setDoacoes] = useState<Doacao[]>([])
  const [totalHoje, setTotalHoje] = useState(0)
  const [totalGeral, setTotalGeral] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    fetchDoacoes()
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      fetchDoacoes()
    }, 30000) // 30 segundos
    
    // Cleanup do interval quando componente desmontar
    return () => clearInterval(interval)
  }, [])

  const fetchDoacoes = async () => {
    try {
      const response = await fetch('/api/doacoes')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setDoacoes(data)
      
      const hoje = new Date()
      const doacoesHoje = data.filter((d: Doacao) => {
        const dataDoacao = new Date(d.data)
        return dataDoacao.toDateString() === hoje.toDateString()
      })
      
      const totalHojeValue = doacoesHoje.reduce((sum: number, d: Doacao) => sum + d.valor, 0)
      const totalGeralValue = data.reduce((sum: number, d: Doacao) => sum + d.valor, 0)
      
      setTotalHoje(totalHojeValue)
      setTotalGeral(totalGeralValue)
      setLastUpdate(new Date())
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar doações:', error)
      setLoading(false)
    }
  }

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 rounded-2xl p-4 text-center border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-sm font-semibold text-green-800 mb-3 uppercase tracking-wide">Total Hoje</h3>
          <div className="text-2xl font-bold text-green-700 animate-pulse">
            Carregando...
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 rounded-2xl p-4 text-center border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-sm font-semibold text-amber-800 mb-3 uppercase tracking-wide">Total Geral</h3>
          <div className="text-2xl font-bold text-amber-700 animate-pulse">
            Carregando...
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 rounded-2xl p-4 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-sm font-semibold text-blue-800 mb-4 text-center uppercase tracking-wide">
            Histórico
          </h3>
          <div className="text-center">
            <p className="text-blue-600 text-sm animate-pulse">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Contadores */}
      <div className="bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 rounded-2xl p-4 text-center border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-sm font-semibold text-green-800 mb-3 uppercase tracking-wide">Total Hoje</h3>
        <div className="text-3xl font-bold text-green-700 mb-1">
          {formatarValor(totalHoje)}
        </div>
        <div className="text-xs text-green-600">
          Atualizado em tempo real • Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 rounded-2xl p-4 text-center border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-sm font-semibold text-amber-800 mb-3 uppercase tracking-wide">Total Geral</h3>
        <div className="text-3xl font-bold text-amber-700 mb-1">
          {formatarValor(totalGeral)}
        </div>
        <div className="text-xs text-amber-600">Soma de todas as doações</div>
      </div>

      {/* Histórico */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-blue-800 uppercase tracking-wider">
            Histórico de Doações
          </h3>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-blue-700 bg-blue-200 px-4 py-2 rounded-full font-bold shadow-md">
              Últimos 10 registros
            </div>
            <div className="flex items-center space-x-2 text-xs text-blue-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Auto-refresh a cada 30s</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
          {doacoes.length === 0 ? (
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 text-center border-2 border-dashed border-blue-300 shadow-lg">
              <div className="text-blue-400 text-4xl mb-3">📝</div>
              <p className="text-blue-800 text-base font-bold mb-1">Nenhuma doação registrada</p>
              <p className="text-blue-600 text-sm">As doações aparecerão aqui</p>
            </div>
          ) : (
            doacoes.slice(0, 10).map((doacao) => {
              const data = new Date(doacao.data)
              const isToday = data.toDateString() === new Date().toDateString()
              const isYesterday = data.toDateString() === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
              
              return (
                <div key={doacao.id} className={`flex items-center justify-between p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${
                  isToday ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400' : 
                  isYesterday ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400' : 
                  'bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400'
                }`}>
                  
                  {/* Data e Dia */}
                  <div className="flex items-center space-x-4">
                    <div className={`text-center min-w-[60px] ${
                      isToday ? 'text-green-700' : 
                      isYesterday ? 'text-blue-700' : 
                      'text-amber-700'
                    }`}>
                      <div className="text-2xl font-bold">
                        {format(data, 'dd', { locale: ptBR })}
                      </div>
                      <div className="text-xs font-medium uppercase">
                        {format(data, 'MMM', { locale: ptBR })}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {format(data, 'EEEE', { locale: ptBR })}
                    </div>
                  </div>
                  
                  {/* Valor */}
                  <div className={`text-xl font-bold ${
                    isToday ? 'text-green-700' : 
                    isYesterday ? 'text-blue-700' : 
                    'text-amber-700'
                  }`}>
                    {formatarValor(doacao.valor)}
                  </div>
                  
                  {/* Status e Horário */}
                  <div className="flex items-center space-x-3">
                    {/* Badge de status */}
                    {isToday && (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        HOJE
                      </div>
                    )}
                    {isYesterday && (
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        ONTEM
                      </div>
                    )}
                    
                    {/* Horário */}
                    <div className={`text-xs px-2 py-1 rounded-lg ${
                      isToday ? 'bg-green-100 text-green-700' : 
                      isYesterday ? 'bg-blue-100 text-blue-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {format(data, 'HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
        
        {doacoes.length > 7 && (
          <div className="mt-4 pt-3 border-t border-blue-300/50 text-center">
            <p className="text-xs text-blue-600">
              Mostrando 7 de {doacoes.length} doações
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
