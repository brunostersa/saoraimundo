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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">
            Histórico Recente
          </h3>
          <div className="text-xs text-blue-600 bg-blue-200/50 px-3 py-1 rounded-full font-medium">
            Últimos 7 dias
          </div>
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
          {doacoes.length === 0 ? (
            <div className="bg-white/80 rounded-xl p-6 text-center border-2 border-dashed border-blue-300">
              <div className="text-blue-400 text-4xl mb-2">📝</div>
              <p className="text-blue-700 text-sm font-medium">Nenhuma doação registrada</p>
              <p className="text-blue-500 text-xs mt-1">As doações aparecerão aqui</p>
            </div>
          ) : (
            doacoes.slice(0, 7).map((doacao) => {
              const data = new Date(doacao.data)
              const isToday = data.toDateString() === new Date().toDateString()
              
              return (
                <div key={doacao.id} className={`bg-gradient-to-r from-white/90 to-white/70 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${
                  isToday ? 'border-l-green-400 bg-green-50/80' : 'border-l-amber-400 bg-amber-50/60'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isToday ? 'bg-green-500' : 'bg-amber-500'
                      }`}></div>
                      <div className="text-sm font-semibold text-gray-800">
                        {format(data, 'dd/MM', { locale: ptBR })}
                      </div>
                      {isToday && (
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                          Hoje
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {formatarValor(doacao.valor)}
                    </span>
                  </div>
                  
                  {doacao.observacao && (
                    <div className="text-xs text-gray-600 bg-white/80 rounded-lg p-2 border border-gray-200/50">
                      <span className="font-medium">📝</span> {doacao.observacao}
                    </div>
                  )}
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
