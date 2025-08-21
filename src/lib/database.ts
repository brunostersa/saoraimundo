// Sistema de banco de dados com fallback definitivo
// Funciona tanto localmente quanto no Vercel

export interface Doacao {
  id: number
  valor: number
  data: string
  observacao?: string
  createdAt: string
  updatedAt: string
}

// Nova interface para atualizações diárias
export interface AtualizacaoDiaria {
  id: number
  data: string // Data no formato YYYY-MM-DD
  valorInicial: number
  valorAtual: number
  valorFinal?: number
  observacoes: string[]
  status: 'aberto' | 'fechado'
  createdAt: string
  updatedAt: string
}

// Interface para histórico de mudanças
export interface HistoricoMudanca {
  id: number
  dataAtualizacaoId: number
  valorAnterior: number
  valorNovo: number
  observacao: string
  timestamp: string
}

const initialDoacoes: Doacao[] = [
  {
    id: 1,
    valor: 150.50,
    data: new Date().toISOString(),
    observacao: 'Doação de teste',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Dados iniciais para atualizações diárias
const initialAtualizacoes: AtualizacaoDiaria[] = [
  {
    id: 1,
    data: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    valorInicial: 0,
    valorAtual: 150.50,
    observacoes: ['Inicialização do sistema'],
    status: 'aberto',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Detectar ambiente
export const isVercel = () => {
  return process.env.VERCEL === '1' || process.env.VERCEL_ENV
}

export const hasPostgreSQL = () => {
  return process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql')
}

// Sistema de cache global que persiste no Vercel
class GlobalCache {
  private static instance: GlobalCache
  private cache: Map<string, unknown>
  private initialized: boolean
  private nextId: number
  private nextAtualizacaoId: number

  constructor() {
    // @ts-expect-error - Acessar cache global do Node.js para persistência entre requests
    if (typeof global !== 'undefined' && !global.__doacoesCache) {
      // @ts-expect-error - Criar cache global para doações
      global.__doacoesCache = new Map()
      // @ts-expect-error - Inicializar contador de IDs global
      global.__doacoesNextId = 2
      // @ts-expect-error - Inicializar contador de IDs para atualizações
      global.__atualizacoesNextId = 2
    }

    // @ts-expect-error - Referenciar cache global existente
    this.cache = global.__doacoesCache
    // @ts-expect-error - Referenciar contador de IDs global
    this.nextId = global.__doacoesNextId
    // @ts-expect-error - Referenciar contador de IDs para atualizações
    this.nextAtualizacaoId = global.__atualizacoesNextId
    this.initialized = false
  }

  static getInstance(): GlobalCache {
    if (!GlobalCache.instance) {
      GlobalCache.instance = new GlobalCache()
    }
    return GlobalCache.instance
  }

  async init() {
    if (this.initialized) return;

    try {
      if (!this.cache.has('doacoes')) {
        this.cache.set('doacoes', [...initialDoacoes]);
        this.cache.set('nextId', 2);
        console.log('🔄 Cache inicializado com dados padrão');
      } else {
        console.log('✅ Cache já possui dados existentes');
      }

      if (!this.cache.has('atualizacoesDiarias')) {
        this.cache.set('atualizacoesDiarias', [...initialAtualizacoes]);
        this.cache.set('nextAtualizacaoId', 2);
        console.log('🔄 Cache de atualizações diárias inicializado');
      } else {
        console.log('✅ Cache de atualizações diárias já possui dados');
      }

      this.initialized = true;
    } catch (error) {
      console.error('❌ Erro ao inicializar cache:', error);
      this.cache.set('doacoes', [...initialDoacoes]);
      this.cache.set('nextId', 2);
      this.cache.set('atualizacoesDiarias', [...initialAtualizacoes]);
      this.cache.set('nextAtualizacaoId', 2);
      this.initialized = true;
    }
  }

  async get(key: string): Promise<unknown> {
    await this.init();
    return this.cache.get(key);
  }

  async set(key: string, value: unknown): Promise<void> {
    await this.init();
    this.cache.set(key, value);

    if (key === 'nextId') {
      // @ts-expect-error - Atualizar contador global de IDs
      global.__doacoesNextId = value;
    }
    if (key === 'nextAtualizacaoId') {
      // @ts-expect-error - Atualizar contador global de IDs para atualizações
      global.__atualizacoesNextId = value;
    }
  }

  async getAllDoacoes(): Promise<Doacao[]> {
    const doacoes = await this.get('doacoes') || [];
    return [...(doacoes as Doacao[])].sort((a: Doacao, b: Doacao) =>
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  async getAllAtualizacoesDiarias(): Promise<AtualizacaoDiaria[]> {
    const atualizacoes = await this.get('atualizacoesDiarias') || [];
    return [...(atualizacoes as AtualizacaoDiaria[])].sort((a: AtualizacaoDiaria, b: AtualizacaoDiaria) =>
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  async getAtualizacaoDoDia(data: string): Promise<AtualizacaoDiaria | null> {
    const atualizacoes = await this.getAllAtualizacoesDiarias();
    return atualizacoes.find(a => a.data === data) || null;
  }

  async createAtualizacaoDiaria(data: { data: string; valorInicial: number; observacao?: string }): Promise<AtualizacaoDiaria> {
    const atualizacoes = await this.getAllAtualizacoesDiarias();
    const nextId = (await this.get('nextAtualizacaoId')) as number || 2;

    const novaAtualizacao: AtualizacaoDiaria = {
      id: nextId,
      data: data.data,
      valorInicial: data.valorInicial,
      valorAtual: data.valorInicial,
      observacoes: [data.observacao || 'Inicialização do dia'],
      status: 'aberto',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    atualizacoes.unshift(novaAtualizacao);
    await this.set('atualizacoesDiarias', atualizacoes);
    await this.set('nextAtualizacaoId', nextId + 1);

    console.log('💾 Atualização diária criada:', novaAtualizacao.id);
    return novaAtualizacao;
  }

  async atualizarValorDoDia(data: string, novoValor: number, observacao: string): Promise<AtualizacaoDiaria> {
    const atualizacoes = await this.getAllAtualizacoesDiarias();
    const index = atualizacoes.findIndex(a => a.data === data);

    if (index === -1) {
      // Criar nova atualização se não existir
      return await this.createAtualizacaoDiaria({
        data,
        valorInicial: novoValor,
        observacao
      });
    }

    const atualizacao = atualizacoes[index];
    const valorAnterior = atualizacao.valorAtual;

    // Atualizar valores
    atualizacao.valorAtual = novoValor;
    atualizacao.observacoes.push(`${observacao} (${valorAnterior} → ${novoValor})`);
    atualizacao.updatedAt = new Date().toISOString();

    // Salvar no cache
    await this.set('atualizacoesDiarias', atualizacoes);

    console.log('💾 Valor do dia atualizado:', data, valorAnterior, '→', novoValor);
    return atualizacao;
  }

  async fecharDia(data: string, valorFinal: number, observacao?: string): Promise<AtualizacaoDiaria> {
    const atualizacoes = await this.getAllAtualizacoesDiarias();
    const index = atualizacoes.findIndex(a => a.data === data);

    if (index === -1) {
      throw new Error('Dia não encontrado para fechamento');
    }

    const atualizacao = atualizacoes[index];
    atualizacao.valorFinal = valorFinal;
    atualizacao.status = 'fechado';
    atualizacao.observacoes.push(`Fechamento: ${observacao || 'Dia encerrado'} (${atualizacao.valorAtual} → ${valorFinal})`);
    atualizacao.updatedAt = new Date().toISOString();

    // Salvar no cache
    await this.set('atualizacoesDiarias', atualizacoes);

    console.log('🔒 Dia fechado:', data, 'Valor final:', valorFinal);
    return atualizacao;
  }

  async getTotais(): Promise<{ totalGeral: number; totalHoje: number; statusHoje: string }> {
    const atualizacoes = await this.getAllAtualizacoesDiarias();
    const hoje = new Date().toISOString().split('T')[0];
    
    const atualizacaoHoje = atualizacoes.find(a => a.data === hoje);
    const totalHoje = atualizacaoHoje ? atualizacaoHoje.valorAtual : 0;
    const statusHoje = atualizacaoHoje ? atualizacaoHoje.status : 'sem_registro';

    // Total geral = soma de todos os valores finais (dias fechados) + valor atual do dia
    const totalGeral = atualizacoes
      .filter(a => a.status === 'fechado' && a.valorFinal)
      .reduce((sum, a) => sum + (a.valorFinal || 0), 0) + totalHoje;

    return { totalGeral, totalHoje, statusHoje };
  }

  async createDoacao(data: Omit<Doacao, 'id' | 'createdAt' | 'updatedAt'>): Promise<Doacao> {
    const doacoes = await this.getAllDoacoes();
    const nextId = (await this.get('nextId')) as number || 2;

    const novaDoacao: Doacao = {
      id: nextId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    doacoes.unshift(novaDoacao);
    await this.set('doacoes', doacoes);
    await this.set('nextId', nextId + 1);

    console.log('💾 Doação salva no cache global:', novaDoacao.id);
    return novaDoacao;
  }

  async getCacheInfo() {
    await this.init();
    const doacoes = await this.getAllDoacoes();
    const atualizacoes = await this.getAllAtualizacoesDiarias();
    const nextId = await this.get('nextId');
    const nextAtualizacaoId = await this.get('nextAtualizacaoId');

    return {
      doacoesCount: doacoes.length,
      atualizacoesCount: atualizacoes.length,
      nextId,
      nextAtualizacaoId,
      initialized: this.initialized,
      cacheKeys: Array.from(this.cache.keys())
    };
  }
}

// Instância global do cache
const globalCache = GlobalCache.getInstance()

// Função principal para obter doações
export async function getDoacoes(): Promise<Doacao[]> {
  try {
    console.log('🔍 Tentando buscar doações...');
    if (hasPostgreSQL()) {
      try {
        console.log('🗄️ Tentando conectar com PostgreSQL...');
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        await prisma.$connect();
        const doacoes = await prisma.doacao.findMany({ orderBy: { data: 'desc' } });
        await prisma.$disconnect();
        console.log('✅ PostgreSQL funcionando, doações encontradas:', doacoes.length);
        return doacoes.map(d => ({
          id: d.id, valor: d.valor, data: d.data.toISOString(),
          observacao: d.observacao || undefined, createdAt: d.createdAt.toISOString(),
          updatedAt: d.updatedAt.toISOString()
        }));
      } catch (error) {
        console.log('❌ PostgreSQL falhou, usando cache global:', error instanceof Error ? error.message : String(error));
      }
    }
    console.log('🔄 Usando cache global...');
    const doacoes = await globalCache.getAllDoacoes();
    const cacheInfo = await globalCache.getCacheInfo();
    console.log('✅ Cache global funcionando:', cacheInfo);
    console.log('📊 Doações encontradas:', doacoes.length);
    return doacoes;
  } catch (error) {
    console.error('❌ Erro crítico ao buscar doações:', error);
    return [...initialDoacoes];
  }
}

export async function createDoacao(data: { valor: number; observacao?: string; data?: string }): Promise<Doacao> {
  try {
    console.log('➕ Criando nova doação...');
    console.log('💰 Valor:', data.valor);
    console.log('📝 Observação:', data.observacao);
    console.log('📅 Data:', data.data);
    if (hasPostgreSQL()) {
      try {
        console.log('🗄️ Tentando criar no PostgreSQL...');
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        await prisma.$connect();
        const doacao = await prisma.doacao.create({
          data: { valor: data.valor, observacao: data.observacao, data: data.data ? new Date(data.data) : new Date() }
        });
        await prisma.$disconnect();
        console.log('✅ Doação criada no PostgreSQL:', doacao.id);
        return {
          id: doacao.id, valor: doacao.valor, data: doacao.data.toISOString(),
          observacao: doacao.observacao || undefined, createdAt: doacao.createdAt.toISOString(),
          updatedAt: doacao.updatedAt.toISOString()
        };
      } catch (error) {
        console.log('❌ PostgreSQL falhou, usando cache global:', error instanceof Error ? error.message : String(error));
      }
    }
    console.log('🔄 Usando cache global para criar doação...');
    const novaDoacao = await globalCache.createDoacao({
      valor: data.valor, observacao: data.observacao, data: data.data || new Date().toISOString()
    });
    console.log('✅ Doação criada no cache global:', novaDoacao.id);
    const doacoesAposCriacao = await globalCache.getAllDoacoes();
    console.log('📊 Total de doações após criação:', doacoesAposCriacao.length);
    return novaDoacao;
  } catch (error) {
    console.error('❌ Erro crítico ao criar doação:', error);
    throw new Error('Falha ao criar doação. Tente novamente.');
  }
}

// Novas funções para atualizações diárias
export async function getAtualizacoesDiarias(): Promise<AtualizacaoDiaria[]> {
  try {
    console.log('📅 Buscando atualizações diárias...');
    return await globalCache.getAllAtualizacoesDiarias();
  } catch (error) {
    console.error('❌ Erro ao buscar atualizações diárias:', error);
    return [];
  }
}

export async function getAtualizacaoDoDia(data: string): Promise<AtualizacaoDiaria | null> {
  try {
    console.log('📅 Buscando atualização do dia:', data);
    return await globalCache.getAtualizacaoDoDia(data);
  } catch (error) {
    console.error('❌ Erro ao buscar atualização do dia:', error);
    return null;
  }
}

export async function criarAtualizacaoDiaria(data: { data: string; valorInicial: number; observacao?: string }): Promise<AtualizacaoDiaria> {
  try {
    console.log('➕ Criando atualização diária para:', data.data);
    console.log('💰 Valor inicial:', data.valorInicial);
    console.log('📝 Observação:', data.observacao);
    
    return await globalCache.createAtualizacaoDiaria(data);
  } catch (error) {
    console.error('❌ Erro ao criar atualização diária:', error);
    throw new Error('Falha ao criar atualização diária. Tente novamente.');
  }
}

export async function atualizarValorDoDia(data: string, novoValor: number, observacao: string): Promise<AtualizacaoDiaria> {
  try {
    console.log('🔄 Atualizando valor do dia:', data);
    console.log('💰 Novo valor:', novoValor);
    console.log('📝 Observação:', observacao);
    
    return await globalCache.atualizarValorDoDia(data, novoValor, observacao);
  } catch (error) {
    console.error('❌ Erro ao atualizar valor do dia:', error);
    throw new Error('Falha ao atualizar valor do dia. Tente novamente.');
  }
}

export async function fecharDia(data: string, valorFinal: number, observacao?: string): Promise<AtualizacaoDiaria> {
  try {
    console.log('🔒 Fechando dia:', data);
    console.log('💰 Valor final:', valorFinal);
    console.log('📝 Observação:', observacao);
    
    return await globalCache.fecharDia(data, valorFinal, observacao);
  } catch (error) {
    console.error('❌ Erro ao fechar dia:', error);
    throw new Error('Falha ao fechar dia. Tente novamente.');
  }
}

export async function getTotais(): Promise<{ totalGeral: number; totalHoje: number; statusHoje: string }> {
  try {
    console.log('📊 Calculando totais...');
    return await globalCache.getTotais();
  } catch (error) {
    console.error('❌ Erro ao calcular totais:', error);
    return { totalGeral: 0, totalHoje: 0, statusHoje: 'erro' };
  }
}

export async function getStats() {
  try {
    const doacoes = await getDoacoes();
    const atualizacoes = await getAtualizacoesDiarias();
    const totais = await getTotais();
    
    return {
      doacoes: {
        total: doacoes.length,
        ultimas: doacoes.slice(0, 5)
      },
      atualizacoes: {
        total: atualizacoes.length,
        ultimas: atualizacoes.slice(0, 5)
      },
      totais,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return { error: 'Falha ao obter estatísticas' };
  }
}

export async function clearData() {
  try {
    console.log('🗑️ Limpando dados...');
    await globalCache.set('doacoes', []);
    await globalCache.set('atualizacoesDiarias', []);
    await globalCache.set('nextId', 1);
    await globalCache.set('nextAtualizacaoId', 1);
    console.log('✅ Dados limpos com sucesso');
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
    throw new Error('Falha ao limpar dados');
  }
}

export async function getCacheInfo() {
  try {
    return await globalCache.getCacheInfo();
  } catch (error) {
    console.error('Erro ao obter info do cache:', error);
    return {
      doacoesCount: 0,
      atualizacoesCount: 0,
      nextId: 1,
      nextAtualizacaoId: 1,
      initialized: false,
      cacheKeys: []
    };
  }
}

// Função para forçar sincronização com o banco (ignorando cache)
export async function forceSyncWithDatabase(): Promise<Doacao[]> {
  try {
    console.log('🔄 Forçando sincronização com banco...')
    
    // Se temos PostgreSQL configurado, forçar busca
    if (hasPostgreSQL()) {
      try {
        console.log('🗄️ Forçando conexão com PostgreSQL...')
        const { PrismaClient } = await import('@prisma/client')
        const prisma = new PrismaClient()
        
        await prisma.$connect()
        const doacoes = await prisma.doacao.findMany({
          orderBy: { data: 'desc' }
        })
        await prisma.$disconnect()
        
        console.log('✅ Sincronização forçada com PostgreSQL:', doacoes.length)
        
        // Atualizar cache local com dados do banco
        if (doacoes.length > 0) {
          await globalCache.set('doacoes', doacoes.map(d => ({
            id: d.id,
            valor: d.valor,
            data: d.data.toISOString(),
            observacao: d.observacao || undefined,
            createdAt: d.createdAt.toISOString(),
            updatedAt: d.updatedAt.toISOString()
          })))
          
          const maxId = Math.max(...doacoes.map(d => d.id))
          await globalCache.set('nextId', maxId + 1)
          
          console.log('💾 Cache local atualizado com dados do banco')
        } else {
          // Se banco está vazio, limpar cache
          await globalCache.set('doacoes', [])
          await globalCache.set('nextId', 1)
          console.log('🗑️ Cache limpo - banco está vazio')
        }
        
        return doacoes.map(d => ({
          id: d.id,
          valor: d.valor,
          data: d.data.toISOString(),
          observacao: d.observacao || undefined,
          createdAt: d.createdAt.toISOString(),
          updatedAt: d.updatedAt.toISOString()
        }))
      } catch (error) {
        console.log('❌ PostgreSQL falhou na sincronização:', error instanceof Error ? error.message : String(error))
      }
    }
    
    // Se não temos PostgreSQL, retornar dados do cache
    console.log('🔄 Usando dados do cache (sem PostgreSQL)')
    return await globalCache.getAllDoacoes()
    
  } catch (error) {
    console.error('❌ Erro na sincronização forçada:', error)
    return await globalCache.getAllDoacoes()
  }
}

// Função para verificar se há diferenças entre cache e banco
export async function checkDatabaseSync(): Promise<{
  inSync: boolean
  cacheCount: number
  databaseCount: number
  differences: string[]
}> {
  try {
    const cacheDoacoes = await globalCache.getAllDoacoes()
    const cacheCount = cacheDoacoes.length
    
    let databaseCount = 0
    let differences: string[] = []
    
    if (hasPostgreSQL()) {
      try {
        const { PrismaClient } = await import('@prisma/client')
        const prisma = new PrismaClient()
        
        await prisma.$connect()
        const dbDoacoes = await prisma.doacao.findMany({
          orderBy: { data: 'desc' }
        })
        await prisma.$disconnect()
        
        databaseCount = dbDoacoes.length
        
        if (cacheCount !== databaseCount) {
          differences.push(`Contagem diferente: Cache=${cacheCount}, Banco=${databaseCount}`)
        }
        
        // Verificar IDs
        const cacheIds = new Set(cacheDoacoes.map(d => d.id))
        const dbIds = new Set(dbDoacoes.map(d => d.id))
        
        const missingInCache = [...dbIds].filter(id => !cacheIds.has(id))
        const missingInDb = [...cacheIds].filter(id => !dbIds.has(id))
        
        if (missingInCache.length > 0) {
          differences.push(`IDs faltando no cache: ${missingInCache.join(', ')}`)
        }
        
        if (missingInDb.length > 0) {
          differences.push(`IDs faltando no banco: ${missingInDb.join(', ')}`)
        }
        
      } catch (error) {
        differences.push(`Erro ao conectar com banco: ${error instanceof Error ? error.message : String(error)}`)
      }
    } else {
      differences.push('PostgreSQL não configurado')
    }
    
    const inSync = differences.length === 0
    
    return {
      inSync,
      cacheCount,
      databaseCount,
      differences
    }
    
  } catch (error) {
    console.error('Erro ao verificar sincronização:', error)
    return {
      inSync: false,
      cacheCount: 0,
      databaseCount: 0,
      differences: [`Erro: ${error instanceof Error ? error.message : String(error)}`]
    }
  }
}
