/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalculationResults, MaterialProperty, SimulationParams } from '../types/physics';

// Fundamental Physics Constants
export const ELEMENTARY_CHARGE = 1.602176634e-19; // Coulombs (C)

// Material Presets
export const MATERIAL_PRESETS: MaterialProperty[] = [
  {
    id: 'copper',
    name: 'Copper (Cu)',
    category: 'Metal',
    carrierDensity: 8.47e28, // ~8.47 x 10^28 m^-3
    carrierType: 'electron',
    defaultThickness: 0.0001, // 0.1 mm
    defaultWidth: 0.002, // 2.0 mm
    defaultLength: 0.010, // 10 mm
    mobility: 0.0043, // m^2 / (V*s)
    description: 'High carrier density metal. Produces tiny microvolt Hall voltages requiring sensitive instrumentation.',
  },
  {
    id: 'silver',
    name: 'Silver (Ag)',
    category: 'Metal',
    carrierDensity: 5.86e28, // ~5.86 x 10^28 m^-3
    carrierType: 'electron',
    defaultThickness: 0.0001, // 0.1 mm
    defaultWidth: 0.002,
    defaultLength: 0.010,
    mobility: 0.0056,
    description: 'Highly conductive metal with dense electron sea resulting in very small Hall voltage response.',
  },
  {
    id: 'silicon_n',
    name: 'Silicon (N-type)',
    category: 'Semiconductor',
    carrierDensity: 1.5e22, // ~1.5 x 10^22 m^-3 (doped)
    carrierType: 'electron',
    defaultThickness: 0.0005, // 0.5 mm
    defaultWidth: 0.002,
    defaultLength: 0.010,
    mobility: 0.135,
    description: 'Doped semiconductor with conduction electrons. Moderate carrier density produces clearly measurable millivolt Hall signals.',
  },
  {
    id: 'silicon_p',
    name: 'Silicon (P-type)',
    category: 'Semiconductor',
    carrierDensity: 1.5e22, // ~1.5 x 10^22 m^-3 (doped)
    carrierType: 'hole',
    defaultThickness: 0.0005, // 0.5 mm
    defaultWidth: 0.002,
    defaultLength: 0.010,
    mobility: 0.048,
    description: 'Doped semiconductor with valence holes as primary carriers. Demonstrates POSITIVE Hall voltage polarity.',
  },
  {
    id: 'germanium_n',
    name: 'Germanium (N-type)',
    category: 'Semiconductor',
    carrierDensity: 2.5e21, // ~2.5 x 10^21 m^-3
    carrierType: 'electron',
    defaultThickness: 0.0005, // 0.5 mm
    defaultWidth: 0.002,
    defaultLength: 0.010,
    mobility: 0.39,
    description: 'High-mobility semiconductor. Lower carrier concentration produces strong Hall voltage outputs ideal for magnetic sensors.',
  },
  {
    id: 'custom',
    name: 'Custom Material',
    category: 'Custom',
    carrierDensity: 1.0e23,
    carrierType: 'electron',
    defaultThickness: 0.0002,
    defaultWidth: 0.002,
    defaultLength: 0.010,
    mobility: 0.05,
    description: 'User-customizable experimental conductor/semiconductor parameters.',
  },
];

/**
 * Calculates Hall effect physics variables based on standard SI equations.
 * 
 * Hall Voltage Equation:
 * V_H = (B * I) / (n * q * t)
 * 
 * where:
 * B = Magnetic field strength in Tesla
 * I = Current in Amperes
 * n = Carrier concentration in m^-3
 * q = Signed charge of carrier (-e for electron, +e for hole)
 * t = Material thickness in meters (perpendicular to field and current)
 */
