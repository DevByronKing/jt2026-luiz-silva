import React from 'react';

export default function ExecutiveVerdict({ verdict, selectedAsset }) {
  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-slate-200 dark:border-[#0055FF]/30 glow-blue">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0055FF]/10 dark:bg-[#0055FF]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#FC6058]/10 dark:bg-[#FC6058]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 dark:bg-[#FC6058]/20 border border-rose-500/30 dark:border-[#FC6058]/40 text-[#FC6058] text-xs font-bold uppercase tracking-wider mb-3">
              <span>⚡ Veredito Quantitativo Executivo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Duelo de Teses: O Mito dos Compactos no Centro vs. Maximização de Retorno
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed">
              A análise matemática empírica <strong className="text-[#FC6058]">refuta a tese inicial</strong> de que studios/1 quarto no Centro oferecem o melhor retorno. O m² inflacionado de compra no Centro (<strong className="text-slate-900 dark:text-white">R$ 19.905/m²</strong>) esmaga o Cap Rate. O ativo mais eficiente para a Seazone no equilíbrio de risco-retorno é o <strong className="text-[#0055FF] dark:text-[#3377FF]">Centro 2 Quartos</strong> (Net Yield 6,75%), com alternativa de alto yield em <strong className="text-emerald-600 dark:text-emerald-400">Morretes</strong> (Net Yield 8,65%).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[260px]">
            <div className="bg-slate-50 dark:bg-[#00143D]/90 p-4 rounded-xl border border-slate-200 dark:border-[#0055FF]/30 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ativo Campeão de Equilíbrio</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between mt-1">
                <span>Centro (2 Quartos)</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0055FF] text-white font-bold">Top 1</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Cap Rate Líquido @ 55%: <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">6,75%</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#00143D]/90 p-4 rounded-xl border border-emerald-500/30 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Campeão de Yield Puro (Low Ticket)</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between mt-1">
                <span>Morretes (2 Quartos)</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">Max Yield</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Cap Rate Líquido @ 55%: <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">8,65%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-[#0055FF]/20 text-xs">
          <div className="bg-slate-50/90 dark:bg-[#00143D]/70 p-4 rounded-xl border border-slate-200 dark:border-[#0055FF]/20 shadow-sm">
            <span className="text-[#FC6058] font-bold text-sm block mb-1">1. Esmagamento de Cap Rate no 1Q Centro</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              O m² no 1Q Centro custa R$ 19.905/m² (+52,5% vs 2Q). Como a diária do 2Q é 30% maior (R$ 557 vs R$ 427), o 2Q entrega Cap Rate superior (10,17% vs 9,63% bruto).
            </p>
          </div>
          <div className="bg-slate-50/90 dark:bg-[#00143D]/70 p-4 rounded-xl border border-slate-200 dark:border-[#0055FF]/20 shadow-sm">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm block mb-1">2. Morretes: Oportunidade de Yield Puro</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Ticket de entrada acessível (R$ 750k no 2Q) com diárias consistentes (R$ 448), gerando 11,99% de Cap Rate Bruto e 8,65% Net.
            </p>
          </div>
          <div className="bg-slate-50/90 dark:bg-[#00143D]/70 p-4 rounded-xl border border-slate-200 dark:border-[#0055FF]/20 shadow-sm">
            <span className="text-[#0055FF] dark:text-[#3377FF] font-bold text-sm block mb-1">3. Recomendação de Alocação Seazone</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Alocação ideal: 60% do fundo em Centro 2Q (resiliência e liquidez turística) e 40% em Morretes 1Q/2Q (alavancagem de yield da carteira).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
