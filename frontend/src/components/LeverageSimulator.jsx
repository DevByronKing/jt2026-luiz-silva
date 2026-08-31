import React, { useState, useMemo } from 'react';
import { formatBRL, formatPct } from '../utils/formatters';
import { calculateLeverageMetrics } from '../utils/calculations';
import { Landmark, TrendingUp, AlertCircle, ShieldCheck, DollarSign } from 'lucide-react';

export default function LeverageSimulator({ selectedAsset, calc }) {
  const [downPaymentPct, setDownPaymentPct] = useState(30);
  const [interestRate, setInterestRate] = useState(10.5);
  const [loanTerm, setLoanTerm] = useState(20);

  const leverage = useMemo(() => {
    return calculateLeverageMetrics(selectedAsset, calc, downPaymentPct, interestRate, loanTerm);
  }, [selectedAsset, calc, downPaymentPct, interestRate, loanTerm]);

  return (
    <div className="glass-panel rounded-2xl p-6 border transition-all duration-300 dark:border-[#0055FF]/25 border-slate-200 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-4 dark:border-slate-800 border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <Landmark className="w-5 h-5 text-[#0055FF]" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Simulador de Alavancagem Financeira (Financiamento Bancário)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simule o impacto do financiamento com capital próprio reduzido sobre o <strong>Cash-on-Cash Return</strong> para {selectedAsset?.label}.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-lg bg-blue-50 dark:bg-[#00143D] text-[#0055FF] dark:text-[#3377FF] border border-blue-200 dark:border-[#0055FF]/30">
            Sistema Price (Parcela Fixa)
          </span>
        </div>
      </div>

      {/* Control Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Down Payment % Slider */}
        <div className="p-4 rounded-xl dark:bg-[#00143D]/90 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Entrada (Capital Próprio)</span>
            <span className="font-mono font-bold text-[#0055FF] text-sm">{downPaymentPct}% ({formatBRL(leverage.downPayment)})</span>
          </div>
          <input
            type="range"
            min="20"
            max="60"
            step="5"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#0055FF] dark:bg-[#050B1A] bg-slate-200"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>20% (Max Alav.)</span>
            <span>40%</span>
            <span>60% (Conservador)</span>
          </div>
        </div>

        {/* Annual Interest Rate Slider */}
        <div className="p-4 rounded-xl dark:bg-[#00143D]/90 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Taxa de Juros Efetiva</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{interestRate}% a.a.</span>
          </div>
          <input
            type="range"
            min="8.5"
            max="13.5"
            step="0.5"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#0055FF] dark:bg-[#050B1A] bg-slate-200"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>8.5% (SBPE Prime)</span>
            <span>10.5% (Médio)</span>
            <span>13.5% (Estresse)</span>
          </div>
        </div>

        {/* Loan Term Years Slider */}
        <div className="p-4 rounded-xl dark:bg-[#00143D]/90 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Prazo de Amortização</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{loanTerm} anos</span>
          </div>
          <input
            type="range"
            min="10"
            max="30"
            step="5"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#0055FF] dark:bg-[#050B1A] bg-slate-200"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>10 anos</span>
            <span>20 anos</span>
            <span>30 anos</span>
          </div>
        </div>

      </div>

      {/* Leveraged Financial KPI Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        
        {/* Metric 1: Cash-on-Cash Return */}
        <div className="p-4 rounded-xl dark:bg-[#00143D] bg-slate-50 border dark:border-[#0055FF]/30 border-slate-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cash-on-Cash Return</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className={`text-2xl font-black font-mono ${leverage.cashOnCashReturn > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
            {formatPct(leverage.cashOnCashReturn)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Retorno líquido anual / Capital próprio de entrada ({formatBRL(leverage.downPayment)}).
          </div>
        </div>

        {/* Metric 2: Prestação Mensal */}
        <div className="p-4 rounded-xl dark:bg-[#00143D] bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Prestação Mensal (Price)</span>
            <DollarSign className="w-4 h-4 text-[#0055FF]" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {formatBRL(leverage.monthlyPayment)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Serviço da Dívida Anual: {formatBRL(leverage.annualDebtService)}
          </div>
        </div>

        {/* Metric 3: Fluxo de Caixa Líquido Alavancado */}
        <div className="p-4 rounded-xl dark:bg-[#00143D] bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fluxo Líquido Alavancado</span>
            <AlertCircle className={`w-4 h-4 ${leverage.isPositiveCashFlow ? 'text-emerald-500' : 'text-rose-500'}`} />
          </div>
          <div className={`text-xl font-bold font-mono ${leverage.isPositiveCashFlow ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
            {formatBRL(leverage.leveragedMonthlyCashFlow)}/mês
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Líquido do Imóvel ({formatBRL(calc?.monthlyNet)}) - Parcela ({formatBRL(leverage.monthlyPayment)})
          </div>
        </div>

        {/* Metric 4: DSCR (Índice de Cobertura do Serviço da Dívida) */}
        <div className="p-4 rounded-xl dark:bg-[#00143D] bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Índice DSCR (Cobertura)</span>
            <ShieldCheck className={`w-4 h-4 ${leverage.dscr >= 1.2 ? 'text-emerald-500' : 'text-amber-500'}`} />
          </div>
          <div className={`text-xl font-bold font-mono ${leverage.dscr >= 1.2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
            {leverage.dscr}x
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {leverage.dscr >= 1.2 ? '✅ Caixa saudável (>1.2x dívida)' : '⚠️ Atenção: Caixa próximo do limite da dívida'}
          </div>
        </div>

      </div>

    </div>
  );
}
