import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { generateSensitivityChartData } from '../utils/calculations';
import { ASSET_COLORS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function SensitivityChart({ assets, seazoneFee, selectedAssetId }) {
  const { isDark } = useTheme();

  const chartData = useMemo(() => {
    return generateSensitivityChartData(assets, seazoneFee);
  }, [assets, seazoneFee]);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-[#0055FF]/25 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Curva de Sensibilidade: Net Cap Rate vs. Taxa de Ocupação
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Impacto da sazonalidade turística de Itapema (35% a 75%)</p>
        </div>
        <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#00143D] px-2.5 py-1 rounded-md border border-slate-200 dark:border-[#0055FF]/20 font-mono">
          Taxa Seazone: {seazoneFee}%
        </span>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
            <XAxis dataKey="occupancy" stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={11} tickLine={false} />
            <YAxis stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={11} tickFormatter={(v) => `${v}%`} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#00143D' : '#FFFFFF',
                borderColor: '#0055FF',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: isDark ? '#fff' : '#0F172A',
                boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.5)' : '0 10px 25px rgba(0,0,0,0.1)'
              }}
              formatter={(value, name) => {
                const asset = assets.find(a => a.id === name);
                return [`${value}% Net Cap Rate`, asset ? asset.label : name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              formatter={(value) => {
                const asset = assets.find(a => a.id === value);
                return <span style={{ color: isDark ? '#E2E8F0' : '#334155' }}>{asset ? asset.label : value}</span>;
              }}
            />
            {assets.map(asset => {
              const isSelected = asset.id === selectedAssetId;
              return (
                <Line
                  key={asset.id}
                  type="monotone"
                  dataKey={asset.id}
                  stroke={ASSET_COLORS[asset.id] || '#0055FF'}
                  strokeWidth={isSelected ? 3.5 : 1.8}
                  dot={isSelected ? { r: 5 } : false}
                  activeDot={{ r: 6 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
