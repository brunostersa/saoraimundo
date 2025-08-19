'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import Image from 'next/image'

interface Doacao {
  id: number
  valor: number
  data: string
  observacao?: string
}

export default function AdminPage() {
  const [valor, setValor] = useState('')
  const [observacao, setObservacao] = useState('')
  const [data, setData] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [doacoes, setDoacoes] = useState<Doacao[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchDoacoes()
  }, [])

  const fetchDoacoes = async () => {
    try {
      const response = await fetch('/api/doacoes')
      const data = await response.json()
      setDoacoes(data)
    } catch (error) {
      console.error('Erro ao buscar doações:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!valor || parseFloat(valor) <= 0) {
      setMessage('Por favor, insira um valor válido')
      return
    }

    if (!data) {
      setMessage('Por favor, selecione uma data')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/doacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: parseFloat(valor),
          observacao: observacao.trim() || undefined,
          data: new Date(data + 'T12:00:00Z').toISOString()
        }),
      })

      if (response.ok) {
        setValor('')
        setObservacao('')
        setData(format(new Date(), 'yyyy-MM-dd'))
        setMessage('Total diário registrado com sucesso!')
        fetchDoacoes()
      } else {
        setMessage('Erro ao registrar total diário')
      }
    } catch {
      setMessage('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const agruparPorDia = (doacoes: Doacao[]) => {
    const grupos: { [key: string]: Doacao[] } = {}
    doacoes.forEach(doacao => {
      const data = new Date(doacao.data)
      const chave = data.toDateString()
      if (!grupos[chave]) {
        grupos[chave] = []
      }
      grupos[chave].push(doacao)
    })
    return grupos
  }

  const grupos = agruparPorDia(doacoes)
  const diasOrdenados = Object.keys(grupos).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header - Reduzido e mais compacto */}
      <div className="text-center mb-4">
        <div className="mb-2">
          <Image
            src="/logo.png"
            alt="Logo Igreja São Raimundo"
            width={200}
            height={100}
            className="mx-auto w-16 h-8 sm:w-20 sm:h-10 object-contain drop-shadow-lg"
            priority
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
          Painel Administrativo
        </h1>
        <div className="text-gray-700 text-xs mb-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-igreja-dourado/30 shadow-sm max-w-md mx-auto">
          <span className="font-medium">Diocese de Araguaína</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-gray-600">@saoraimundononato_camposlindos</span>
        </div>
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 bg-igreja-dourado hover:bg-igreja-dourado/80 text-white px-3 py-1.5 rounded-lg font-semibold transition-all duration-300 text-xs shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <span>←</span>
          <span>Voltar para o Painel Público</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {/* Formulário de Total Diário */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-igreja-dourado/30 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-igreja-dourado/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💰</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Registrar Total Diário
            </h2>
            <p className="text-gray-600 mt-2">Adicione o valor total arrecadado no dia</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="data" className="block text-gray-700 text-sm font-semibold uppercase tracking-wide">
                📅 Data
              </label>
              <input
                type="date"
                id="data"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-igreja-dourado focus:border-igreja-dourado text-base shadow-sm transition-all duration-200 hover:border-igreja-dourado/60"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="valor" className="block text-gray-700 text-sm font-semibold uppercase tracking-wide">
                💵 Total do Dia (R$)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400">R$</span>
                <input
                  type="number"
                  id="valor"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  step="0.01"
                  min="0.01"
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-800 text-xl md:text-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-igreja-dourado focus:border-igreja-dourado shadow-sm transition-all duration-200 hover:border-igreja-dourado/60"
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="observacao" className="block text-gray-700 text-sm font-semibold uppercase tracking-wide">
                📝 Observação (opcional)
              </label>
              <textarea
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-igreja-dourado focus:border-igreja-dourado resize-none text-base shadow-sm transition-all duration-200 hover:border-igreja-dourado/60"
                placeholder="Ex: Coleta da missa dominical, evento especial..."
              />
            </div>

            {message && (
              <div className={`p-4 rounded-2xl text-center font-semibold text-base border-2 ${
                message.includes('sucesso') 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                <span className="text-lg mr-2">
                  {message.includes('sucesso') ? '✅' : '❌'}
                </span>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-igreja-dourado hover:bg-igreja-dourado/90 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Registrando...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>💾</span>
                  <span>Registrar Total Diário</span>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Histórico de Totais Diários */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-igreja-dourado/30 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-igreja-dourado/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Histórico de Totais
            </h2>
            <p className="text-gray-600 mt-2">Acompanhe os valores registrados</p>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {diasOrdenados.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
                <div className="text-gray-400 text-5xl mb-3">📊</div>
                <p className="text-gray-500 text-base font-medium">Nenhum total diário registrado</p>
                <p className="text-gray-400 text-sm mt-2">Use o formulário ao lado para começar</p>
              </div>
            ) : (
              diasOrdenados.map((dia) => {
                const doacoesDia = grupos[dia]
                const totalDia = doacoesDia.reduce((sum, d) => sum + d.valor, 0)
                const data = new Date(dia)
                const isToday = data.toDateString() === new Date().toDateString()
                
                return (
                  <div key={dia} className={`bg-gradient-to-r from-white/80 to-white/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${
                    isToday ? 'border-l-green-400 bg-green-50/50' : 'border-l-igreja-dourado/40'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            isToday ? 'bg-green-400' : 'bg-igreja-dourado/60'
                          }`}></div>
                          <div className="text-xl font-bold text-gray-800">
                            {formatarValor(totalDia)}
                          </div>
                          {isToday && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                              Hoje
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 ml-6">
                          {format(data, 'dd/MM/yyyy (EEEE)', { locale: ptBR })}
                        </div>
                      </div>
                      {doacoesDia[0]?.observacao && (
                        <div className="text-xs text-gray-600 bg-white/80 rounded-xl p-3 border border-gray-200/50 max-w-xs text-right">
                          <span className="font-medium">📝</span> {doacoesDia[0].observacao}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {diasOrdenados.length > 0 && (
            <div className="mt-6 pt-4 border-t-2 border-igreja-dourado/20">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-igreja-dourado mb-2">
                  Total Geral: {formatarValor(doacoes.reduce((sum, d) => sum + d.valor, 0))}
                </div>
                <p className="text-gray-600 text-sm">Soma de todos os dias registrados</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
