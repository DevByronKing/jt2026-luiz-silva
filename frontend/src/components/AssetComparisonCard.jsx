import React from 'react';
import { formatBRL, formatPct } from '../utils/formatters';

export default function AssetComparisonCard({ asset, isSelected, onSelect }) {
  const isWinner = asset.is_winner;
  const isYieldChamp = asset.is_yield_champ;
  const isChallenger = asset.id === 'centro_1q';

  return (
    <div
      onClick={onSelect}
      className={`glass-card rounded-2xl p-5 cursor-pointer relative transition-all ${
        isSelected
          ? 'ring-2 ring-[#0055FF] glow-blue bg-blue-50/50 dark:bg-[#0E1E45]'
          : 'bg-white dark:bg-transparent'
      } ${isWinner ? 'border-t-4 border-t-[#0055FF]' : ''} ${
        isYieldChamp ? 'border-t-4 border-t-emerald-500' : ''
      } ${isChallenger ? 'border-t-4 border-t-[#FC6058]' : ''}`}
    >
      {/* Role Badge */}
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
          isWinner ? 'bg-[#0055FF]/20 text-[#0055FF] dark:text-[#3377FF] border border-[#0055FF]/40' :
          isYieldChamp ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40' :
          isChallenger ? 'bg-rose-500/20 text-[#FC6058] border border-rose-500/40' :
          'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
        }`}>
          {asset.thesis_role}
        </span>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Score Seazone</span>
          <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">{asset.scores.overall_index}/100</div>
        </div>
      </div>

      {/* Header */}
      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{asset.label}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
        {asset.market_data.median_area_m2} m² • {formatBRL(asset.market_data.median_price_m2)}/m²
      </p>

      {/* Cap Rate Spotlight */}
      <div className="grid grid-cols-2 gap-3 my-4 p-3 rounded-xl bg-slate-50 dark:bg-[#00143D]/90 border border-slate-200 dark:border-[#0055FF]/20">
        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Net Cap Rate</span>
          <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {formatPct(asset.calc.netCapRate)}
          </div>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Gross Cap Rate</span>
          <div className="text-xl font-black font-mono text-[#0055FF] dark:text-[#3377FF]">
            {formatPct(asset.calc.grossCapRate)}
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div className="space-y-2 text-xs border-t border-slate-200 dark:border-[#0055FF]/15 pt-3">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Preço Aquisição:</span>
          <span className="font-semibold font-mono text-slate-900 dark:text-white">{formatBRL(asset.market_data.median_sale_price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Diária Mediana (ADR):</span>
          <span className="font-semibold font-mono text-slate-900 dark:text-white">{formatBRL(asset.rental_pricing.median_adr)}/dia</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Faturamento Bruto Anual:</span>
          <span className="font-semibold font-mono text-slate-700 dark:text-slate-200">{formatBRL(asset.calc.grossAnnual)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Fluxo Líquido/mês:</span>
          <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{formatBRL(asset.calc.monthlyNet)}/mês</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Payback Estimado:</span>
          <span className="font-semibold font-mono text-slate-700 dark:text-slate-300">{asset.calc.payback} anos</span>
        </div>
      </div>

      {/* Liquidity Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#0055FF]/15 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>Conversão Reviews: <strong className="text-slate-900 dark:text-white font-mono">{asset.market_data.liquidity_conversion_pct}%</strong></span>
        <span>Média Reviews: <strong className="text-slate-900 dark:text-white font-mono">{asset.market_data.avg_reviews_per_listing}</strong></span>
      </div>
    </div>
  );
}
