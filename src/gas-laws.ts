/**
 * Gas Laws Calculator
 * Calculates properties of ideal gases using PV=nRT and related equations.
 */

import { CalculationError } from './errors';
import { t } from './i18n';

/**
 * Pressure units supported.
 */
export type PressureUnit = 'atm' | 'kPa' | 'mmHg' | 'Pa' | 'bar' | 'psi';

/**
 * Volume units supported.
 */
export type VolumeUnit = 'L' | 'mL' | 'm3';

/**
 * Temperature units supported.
 */
export type TemperatureUnit = 'K' | 'C' | 'F';

/**
 * Conversion factors to SI units.
 */
const PRESSURE_TO_PA: Record<PressureUnit, number> = {
  Pa: 1,
  kPa: 1000,
  atm: 101325,
  mmHg: 133.322,
  bar: 100000,
  psi: 6894.76,
};

const VOLUME_TO_M3: Record<VolumeUnit, number> = {
  m3: 1,
  L: 0.001,
  mL: 0.000001,
};

/**
 * Gas constant R in different unit combinations.
 */
export const GAS_CONSTANT = {
  /** L·atm/(mol·K) */
  L_atm: 0.08206,
  /** J/(mol·K) or m³·Pa/(mol·K) */
  J: 8.314,
  /** L·kPa/(mol·K) */
  L_kPa: 8.314,
  /** cal/(mol·K) */
  cal: 1.987,
};

/**
 * Input for ideal gas law calculation.
 * Provide any 3 of the 4 variables (P, V, n, T) to solve for the fourth.
 */
export interface IdealGasInput {
  /** Pressure value */
  P?: number;
  /** Pressure unit */
  PUnit?: PressureUnit;
  /** Volume value */
  V?: number;
  /** Volume unit */
  VUnit?: VolumeUnit;
  /** Moles of gas */
  n?: number;
  /** Temperature value */
  T?: number;
  /** Temperature unit */
  TUnit?: TemperatureUnit;
}

/**
 * Result of ideal gas law calculation.
 */
export interface IdealGasResult {
  /** Pressure in atm */
  P: number;
  /** Volume in L */
  V: number;
  /** Moles of gas */
  n: number;
  /** Temperature in K */
  T: number;
  /** Which variable was solved for */
  solvedFor: 'P' | 'V' | 'n' | 'T';
  /** The equation used */
  equation: string;
}

/**
 * Converts temperature to Kelvin.
 */
function toKelvin(value: number, unit: TemperatureUnit): number {
  switch (unit) {
    case 'K':
      return value;
    case 'C':
      return value + 273.15;
    case 'F':
      return (value - 32) * (5 / 9) + 273.15;
  }
}

/**
 * Converts pressure to atm.
 */
function toAtm(value: number, unit: PressureUnit): number {
  return (value * PRESSURE_TO_PA[unit]) / PRESSURE_TO_PA['atm'];
}

/**
 * Converts volume to liters.
 */
function toLiters(value: number, unit: VolumeUnit): number {
  return (value * VOLUME_TO_M3[unit]) / VOLUME_TO_M3['L'];
}

/**
 * Calculates properties of an ideal gas using PV = nRT.
 *
 * @param input - Object with 3 of 4 variables (P, V, n, T)
 * @returns IdealGasResult with all 4 variables
 *
 * @example
 * ```typescript
 * // Find volume of 1 mol of gas at STP
 * idealGasLaw({ P: 1, PUnit: 'atm', n: 1, T: 273.15, TUnit: 'K' })
 * // { V: 22.4, ... }
 *
 * // Find pressure given V, n, T
 * idealGasLaw({ V: 10, VUnit: 'L', n: 2, T: 300, TUnit: 'K' })
 * // { P: 4.93, ... }
 * ```
 */
export function idealGasLaw(input: IdealGasInput): IdealGasResult {
  const R = GAS_CONSTANT.L_atm;

  // Convert all inputs to standard units
  const P = input.P !== undefined ? toAtm(input.P, input.PUnit || 'atm') : undefined;
  const V = input.V !== undefined ? toLiters(input.V, input.VUnit || 'L') : undefined;
  const n = input.n;
  const T = input.T !== undefined ? toKelvin(input.T, input.TUnit || 'K') : undefined;

  // Count provided variables
  const provided = [P, V, n, T].filter(x => x !== undefined).length;

  if (provided !== 3) {
    throw new CalculationError(t('error.missing_variables', { variables: 'P, V, n, T' }));
  }

  let solvedFor: 'P' | 'V' | 'n' | 'T';
  let result: { P: number; V: number; n: number; T: number };

  if (P === undefined) {
    // Solve for P: P = nRT/V
    const calcP = (n! * R * T!) / V!;
    result = { P: calcP, V: V!, n: n!, T: T! };
    solvedFor = 'P';
  } else if (V === undefined) {
    // Solve for V: V = nRT/P
    const calcV = (n! * R * T!) / P;
    result = { P, V: calcV, n: n!, T: T! };
    solvedFor = 'V';
  } else if (n === undefined) {
    // Solve for n: n = PV/RT
    const calcN = (P * V) / (R * T!);
    result = { P, V, n: calcN, T: T! };
    solvedFor = 'n';
  } else {
    // Solve for T: T = PV/nR
    const calcT = (P * V) / (n * R);
    result = { P, V, n, T: calcT };
    solvedFor = 'T';
  }

  // Round results
  result.P = Math.round(result.P * 10000) / 10000;
  result.V = Math.round(result.V * 10000) / 10000;
  result.n = Math.round(result.n * 10000) / 10000;
  result.T = Math.round(result.T * 100) / 100;

  return {
    ...result,
    solvedFor,
    equation: `PV = nRT => ${result.P} × ${result.V} = ${result.n} × ${R} × ${result.T}`,
  };
}

