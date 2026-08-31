import React from 'react';
import { formatBRL, formatPct } from '../utils/formatters';

export default function ConsolidatedTable({ computedAssets, occupancy }) {
  return (
    <div className="glass-panel rounded-2xl p-6 border transition-all duration-300 dark:border-[#0055FF]/25 border-slate-200 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Matriz Executiva Consolidada de Decisão (Master Matrix)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparativo completo dos 6 ativos de Itapema sob o cenário de {occupancy}% de ocupação anual.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-blue-50 dark:bg-[#00143D] text-[#0055FF] dark:text-[#3377FF] border border-blue-200 dark:border-[#0055FF]/30">
          Ocupação Simulada: {occupancy}%
        </span>
      </div>

      <div className="overflow-x-auto pt-2">
        <table className="w-full text-left text-xs">
          <thead className="dark:bg-[#00143D] bg-slate-100 text-slate-700 dark:text-slate-300 uppercase font-semibold border-b dark:border-[#0055FF]/30 border-slate-200">
            <tr>
              <th className="p-3.5">Ativo & Tipologia</th>
              <th className="p-3.5">Preço Compra</th>
              <th className="p-3.5">Preço/m²</th>
              <th className="p-3.5">ADR Airbnb</th>
              <th className="p-3.5">Gross Cap Rate</th>
              <th className="p-3.5 text-emerald-600 dark:text-emerald-400">Net Cap Rate (@ {occupancy}%)</th>
              <th className="p-3.5">Fluxo Mensal Líquido</th>
              <th className="p-3.5">Liquidez / Reviews</th>
              <th className="p-3.5">Veredito Executivo</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-[#0055FF]/10 divide-slate-200 font-mono">
            {computedAssets.map((asset) => (
              <tr key={asset.id} className="dark:hover:bg-[#00143D]/50 hover:bg-slate-50 transition">
                <td className="p-3.5 font-sans font-bold text-slate-900 dark:text-white">
                  {asset.label}
                </td>
                <td className="p-3.5">{formatBRL(asset.market_data.median_sale_price)}</td>
                <td className="p-3.5">{formatBRL(asset.market_data.median_price_m2)}</td>
                <td className="p-3.5">{formatBRL(asset.rental_pricing.median_adr)}</td>
                <td className="p-3.5 text-[#0055FF] dark:text-[#3377FF] font-bold">{formatPct(asset.calc.grossCapRate)}</td>
                <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-black">{formatPct(asset.calc.netCapRate)}</td>
                <td className="p-3.5 text-slate-700 dark:text-slate-200 font-bold">{formatBRL(asset.calc.monthlyNet)}</td>
                <td className="p-3.5 font-sans">
                  <span className="px-2 py-0.5 rounded dark:bg-slate-800 bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px] font-mono">
                    {asset.market_data.liquidity_conversion_pct}% reviews
                  </span>
                </td>
                <td className="p-3.5 font-sans">
                  {asset.is_winner ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#0055FF] text-white text-[10px] font-bold shadow-sm shadow-[#0055FF]/40">
                      🏆 Vencedor Risco/Retorno
                    </span>
                  ) : asset.is_yield_champ ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm shadow-emerald-600/40">
                      🚀 Campeão Yield Puro
                    </span>
                  ) : asset.id === 'centro_1q' ? (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-[#FC6058] border border-rose-500/30 text-[10px] font-bold">
                      ⚠️ Tese Refutada em Yield
                    </span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">Padrão Mercado</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