export function calculateHallEffect(params: SimulationParams): CalculationResults {
  const {
    magneticField,
    fieldDirection,
    current,
    currentDirection,
    carrierDensity,
    carrierType,
    thickness,
    width,
  } = params;

  // Signed charge
  const qSign = carrierType === 'electron' ? -1 : 1;
  const effectiveCharge = qSign * ELEMENTARY_CHARGE;

  // Direction multipliers
  // Field direction: 'into' (-Z) vs 'out' (+Z)
  const bSign = fieldDirection === 'into' ? -1 : 1;
  const B_vector = bSign * Math.abs(magneticField);

  // Current direction: 'positive' (+X, left to right) vs 'negative' (-X, right to left)
  const iSign = currentDirection === 'positive' ? 1 : -1;
  const I_vector = iSign * Math.abs(current);

  // Avoid division by zero
  const safeDensity = Math.max(carrierDensity, 1e12);
  const safeThickness = Math.max(thickness, 1e-7);
  const safeWidth = Math.max(width, 1e-6);

  // Signed Hall Voltage V_H = (B * I) / (n * q * t)
  let hallVoltage = 0;
  if (Math.abs(B_vector) > 1e-9 && Math.abs(I_vector) > 1e-9) {
    hallVoltage = (B_vector * I_vector) / (safeDensity * effectiveCharge * safeThickness);
  }

  const hallVoltageMilliVolts = hallVoltage * 1e3;
  const hallVoltageMicroVolts = hallVoltage * 1e6;
  const hallVoltageMagnitudeMilliVolts = Math.abs(hallVoltageMilliVolts);

  // Hall Coefficient R_H = 1 / (n * q)
  const hallCoefficient = 1 / (safeDensity * effectiveCharge);

  // Current Density J = I / (w * t)
  const crossSectionArea = safeWidth * safeThickness;
  const currentDensity = Math.abs(I_vector) / crossSectionArea;

  // Drift Velocity v_d = J / (n * |q|)
  const driftVelocity = currentDensity / (safeDensity * ELEMENTARY_CHARGE);

  // Lorentz Force Magnitude F_L = |q| * v_d * |B|
  const lorentzForceMagnitude = ELEMENTARY_CHARGE * driftVelocity * Math.abs(B_vector);

  // Transverse Force Direction along Y-axis (top vs bottom)
  // Let's derive vector cross product:
  // X = Right (+X), Y = Up (+Y), Z = Out of Screen (+Z)
  // Current I flows along X: direction = iSign (+X or -X)
  // Carriers velocity direction v_dir:
  // For electrons (q < 0), v_dir = -iSign (opposite current)
  // For holes (q > 0), v_dir = +iSign (same as current)
  // B field direction: bSign (+Z for out, -Z for into)
  // Lorentz Force F = q * (v x B)
  // v = v_dir * i_hat
  // B = bSign * k_hat
  // v x B = (v_dir * i_hat) x (bSign * k_hat) = v_dir * bSign * (i_hat x k_hat) = v_dir * bSign * (-j_hat)
  // Force F = qSign * |q| * [ - v_dir * bSign ] j_hat = - qSign * v_dir * bSign * |q| v_d B j_hat
  // Note:
  // For electrons: qSign = -1, v_dir = -iSign
  // => F_y_factor = - (-1) * (-iSign) * bSign = - iSign * bSign
  // For holes: qSign = +1, v_dir = +iSign
  // => F_y_factor = - (+1) * (+iSign) * bSign = - iSign * bSign
  // Notice that F_y_factor = - iSign * bSign for BOTH electrons and holes!
  // This physically proves that BOTH electrons and holes are deflected in the EXACT SAME Y-DIRECTION
  // whenever iSign and bSign are identical!
  
  let lorentzForceDirection: 'up' | 'down' | 'none' = 'none';
  const forceYFactor = -1 * iSign * bSign;
  if (Math.abs(magneticField) > 1e-4 && Math.abs(current) > 1e-4) {
    if (forceYFactor > 0) {
      lorentzForceDirection = 'up';
    } else if (forceYFactor < 0) {
      lorentzForceDirection = 'down';
    }
  }

  // Charge accumulation:
  // If carriers are deflected UP:
  // - Electrons (negative charge) deflected UP -> Top face gets '-', Bottom face gets '+'
  // - Holes (positive charge) deflected UP -> Top face gets '+', Bottom face gets '-'
  // If carriers are deflected DOWN:
  // - Electrons deflected DOWN -> Bottom face gets '-', Top face gets '+'
  // - Holes deflected DOWN -> Bottom face gets '+', Top face gets '-'
  let chargeAccumulationTop: '+' | '-' | '0' = '0';
  let chargeAccumulationBottom: '+' | '-' | '0' = '0';

  if (lorentzForceDirection === 'up') {
    if (carrierType === 'electron') {
      chargeAccumulationTop = '-';
      chargeAccumulationBottom = '+';
    } else {
      chargeAccumulationTop = '+';
      chargeAccumulationBottom = '-';
    }
  } else if (lorentzForceDirection === 'down') {
    if (carrierType === 'electron') {
      chargeAccumulationTop = '+';
      chargeAccumulationBottom = '-';
    } else {
      chargeAccumulationTop = '-';
      chargeAccumulationBottom = '+';
    }
  }

  // Voltmeter probes: Probe A attached to TOP face, Probe B attached to BOTTOM face.
  // Voltage measured V_top - V_bottom.
  // If top is '+', bottom is '-', Probe A polarity is '+', Probe B is '-', V_H > 0.
  // If top is '-', bottom is '+', Probe A polarity is '-', Probe B is '+', V_H < 0.
  const voltmeterProbeTopPolarity = chargeAccumulationTop;
  const voltmeterProbeBottomPolarity = chargeAccumulationBottom;

  // Hall Electric Field E_H = V_H / w
  const hallElectricField = hallVoltage / safeWidth;

  return {
    hallVoltage,
    hallVoltageMilliVolts,
    hallVoltageMicroVolts,
    hallVoltageMagnitudeMilliVolts,
    hallCoefficient,
    currentDensity,
    driftVelocity,
    lorentzForceMagnitude,
    lorentzForceDirection,
    hallElectricField,
    chargeAccumulationTop,
    chargeAccumulationBottom,
    voltmeterProbeTopPolarity,
    voltmeterProbeBottomPolarity,
    effectiveCharge,
  };
}

