/**
 * Serviço de Integração com Google Gemini AI
 * Suporta chaves da Google AI Studio (VITE_GEMINI_API_KEY)
 * Com fallback gracioso para o motor quantitativo offline.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const isGeminiConfigured = Boolean(
  GEMINI_API_KEY && 
  GEMINI_API_KEY !== 'sua_chave_gemini_aqui' &&
  GEMINI_API_KEY.length > 10
);

export async function askGeminiCopilot({
  question,
  assets,
  occupancy,
  seazoneFee,
  chatHistory = []
}) {
  if (!isGeminiConfigured) {
    return null; // Fallback para knowledge base local
  }

  const systemContext = `
Você é o Seazone AI Copilot, um consultor quantitativo sênior de inteligência imobiliária especializado no mercado de Itapema (SC).
Você tem acesso aos dados empíricos reais processados de 4.441 anúncios de Airbnb e 7.968 imóveis à venda no VivaReal.

PARÂMETROS DE CENÁRIO ATUAL:
- Taxa de Ocupação Anual Simulada: ${occupancy}%
- Taxa de Gestão Seazone: ${seazoneFee}%
- Custo Fixo Estimado: Condomínio + IPTU + 0.5% a.a. de reserva de manutenção.

DADOS CONSOLIDADOS DOS ATIVOS DE ITAPEMA:
${assets.map(a => `
- ${a.label} (${a.neighborhood}):
  * Preço Compra Mediano: R$ ${a.market_data.median_sale_price.toLocaleString('pt-BR')} (R$ ${a.market_data.median_price_m2.toLocaleString('pt-BR')}/m²)
  * Diária Mediana Airbnb (ADR): R$ ${a.rental_pricing.median_adr}/dia
  * Gross Cap Rate: ${a.calc.grossCapRate.toFixed(2)}%
  * Net Cap Rate (@ ${occupancy}% ocupação): ${a.calc.netCapRate.toFixed(2)}%
  * Fluxo Líquido Mensal: R$ ${Math.round(a.calc.monthlyNet).toLocaleString('pt-BR')}/mês
  * Liquidez (% anúncios com reviews): ${a.market_data.liquidity_conversion_pct}%
  * Papel na Tese: ${a.thesis_role}
`).join('\n')}

DIRETRIZES DE RESPOSTA:
1. Seja analítico, executivo, direto e embasado puramente em matemática financeira imobiliária (Cap Rate, NOI, Preço/m², ADR).
2. Lembre-se que a tese de compactos de 1 Quarto no Centro foi refutada matematicamente (m² inflacionado em R$ 19,9k/m² esmaga o Cap Rate para 6,18% vs 6,75% no 2 Quartos).
3. O campeão de yield puro é Morretes 2Q (Net Cap Rate 8,65%).
4. Responda em Markdown bem formatado (listas, negrito, valores monetários em R$).
`;

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemContext}\n\nPERGUNTA DO INVESTIDOR: "${question}"` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024
        }
      })
    });

    if (!response.ok) {
      console.warn('Erro na resposta da API Gemini:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || null;
  } catch (error) {
    console.error('Falha ao consultar Gemini API:', error);
    return null;
  }
}
