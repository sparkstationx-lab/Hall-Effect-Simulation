/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FieldDirection = 'into' | 'out'; // Into screen (-Z) vs Out of screen (+Z)
export type CurrentDirection = 'positive' | 'negative'; // Positive (+X, left to right) vs Negative (-X, right to left)
export type CarrierType = 'electron' | 'hole';

export interface MaterialProperty {
  id: string;
  name: string;
  category: 'Metal' | 'Semiconductor' | 'Custom';
  carrierDensity: number; // m^-3
  carrierType: CarrierType;
  defaultThickness: number; // meters (e.g. 0.0001 m = 0.1 mm)
  defaultWidth: number; // meters (e.g. 0.002 m = 2 mm)
  defaultLength: number; // meters (e.g. 0.01 m = 10 mm)
  mobility: number; // m^2 / (V*s)
  description: string;
}

export interface SimulationParams {
  magneticField: number; // Tesla (0 to 2.0 T)
  fieldDirection: FieldDirection;
  current: number; // Amperes (0 to 5.0 A)
  currentDirection: CurrentDirection;
  materialId: string;
  carrierDensity: number; // m^-3
  carrierType: CarrierType;
  thickness: number; // meters
  width: number; // meters
  length: number; // meters
  mobility: number; // m^2/(V*s)
  particleSpeedScale: number; // 0.5 to 2.0
  isSimulating: boolean;
  showForceVectors: boolean;
  showFieldLines: boolean;
  showTrajectoryTrails: boolean;
}

export interface CalculationResults {
  hallVoltage: number; // Volts (signed)
  hallVoltageMilliVolts: number; // mV (signed)
  hallVoltageMicroVolts: number; // uV (signed)
  hallVoltageMagnitudeMilliVolts: number; // |V_H| in mV
  hallCoefficient: number; // m^3 / C (R_H = 1 / (n * q))
  currentDensity: number; // A / m^2 (J = I / (w * t))
  driftVelocity: number; // m / s (v_d = J / (n * |q|))
  lorentzForceMagnitude: number; // Newtons (F_L = |q| * v_d * B)
  lorentzForceDirection: 'up' | 'down' | 'none'; // Transverse deflection direction along Y-axis
  hallElectricField: number; // V / m (E_H = V_H / w)
  chargeAccumulationTop: '+' | '-' | '0';
  chargeAccumulationBottom: '+' | '-' | '0';
  voltmeterProbeTopPolarity: '+' | '-' | '0';
  voltmeterProbeBottomPolarity: '+' | '-' | '0';
  effectiveCharge: number; // q with sign (-1.602e-19 or +1.602e-19)
}

export interface GraphDataPoint {
  xValue: number;
  hallVoltageMilliVolts: number;
  hallVoltageVolts: number;
  label?: string;
}

export interface ExperimentTask {
  id: string;
  title: string;
  description: string;
  objective: string;
  instructions: string[];
  targetCriteria: (params: SimulationParams, results: CalculationResults) => boolean;
  hint: string;
  explanation: string;
}
