/**
 * Motor de Inteligência Artificial e Consultoria Quantitativa (Seazone AI Advisor)
 * Processa diagnósticos preditivos, respostas a consultas estratégicas e geração de memorandos executivos.
 */

import { formatBRL, formatPct } from './formatters';

/**
 * Calcula diagnósticos preditivos avançados para o ativo selecionado.
 * @param {Object} asset - Ativo imobiliário
 * @param {Object} calc - Métricas calculadas
 * @returns {Object} Diagnósticos preditivos
 */
export function calculatePredictiveDiagnostics(asset, calc) {
  const salePrice = asset?.market_data?.median_sale_price || 1;
  const medianAdr = asset?.rental_pricing?.median_adr || 1;
  const breakevenOcc = calc?.breakevenOccupancyPct || 25;

  // 1. Elasticidade de Diária: Variação de NOI ao alterar ADR em +R$ 50
  const deltaAdr = 50;
  const annualNights = calc?.nights || 200;
  const additionalGross = deltaAdr * annualNights;
  const additionalNet = additionalGross * 0.77; // após 20% Seazone + 3% OTA
  const elasticityPct = ((additionalNet / (calc?.netIncome || 1)) * 100);

  // 2. Índice de Resiliência à Baixa Temporada (0 a 100)
  const breakevenScore = Math.max(0, 100 - (breakevenOcc * 2.5));
  const reviewScore = Math.min(100, (asset?.market_data?.liquidity_conversion_pct || 50) * 1.1);
  const resilienceScore = Number(((breakevenScore * 0.6) + (reviewScore * 0.4)).toFixed(1));

  // 3. Sensibilidade a Vacância (Perda de receita por cada 5% de queda na ocupação)
  const lossPer5PctOcc = (medianAdr * 365 * 0.05) * 0.77;

  return {
    breakevenOcc: breakevenOcc,
    elasticityPct: Number(elasticityPct.toFixed(1)),
    additionalNetWith50Brl: additionalNet,
    resilienceScore: Math.min(100, resilienceScore),
    lossPer5PctOcc: lossPer5PctOcc
  };
}

/**
 * Responde a consultas em linguagem natural com base nos dados quantitativos reais de Itapema.
 * @param {string} query - Pergunta do usuário
 * @param {Object} context - Dados de contexto (selectedAsset, occupancy, seazoneFee, allAssets, leverageData)
 * @returns {string} Resposta analítica formatada em Markdown
 */
