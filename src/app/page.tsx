import Image from 'next/image'
import DoacoesClient from './DoacoesClient'

export default function Home() {
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
              <span className="text-white/80 text-base md:text-lg">@marvinarquitetos</span>
            </div>
          </div>

          {/* QR Code sobreposto à imagem */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Faça sua doação
              </h3>
              <p className="text-gray-600">
                Escaneie o QR Code para contribuir
              </p>
            </div>
            
            <div className="mb-4">
              <Image
                src="/qrcode.png"
                alt="QR Code para doações"
                width={140}
                height={140}
                className="mx-auto w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 object-contain"
              />
            </div>
            
            <div className="text-xs text-gray-500 bg-gray-50 rounded-xl p-4">
              <p className="font-medium text-gray-700 mb-2">Como usar:</p>
              <p>1. Abra o app do seu banco</p>
              <p>2. Escaneie o QR Code</p>
              <p>3. Confirme o valor e pague</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Lateral - 25% - Informações de Doações */}
      <div className="w-full lg:w-1/4 bg-white/95 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-gray-200 p-6 lg:p-8 shadow-xl">
        {/* Header da seção lateral */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Doações
          </h2>
        </div>

        {/* Componente cliente para doações */}
        <DoacoesClient />
      </div>
    </div>
  )
}

