import React, { useState, useMemo } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/Header';
import ExecutiveVerdict from './components/ExecutiveVerdict';
import AssetComparisonCard from './components/AssetComparisonCard';
import OccupancySlider from './components/OccupancySlider';
import LeverageSimulator from './components/LeverageSimulator';
import SensitivityChart from './components/SensitivityChart';
import ConsolidatedTable from './components/ConsolidatedTable';
import AICopilot from './components/AICopilot';
import enginePayload from './seazone_engine_payload.json';
import { formatBRL, formatPct } from './utils/formatters';
import { calculateFinancialMetrics, calculateLeverageMetrics } from './utils/calculations';
import { Sparkles } from 'lucide-react';

function DashboardContent() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('verdict'); // 'verdict' | 'simulator' | 'charts' | 'ai'
  const [occupancy, setOccupancy] = useState(55);
  const [seazoneFee, setSeazoneFee] = useState(20);
  const [selectedAssetId, setSelectedAssetId] = useState('centro_2q');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'duel' | 'centro' | 'morretes'

  // Compute metrics across all assets based on sliders
  const computedAssets = useMemo(() => {
    return enginePayload.thesis_duel_assets.map(asset => {
      const isWinner = asset.id === 'centro_2q';
      const isYieldChamp = asset.id === 'morretes_2q';
      const isChallenger = asset.id === 'centro_1q';
      const calc = calculateFinancialMetrics(asset, occupancy, seazoneFee);

      return {
        ...asset,
        is_winner: isWinner,
        is_yield_champ: isYieldChamp,
        is_challenger: isChallenger,
        calc
      };
    });
  }, [occupancy, seazoneFee]);

  // Filtered assets for Tab 1
  const displayedAssets = useMemo(() => {
    if (filterTab === 'duel') {
      return computedAssets.filter(a => ['centro_1q', 'centro_2q', 'morretes_1q', 'morretes_2q'].includes(a.id));
    }
    if (filterTab === 'centro') {
      return computedAssets.filter(a => a.suburb === 'Centro');
    }
    if (filterTab === 'morretes') {
      return computedAssets.filter(a => a.suburb === 'Morretes');
    }
    return computedAssets;
  }, [computedAssets, filterTab]);

  const selectedAsset = computedAssets.find(a => a.id === selectedAssetId) || computedAssets[1];

  const leverageData = useMemo(() => {
    return calculateLeverageMetrics(selectedAsset, selectedAsset.calc, 30, 10.5, 20);
  }, [selectedAsset]);

  return (
    <div className={`min-h-screen pb-20 selection:bg-[#0055FF] selection:text-white transition-colors duration-200 ${isDark ? 'bg-[#050B1A] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      
      {/* Top Header & Tab Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* TAB 1: DUELO DE TESES & VEREDITO EXECUTIVO */}
        {activeTab === 'verdict' && (
          <div className="space-y-8 animate-fade-in">
            {/* Executive Verdict Banner */}
            <ExecutiveVerdict verdict={enginePayload.executive_verdict} selectedAsset={selectedAsset} />

            {/* Quick Filter Navigation & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Painel Comparativo de Ativos Imobiliários
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Clique em qualquer card para detalhar os fluxos de caixa e métricas de rentabilidade.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'Todos os Ativos (6)' },
                  { id: 'duel', label: '⚔️ Duelo de Teses' },
                  { id: 'centro', label: '📍 Apenas Centro' },
                  { id: 'morretes', label: '📍 Apenas Morretes' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterTab(tab.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                      filterTab === tab.id
                        ? 'bg-[#0055FF] text-white shadow-md shadow-[#0055FF]/30'
                        : 'dark:bg-[#00143D] dark:text-slate-300 dark:hover:bg-[#002B80] dark:border-[#0055FF]/20 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6 Asset Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedAssets.map((asset) => (
                <AssetComparisonCard
                  key={asset.id}
                  asset={asset}
                  isSelected={asset.id === selectedAssetId}
                  onSelect={() => setSelectedAssetId(asset.id)}
                />
              ))}
            </div>

            {/* Quick CTA to AI & Simulator */}
            <div className="glass-panel p-5 rounded-2xl border dark:border-[#0055FF]/25 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-[#00143D] text-[#0055FF]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Deseja simular cenários de ocupação ou gerar o dossiê com IA?</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Navegue pelas abas acima para acessar o simulador financeiro e o AI Copilot.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('simulator')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#00143D] hover:bg-slate-200 dark:hover:bg-[#002B80] text-slate-800 dark:text-slate-200 transition"
                >
                  Abrir Simulador 🎛️
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0055FF] hover:bg-[#3377FF] text-white shadow-md shadow-[#0055FF]/30 transition"
                >
                  Consultar IA 🤖
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SIMULADOR FINANCEIRO & DRE OPERACIONAL */}
        {activeTab === 'simulator' && (
          <div className="space-y-8 animate-fade-in">
            {/* Sliders Control */}
            <OccupancySlider
              occupancy={occupancy}
              setOccupancy={setOccupancy}
              seazoneFee={seazoneFee}
              setSeazoneFee={setSeazoneFee}
            />

            {/* DRE Breakdown & Operational Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Asset DRE Card */}
              <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border dark:border-[#0055FF]/25 border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3 dark:border-slate-800 border-slate-200">
                  <div>
                    <span className="text-[11px] font-mono uppercase font-bold text-[#0055FF]">Demonstrativo de Resultado do Exercício (DRE)</span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{selectedAsset.label}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg dark:bg-[#00143D] dark:text-[#3377FF] bg-blue-50 text-[#0055FF] border dark:border-[#0055FF]/30 border-blue-200">
                    Ocupação @ {occupancy}% ({selectedAsset.calc.nights} noites)
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl dark:bg-[#00143D] bg-slate-50 border dark:border-slate-800 border-slate-200 flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">(+) Faturamento Bruto Anual ({selectedAsset.calc.nights} noites x {formatBRL(selectedAsset.rental_pricing.median_adr)})</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{formatBRL(selectedAsset.calc.grossAnnual)}</span>
                  </div>

                  <div className="p-3 rounded-xl dark:bg-[#00143D] bg-slate-50 border dark:border-slate-800 border-slate-200 flex justify-between items-center text-rose-500">
                    <span>(-) Taxa de Gestão Seazone Full-Service ({seazoneFee}%)</span>
                    <span className="font-bold font-mono">-{formatBRL(selectedAsset.calc.seazoneFee)}</span>
                  </div>

                  <div className="p-3 rounded-xl dark:bg-[#00143D] bg-slate-50 border dark:border-slate-800 border-slate-200 flex justify-between items-center text-rose-500">
                    <span>(-) Custos Fixos Anuais (Condomínio + IPTU + Manutenção)</span>
                    <span className="font-bold font-mono">-{formatBRL(selectedAsset.calc.fixedCosts)}</span>
                  </div>

                  <div className="p-3 rounded-xl dark:bg-[#00143D] bg-slate-50 border dark:border-slate-800 border-slate-200 flex justify-between items-center text-rose-500">
                    <span>(-) Taxas de Plataformas OTA (~3%)</span>
                    <span className="font-bold font-mono">-{formatBRL(selectedAsset.calc.otaCosts)}</span>
                  </div>

                  <div className="p-4 rounded-xl dark:bg-emerald-950/40 bg-emerald-50 border dark:border-emerald-500/30 border-emerald-200 flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                    <div>
                      <span className="font-bold text-sm block">(=) Resultado Operacional Líquido Anual (NOI)</span>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-300/80 font-mono">Fluxo Médio: {formatBRL(selectedAsset.calc.monthlyNet)}/mês</span>
                    </div>
                    <span className="font-black font-mono text-lg">{formatBRL(selectedAsset.calc.netIncome)}</span>
                  </div>
                </div>
              </div>

              {/* Right 1 Col: Asset Quick Selector */}
              <div className="glass-panel rounded-2xl p-6 border dark:border-[#0055FF]/25 border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Selecionar Ativo em Foco:</h4>
                <div className="space-y-2">
                  {computedAssets.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setSelectedAssetId(a.id)}
                      className={`w-full p-3 rounded-xl text-left text-xs transition border flex justify-between items-center ${
                        a.id === selectedAssetId
                          ? 'border-[#0055FF] bg-blue-50 dark:bg-[#0E1E45] font-bold text-[#0055FF] dark:text-white ring-1 ring-[#0055FF]'
                          : 'dark:bg-[#00143D] bg-white border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#002B80]'
                      }`}
                    >
                      <span className="truncate max-w-[170px]">{a.label}</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{formatPct(a.calc.netCapRate)} Net</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Leverage Simulator */}
            <LeverageSimulator selectedAsset={selectedAsset} calc={selectedAsset.calc} />
          </div>
        )}

        {/* TAB 3: CURVAS DE SENSIBILIDADE & MATRIZ EXECUTIVA */}
        {activeTab === 'charts' && (
          <div className="space-y-8 animate-fade-in">
            {/* Sensitivity Curve Recharts */}
            <SensitivityChart
              assets={enginePayload.thesis_duel_assets}
              seazoneFee={seazoneFee}
              selectedAssetId={selectedAssetId}
            />

            {/* Master Consolidated Decision Matrix Table */}
            <ConsolidatedTable
              computedAssets={computedAssets}
              occupancy={occupancy}
            />
          </div>
        )}

        {/* TAB 4: SEAZONE AI COPILOT & DOSSIÊ */}
        {activeTab === 'ai' && (
          <div className="space-y-8 animate-fade-in">
            <AICopilot
              selectedAsset={selectedAsset}
              occupancy={occupancy}
              seazoneFee={seazoneFee}
              allAssets={computedAssets}
              leverageData={leverageData}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t dark:border-slate-800 border-slate-200 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>Seazone OS — Decision Support Engine • Desenvolvido com identidade Seazone (Navy #00143D, Azul #0055FF, Coral #FC6058)</p>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
}
