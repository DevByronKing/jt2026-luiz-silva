import React, { useState, useMemo } from 'react';
import { formatBRL, formatPct } from '../utils/formatters';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const STRATEGIES = {
  balanced: {
    id: 'balanced',
    name: '🎯 Balanceada (Tese Vencedora Seazone)',
    description: 'Combina a alta liquidez turística e valorização do Centro 2Q com o yield imbatível de Morretes 2Q.',
    allocation: [
      { assetId: 'centro_2q', share: 0.60, label: 'Centro (2 Quartos)' },
      { assetId: 'morretes_2q', share: 0.40, label: 'Morretes (2 Quartos)' }
    ]
  },
  max_yield: {
    id: 'max_yield',
    name: '🚀 Max Yield (Alavancagem Pura de Rentabilidade)',
    description: 'Foco total no maior Cap Rate da cidade em Morretes para maximizar o fluxo de caixa mensal imediato.',
    allocation: [
      { assetId: 'morretes_2q', share: 0.70, label: 'Morretes (2 Quartos)' },
      { assetId: 'morretes_1q', share: 0.30, label: 'Morretes (1 Quarto)' }
    ]
  },
  conservative: {
    id: 'conservative',
    name: '🛡️ Preservação de Capital & Turismo Premium',
    description: 'Foco em liquidez primária e regiões consagradas para minimização absoluta de risco de desvalorização.',
    allocation: [
      { assetId: 'centro_2q', share: 0.50, label: 'Centro (2 Quartos)' },
      { assetId: 'meia_praia_2q', share: 0.50, label: 'Meia Praia (2 Quartos)' }
    ]
  }
};

