/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlPanel } from './components/ControlPanel';
import { GraphsSection } from './components/GraphsSection';
import { GuidedExperiments } from './components/GuidedExperiments';
import { TheorySection } from './components/TheorySection';
import { SimulationParams } from './types/physics';
import { calculateHallEffect, MATERIAL_PRESETS } from './utils/physics';
import { X } from 'lucide-react';

const DEFAULT_PARAMS: SimulationParams = {
  magneticField: 1.0, // 1.0 Tesla
  fieldDirection: 'into',
  current: 2.0, // 2.0 Amperes
  currentDirection: 'positive',
  materialId: 'silicon_n',
  carrierDensity: 1.5e22,
  carrierType: 'electron',
  thickness: 0.0005, // 0.5 mm
  width: 0.002, // 2.0 mm
  length: 0.010, // 10 mm
  mobility: 0.135,
  particleSpeedScale: 1.0,
  isSimulating: true,
  showForceVectors: true,
  showFieldLines: true,
  showTrajectoryTrails: true,
};

export default function App() {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<'none' | 'graphs' | 'experiments' | 'theory'>('none');

  // Sync Dark Mode class on <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Real-time physics calculations
  const results = useMemo(() => {
    return calculateHallEffect(params);
  }, [params]);

  // Action Handlers
  const handleReverseField = () => {
    setParams(prev => ({
      ...prev,
      fieldDirection: prev.fieldDirection === 'into' ? 'out' : 'into',
    }));
  };

  const handleReverseCurrent = () => {
    setParams(prev => ({
      ...prev,
      currentDirection: prev.currentDirection === 'positive' ? 'negative' : 'positive',
    }));
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
  };

  const handleRandomize = () => {
    const randomMat = MATERIAL_PRESETS[Math.floor(Math.random() * (MATERIAL_PRESETS.length - 1))];
    const randomB = parseFloat((0.4 + Math.random() * 1.5).toFixed(2));
    const randomI = parseFloat((0.5 + Math.random() * 4.0).toFixed(1));
    const randomFieldDir = Math.random() > 0.5 ? 'into' : 'out';
    const randomCurrDir = Math.random() > 0.5 ? 'positive' : 'negative';

    setParams({
      ...DEFAULT_PARAMS,
      materialId: randomMat.id,
      carrierDensity: randomMat.carrierDensity,
      carrierType: randomMat.carrierType,
      thickness: randomMat.defaultThickness,
      width: randomMat.defaultWidth,
      length: randomMat.defaultLength,
      mobility: randomMat.mobility,
      magneticField: randomB,
      current: randomI,
      fieldDirection: randomFieldDir,
      currentDirection: randomCurrDir,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onReset={handleReset}
        onRandomize={handleRandomize}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />

      {/* Main Distraction-Free Physics Stage (TWO PRIMARY SECTIONS ONLY) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* SECTION 1: Experimental Controls (4 cols) */}
          <div className="lg:col-span-4">
            <ControlPanel
              params={params}
              setParams={setParams}
              onReverseField={handleReverseField}
              onReverseCurrent={handleReverseCurrent}
              onReset={handleReset}
              onRandomize={handleRandomize}
            />
          </div>

          {/* SECTION 2: Simulation Stage with Integrated Measurement Strip (8 cols) */}
          <div className="lg:col-span-8">
            <SimulationCanvas
              params={params}
              setParams={setParams}
              results={results}
              darkMode={darkMode}
            />
          </div>

        </div>
      </main>

      {/* Secondary Tool Overlay Modals (Graphs / Guided Lab / Theory) */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 my-auto animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {activeModal === 'graphs' && 'Real-Time Parameter Sweeps & Curves'}
                {activeModal === 'experiments' && 'Guided Physics Experiments'}
                {activeModal === 'theory' && 'Hall Effect Physics Theory & Formulations'}
              </h3>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="max-h-[75vh] overflow-y-auto pr-1">
              {activeModal === 'graphs' && (
                <GraphsSection params={params} results={results} darkMode={darkMode} />
              )}
              {activeModal === 'experiments' && (
                <GuidedExperiments params={params} setParams={setParams} results={results} />
              )}
              {activeModal === 'theory' && <TheorySection />}
            </div>

          </div>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-3 text-xs text-center text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span>HallLab — Interactive Hall Effect Physics Lab</span>
          <span className="font-mono text-[11px]">V_H = (B · I) / (n · q · t)</span>
        </div>
      </footer>

    </div>
  );
}
