'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

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

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [doacoes, setDoacoes] = useState<Doacao[]>([])
  const [atualizacoes, setAtualizacoes] = useState<AtualizacaoDiaria[]>([])
  const [totais, setTotais] = useState<Totais>({ totalGeral: 0, totalHoje: 0, statusHoje: 'sem_registro' })
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  // Estados para formulários
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    valor: ''
  })
  const [formAction, setFormAction] = useState<'criar' | 'atualizar' | 'fechar'>('criar')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar doações
      const doacoesResponse = await fetch('/api/doacoes')
      if (doacoesResponse.ok) {
        const doacoesData = await doacoesResponse.json()
        setDoacoes(doacoesData.data || [])
      }

      // Buscar atualizações diárias
      const atualizacoesResponse = await fetch('/api/atualizacoes')
      if (atualizacoesResponse.ok) {
        const atualizacoesData = await atualizacoesResponse.json()
        setAtualizacoes(atualizacoesData.data.atualizacoes || [])
        setTotais(atualizacoesData.data.totais || { totalGeral: 0, totalHoje: 0, statusHoje: 'sem_registro' })
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
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.data || !formData.valor) {
      setError('Data e valor são obrigatórios')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/atualizacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: formAction,
          data: formData.data,
          valorInicial: formAction === 'criar' ? parseFloat(formData.valor) : undefined,
          novoValor: formAction === 'atualizar' ? parseFloat(formData.valor) : undefined,
          valorFinal: formAction === 'fechar' ? parseFloat(formData.valor) : undefined,
          observacao: 'Atualização manual'
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Operação realizada:', result.message)
        
        // Limpar formulário
        setFormData({
          data: new Date().toISOString().split('T')[0],
          valor: ''
        })
        setShowForm(false)
        
        // Recarregar dados
        await fetchData()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro na operação')
      }
    } catch (err) {
      console.error('Erro na operação:', err)
      setError('Erro ao realizar operação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleClearData = async () => {
    if (confirm('⚠️ ATENÇÃO: Esta ação irá limpar TODOS os dados do sistema!\n\nDeseja realmente continuar?')) {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/clear-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const result = await response.json()
          console.log('✅ Dados limpos com sucesso:', result.message)
          alert('Dados do sistema foram limpos com sucesso!')
          await fetchData() // Recarregar dados após a limpeza
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Erro ao limpar dados')
          alert('Erro ao limpar dados: ' + (errorData.error || 'Tente novamente.'))
        }
      } catch (err) {
        console.error('Erro ao limpar dados:', err)
        setError('Erro ao limpar dados. Tente novamente.')
        alert('Erro ao limpar dados: ' + (err as string))
      } finally {
        setLoading(false)
      }
    }
  }







  const formatarValor = (valor: number) => {
    // Garante que o valor seja um número inteiro
    const valorInteiro = Math.round(valor)
    
    if (valorInteiro >= 1000000) {
      // Para milhões: 1.500.000 -> 1,50 milhões
      return `R$ ${(valorInteiro / 1000000).toFixed(2).replace('.', ',')} milhões`
    } else if (valorInteiro >= 1000) {
      // Para milhares: 15.000 -> 15,0 mil
      return `R$ ${(valorInteiro / 1000).toFixed(1).replace('.', ',')} mil`
    } else {
      // Para valores menores que 1000, usa formatação com pontos
      return `R$ ${valorInteiro.toLocaleString('pt-BR')}`
    }
  }

  const formatarData = (data: string) => {
    try {
      return format(new Date(data), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
      return data
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

  if (loading && doacoes.length === 0) {
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Painel de Administração</h1>
          <p className="text-gray-600">Controle completo do sistema de doações</p>
          <p className="text-sm text-gray-500 mt-2">Última atualização: {lastUpdate}</p>
          
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <span className="mr-2">🏠</span>
              Voltar para Home
            </Link>
          </div>
        </div>

        {/* Cards de Totais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="text-4xl mr-4">💰</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Geral</p>
                <p className="text-3xl font-bold text-blue-600">{formatarValor(totais.totalGeral)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="text-4xl mr-4">🗓️</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Hoje</p>
                <p className="text-3xl font-bold text-green-600">{formatarValor(totais.totalHoje)}</p>
                <p className={`text-sm px-2 py-1 rounded-full inline-block mt-2 ${getStatusColor(totais.statusHoje)}`}>
                  {getStatusText(totais.statusHoje)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Registros</p>
                <p className="text-3xl font-bold text-purple-600">{atualizacoes.length}</p>
                <p className="text-sm text-gray-500 mt-2">Dias registrados</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>



        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => {
              setFormAction('criar')
              setShowForm(true)
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            ➕ Iniciar Dia
          </button>
          
          <button
            onClick={() => {
              setFormAction('atualizar')
              setShowForm(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            🔄 Atualizar Valor
          </button>
          
          <button
            onClick={() => {
              setFormAction('fechar')
              setShowForm(true)
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            🔒 Fechar Dia
          </button>
          
          <button
            onClick={() => {
              if (confirm('⚠️ ATENÇÃO: Esta ação irá limpar TODOS os dados do sistema!\n\nDeseja realmente continuar?')) {
                handleClearData()
              }
            }}
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            🗑️ Limpar Dados
          </button>

        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">
              {formAction === 'criar' && 'Iniciar Novo Dia'}
              {formAction === 'atualizar' && 'Atualizar Valor do Dia'}
              {formAction === 'fechar' && 'Fechar Dia'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, data: new Date().toISOString().split('T')[0] })}
                    className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded border"
                  >
                    Hoje
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const ontem = new Date()
                      ontem.setDate(ontem.getDate() - 1)
                      setFormData({ ...formData, data: ontem.toISOString().split('T')[0] })
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border"
                  >
                    Ontem
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const amanha = new Date()
                      amanha.setDate(amanha.getDate() + 1)
                      setFormData({ ...formData, data: amanha.toISOString().split('T')[0] })
                    }}
                    className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded border"
                  >
                    Amanhã
                  </button>
                </div>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formAction === 'criar' && 'Valor Inicial'}
                  {formAction === 'atualizar' && 'Novo Valor'}
                  {formAction === 'fechar' && 'Valor Final'}
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, valor: '0' })}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border"
                  >
                    R$ 0,00
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, valor: '50' })}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border"
                  >
                    R$ 50,00
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, valor: '100' })}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border"
                  >
                    R$ 100,00
                  </button>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  {loading ? 'Processando...' : 'Salvar'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Histórico de Atualizações Diárias */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Atualizações Diárias</h2>
          
          {atualizacoes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma atualização encontrada</p>
          ) : (
            <div className="space-y-4">
              {atualizacoes.map((atualizacao) => (
                <div key={atualizacao.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {formatarData(atualizacao.data)}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(atualizacao.status)}`}>
                      {getStatusText(atualizacao.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Valor Inicial</p>
                      <p className="font-semibold">{formatarValor(atualizacao.valorInicial)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valor Atual</p>
                      <p className="font-semibold text-blue-600">{formatarValor(atualizacao.valorAtual)}</p>
                    </div>
                    {atualizacao.valorFinal && (
                      <div>
                        <p className="text-sm text-gray-600">Valor Final</p>
                        <p className="font-semibold text-green-600">{formatarValor(atualizacao.valorFinal)}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Histórico de Doações Individuais */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Doações Individuais</h2>
          
          {doacoes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma doação encontrada</p>
          ) : (
            <div className="space-y-4">
              {doacoes.map((doacao) => (
                <div key={doacao.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg">{formatarValor(doacao.valor)}</p>
                      <p className="text-sm text-gray-600">{formatarData(doacao.data)}</p>
                      {doacao.observacao && (
                        <p className="text-sm text-gray-700 mt-1">{doacao.observacao}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">ID: {doacao.id}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(doacao.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  )
}