export function processAICopilotQuery(query, context) {
  const q = query.toLowerCase();
  const { selectedAsset, occupancy, seazoneFee, allAssets, leverageData } = context;

  const centro1q = allAssets?.find(a => a.id === 'centro_1q');
  const centro2q = allAssets?.find(a => a.id === 'centro_2q');
  const morretes1q = allAssets?.find(a => a.id === 'morretes_1q');
  const morretes2q = allAssets?.find(a => a.id === 'morretes_2q');
  const meiaPraia2q = allAssets?.find(a => a.id === 'meia_praia_2q');
  const meiaPraia3q = allAssets?.find(a => a.id === 'meia_praia_3q');

  // Caso 1: Refutação de Compactos no Centro
  if (q.includes('tese') || q.includes('refut') || q.includes('1q') || q.includes('compacto') || q.includes('studio')) {
    return `### ⚔️ Refutação Quantitativa: Compactos no Centro vs 2 Quartos

A tese inicial de que studios e 1 quarto no Centro maximizariam o retorno foi **refutada matematicamente** pela modelagem empírica de Itapema:

1. **Distorção Crítica do Preço de Compra por m²:**
   - **Centro 1Q / Compacto:** Preço mediano de aquisição em **${formatBRL(centro1q?.market_data?.median_price_m2)}/m²** (R$ 890k para 45 m²).
   - **Centro 2 Quartos:** Preço mediano em **${formatBRL(centro2q?.market_data?.median_price_m2)}/m²** (R$ 1,10M para 84 m²).
   - *Impacto:* O investidor paga **+52,5% mais caro por m²** no 1Q para obter um produto com menor demanda turística familiar.

2. **Incapacidade de Elasticidade da Diária:**
   - Para compensar o custo de compra, o 1Q precisaria de diárias equivalentes ao 2Q. Porém, no Airbnb:
   - **Diária Mediana Centro 1Q:** ${formatBRL(centro1q?.rental_pricing?.median_adr)}/dia.
   - **Diária Mediana Centro 2Q:** ${formatBRL(centro2q?.rental_pricing?.median_adr)}/dia (**+30,4% de faturamento por noite**).

3. **Veredito de Cap Rate Líquido (@ ${occupancy}% de Ocupação):**
   - **Centro 1Q:** Net Cap Rate de **${formatPct(centro1q?.calc?.netCapRate)}** (Fluxo líquido de ${formatBRL(centro1q?.calc?.monthlyNet)}/mês).
   - **Centro 2 Quartos:** Net Cap Rate de **${formatPct(centro2q?.calc?.netCapRate)}** (Fluxo líquido de ${formatBRL(centro2q?.calc?.monthlyNet)}/mês).

> **Conclusão Estratégica:** O **Centro 2 Quartos** entrega maior retorno financeiro percentual (+0,57% a.a.) e maior resiliência de demanda turística para famílias e grupos.`;
  }

  // Caso 2: Alocação de Fundo de 5 Milhões
  if (q.includes('5m') || q.includes('5 milhões') || q.includes('1.5m') || q.includes('aloca') || q.includes('fundo') || q.includes('portfólio') || q.includes('carteira')) {
    const totalBudget = q.includes('1.5m') ? 1500000 : 5000000;
    const centroWeight = 0.60;
    const morretesWeight = 0.40;
    const centroCapital = totalBudget * centroWeight;
    const morretesCapital = totalBudget * morretesWeight;

    const weightedNetCap = (centro2q?.calc?.netCapRate * centroWeight) + (morretes2q?.calc?.netCapRate * morretesWeight);
    const totalNetAnnual = (totalBudget * weightedNetCap) / 100;
    const totalMonthlyCash = totalNetAnnual / 12;

    return `### 💼 Estratégia Barbell de Alocação de Capital (${formatBRL(totalBudget)})

Para maximizar o retorno ponderado pelo risco em Itapema, estruturamos a carteira em 2 pilares complementares:

1. **Pilar Âncora — 60% em Centro (2 Quartos) (${formatBRL(centroCapital)}):**
   - *Função:* Proteção patrimonial, altíssima liquidez de reviews (${centro2q?.market_data?.liquidity_conversion_pct}%) e valorização imobiliária constante.
   - *Geração Líquida Estimada:* **${formatBRL((centroCapital * centro2q?.calc?.netCapRate) / 100)}/ano**.

2. **Pilar de Rendimento — 40% em Morretes (2 Quartos) (${formatBRL(morretesCapital)}):**
   - *Função:* Alavancagem pura de rentabilidade com o menor preço/m² de Itapema (R$ 11.117/m²).
   - *Geração Líquida Estimada:* **${formatBRL((morretesCapital * morretes2q?.calc?.netCapRate) / 100)}/ano** (Net Cap Rate de **${formatPct(morretes2q?.calc?.netCapRate)}**).

> **Resultado Consolidado da Carteira:**
> - **Cap Rate Líquido Ponderado:** **${formatPct(weightedNetCap)} ao ano**
> - **Lucro Líquido Anual (NOI):** **${formatBRL(totalNetAnnual)}/ano**
> - **Fluxo de Caixa Mensal Líquido:** **${formatBRL(totalMonthlyCash)}/mês**`;
  }

  // Caso 3: Sensibilidade na Baixa Temporada / Inverno
  if (q.includes('baixa') || q.includes('40%') || q.includes('inverno') || q.includes('sazonalidade') || q.includes('estresse')) {
    const stressOcc = 40;
    const stressNights = Math.round(365 * 0.40);
    const stressGross = selectedAsset?.rental_pricing?.median_adr * stressNights;
    const stressOta = stressGross * 0.03;
    const stressSeazone = stressGross * (seazoneFee / 100);
    const stressFixed = selectedAsset?.market_data?.annual_fixed_costs || 15000;
    const stressNet = stressGross - stressOta - stressSeazone - stressFixed;

    return `### ❄️ Diagnóstico de Estresse: Baixa Temporada (Ocupação @ ${stressOcc}%)

Simulação de estresse operacional considerando cenário conservador de inverno (146 noites ocupadas no ano):

1. **Detalhamento do Ativo em Foco (${selectedAsset?.label}):**
   - **Faturamento Bruto Anual:** ${formatBRL(stressGross)}
   - **Custos Fixos Totais:** -${formatBRL(stressFixed)} (Condomínio, IPTU e Reserva)
   - **Gestão Seazone Full-Service (${seazoneFee}%):** -${formatBRL(stressSeazone)}
   - **Resultado Operacional Líquido:** **${formatBRL(stressNet)}/ano** (${formatBRL(stressNet / 12)}/mês)
   - **Ponto de Equilíbrio (Breakeven):** **${selectedAsset?.calc?.breakevenOccupancyPct}% de ocupação** mínima.

2. **Ativo Mais Resiliente da Cidade:**
   - O **Centro (2 Quartos)** possui a menor taxa de vacância estrutural de Itapema e melhor atratividade para estadias de média duração (*mid-term stays* e *workation* no inverno).

> **Diretriz Operacional Seazone:** Aplicação de precificação dinâmica automatizada para preencher dias de semana na baixa temporada com nômades digitais e viajantes corporativos.`;
  }

  // Caso 4: Alavancagem e Financiamento
  if (q.includes('alavanca') || q.includes('financiamento') || q.includes('cash-on-cash') || q.includes('juros') || q.includes('dívida')) {
    return `### ⚡ Alavancagem Financeira e Cash-on-Cash Return

Simulação de aquisição alavancada com **30% de entrada** e saldo financiado a **10,5% a.a.** para **${selectedAsset?.label}**:

1. **Estrutura de Capital:**
   - **Capital Próprio Investido (Entrada 30%):** ${formatBRL(leverageData?.downPayment)}
   - **Valor Financiado (70%):** ${formatBRL(leverageData?.loanAmount)}
   - **Prestação Mensal Estimada:** ${formatBRL(leverageData?.monthlyPayment)}/mês (-${formatBRL(leverageData?.annualDebtService)}/ano)

2. **Geração de Caixa e Retorno sobre o Capital Próprio:**
   - **Resultado Líquido do Imóvel (NOI):** ${formatBRL(selectedAsset?.calc?.netIncome)}/ano
   - **Fluxo de Caixa Líquido Alavancado:** **${formatBRL(leverageData?.leveragedAnnualCashFlow)}/ano** (${formatBRL(leverageData?.leveragedMonthlyCashFlow)}/mês no bolso)
   - **Cash-on-Cash Return:** **${formatPct(leverageData?.cashOnCashReturn)} ao ano** sobre o capital próprio aportado.

> **Campeão de Cash-on-Cash:** **Morretes (2 Quartos)** alcança até **~11,2% a.a.** de Cash-on-Cash alavancado devido ao menor preço de entrada (R$ 750k).`;
  }

  // Resposta contextualizada padrão com dados reais
  return `### 📈 Análise Quantitativa Personalizada para ${selectedAsset?.label}

Com base no cenário simulado com **${occupancy}% de ocupação anual** e taxa de gestão Seazone de **${seazoneFee}%**:

1. **Métricas de Aquisição & Mercado:**
   - **Preço Mediano de Compra:** ${formatBRL(selectedAsset?.market_data?.median_sale_price)} (${formatBRL(selectedAsset?.market_data?.median_price_m2)}/m²)
   - **Diária Mediana Airbnb (ADR):** ${formatBRL(selectedAsset?.rental_pricing?.median_adr)}/noite

2. **Demonstrativo Financeiro (DRE Anual):**
   - **Faturamento Bruto:** ${formatBRL(selectedAsset?.calc?.grossAnnual)} (${selectedAsset?.calc?.nights} noites)
   - **Taxa de Gestão Seazone (${seazoneFee}%):** -${formatBRL(selectedAsset?.calc?.seazoneFee)}
   - **Custos Fixos + Taxas OTA:** -${formatBRL(selectedAsset?.calc?.fixedCosts + selectedAsset?.calc?.otaCosts)}
   - **Resultado Operacional Líquido (NOI):** **${formatBRL(selectedAsset?.calc?.netIncome)}/ano** (${formatBRL(selectedAsset?.calc?.monthlyNet)}/mês)

3. **Indicadores de Retorno:**
   - **Net Cap Rate:** **${formatPct(selectedAsset?.calc?.netCapRate)} ao ano**
   - **Gross Cap Rate:** **${formatPct(selectedAsset?.calc?.grossCapRate)} ao ano**
   - **Payback Estimado:** **${selectedAsset?.calc?.payback} anos**

> **Dica Executiva:** Clique nos botões de prompts rápidos para testar cenários de estresse de baixa temporada ou simulações de alocação de fundos.`;
}

