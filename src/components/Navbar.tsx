/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Cpu, RotateCcw, Moon, Sun, Sparkles, BarChart3, Compass, BookOpen, X } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onReset: () => void;
  onRandomize: () => void;
  activeModal: 'none' | 'graphs' | 'experiments' | 'theory';
  setActiveModal: (modal: 'none' | 'graphs' | 'experiments' | 'theory') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onReset,
  onRandomize,
  activeModal,
  setActiveModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        
        {/* Brand Wordmark & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm shadow-indigo-500/20 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              HallLab <span className="font-normal text-slate-500 dark:text-slate-400 text-xs sm:text-sm">| Hall Effect Simulator</span>
            </h1>
          </div>
        </div>

        {/* Secondary Tool Modals (Graphs, Lab Tasks, Theory) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveModal(activeModal === 'graphs' ? 'none' : 'graphs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.98] ${
              activeModal === 'graphs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Graphs</span>
          </button>

          <button
            onClick={() => setActiveModal(activeModal === 'experiments' ? 'none' : 'experiments')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.98] ${
              activeModal === 'experiments'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guided Lab</span>
          </button>

          <button
            onClick={() => setActiveModal(activeModal === 'theory' ? 'none' : 'theory')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.98] ${
              activeModal === 'theory'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Theory</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onRandomize}
            title="Randomize Experiment"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors active:scale-[0.97]"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
          </button>

          <button
            onClick={onReset}
            title="Reset Parameters"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors active:scale-[0.97]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDarkMode(prev => !prev)}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors active:scale-[0.97]"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>

      </div>
    </header>
  );
};
