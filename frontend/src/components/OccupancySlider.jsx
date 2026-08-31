import React from 'react';

export default function OccupancySlider({ occupancy, setOccupancy, seazoneFee, setSeazoneFee }) {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-[#0055FF]/25 glow-blue">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Occupancy Rate */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0055FF]"></div>
              <label className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                Taxa de Ocupação Anual Estimada (AirDNA / Seazone)
              </label>
            </div>
            <span className="text-2xl font-black font-mono text-[#0055FF] bg-blue-50 dark:bg-[#00143D] px-3.5 py-1 rounded-lg border border-[#0055FF]/30 dark:border-[#0055FF]/40">
              {occupancy}% <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({Math.round(365 * occupancy / 100)} noites)</span>
            </span>
          </div>

          <input
            type="range"
            min="35"
            max="75"
            step="1"
            value={occupancy}
            onChange={(e) => setOccupancy(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 dark:bg-[#00143D] rounded-lg appearance-none cursor-pointer slider-seazone border border-slate-300 dark:border-[#0055FF]/30"
          />

          <div className="flex flex-wrap justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 pt-1 gap-2">
            <button 
              onClick={() => setOccupancy(45)} 
              className={`px-3 py-1.5 rounded-lg transition ${
                occupancy === 45 
                  ? 'bg-[#0055FF] text-white shadow-md shadow-[#0055FF]/40 font-bold' 
                  : 'bg-slate-100 dark:bg-[#00143D] hover:bg-slate-200 dark:hover:bg-[#002B80] border border-slate-200 dark:border-[#0055FF]/20 text-slate-700 dark:text-slate-300'
              }`}>
              Cenário Baixa / Conservador (45%)
            </button>
            <button 
              onClick={() => setOccupancy(55)} 
              className={`px-3 py-1.5 rounded-lg transition ${
                occupancy === 55 
                  ? 'bg-[#0055FF] text-white shadow-md shadow-[#0055FF]/40 font-bold' 
                  : 'bg-slate-100 dark:bg-[#00143D] hover:bg-slate-200 dark:hover:bg-[#002B80] border border-slate-200 dark:border-[#0055FF]/20 text-slate-700 dark:text-slate-300'
              }`}>
              Cenário Base Anual (55%)
            </button>
            <button 
              onClick={() => setOccupancy(65)} 
              className={`px-3 py-1.5 rounded-lg transition ${
                occupancy === 65 
                  ? 'bg-[#0055FF] text-white shadow-md shadow-[#0055FF]/40 font-bold' 
                  : 'bg-slate-100 dark:bg-[#00143D] hover:bg-slate-200 dark:hover:bg-[#002B80] border border-slate-200 dark:border-[#0055FF]/20 text-slate-700 dark:text-slate-300'
              }`}>
              Cenário Alta Temporada (65%)
            </button>
          </div>
        </div>

        {/* Seazone Management Fee Control */}
        <div className="bg-slate-50 dark:bg-[#00143D]/90 p-4 rounded-xl border border-slate-200 dark:border-[#0055FF]/30 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Taxa Full-Service Seazone</span>
            <span className="font-mono font-bold text-[#FC6058] text-sm">{seazoneFee}%</span>
          </div>
          <input
            type="range"
            min="15"
            max="25"
            step="1"
            value={seazoneFee}
            onChange={(e) => setSeazoneFee(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-[#050B1A] rounded-lg appearance-none cursor-pointer accent-[#FC6058]"
          />
          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            *Dedução automática no Net Cap Rate: Taxa Seazone + Condomínio + IPTU + Manutenção.
          </div>
        </div>

      </div>
    </div>
  );
}