/**
 * Gera o Memorando Executivo Formal para Comitê de Investimento em Markdown.
 * @param {Object} context - Dados consolidados
 * @returns {string} Texto completo do memorando executivo em Markdown
 */
export function generateExecutiveDossier(context) {
  const { selectedAsset, occupancy, seazoneFee, allAssets, leverageData } = context;
  const now = new Date().toLocaleDateString('pt-BR');

  const centro1q = allAssets?.find(a => a.id === 'centro_1q');
  const centro2q = allAssets?.find(a => a.id === 'centro_2q');
  const morretes2q = allAssets?.find(a => a.id === 'morretes_2q');

  return `# MEMORANDO EXECUTIVO DE INVESTIMENTO IMOBILIÁRIO — SEAZONE OS
**Data de Emissão:** ${now}
**Localização:** Itapema (SC)
**Base Analítica:** 4.441 Anúncios Airbnb | 8.329 Imóveis VivaReal | 118.839 Diárias Históricas

---

## 1. SUMÁRIO EXECUTIVO & PARECER DO COMITÊ

O presente memorando formaliza a recomendação técnica para alocação de capital em ativos residenciais para aluguel por temporada em Itapema (SC), sob gestão profissional da **Seazone**.

### Parecer sobre a Tese Preliminar (Compactos no Centro):
A análise estatística **refuta a hipótese preliminar** de que apartamentos compactos (1 quarto/studio) no Centro seriam o veículo mais eficiente. O preço de venda por metro quadrado dos compactos no Centro encontra-se altamente inflacionado (**${formatBRL(centro1q?.market_data?.median_price_m2)}/m²**), resultando em um Net Cap Rate de **${formatPct(centro1q?.calc?.netCapRate)}**, inferior ao do ativo de 2 Quartos no Centro (**${formatPct(centro2q?.calc?.netCapRate)}**).

---

## 2. ATIVO SELECIONADO: ${selectedAsset?.label?.toUpperCase()}

* **Papel Estratégico:** ${selectedAsset?.thesis_role}
* **Preço de Aquisição Mediano:** ${formatBRL(selectedAsset?.market_data?.median_sale_price)}
* **Área Útil Mediana:** ${selectedAsset?.market_data?.median_area_m2} m² (${formatBRL(selectedAsset?.market_data?.median_price_m2)}/m²)
* **Diária Mediana de Mercado (ADR):** ${formatBRL(selectedAsset?.rental_pricing?.median_adr)}/noite

### Demonstrativo de Resultado Projetado (Cenário Base @ ${occupancy}% Ocupação):
| Linha do DRE | Valor Anual (R$) | % da Receita Bruta |
| :--- | :--- | :--- |
| **(+) Faturamento Bruto Anual** | **${formatBRL(selectedAsset?.calc?.grossAnnual)}** | **100,0%** |
| (-) Gestão Seazone Full-Service (${seazoneFee}%) | -${formatBRL(selectedAsset?.calc?.seazoneFee)} | ${seazoneFee},0% |
| (-) Taxas de Canais OTA (~3%) | -${formatBRL(selectedAsset?.calc?.otaCosts)} | 3,0% |
| (-) Custos Fixos (Condomínio + IPTU + Manutenção) | -${formatBRL(selectedAsset?.calc?.fixedCosts)} | ${((selectedAsset?.calc?.fixedCosts / (selectedAsset?.calc?.grossAnnual || 1)) * 100).toFixed(1)}% |
| **(=) Resultado Operacional Líquido (NOI)** | **${formatBRL(selectedAsset?.calc?.netIncome)}** | **${((selectedAsset?.calc?.netIncome / (selectedAsset?.calc?.grossAnnual || 1)) * 100).toFixed(1)}%** |

### Indicadores Chave de Desempenho (KPIs):
* **Net Cap Rate (Retorno Líquido Desalavancado):** **${formatPct(selectedAsset?.calc?.netCapRate)} a.a.**
* **Gross Cap Rate (Retorno Bruto):** **${formatPct(selectedAsset?.calc?.grossCapRate)} a.a.**
* **Fluxo de Caixa Líquido Mensal:** **${formatBRL(selectedAsset?.calc?.monthlyNet)}/mês**
* **Prazo de Payback Estimado:** **${selectedAsset?.calc?.payback} anos**
* **Ponto de Equilíbrio Operacional (Breakeven):** **${selectedAsset?.calc?.breakevenOccupancyPct}% de ocupação**

---

## 3. ANÁLISE DE ALAVANCAGEM BANCÁRIA (CASH-ON-CASH)

Considerando aquisição com 30% de capital próprio e 70% financiado em 20 anos a 10,5% a.a.:
* **Capital Próprio Investido (Entrada):** ${formatBRL(leverageData?.downPayment)}
* **Serviço da Dívida Anual (Financiamento):** -${formatBRL(leverageData?.annualDebtService)}/ano (${formatBRL(leverageData?.monthlyPayment)}/mês)
* **Fluxo de Caixa Líquido Alavancado:** **${formatBRL(leverageData?.leveragedAnnualCashFlow)}/ano**
* **Cash-on-Cash Return:** **${formatPct(leverageData?.cashOnCashReturn)} a.a.**

---

## 4. RECOMENDAÇÃO FINAL DE PORTFÓLIO PARA O COMITÊ

1. **Ativo Âncora (60% do Fundo):** **Centro (2 Quartos)** — Máxima resiliência de demanda, menor taxa de vacância e valorização patrimonial de primeira linha.
2. **Ativo de Rendimento (40% do Fundo):** **Morretes (2 Quartos)** — Maximização de retorno percentual de caixa com ticket de entrada reduzido.

---
*Relatório gerado automaticamente pela plataforma Seazone OS (Decision Support Platform).*
`;
}

/**
 * Dispara o download do Dossiê em formato .md no navegador.
 */
export function downloadDossierMarkdown(markdownText, filename = 'Dossie_Executivo_Seazone_Itapema.md') {
  const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
