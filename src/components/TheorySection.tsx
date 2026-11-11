/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Cpu, Compass, Zap, ShieldCheck } from 'lucide-react';

export const TheorySection: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'hall-effect': true,
    'lorentz-force': true,
    'formula-breakdown': true,
    'semiconductors': false,
    'applications': false,
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Hall Effect Physics Theory & Formulations
        </h2>
      </div>

      {/* Accordion 1: What is the Hall Effect? */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('hall-effect')}
          className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-500" />
            1. What is the Hall Effect?
          </span>
          {openSections['hall-effect'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections['hall-effect'] && (
          <div className="p-4 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <p>
              Discovered by American physicist <strong>Edwin Hall in 1879</strong>, the Hall Effect describes the generation of a transverse electric potential difference (known as the <strong>Hall Voltage</strong>) across an electrical conductor or semiconductor when placed in a perpendicular magnetic field.
            </p>
            <p>
              When an electric current $I$ flows through a material along the X-axis and a magnetic field $B$ is applied along the Z-axis, moving charge carriers experience a magnetic <strong>Lorentz Force</strong> perpendicular to both $I$ and $B$. This force deflects carriers toward one side of the material, causing charge build-up on the transverse surfaces until an opposing transverse electric field $E_H$ balances the magnetic force.
            </p>
          </div>
        )}
      </div>

      {/* Accordion 2: Lorentz Force Derivation */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('lorentz-force')}
          className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            2. The Lorentz Force & Steady-State Equilibrium
          </span>
          {openSections['lorentz-force'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections['lorentz-force'] && (
          <div className="p-4 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <p>
              A charge q moving with drift velocity v_d through a magnetic field B experiences a magnetic force given by vector cross product:
            </p>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-center text-indigo-700 dark:text-indigo-300 font-bold">
              F_B = q · (v_d × B)
            </div>
            <p>
              As charge accumulates along the transverse boundaries (width w), it generates an opposing internal Hall electric field E_H, producing an electric force F_E = q · E_H. At steady state, these two forces reach dynamic equilibrium:
            </p>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-center text-slate-900 dark:text-white font-bold">
              q · E_H = q · v_d · B  ⇒  E_H = v_d · B
            </div>
            <p>
              Multiplying by the transverse sample width $w$ yields the steady-state Hall Voltage:
            </p>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-center text-emerald-600 dark:text-emerald-400 font-bold">
              V_H = E_H · w = v_d · B · w
            </div>
          </div>
        )}
      </div>

      {/* Accordion 3: Main Hall Voltage Equation */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('formula-breakdown')}
          className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            3. The Universal Hall Voltage Formula
          </span>
          {openSections['formula-breakdown'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections['formula-breakdown'] && (
          <div className="p-4 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl border border-indigo-200 dark:border-indigo-800 text-center">
              <div className="text-xl font-mono font-bold text-indigo-700 dark:text-indigo-300">
                V_H = ( B · I ) / ( n · q · t )
              </div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                Hall Voltage = (Magnetic Field × Current) / (Carrier Density × Charge × Thickness)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                <strong className="text-slate-900 dark:text-white">V_H:</strong> Hall Voltage (Volts)
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                <strong className="text-slate-900 dark:text-white">B:</strong> Magnetic field magnitude (Tesla)
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                <strong className="text-slate-900 dark:text-white">I:</strong> Total electric current (Amperes)
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                <strong className="text-slate-900 dark:text-white">n:</strong> Carrier concentration (m⁻³)
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                <strong className="text-slate-900 dark:text-white">q:</strong> Carrier charge (-1.602×10⁻¹⁹ C or +1.602×10⁻¹⁹ C)
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                <strong className="text-slate-900 dark:text-white">t:</strong> Material thickness (meters)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 4: N-Type vs P-Type Semiconductors */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('semiconductors')}
          className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            4. N-Type vs P-Type Semiconductor Polarity
          </span>
          {openSections['semiconductors'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections['semiconductors'] && (
          <div className="p-4 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <p>
              One of the most powerful discoveries enabled by the Hall Effect is the ability to determine whether majority carriers are negative electrons ($e^-$) or positive holes ($h^+$):
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>N-Type Semiconductors:</strong> Primary carriers are electrons ($q = -e$). Electrons drift opposite to current. The magnetic force pushes electrons toward the top probe, making the top probe NEGATIVE relative to the bottom probe ($V_H &lt; 0$).
              </li>
              <li>
                <strong>P-Type Semiconductors:</strong> Primary carriers are valence holes ($q = +e$). Holes drift in the direction of current. The magnetic force pushes holes toward the top probe, making the top probe POSITIVE relative to the bottom probe ($V_H &gt; 0$).
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Accordion 5: Industrial & Scientific Applications */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('applications')}
          className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-pink-500" />
            5. Practical Engineering Applications
          </span>
          {openSections['applications'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections['applications'] && (
          <div className="p-4 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                <strong className="text-slate-900 dark:text-white block mb-1">Magnetic Field Probes (Gaussmeters)</strong>
                Hall sensors measure magnetic flux density in industrial machinery, smartphones (digital compasses), and MRI scanners.
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                <strong className="text-slate-900 dark:text-white block mb-1">Contactless Current Sensors</strong>
                Hall effect current sensors measure high currents in power grids and electric vehicles safely without direct electrical contact.
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                <strong className="text-slate-900 dark:text-white block mb-1">Automotive Speed & Position Sensors</strong>
                Used in ABS brake systems, crankshaft position monitoring, and brushless DC (BLDC) motor commutation.
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                <strong className="text-slate-900 dark:text-white block mb-1">Semiconductor Material Characterization</strong>
                Physicists measure $V_H$ to determine carrier concentration $n$ and mobility $\mu = \sigma \cdot R_H$ in novel materials.
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
