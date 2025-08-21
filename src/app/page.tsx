import Image from 'next/image'
import DoacoesClient from './DoacoesClient'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Seção Principal - 75% - Divulgação/Arte */}
      <div className="w-full lg:w-3/4 p-4 md:p-6 lg:p-8 flex flex-col justify-center items-center">
        {/* Header Principal com Logo - Redesenhado */}
        <div className="text-center mb-8 lg:mb-12 w-full max-w-4xl">
          <div className="mb-6">
            <Image
              src="/logo.png"
              alt="Logo Igreja São Raimundo"
              width={200}
              height={100}
              className="mx-auto w-32 h-16 sm:w-40 sm:h-20 md:w-48 md:h-24 lg:w-56 lg:h-28 object-contain drop-shadow-lg"
              priority
            />
          </div>
          
          {/* Títulos principais */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 mb-4 leading-tight drop-shadow-lg">
            Igreja São Raimundo
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 mb-6 font-medium drop-shadow-md">
            Sistema de Doações
          </p>
          
          {/* Informações da Igreja - Compactas */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-gray-700 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-igreja-dourado/30 shadow-lg">
            <span className="font-medium text-sm md:text-base">Diocese de Araguaína</span>
            <span className="hidden sm:block text-gray-400">•</span>
            <span className="text-gray-600 text-sm md:text-base">@saoraimundononato_camposlindos</span>
            <span className="hidden sm:block text-gray-400">•</span>
            <span className="text-gray-600 text-sm md:text-base">@marvinarquitetos</span>
          </div>
        </div>

        {/* Área de Divulgação/Arte - Redesenhada com duas colunas */}
        <div className="w-full max-w-6xl">
          {/* Layout de duas colunas para conteúdo e QR code */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Coluna da esquerda - Conteúdo principal */}
            <div className="lg:col-span-2">
              {/* Imagem da Igreja - Reduzida e centralizada */}
              <div className="flex justify-center">
                <Image
                  src="/igreja.png"
                  alt="Igreja São Raimundo"
                  width={400}
                  height={300}
                  className="rounded-3xl shadow-2xl w-full max-w-lg object-cover"
                  priority
                />
              </div>
            </div>

            {/* Coluna da direita - QR Code */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-igreja-dourado/30 shadow-xl text-center">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Faça sua doação
                    </h3>
                    <p className="text-sm text-gray-600">
                      Escaneie o QR Code para contribuir
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <Image
                      src="/qrcode.png"
                      alt="QR Code para doações"
                      width={120}
                      height={120}
                      className="mx-auto w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain"
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-700 mb-1">Como usar:</p>
                    <p>1. Abra o app do seu banco</p>
                    <p>2. Escaneie o QR Code</p>
                    <p>3. Confirme o valor e pague</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Lateral - 30% - Informações de Doações */}
      <div className="w-full lg:w-1/4 bg-white/90 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-igreja-dourado/30 p-4 md:p-6 lg:p-8 shadow-xl">
        {/* Header da seção lateral */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Doações
          </h2>
        </div>

        {/* Componente cliente para doações */}
        <DoacoesClient />
      </div>
    </div>
  )
}
// Força deploy
