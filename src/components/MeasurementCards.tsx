/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Magnet, Zap, Activity, Gauge, Database, Compass, ArrowUp, ArrowDown, Minus, Radio } from 'lucide-react';
import { CalculationResults, SimulationParams } from '../types/physics';
import { formatScientific } from '../utils/physics';

interface MeasurementCardsProps {
  params: SimulationParams;
  results: CalculationResults;
}

export const MeasurementCards: React.FC<MeasurementCardsProps> = ({ params, results }) => {
  const vMilli = results.hallVoltageMilliVolts;
  const isPositive = vMilli > 0;
  const isNegative = vMilli < 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Live Measurements & Telemetry
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>Real-time Stream</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        
        {/* 1. Hall Voltage (Primary Hero Card) */}
        <div className="sm:col-span-2 lg:col-span-3 p-4 bg-gradient-to-r from-indigo-50/90 via-indigo-50/30 to-slate-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 block mb-1">
              Transverse Hall Voltage (V_H)
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className={`text-2xl sm:text-3xl font-mono tabular-nums font-bold tracking-tight ${
                isPositive ? 'text-emerald-600 dark:text-emerald-400' :
                isNegative ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'
              }`}>
                {vMilli > 0 ? '+' : ''}{vMilli.toFixed(4)} mV
              </span>
              <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                ({formatScientific(results.hallVoltage, 3)} V)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-sm">
              Probe A: {results.voltmeterProbeTopPolarity} · Probe B: {results.voltmeterProbeBottomPolarity}
            </div>
            <div className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase ${
              isPositive ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
              isNegative ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
              'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}>
              {isPositive ? 'POSITIVE' : isNegative ? 'NEGATIVE' : 'ZERO'}
            </div>
          </div>
        </div>

        {/* 2. Magnetic Field */}
        <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <Magnet className="w-3.5 h-3.5 text-blue-500" />
              Magnetic Field (B)
            </span>
            <span className="font-mono text-xs">{params.fieldDirection === 'into' ? '⊗ Into' : '⊙ Out'}</span>
          </div>
          <div className="text-lg font-mono tabular-nums font-bold text-slate-900 dark:text-white">
            {params.magneticField.toFixed(2)} <span className="text-xs font-sans font-normal text-slate-500">T</span>
          </div>
        </div>

        {/* 3. Electric Current */}
        <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Electric Current (I)
            </span>
            <span className="font-mono text-xs">{params.currentDirection === 'positive' ? '→ L-to-R' : '← R-to-L'}</span>
          </div>
          <div className="text-lg font-mono tabular-nums font-bold text-slate-900 dark:text-white">
            {params.current.toFixed(1)} <span className="text-xs font-sans font-normal text-slate-500">A</span>
          </div>
        </div>

        {/* 4. Hall Coefficient */}
        <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-indigo-500" />
              Hall Coefficient (R_H)
            </span>
          </div>
          <div className="text-sm font-mono tabular-nums font-bold text-slate-900 dark:text-white truncate">
            {formatScientific(results.hallCoefficient, 2)}{' '}
            <span className="text-xs font-sans font-normal text-slate-500">m³/C</span>
          </div>
        </div>

        {/* 5. Carrier Concentration */}
        <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-500" />
              Carrier Density (n)
            </span>
          </div>
          <div className="text-sm font-mono tabular-nums font-bold text-slate-900 dark:text-white truncate">
            {formatScientific(params.carrierDensity, 2)}{' '}
            <span className="text-xs font-sans font-normal text-slate-500">m⁻³</span>
          </div>
        </div>

        {/* 6. Lorentz Force Vector */}
        <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-pink-500" />
              Lorentz Force (F_L)
            </span>
            <span className="font-bold flex items-center gap-0.5 text-pink-600 dark:text-pink-400">
              {results.lorentzForceDirection === 'up' && <ArrowUp className="w-3.5 h-3.5" />}
              {results.lorentzForceDirection === 'down' && <ArrowDown className="w-3.5 h-3.5" />}
              {results.lorentzForceDirection === 'none' && <Minus className="w-3.5 h-3.5" />}
              {results.lorentzForceDirection.toUpperCase()}
            </span>
          </div>
          <div className="text-sm font-mono tabular-nums font-bold text-slate-900 dark:text-white truncate">
            {formatScientific(results.lorentzForceMagnitude, 2)}{' '}
            <span className="text-xs font-sans font-normal text-slate-500">N</span>
          </div>
        </div>

        {/* 7. Hall Electric Field */}
        <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              Hall Field (E_H)
            </span>
          </div>
          <div className="text-sm font-mono tabular-nums font-bold text-slate-900 dark:text-white truncate">
            {formatScientific(results.hallElectricField, 2)}{' '}
            <span className="text-xs font-sans font-normal text-slate-500">V/m</span>
          </div>
        </div>

      </div>
    </div>
  );
};