/**
 * Generates data points for Hall Voltage vs Magnetic Field (B sweep).
 */
export function generateBFieldSweepData(params: SimulationParams, steps: number = 25) {
  const data = [];
  const maxB = 2.0; // 0 to 2 Tesla
  for (let i = 0; i <= steps; i++) {
    const b = (i / steps) * maxB;
    const testParams = { ...params, magneticField: b };
    const res = calculateHallEffect(testParams);
    data.push({
      xValue: parseFloat(b.toFixed(2)),
      hallVoltageMilliVolts: parseFloat(res.hallVoltageMilliVolts.toFixed(4)),
      hallVoltageVolts: res.hallVoltage,
    });
  }
  return data;
}

/**
 * Generates data points for Hall Voltage vs Electric Current (I sweep).
 */
export function generateCurrentSweepData(params: SimulationParams, steps: number = 25) {
  const data = [];
  const maxI = 5.0; // 0 to 5 Amperes
  for (let i = 0; i <= steps; i++) {
    const currentVal = (i / steps) * maxI;
    const testParams = { ...params, current: currentVal };
    const res = calculateHallEffect(testParams);
    data.push({
      xValue: parseFloat(currentVal.toFixed(2)),
      hallVoltageMilliVolts: parseFloat(res.hallVoltageMilliVolts.toFixed(4)),
      hallVoltageVolts: res.hallVoltage,
    });
  }
  return data;
}

/**
 * Generates data points for Hall Voltage vs Carrier Density (n sweep, log scale).
 */
export function generateCarrierDensitySweepData(params: SimulationParams, steps: number = 25) {
  const data = [];
  // Sweep from 1e20 to 1e29 m^-3 on log scale
  const minLog = 20;
  const maxLog = 29;
  for (let i = 0; i <= steps; i++) {
    const exp = minLog + (i / steps) * (maxLog - minLog);
    const nVal = Math.pow(10, exp);
    const testParams = { ...params, carrierDensity: nVal };
    const res = calculateHallEffect(testParams);
    data.push({
      xValue: nVal,
      hallVoltageMilliVolts: parseFloat(res.hallVoltageMilliVolts.toFixed(4)),
      hallVoltageVolts: res.hallVoltage,
      label: `10^${exp.toFixed(1)}`,
    });
  }
  return data;
}

/**
 * Formats scientific numbers cleanly for UI display (e.g., 1.50 x 10^22 m^-3 or 0.042 mV)
 */
export function formatScientific(num: number, digits: number = 2): string {
  if (num === 0) return '0';
  const abs = Math.abs(num);
  if (abs >= 0.01 && abs < 10000) {
    return num.toLocaleString('en-US', {
      maximumFractionDigits: digits,
      minimumFractionDigits: Math.min(digits, 1),
    });
  }
  return num.toExponential(digits).replace('e+', ' × 10^').replace('e-', ' × 10^-');
}
