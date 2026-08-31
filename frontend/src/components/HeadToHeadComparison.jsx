import React, { useState, useMemo } from 'react';
import { formatBRL, formatPct } from '../utils/formatters';
import { calculateFinancialMetrics } from '../utils/calculations';

export default function HeadToHeadComparison({ assets, occupancy = 55, seazoneFee = 20 }) {
  const [asset1Id, setAsset1Id] = useState('centro_1q');
  const [asset2Id, setAsset2Id] = useState('centro_2q');

  const asset1 = useMemo(() => {
    const raw = assets.find(a => a.id === asset1Id) || assets[0];
    if (!raw) return null;
    return {
      ...raw,
      calc: raw.calc || calculateFinancialMetrics(raw, occupancy, seazoneFee)
    };
  }, [assets, asset1Id, occupancy, seazoneFee]);

  const asset2 = useMemo(() => {
    const raw = assets.find(a => a.id === asset2Id) || assets[1] || assets[0];
    if (!raw) return null;
    return {
      ...raw,
      calc: raw.calc || calculateFinancialMetrics(raw, occupancy, seazoneFee)
    };
  }, [assets, asset2Id, occupancy, seazoneFee]);

  if (!asset1 || !asset2) return null;

  const metrics = [
    {
      label: 'Preço de Aquisição',
      val1: formatBRL(asset1?.market_data?.median_sale_price),
      val2: formatBRL(asset2?.market_data?.median_sale_price),
      better: (asset1?.market_data?.median_sale_price || 0) < (asset2?.market_data?.median_sale_price || 0) ? 1 : 2
    },
    {
      label: 'Preço por m² (Aquisição)',
      val1: `${formatBRL(asset1?.market_data?.median_price_m2)}/m²`,
      val2: `${formatBRL(asset2?.market_data?.median_price_m2)}/m²`,
      better: (asset1?.market_data?.median_price_m2 || 0) < (asset2?.market_data?.median_price_m2 || 0) ? 1 : 2
    },
    {
      label: 'Área Útil Mediana',
      val1: `${asset1?.market_data?.median_area_m2 || 0} m²`,
      val2: `${asset2?.market_data?.median_area_m2 || 0} m²`,
      better: (asset1?.market_data?.median_area_m2 || 0) > (asset2?.market_data?.median_area_m2 || 0) ? 1 : 2
    },
    {
      label: 'Diária Mediana (ADR Airbnb)',
      val1: `${formatBRL(asset1?.rental_pricing?.median_adr)}/dia`,
      val2: `${formatBRL(asset2?.rental_pricing?.median_adr)}/dia`,
      better: (asset1?.rental_pricing?.median_adr || 0) > (asset2?.rental_pricing?.median_adr || 0) ? 1 : 2
    },
    {
      label: `Net Cap Rate (@ ${occupancy}% Ocupação)`,
      val1: formatPct(asset1?.calc?.netCapRate),
      val2: formatPct(asset2?.calc?.netCapRate),
      better: (asset1?.calc?.netCapRate || 0) > (asset2?.calc?.netCapRate || 0) ? 1 : 2,
      highlight: true
    },
    {
      label: 'Gross Cap Rate Anual',
      val1: formatPct(asset1?.calc?.grossCapRate),
      val2: formatPct(asset2?.calc?.grossCapRate),
      better: (asset1?.calc?.grossCapRate || 0) > (asset2?.calc?.grossCapRate || 0) ? 1 : 2
    },
    {
      label: 'Lucro Líquido Anual (NOI)',
      val1: formatBRL(asset1?.calc?.netIncome),
      val2: formatBRL(asset2?.calc?.netIncome),
      better: (asset1?.calc?.netIncome || 0) > (asset2?.calc?.netIncome || 0) ? 1 : 2
    },
    {
      label: 'Fluxo Líquido Médio Mensal',
      val1: `${formatBRL(asset1?.calc?.monthlyNet)}/mês`,
      val2: `${formatBRL(asset2?.calc?.monthlyNet)}/mês`,
      better: (asset1?.calc?.monthlyNet || 0) > (asset2?.calc?.monthlyNet || 0) ? 1 : 2
    },
    {
      label: 'Payback do Investimento',
      val1: `${asset1?.calc?.payback || 0} anos`,
      val2: `${asset2?.calc?.payback || 0} anos`,
      better: Number(asset1?.calc?.payback || 99) < Number(asset2?.calc?.payback || 99) ? 1 : 2
    },
    {
      label: 'Liquidez (% Anúncios com Reviews)',
      val1: `${asset1?.market_data?.liquidity_conversion_pct || 0}%`,
      val2: `${asset2?.market_data?.liquidity_conversion_pct || 0}%`,
      better: (asset1?.market_data?.liquidity_conversion_pct || 0) > (asset2?.market_data?.liquidity_conversion_pct || 0) ? 1 : 2
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-[#0055FF]/25 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0055FF]/20 text-[#0055FF] dark:text-[#3377FF] text-xs font-bold uppercase tracking-wider mb-2">
            <span>⚔️ Comparador Lado a Lado (Head-to-Head)</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Duelo Direto entre Imóveis
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Selecione quaisquer 2 tipologias para confrontar os números de aquisição, diárias e rentabilidade líquida.
          </p>
        </div>

        {/* Quick Duel Presets */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setAsset1Id('centro_1q'); setAsset2Id('centro_2q'); }}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#00143D] text-slate-700 dark:text-slate-300 hover:bg-[#0055FF] hover:text-white transition font-semibold border border-slate-200 dark:border-[#0055FF]/20"
          >
            Centro 1Q vs 2Q
          </button>
          <button
            onClick={() => { setAsset1Id('centro_2q'); setAsset2Id('morretes_2q'); }}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#00143D] text-slate-700 dark:text-slate-300 hover:bg-[#0055FF] hover:text-white transition font-semibold border border-slate-200 dark:border-[#0055FF]/20"
          >
            Centro 2Q vs Morretes 2Q
          </button>
          <button
            onClick={() => { setAsset1Id('morretes_1q'); setAsset2Id('morretes_2q'); }}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#00143D] text-slate-700 dark:text-slate-300 hover:bg-[#0055FF] hover:text-white transition font-semibold border border-slate-200 dark:border-[#0055FF]/20"
          >
            Morretes 1Q vs 2Q
          </button>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#00143D] border border-slate-200 dark:border-[#0055FF]/30">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Ativo A (Desafiante)</label>
          <select
            value={asset1Id}
            onChange={(e) => setAsset1Id(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050B1A] border border-slate-300 dark:border-[#0055FF]/40 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">{asset1?.thesis_role}</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#00143D] border border-slate-200 dark:border-[#0055FF]/30">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Ativo B (Comparado)</label>
          <select
            value={asset2Id}
            onChange={(e) => setAsset2Id(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#050B1A] border border-slate-300 dark:border-[#0055FF]/40 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">{asset2?.thesis_role}</div>
        </div>
      </div>

      {/* Duel Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 dark:bg-[#00143D] text-slate-600 dark:text-slate-300 uppercase font-semibold border-b border-slate-200 dark:border-[#0055FF]/30">
            <tr>
              <th className="p-3.5">Métrica Analisada</th>
              <th className="p-3.5 text-center font-bold text-slate-900 dark:text-white">{asset1?.label}</th>
              <th className="p-3.5 text-center font-bold text-slate-900 dark:text-white">{asset2?.label}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-[#0055FF]/10 font-mono">
            {metrics.map((m, idx) => (
              <tr
                key={idx}
                className={`transition ${m.highlight ? 'bg-[#0055FF]/10 dark:bg-[#0E1E45] font-bold' : 'hover:bg-slate-50 dark:hover:bg-[#00143D]/40'}`}
              >
                <td className="p-3.5 font-sans font-medium text-slate-800 dark:text-slate-200">
                  {m.label}
                </td>
                <td className={`p-3.5 text-center ${m.better === 1 ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-600 dark:text-slate-300'}`}>
                  {m.val1} {m.better === 1 && '⭐'}
                </td>
                <td className={`p-3.5 text-center ${m.better === 2 ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-600 dark:text-slate-300'}`}>
                  {m.val2} {m.better === 2 && '⭐'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
