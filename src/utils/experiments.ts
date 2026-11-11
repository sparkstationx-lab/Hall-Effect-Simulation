/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExperimentTask } from '../types/physics';

export const EXPERIMENT_TASKS: ExperimentTask[] = [
  {
    id: 'exp-1',
    title: '1. P-Type vs N-Type Carrier Polarity Discovery',
    description: 'Determine charge carrier sign by observing Hall voltage polarity.',
    objective: 'Demonstrate that positive holes produce a positive Hall voltage while negative electrons produce a negative Hall voltage.',
    instructions: [
      'Select Silicon (P-type) from the Material dropdown.',
      'Set Magnetic Field B = 1.0 Tesla (Direction: Into screen).',
      'Set Electric Current I = 2.0 Amperes (Direction: Positive / Left-to-Right).',
      'Observe the sign of the Hall voltage V_H measured on the top probe.',
    ],
    targetCriteria: (params, results) => {
      return (
        params.materialId === 'silicon_p' &&
        Math.abs(params.magneticField - 1.0) < 0.15 &&
        params.fieldDirection === 'into' &&
        Math.abs(params.current - 2.0) < 0.25 &&
        params.currentDirection === 'positive' &&
        results.hallVoltageMilliVolts > 0
      );
    },
    hint: 'Select Silicon (P-type), set Magnetic Field = 1.0 T (Into screen), and Current = 2.0 A (Positive). The resulting Hall voltage should be +0.266 mV!',
    explanation: 'In P-type semiconductors, valence holes (+e) drift in the direction of current (+X). The magnetic force pushes holes UP towards the top probe, creating a POSITIVE Hall voltage on Probe A relative to Probe B!',
  },
  {
    id: 'exp-2',
    title: '2. Linear Field Dependence (V_H ∝ B)',
    description: 'Verify the linear relationship between Hall Voltage and Magnetic Field Strength.',
    objective: 'Triple the magnetic field strength from 0.5 T to 1.5 T and observe how Hall Voltage scales.',
    instructions: [
      'Select Silicon (N-type) material.',
      'Set Electric Current I = 3.0 Amperes.',
      'Increase Magnetic Field B to 1.5 Tesla.',
      'Check that the Hall voltage magnitude scales linearly with B.',
    ],
    targetCriteria: (params, results) => {
      return (
        params.materialId === 'silicon_n' &&
        Math.abs(params.magneticField - 1.5) < 0.1 &&
        Math.abs(params.current - 3.0) < 0.2 &&
        results.hallVoltageMagnitudeMilliVolts > 0.5
      );
    },
    hint: 'Set Material = Silicon (N-type), Current = 3.0 A, and Magnetic Field = 1.5 T.',
    explanation: 'According to V_H = (B * I) / (n * q * t), Hall voltage is directly proportional to magnetic field strength B. Doubling B doubles V_H!',
  },
  {
    id: 'exp-3',
    title: '3. Semiconductor Sensor Sensitivity (Germanium N-Type)',
    description: 'Generate high Hall Voltage output in low carrier density materials.',
    objective: 'Achieve a Hall voltage greater than 15 mV using Germanium (N-type).',
    instructions: [
      'Select Germanium (N-type) material from the dropdown.',
      'Set Magnetic Field B = 1.5 Tesla or higher.',
      'Set Electric Current I = 4.0 Amperes or higher.',
      'Observe the strong millivolt voltage response on the live dashboard.',
    ],
    targetCriteria: (params, results) => {
      return (
        params.materialId === 'germanium_n' &&
        params.magneticField >= 1.2 &&
        params.current >= 3.5 &&
        results.hallVoltageMagnitudeMilliVolts >= 15.0
      );
    },
    hint: 'Set Material = Germanium (N-type), B ≥ 1.5 T, and Current ≥ 4.0 A.',
    explanation: 'Germanium has a lower carrier concentration (~2.5 × 10²¹ m⁻³) than Silicon, making it much more sensitive to magnetic fields! This makes semiconductors ideal for magnetic field probes and Hall sensors.',
  },
  {
    id: 'exp-4',
    title: '4. Metal vs Semiconductor Response Comparison',
    description: 'Discover why metals produce tiny microvolt Hall voltages while semiconductors yield millivolts.',
    objective: 'Set up Copper with max current and field, then observe the microvolt scale output.',
    instructions: [
      'Select Copper (Cu) from the Material dropdown.',
      'Set Magnetic Field B = 2.0 Tesla.',
      'Set Electric Current I = 5.0 Amperes.',
      'Observe how small V_H is in metals compared to semiconductors.',
    ],
    targetCriteria: (params, results) => {
      return (
        params.materialId === 'copper' &&
        Math.abs(params.magneticField - 2.0) < 0.1 &&
        Math.abs(params.current - 5.0) < 0.1 &&
        results.hallVoltageMagnitudeMilliVolts < 0.001
      );
    },
    hint: 'Select Copper (Cu), set B = 2.0 T and Current = 5.0 A. Note V_H is around 0.0007 mV (~0.7 µV)!',
    explanation: 'Copper has an enormous electron density (n ≈ 8.47 × 10²⁸ m⁻³). Because V_H is inversely proportional to n, metals produce extremely small Hall voltages (~1 µV), whereas semiconductors produce millivolts!',
  },
  {
    id: 'exp-5',
    title: '5. Double Reversal Invariance Test',
    description: 'Verify that reversing BOTH magnetic field AND current simultaneously maintains the original voltage sign.',
    objective: 'Set Magnetic Field to Out of screen and Current to Negative (Right-to-Left).',
    instructions: [
      'Select Silicon (N-type) material.',
      'Set Magnetic Field direction to Out of screen (⊙).',
      'Set Current direction to Negative / Right-to-Left (←).',
      'Set Field strength B = 1.0 T and Current I = 2.0 A.',
    ],
    targetCriteria: (params) => {
      return (
        params.materialId === 'silicon_n' &&
        params.fieldDirection === 'out' &&
        params.currentDirection === 'negative' &&
        Math.abs(params.magneticField - 1.0) < 0.2 &&
        Math.abs(params.current - 2.0) < 0.3
      );
    },
    hint: 'Set B = 1.0 T (Out of screen) and Current = 2.0 A (Negative / Right-to-Left).',
    explanation: 'Since V_H = (B * I) / (n * q * t), multiplying both B and I by -1 gives (-B) * (-I) = + (B * I). The double reversal leaves the sign of Hall voltage unchanged!',
  },
];
