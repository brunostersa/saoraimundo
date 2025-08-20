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

  useEffect(() => {
    fetchDoacoes()
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
        <div className="text-xs text-green-600">Atualizado em tempo real</div>
      </div>
      
      <div className="bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 rounded-2xl p-4 text-center border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-sm font-semibold text-amber-800 mb-3 uppercase tracking-wide">Total Geral</h3>
        <div className="text-3xl font-bold text-amber-700 mb-1">
          {formatarValor(totalGeral)}
        </div>
        <div className="text-xs text-amber-600">Soma de todas as doações</div>
      </div>

      {/* Histórico */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 rounded-2xl p-4 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">
            Histórico Visual
          </h3>
          <div className="text-xs text-blue-600 bg-blue-200/50 px-3 py-1 rounded-full font-medium">
            Últimos 7 dias
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
          {doacoes.length === 0 ? (
            <div className="col-span-1 sm:col-span-2 bg-white/80 rounded-xl p-6 text-center border-2 border-dashed border-blue-300">
              <div className="text-blue-400 text-4xl mb-2">📝</div>
              <p className="text-blue-700 text-sm font-medium">Nenhuma doação registrada</p>
              <p className="text-blue-500 text-xs mt-1">As doações aparecerão aqui</p>
            </div>
          ) : (
            doacoes.slice(0, 7).map((doacao) => {
              const data = new Date(doacao.data)
              const isToday = data.toDateString() === new Date().toDateString()
              const isYesterday = data.toDateString() === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
              
              return (
                <div key={doacao.id} className={`bg-gradient-to-r from-white/95 to-white/85 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
                  isToday ? 'border-l-green-500 bg-green-50/90' : 
                  isYesterday ? 'border-l-blue-500 bg-blue-50/80' : 
                  'border-l-amber-500 bg-amber-50/70'
                }`}>
                  {/* Data - Grande e destacada */}
                  <div className="text-center mb-3">
                    <div className={`text-2xl md:text-3xl font-bold ${
                      isToday ? 'text-green-700' : 
                      isYesterday ? 'text-blue-700' : 
                      'text-amber-700'
                    }`}>
                      {format(data, 'dd', { locale: ptBR })}
                    </div>
                    <div className={`text-sm font-medium ${
                      isToday ? 'text-green-600' : 
                      isYesterday ? 'text-blue-600' : 
                      'text-amber-600'
                    }`}>
                      {format(data, 'MMM', { locale: ptBR })}
                    </div>
                    <div className={`text-xs ${
                      isToday ? 'text-green-500' : 
                      isYesterday ? 'text-blue-500' : 
                      'text-amber-500'
                    }`}>
                      {format(data, 'yyyy', { locale: ptBR })}
                    </div>
                  </div>
                  
                  {/* Valor - Destacado */}
                  <div className="text-center mb-3">
                    <div className={`text-xl md:text-2xl font-bold ${
                      isToday ? 'text-green-800' : 
                      isYesterday ? 'text-blue-800' : 
                      'text-amber-800'
                    }`}>
                      {formatarValor(doacao.valor)}
                    </div>
                  </div>
                  
                  {/* Indicadores e horário */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        isToday ? 'bg-green-500' : 
                        isYesterday ? 'bg-blue-500' : 
                        'bg-amber-500'
                      }`}></div>
                      {isToday && (
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                          Hoje
                        </span>
                      )}
                      {isYesterday && (
                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">
                          Ontem
                        </span>
                      )}
                    </div>
                    
                    {/* Horário de atualização */}
                    <div className={`text-xs font-medium ${
                      isToday ? 'text-green-600' : 
                      isYesterday ? 'text-blue-600' : 
                      'text-amber-600'
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
