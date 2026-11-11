/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
  Legend,
} from 'recharts';
import { Download, BarChart3, TrendingUp, Sliders, Info } from 'lucide-react';
import { CalculationResults, SimulationParams } from '../types/physics';
import {
  generateBFieldSweepData,
  generateCurrentSweepData,
  generateCarrierDensitySweepData,
  formatScientific,
} from '../utils/physics';

interface GraphsSectionProps {
  params: SimulationParams;
  results: CalculationResults;
  darkMode: boolean;
}

export const GraphsSection: React.FC<GraphsSectionProps> = ({ params, results, darkMode }) => {
  const [activeGraph, setActiveGraph] = useState<'B' | 'I' | 'n'>('B');

  // Generate real-time sweep curves based on current fixed params
  const bData = generateBFieldSweepData(params);
  const iData = generateCurrentSweepData(params);
  const nData = generateCarrierDensitySweepData(params);

  // CSV Exporter
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeGraph === 'B') {
      csvContent += 'MagneticField_Tesla,HallVoltage_mV,HallVoltage_Volts\n';
      bData.forEach(row => {
        csvContent += `${row.xValue},${row.hallVoltageMilliVolts},${row.hallVoltageVolts}\n`;
      });
    } else if (activeGraph === 'I') {
      csvContent += 'ElectricCurrent_Amperes,HallVoltage_mV,HallVoltage_Volts\n';
      iData.forEach(row => {
        csvContent += `${row.xValue},${row.hallVoltageMilliVolts},${row.hallVoltageVolts}\n`;
      });
    } else {
      csvContent += 'CarrierDensity_m3,HallVoltage_mV,HallVoltage_Volts\n';
      nData.forEach(row => {
        csvContent += `${row.xValue},${row.hallVoltageMilliVolts},${row.hallVoltageVolts}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hall_effect_sweep_${activeGraph}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartTheme = {
    grid: darkMode ? '#334155' : '#E2E8F0',
    text: darkMode ? '#94A3B8' : '#64748B',
    line: '#6366F1', // Indigo
    point: '#EC4899', // Pink
    bg: darkMode ? '#0F172A' : '#FFFFFF',
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5">
      
      {/* Header & Graph Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Real-Time Parameter Sweeps
          </h2>
        </div>

        {/* Graph Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveGraph('B')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.98] ${
              activeGraph === 'B'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            V_H vs Field (B)
          </button>

          <button
            onClick={() => setActiveGraph('I')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.98] ${
              activeGraph === 'I'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            V_H vs Current (I)
          </button>

          <button
            onClick={() => setActiveGraph('n')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.98] ${
              activeGraph === 'n'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            V_H vs Density (n)
          </button>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all active:scale-[0.98] shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-indigo-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Graph Description Banner */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          {activeGraph === 'B' && (
            <p>
              <strong>Hall Voltage vs. Magnetic Field Strength:</strong> Hall voltage $V_H$ increases in direct proportion to $B$. The slope of this line depends on current $I$, carrier concentration $n$, and material thickness $t$. The pink marker indicates your current operating point ($B = {params.magneticField.toFixed(2)}$ T).
            </p>
          )}
          {activeGraph === 'I' && (
            <p>
              <strong>Hall Voltage vs. Electric Current:</strong> Demonstrates linear proportionality $V_H \propto I$. Increasing sample current pushes more charge carriers through per second, increasing transverse carrier deflection. The pink marker represents $I = {params.current.toFixed(1)}$ A.
            </p>
          )}
          {activeGraph === 'n' && (
            <p>
              <strong>Hall Voltage vs. Charge Carrier Density:</strong> Shows an inverse relationship $V_H \propto 1/n$. Dense electron seas in metals produce microvolts, while semiconductors with low carrier density produce strong millivolt signals.
            </p>
          )}
        </div>
      </div>

      {/* Recharts Render Area */}
      <div className="w-full h-[320px] sm:h-[380px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeGraph === 'B' ? (
            <LineChart data={bData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis
                dataKey="xValue"
                stroke={chartTheme.text}
                label={{ value: 'Magnetic Field B (Tesla)', position: 'insideBottom', offset: -10, fill: chartTheme.text, fontSize: 12 }}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                stroke={chartTheme.text}
                label={{ value: 'Hall Voltage V_H (mV)', angle: -90, position: 'insideLeft', offset: 10, fill: chartTheme.text, fontSize: 12 }}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: chartTheme.bg, borderColor: chartTheme.grid, borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: any) => [`${value} mV`, 'Hall Voltage V_H']}
                labelFormatter={(label: any) => `B = ${label} T`}
              />
              <Line type="monotone" dataKey="hallVoltageMilliVolts" stroke="#6366F1" strokeWidth={3} dot={false} />
              <ReferenceDot
                x={params.magneticField}
                y={results.hallVoltageMilliVolts}
                r={7}
                fill="#EC4899"
                stroke="#FFFFFF"
                strokeWidth={2}
                label={{ value: 'Operating Point', fill: '#EC4899', fontSize: 11, fontWeight: 'bold', position: 'top' }}
              />
            </LineChart>
          ) : activeGraph === 'I' ? (
            <LineChart data={iData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis
                dataKey="xValue"
                stroke={chartTheme.text}
                label={{ value: 'Electric Current I (Amperes)', position: 'insideBottom', offset: -10, fill: chartTheme.text, fontSize: 12 }}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                stroke={chartTheme.text}
                label={{ value: 'Hall Voltage V_H (mV)', angle: -90, position: 'insideLeft', offset: 10, fill: chartTheme.text, fontSize: 12 }}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: chartTheme.bg, borderColor: chartTheme.grid, borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: any) => [`${value} mV`, 'Hall Voltage V_H']}
                labelFormatter={(label: any) => `I = ${label} A`}
              />
              <Line type="monotone" dataKey="hallVoltageMilliVolts" stroke="#3B82F6" strokeWidth={3} dot={false} />
              <ReferenceDot
                x={params.current}
                y={results.hallVoltageMilliVolts}
                r={7}
                fill="#EC4899"
                stroke="#FFFFFF"
                strokeWidth={2}
                label={{ value: 'Operating Point', fill: '#EC4899', fontSize: 11, fontWeight: 'bold', position: 'top' }}
              />
            </LineChart>
          ) : (
            <LineChart data={nData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis
                dataKey="xValue"
                scale="log"
                domain={['auto', 'auto']}
                stroke={chartTheme.text}
                tickFormatter={(val: number) => formatScientific(val, 0)}
                label={{ value: 'Carrier Concentration n (m⁻³, Log Scale)', position: 'insideBottom', offset: -10, fill: chartTheme.text, fontSize: 12 }}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                stroke={chartTheme.text}
                label={{ value: 'Hall Voltage V_H (mV)', angle: -90, position: 'insideLeft', offset: 10, fill: chartTheme.text, fontSize: 12 }}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: chartTheme.bg, borderColor: chartTheme.grid, borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: any) => [`${value} mV`, 'Hall Voltage V_H']}
                labelFormatter={(label: any) => `n = ${formatScientific(Number(label), 2)} m⁻³`}
              />
              <Line type="monotone" dataKey="hallVoltageMilliVolts" stroke="#10B981" strokeWidth={3} dot={false} />
              <ReferenceDot
                x={params.carrierDensity}
                y={results.hallVoltageMilliVolts}
                r={7}
                fill="#EC4899"
                stroke="#FFFFFF"
                strokeWidth={2}
                label={{ value: 'Operating Point', fill: '#EC4899', fontSize: 11, fontWeight: 'bold', position: 'top' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

    </div>
  );
};