export default function PortfolioBuilder({ assets, occupancy, seazoneFee }) {
  const [budget, setBudget] = useState(2000000); // 2 milhões padrão
  const [strategyId, setStrategyId] = useState('balanced');
  const [investorName, setInvestorName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(null);

  const selectedStrategy = STRATEGIES[strategyId];

  const portfolioCalculation = useMemo(() => {
    let totalGrossRevenue = 0;
    let totalSeazoneFee = 0;
    let totalFixedCosts = 0;
    let totalNetIncome = 0;
    let allocatedAssets = [];

    selectedStrategy.allocation.forEach(item => {
      const asset = assets.find(a => a.id === item.assetId) || assets[1];
      const allocatedAmount = budget * item.share;
      
      // Proporção de unidades teóricas ou frações equivalentes
      const unitFraction = allocatedAmount / asset.market_data.median_sale_price;
      const grossRev = asset.calc.grossAnnual * unitFraction;
      const fee = asset.calc.seazoneFee * unitFraction;
      const fixed = asset.calc.fixedCosts * unitFraction;
      const net = asset.calc.netIncome * unitFraction;

      totalGrossRevenue += grossRev;
      totalSeazoneFee += fee;
      totalFixedCosts += fixed;
      totalNetIncome += net;

      allocatedAssets.push({
        ...item,
        asset,
        allocatedAmount,
        unitFraction: unitFraction.toFixed(2),
        grossRev,
        net,
        netCapRate: asset.calc.netCapRate
      });
    });

    const weightedNetCapRate = budget > 0 ? (totalNetIncome / budget) * 100 : 0;
    const weightedGrossCapRate = budget > 0 ? (totalGrossRevenue / budget) * 100 : 0;
    const monthlyCashFlow = totalNetIncome / 12;

    return {
      totalGrossRevenue,
      totalSeazoneFee,
      totalFixedCosts,
      totalNetIncome,
      weightedNetCapRate,
      monthlyCashFlow,
      allocatedAssets
    };
  }, [budget, selectedStrategy, assets, occupancy, seazoneFee]);

  const handleSavePortfolio = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setSaveFeedback({ type: 'warning', text: 'Configure o Supabase no arquivo .env para salvar no banco de dados.' });
      setTimeout(() => setSaveFeedback(null), 4000);
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('portfolio_simulations').insert([
        {
          investor_name: investorName.trim() || 'Investidor Seazone',
          total_budget: budget,
          occupancy_rate: occupancy,
          seazone_fee_pct: seazoneFee,
          strategy_profile: selectedStrategy.name,
          allocated_assets: portfolioCalculation.allocatedAssets.map(a => ({
            id: a.assetId,
            label: a.label,
            share: a.share,
            allocatedAmount: a.allocatedAmount,
            netCapRate: a.netCapRate
          })),
          total_invested: budget,
          remaining_cash: 0,
          expected_annual_net: portfolioCalculation.totalNetIncome,
          weighted_net_cap_rate: portfolioCalculation.weightedNetCapRate,
          monthly_cash_flow: portfolioCalculation.monthlyCashFlow
        }
      ]);

      if (error) throw error;
      setSaveFeedback({ type: 'success', text: '✅ Simulação de Carteira salva com sucesso no Supabase!' });
    } catch (err) {
      setSaveFeedback({ type: 'error', text: `Erro ao salvar: ${err.message}` });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveFeedback(null), 5000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-[#0055FF]/25">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>💼 Otimizador de Alocação de Capital</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Simulador de Carteira Imobiliária
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm max-w-2xl">
              Defina o volume de investimento disponível e simule a distribuição de portfólio entre os ativos vencedores para maximizar o fluxo de caixa mensal consolidado.
            </p>
          </div>

          {/* Budget Presets */}
          <div className="flex flex-wrap gap-2">
            {[1000000, 2000000, 3500000, 5000000].map(val => (
              <button
                key={val}
                onClick={() => setBudget(val)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                  budget === val
                    ? 'bg-[#0055FF] text-white shadow-md shadow-[#0055FF]/30'
                    : 'bg-slate-100 dark:bg-[#00143D] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#002B80] border border-slate-200 dark:border-[#0055FF]/20'
                }`}
              >
                {formatBRL(val)}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Input & Strategy Selection */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8 pt-6 border-t border-slate-200 dark:border-[#0055FF]/20">
          
          <div className="md:col-span-5 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Capital Total para Investimento (R$)
            </label>
            <div className="relative">
              <input
                type="number"
                min="500000"
                max="50000000"
                step="100000"
                value={budget}
                onChange={(e) => setBudget(Math.max(100000, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#050B1A] border border-slate-300 dark:border-[#0055FF]/40 text-lg font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
              />
              <span className="absolute right-4 top-3.5 text-xs text-slate-400 font-mono">BRL</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Simulação considerando ocupação de <strong>{occupancy}%</strong> e gestão Seazone de <strong>{seazoneFee}%</strong>.
            </p>
          </div>

          <div className="md:col-span-7 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Perfil de Alocação Estratégica
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {Object.values(STRATEGIES).map(strat => (
                <button
                  key={strat.id}
                  onClick={() => setStrategyId(strat.id)}
                  className={`p-3 rounded-xl text-left transition border ${
                    strategyId === strat.id
                      ? 'bg-[#0055FF]/10 dark:bg-[#0E1E45] border-[#0055FF] ring-2 ring-[#0055FF]/40'
                      : 'bg-white dark:bg-[#0A1530] border-slate-200 dark:border-[#0055FF]/20 hover:border-[#0055FF]/40'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-white leading-tight">{strat.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{strat.description}</div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Portfolio Summary Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono">
        
        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-[#0055FF]/25">
          <div className="text-[11px] font-sans uppercase font-bold text-slate-500 dark:text-slate-400">Cap Rate Médio Líquido</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatPct(portfolioCalculation.weightedNetCapRate)}
          </div>
          <div className="text-[10px] font-sans text-slate-500 dark:text-slate-400 mt-1">
            Cap Bruto: {formatPct(portfolioCalculation.weightedGrossCapRate)}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-[#0055FF]/25">
          <div className="text-[11px] font-sans uppercase font-bold text-slate-500 dark:text-slate-400">Fluxo Líquido Mensal</div>
          <div className="text-2xl font-black text-[#0055FF] dark:text-[#3377FF] mt-1">
            {formatBRL(portfolioCalculation.monthlyNetCashFlow)}
          </div>
          <div className="text-[10px] font-sans text-slate-500 dark:text-slate-400 mt-1">
            Renda líquida no bolso
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-[#0055FF]/25">
          <div className="text-[11px] font-sans uppercase font-bold text-slate-500 dark:text-slate-400">NOI Anual Consolidado</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatBRL(portfolioCalculation.totalNetIncome)}
          </div>
          <div className="text-[10px] font-sans text-slate-500 dark:text-slate-400 mt-1">
            Lucro operacional anual
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-[#0055FF]/25">
          <div className="text-[11px] font-sans uppercase font-bold text-slate-500 dark:text-slate-400">Faturamento Bruto Total</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatBRL(portfolioCalculation.totalGrossRevenue)}
          </div>
          <div className="text-[10px] font-sans text-slate-500 dark:text-slate-400 mt-1">
            Receita total de estadias
          </div>
        </div>

      </div>

      {/* Breakdown by Allocated Asset */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-[#0055FF]/25">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Composição da Carteira & Distribuição do Capital
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {portfolioCalculation.allocatedAssets.map(item => (
            <div
              key={item.assetId}
              className="p-5 rounded-xl bg-white dark:bg-[#00143D] border border-slate-200 dark:border-[#0055FF]/30 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0055FF]/20 text-[#0055FF] dark:text-[#3377FF]">
                    {Math.round(item.share * 100)}% da Carteira
                  </span>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1.5">{item.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.asset.thesis_role}</p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Capital Alocado</div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">{formatBRL(item.allocatedAmount)}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-200 dark:border-[#0055FF]/20 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Faturamento Bruto Anual:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{formatBRL(item.grossRev)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Lucro Líquido Anual (NOI):</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatBRL(item.net)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Net Cap Rate do Ativo:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatPct(item.netCapRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Preço Unitário de Compra:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{formatBRL(item.asset.market_data.median_sale_price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Strategic Takeaway */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-[#050B1A] border border-slate-200 dark:border-[#0055FF]/20 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          💡 <strong>Recomendação de Portfólio Seazone OS:</strong> A diversificação proposta na estratégia <em>{selectedStrategy.name}</em> distribui o risco operacional entre diferentes perfis de hóspedes (famílias no Centro e turistas com foco em custo-benefício em Morretes), mantendo o Net Cap Rate da carteira em <strong>{formatPct(portfolioCalculation.weightedNetCapRate)}</strong> ao ano.
        </div>

        {/* Supabase Save Simulation Section */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-[#0055FF]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              value={investorName}
              onChange={(e) => setInvestorName(e.target.value)}
              placeholder="Nome do Investidor / Título da Proposta..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#0055FF]/30 bg-slate-50 dark:bg-[#00143D] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
            />
          </div>

          <button
            onClick={handleSavePortfolio}
            disabled={isSaving}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{isSaving ? 'Salvando...' : '💾 Salvar Simulação no Supabase'}</span>
          </button>
        </div>

        {saveFeedback && (
          <div className={`mt-3 p-3 rounded-xl text-xs font-semibold ${
            saveFeedback.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
            saveFeedback.type === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}>
            {saveFeedback.text}
          </div>
        )}
      </div>
    </div>
  );
}
