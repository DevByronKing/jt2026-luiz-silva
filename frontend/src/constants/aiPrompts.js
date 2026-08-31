/**
 * Prompts pré-configurados e perfis de investidor para o Seazone AI Copilot
 */

export const QUICK_PROMPTS = [
  {
    id: 'tese_refutada',
    label: 'Por que o 1Q Centro foi refutado?',
    query: 'Por que a análise matemática empírica refuta a tese preliminar de compactos (1Q/studio) no Centro?'
  },
  {
    id: 'alocacao_5m',
    label: 'Alocação de Fundo de R$ 5 Milhões',
    query: 'Como montar um portfólio ideal de R$ 5 milhões entre Centro e Morretes para equilibrar yield e liquidez?'
  },
  {
    id: 'baixa_temporada',
    label: 'Sensibilidade na Baixa Temporada (40%)',
    query: 'Qual ativo é mais resiliente se a ocupação cair para 40% durante o inverno em Itapema?'
  },
  {
    id: 'alavancagem_bancaria',
    label: 'Maior Cash-on-Cash Alavancado',
    query: 'Qual ativo entrega o maior retorno sobre o capital próprio (Cash-on-Cash) utilizando financiamento com 30% de entrada?'
  }
];

export const INVESTOR_PROFILES = {
  conservador: {
    id: 'conservador',
    name: 'Conservador / Preservação',
    badge: 'Foco em Liquidez e Resiliência',
    recommendedAssetId: 'centro_2q',
    allocationStrategy: '75% Centro 2Q + 25% Meia Praia 2Q',
    description: 'Prioriza liquidez imediata, localização nobre próxima ao mar e baixo risco de vacância durante a baixa temporada.',
    targetNetCapRate: '6,5% - 7,2%'
  },
  equilibrado: {
    id: 'equilibrado',
    name: 'Moderado / Equilibrado (Core Seazone)',
    badge: 'Recomendação Oficial Seazone',
    recommendedAssetId: 'centro_2q',
    allocationStrategy: '60% Centro 2Q + 40% Morretes 2Q',
    description: 'Combina a segurança e valorização do Centro com a alta tração de rentabilidade percentual de Morretes.',
    targetNetCapRate: '7,5% - 8,2%'
  },
  agressivo: {
    id: 'agressivo',
    name: 'Agressivo / Yield Hunter',
    badge: 'Maximização de Retorno de Caixa',
    recommendedAssetId: 'morretes_2q',
    allocationStrategy: '80% Morretes 2Q + 20% Morretes 1Q',
    description: 'Focado em maximizar o Cap Rate e retorno Cash-on-Cash alavancado com menor ticket de aquisição.',
    targetNetCapRate: '8,5% - 9,8%'
  }
};
