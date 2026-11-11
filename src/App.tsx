/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlPanel } from './components/ControlPanel';
import { MeasurementCards } from './components/MeasurementCards';
import { GraphsSection } from './components/GraphsSection';
import { GuidedExperiments } from './components/GuidedExperiments';
import { TheorySection } from './components/TheorySection';
import { SimulationParams } from './types/physics';
import { calculateHallEffect, MATERIAL_PRESETS } from './utils/physics';

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
  const [activeTab, setActiveTab] = useState<'simulation' | 'graphs' | 'experiments' | 'theory'>('simulation');
  const [darkMode, setDarkMode] = useState<boolean>(true);

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
    const randomMat = MATERIAL_PRESETS[Math.floor(Math.random() * (MATERIAL_PRESETS.length - 1))]; // avoid custom
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onReset={handleReset}
        onRandomize={handleRandomize}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* TAB 1: MAIN SIMULATION DASHBOARD */}
        {activeTab === 'simulation' && (
          <div className="space-y-6">
            
            {/* Split Screen Layout: Left Controls (1/3) + Right Main Stage (2/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Control Panel (4 cols) */}
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

              {/* Center/Right Simulation Canvas (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <SimulationCanvas
                  params={params}
                  setParams={setParams}
                  results={results}
                  darkMode={darkMode}
                />

                {/* Real-Time Measurement Telemetry Cards */}
                <MeasurementCards params={params} results={results} />
              </div>

            </div>

            {/* Embedded Graphs Strip below Main Stage */}
            <GraphsSection params={params} results={results} darkMode={darkMode} />
          </div>
        )}

        {/* TAB 2: REAL-TIME GRAPHS */}
        {activeTab === 'graphs' && (
          <div className="space-y-6">
            <GraphsSection params={params} results={results} darkMode={darkMode} />
            <MeasurementCards params={params} results={results} />
          </div>
        )}

        {/* TAB 3: GUIDED LAB EXPERIMENTS */}
        {activeTab === 'experiments' && (
          <div className="space-y-6">
            <GuidedExperiments params={params} setParams={setParams} results={results} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <SimulationCanvas params={params} setParams={setParams} results={results} darkMode={darkMode} />
              </div>
              <div className="lg:col-span-5">
                <ControlPanel
                  params={params}
                  setParams={setParams}
                  onReverseField={handleReverseField}
                  onReverseCurrent={handleReverseCurrent}
                  onReset={handleReset}
                  onRandomize={handleRandomize}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: THEORY & FORMULAS */}
        {activeTab === 'theory' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <TheorySection />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-xs text-center text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>HallLab — Interactive Hall Effect Virtual Physics Laboratory</span>
          <div className="flex items-center gap-3">
            <span>V_H = (B · I) / (n · q · t)</span>
            <span>·</span>
            <span>Lorentz Force F = q(v × B)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
