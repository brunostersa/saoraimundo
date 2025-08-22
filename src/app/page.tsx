'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import DoacoesClient from './DoacoesClient'

export default function Home() {
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const fetchLastUpdate = async () => {
      try {
        const response = await fetch('/api/atualizacoes')
        if (response.ok) {
          const data = await response.json()
          if (data.data?.atualizacoes?.length > 0) {
            // Pega a última atualização (mais recente)
            const lastUpdateData = data.data.atualizacoes[0] // Assumindo que a API retorna ordenado por data mais recente
            const lastUpdateDate = new Date(lastUpdateData.updatedAt)
            setLastUpdate(lastUpdateDate.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }))
          }
        }
      } catch (error) {
        console.error('Erro ao buscar última atualização:', error)
      }
    }

    fetchLastUpdate()
    
    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchLastUpdate, 30000)
    return () => clearInterval(interval)
  }, [])

  // Evita hidratação até o componente estar montado
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Seção Principal - 75% - Imagem Full da Igreja */}
        <div className="w-full lg:w-3/4 relative">
          {/* Imagem de Fundo Full Screen */}
          <div className="absolute inset-0">
            <Image
              src="/paroquia.jpeg"
              alt="Paróquia São Raimundo Nonato"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay escuro para melhorar legibilidade do texto */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Conteúdo sobreposto à imagem */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
            {/* Header Principal com Logo */}
            <div className="mb-12 w-full max-w-4xl">
              <div className="mb-8">
                <Image
                  src="/logo.png"
                  alt="Logo Igreja São Raimundo"
                  width={200}
                  height={100}
                  className="mx-auto w-32 h-16 sm:w-40 sm:h-20 md:w-48 md:h-24 lg:w-56 lg:h-28 object-contain drop-shadow-2xl"
                  priority
                />
              </div>
              
              {/* Títulos principais */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                Paróquia São Raimundo Nonato
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 mb-8 font-medium drop-shadow-xl">
                Contador de Doações
              </p>
              
              {/* Informações da Igreja */}
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-white/90 bg-white/10 backdrop-blur-md rounded-3xl px-8 py-6 border border-white/20 shadow-2xl">
                <span className="font-medium text-base md:text-lg">Diocese de Araguaína</span>
                <span className="hidden sm:block text-white/60">•</span>
                <span className="text-white/80 text-base md:text-lg">@saoraimundononato_camposlindos</span>
                <span className="hidden sm:block text-white/60">•</span>
                <span className="text-white/80 text-base md:text-lg">@marvin_arquitetos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Lateral - 25% - Informações de Doações */}
        <div className="w-full lg:w-1/4 bg-white/95 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-gray-200 p-3 lg:p-4 shadow-xl flex flex-col h-screen">
          {/* Header da seção lateral */}
          <div className="text-center mb-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Doações
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Carregando...
            </p>
          </div>

          {/* Componente cliente para doações - Alinhado ao topo */}
          <div className="flex-1">
            <DoacoesClient />
          </div>

          {/* Separador visual */}
          <div className="border-t-2 border-gray-300 my-6 mx-2"></div>

          {/* QR Code para doações - Alinhado ao bottom */}
          <div className="mt-auto bg-white rounded-lg shadow-md p-3 border border-gray-200">
            <div className="flex items-stretch gap-4">
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-800 mb-2 text-center">QRCODE PIX</h4>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                  <Image
                    src="/qrcode.png"
                    alt="QR Code PIX para doações"
                    width={140}
                    height={140}
                    className="w-24 h-24 md:w-28 md:h-28 object-contain"
                  />
                </div>
              </div>
              
              {/* Informações bancárias */}
              <div className="flex-1 bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-center mb-2">
                  <h4 className="text-xs font-bold text-blue-800 mb-1">Dados Bancários</h4>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-700">Banco:</span>
                    <span className="text-blue-800">Sicredi</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-700">Agência:</span>
                    <span className="text-blue-800">0911</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-700">Conta:</span>
                    <span className="text-blue-800">69285-2</span>
                  </div>
                  <div className="border-t border-blue-200 pt-1 mt-1">
                    <div className="text-center">
                      <span className="font-medium text-blue-700 text-xs">BENEFICIÁRIO:</span>
                      <p className="text-blue-800 font-semibold text-xs">Paróquia São Raimundo Nonato</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
              <p className="font-medium text-gray-700 mb-1">Como usar:</p>
              <p>Abra o app do seu banco, escaneie o QR Code e confirme o pagamento</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Seção Principal - 75% - Imagem Full da Igreja */}
      <div className="w-full lg:w-3/4 relative">
        {/* Imagem de Fundo Full Screen */}
        <div className="absolute inset-0">
          <Image
            src="/paroquia.jpeg"
            alt="Paróquia São Raimundo Nonato"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay escuro para melhorar legibilidade do texto */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Conteúdo sobreposto à imagem */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
          {/* Header Principal com Logo */}
          <div className="mb-12 w-full max-w-4xl">
            <div className="mb-8">
              <Image
                src="/logo.png"
                alt="Logo Igreja São Raimundo"
                width={200}
                height={100}
                className="mx-auto w-32 h-16 sm:w-40 sm:h-20 md:w-48 md:h-24 lg:w-56 lg:h-28 object-contain drop-shadow-2xl"
                priority
              />
            </div>
            
            {/* Títulos principais */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Paróquia São Raimundo Nonato
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 mb-8 font-medium drop-shadow-xl">
              Contador de Doações
            </p>
            
            {/* Informações da Igreja */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-white/90 bg-white/10 backdrop-blur-md rounded-3xl px-8 py-6 border border-white/20 shadow-2xl">
              <span className="font-medium text-base md:text-lg">Diocese de Araguaína</span>
              <span className="hidden sm:block text-white/60">•</span>
              <span className="text-white/80 text-base md:text-lg">@saoraimundononato_camposlindos</span>
              <span className="hidden sm:block text-white/60">•</span>
              <span className="text-white/80 text-base md:text-lg">@marvin_arquitetos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Lateral - 25% - Informações de Doações */}
      <div className="w-full lg:w-1/4 bg-white/95 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-gray-200 p-3 lg:p-4 shadow-xl flex flex-col h-screen">
        {/* Header da seção lateral */}
        <div className="text-center mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Doações
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Última atualização: {lastUpdate || 'Carregando...'}
          </p>
        </div>

        {/* Componente cliente para doações - Alinhado ao topo */}
        <div className="flex-1">
          <DoacoesClient />
        </div>

        {/* Separador visual */}
        <div className="border-t-2 border-gray-300 my-6 mx-2"></div>

        {/* QR Code para doações - Alinhado ao bottom */}
        <div className="mt-auto bg-white rounded-lg shadow-md p-3 border border-gray-200">
          <div className="flex items-stretch gap-4">
            <div className="flex-1">
              <h4 className="text-xs font-bold text-gray-800 mb-2 text-center">QRCODE PIX</h4>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                <Image
                  src="/qrcode.png"
                  alt="QR Code PIX para doações"
                  width={140}
                  height={140}
                  className="w-24 h-24 md:w-28 md:h-28 object-contain"
                />
              </div>
            </div>
            
            {/* Informações bancárias */}
            <div className="flex-1 bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="text-center mb-2">
                <h4 className="text-xs font-bold text-blue-800 mb-1">Dados Bancários</h4>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-700">Banco:</span>
                  <span className="text-blue-800">Sicredi</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-700">Agência:</span>
                  <span className="text-blue-800">0911</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-700">Conta:</span>
                  <span className="text-blue-800">69285-2</span>
                </div>
                <div className="border-t border-blue-200 pt-1 mt-1">
                  <div className="text-center">
                    <span className="font-medium text-blue-700 text-xs">BENEFICIÁRIO:</span>
                    <p className="text-blue-800 font-semibold text-xs">Paróquia São Raimundo Nonato</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
            <p className="font-medium text-gray-700 mb-1">Como usar:</p>
            <p>Abra o app do seu banco, escaneie o QR Code e confirme o pagamento</p>
          </div>
        </div>
      </div>
    </div>
  )
}