/**
 * Input for combined gas law calculation.
 * Requires initial and final conditions with one unknown.
 */
export interface CombinedGasInput {
  /** Initial pressure */
  P1?: number;
  /** Initial volume */
  V1?: number;
  /** Initial temperature (in K) */
  T1?: number;
  /** Final pressure */
  P2?: number;
  /** Final volume */
  V2?: number;
  /** Final temperature (in K) */
  T2?: number;
}

/**
 * Result of combined gas law calculation.
 */
export interface CombinedGasResult {
  /** All values */
  P1: number;
  V1: number;
  T1: number;
  P2: number;
  V2: number;
  T2: number;
  /** Which variable was solved for */
  solvedFor: 'P1' | 'V1' | 'T1' | 'P2' | 'V2' | 'T2';
}

/**
 * Calculates gas properties using the combined gas law: P1V1/T1 = P2V2/T2.
 *
 * @param input - Object with 5 of 6 variables
 * @returns CombinedGasResult with all 6 variables
 *
 * @example
 * ```typescript
 * // Find final volume after temperature change
 * combinedGasLaw({ P1: 1, V1: 10, T1: 300, P2: 1, T2: 600 })
 * // { V2: 20, ... }
 * ```
 */
export function combinedGasLaw(input: CombinedGasInput): CombinedGasResult {
  const { P1, V1, T1, P2, V2, T2 } = input;

  // Count provided variables
  const values = [P1, V1, T1, P2, V2, T2];
  const provided = values.filter(x => x !== undefined).length;

  if (provided !== 5) {
    throw new CalculationError(t('error.missing_variables', { variables: 'P1, V1, T1, P2, V2, T2' }));
  }

  let solvedFor: 'P1' | 'V1' | 'T1' | 'P2' | 'V2' | 'T2';
  let result: CombinedGasResult;

  // P1V1/T1 = P2V2/T2
  if (P1 === undefined) {
    const calcP1 = (P2! * V2! * T1!) / (V1! * T2!);
    result = { P1: calcP1, V1: V1!, T1: T1!, P2: P2!, V2: V2!, T2: T2!, solvedFor: 'P1' };
  } else if (V1 === undefined) {
    const calcV1 = (P2! * V2! * T1!) / (P1 * T2!);
    result = { P1, V1: calcV1, T1: T1!, P2: P2!, V2: V2!, T2: T2!, solvedFor: 'V1' };
  } else if (T1 === undefined) {
    const calcT1 = (P1 * V1 * T2!) / (P2! * V2!);
    result = { P1, V1, T1: calcT1, P2: P2!, V2: V2!, T2: T2!, solvedFor: 'T1' };
  } else if (P2 === undefined) {
    const calcP2 = (P1 * V1 * T2!) / (V2! * T1);
    result = { P1, V1, T1, P2: calcP2, V2: V2!, T2: T2!, solvedFor: 'P2' };
  } else if (V2 === undefined) {
    const calcV2 = (P1 * V1 * T2!) / (P2 * T1);
    result = { P1, V1, T1, P2, V2: calcV2, T2: T2!, solvedFor: 'V2' };
  } else {
    const calcT2 = (P2 * V2 * T1) / (P1 * V1);
    result = { P1, V1, T1, P2, V2, T2: calcT2, solvedFor: 'T2' };
  }

  // Round all values
  const keys = ['P1', 'V1', 'T1', 'P2', 'V2', 'T2'] as const;
  for (const key of keys) {
    (result[key] as number) = Math.round(result[key] * 10000) / 10000;
  }

  return result;
}

/**
 * Calculates the molar volume of an ideal gas at given conditions.
 *
 * @param T - Temperature in Kelvin
 * @param P - Pressure in atm (default: 1 atm)
 * @returns Molar volume in L/mol
 */
export function molarVolume(T: number, P: number = 1): number {
  const R = GAS_CONSTANT.L_atm;
  return (R * T) / P;
}

/**
 * Standard Temperature and Pressure (STP) conditions.
 */
export const STP = {
  /** Temperature in K */
  T: 273.15,
  /** Pressure in atm */
  P: 1,
  /** Molar volume at STP in L/mol */
  Vm: 22.414,
};
