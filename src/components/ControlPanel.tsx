/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sliders, Magnet, Zap, Layers, RefreshCw, ArrowLeftRight, Sparkles, MoveHorizontal, Box } from 'lucide-react';
import { SimulationParams } from '../types/physics';
import { MATERIAL_PRESETS } from '../utils/physics';

interface ControlPanelProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  onReverseField: () => void;
  onReverseCurrent: () => void;
  onReset: () => void;
  onRandomize: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  params,
  setParams,
  onReverseField,
  onReverseCurrent,
  onReset,
  onRandomize,
}) => {
  const isCustom = params.materialId === 'custom';

  const handleMaterialSelect = (materialId: string) => {
    const mat = MATERIAL_PRESETS.find(m => m.id === materialId);
    if (mat) {
      setParams(prev => ({
        ...prev,
        materialId,
        carrierDensity: mat.carrierDensity,
        carrierType: mat.carrierType,
        thickness: mat.defaultThickness,
        width: mat.defaultWidth,
        length: mat.defaultLength,
        mobility: mat.mobility,
      }));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-5">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <Sliders className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Control Parameters
          </h2>
        </div>
        <button
          onClick={onRandomize}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800/80 transition-all active:scale-[0.97]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Randomize</span>
        </button>
      </div>

      {/* 1. Material Selector */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <span>Sample Material</span>
        </label>

        <select
          value={params.materialId}
          onChange={e => handleMaterialSelect(e.target.value)}
          className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
        >
          {MATERIAL_PRESETS.map(mat => (
            <option key={mat.id} value={mat.id}>
              {mat.name} ({mat.category})
            </option>
          ))}
        </select>

        {/* Selected Material Summary Note */}
        {MATERIAL_PRESETS.find(m => m.id === params.materialId) && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/80 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
            {MATERIAL_PRESETS.find(m => m.id === params.materialId)?.description}
          </p>
        )}
      </div>

      {/* 2. Magnetic Field Control */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Magnet className="w-3.5 h-3.5 text-blue-500" />
            <span>Magnetic Field (B)</span>
          </label>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
            {params.magneticField.toFixed(2)} Tesla
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="2.0"
          step="0.05"
          value={params.magneticField}
          onChange={e => setParams(prev => ({ ...prev, magneticField: parseFloat(e.target.value) }))}
          className="w-full h-2 rounded-lg cursor-pointer"
        />

        {/* Segmented Direction Toggle */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            onClick={() => setParams(prev => ({ ...prev, fieldDirection: 'into' }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all active:scale-[0.98] ${
              params.fieldDirection === 'into'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-sm font-mono leading-none">⊗</span>
            <span>Into Screen (-Z)</span>
          </button>

          <button
            onClick={() => setParams(prev => ({ ...prev, fieldDirection: 'out' }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all active:scale-[0.98] ${
              params.fieldDirection === 'out'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-sm font-mono leading-none">⊙</span>
            <span>Out of Screen (+Z)</span>
          </button>
        </div>
      </div>

      {/* 3. Electric Current Control */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Electric Current (I)</span>
          </label>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
            {params.current.toFixed(1)} Amperes
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="5.0"
          step="0.1"
          value={params.current}
          onChange={e => setParams(prev => ({ ...prev, current: parseFloat(e.target.value) }))}
          className="w-full h-2 rounded-lg cursor-pointer"
        />

        {/* Current Direction Toggle */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            onClick={() => setParams(prev => ({ ...prev, currentDirection: 'positive' }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all active:scale-[0.98] ${
              params.currentDirection === 'positive'
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Left to Right (→)</span>
          </button>

          <button
            onClick={() => setParams(prev => ({ ...prev, currentDirection: 'negative' }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all active:scale-[0.98] ${
              params.currentDirection === 'negative'
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Right to Left (←)</span>
          </button>
        </div>
      </div>

      {/* 4. Fine Material & Geometry Parameters */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Box className="w-3.5 h-3.5 text-indigo-500" />
          <span>Geometry & Carrier Type</span>
        </label>

        {/* Thickness Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Thickness (t)</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {(params.thickness * 1000).toFixed(2)} mm
            </span>
          </div>
          <input
            type="range"
            min="0.00005"
            max="0.002"
            step="0.00005"
            value={params.thickness}
            onChange={e => setParams(prev => ({ ...prev, thickness: parseFloat(e.target.value) }))}
            className="w-full h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Carrier Type Toggle */}
        <div className="space-y-1 pt-1">
          <span className="block text-xs font-medium text-slate-600 dark:text-slate-400">
            Primary Charge Carrier
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setParams(prev => ({ ...prev, carrierType: 'electron' }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-[0.98] ${
                params.carrierType === 'electron'
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              Electrons (e⁻)
            </button>
            <button
              onClick={() => setParams(prev => ({ ...prev, carrierType: 'hole' }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-[0.98] ${
                params.carrierType === 'hole'
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              Holes (h⁺)
            </button>
          </div>
        </div>

        {/* Custom Material Options */}
        {isCustom && (
          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 space-y-2.5 text-xs">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
              Custom Material Properties
            </span>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">
                Carrier Density n (m⁻³)
              </label>
              <input
                type="number"
                value={params.carrierDensity}
                onChange={e => setParams(prev => ({ ...prev, carrierDensity: parseFloat(e.target.value) || 1e22 }))}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">
                Sample Width w (meters)
              </label>
              <input
                type="number"
                step="0.0005"
                value={params.width}
                onChange={e => setParams(prev => ({ ...prev, width: parseFloat(e.target.value) || 0.002 }))}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. Quick Reversal Actions */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onReverseField}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-500" />
            <span>Reverse B-Field</span>
          </button>

          <button
            onClick={onReverseCurrent}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-500" />
            <span>Reverse Current</span>
          </button>
        </div>

        <button
          onClick={onReset}
          className="w-full py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset All Parameters</span>
        </button>
      </div>

    </div>
  );
};
