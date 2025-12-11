import { Parser } from './parser';
import { t } from './i18n';

/**
 * Atomic masses for all elements (in g/mol).
 * Values are standard atomic weights from IUPAC.
 */
export const ATOMIC_MASSES: Record<string, number> = {
  // Period 1
  H: 1.008, He: 4.003,
  // Period 2
  Li: 6.941, Be: 9.012, B: 10.81, C: 12.01, N: 14.01, O: 16.00, F: 19.00, Ne: 20.18,
  // Period 3
  Na: 22.99, Mg: 24.31, Al: 26.98, Si: 28.09, P: 30.97, S: 32.07, Cl: 35.45, Ar: 39.95,
  // Period 4
  K: 39.10, Ca: 40.08, Sc: 44.96, Ti: 47.87, V: 50.94, Cr: 52.00, Mn: 54.94, Fe: 55.85,
  Co: 58.93, Ni: 58.69, Cu: 63.55, Zn: 65.38, Ga: 69.72, Ge: 72.64, As: 74.92, Se: 78.97,
  Br: 79.90, Kr: 83.80,
  // Period 5
  Rb: 85.47, Sr: 87.62, Y: 88.91, Zr: 91.22, Nb: 92.91, Mo: 95.95, Tc: 98.00, Ru: 101.1,
  Rh: 102.9, Pd: 106.4, Ag: 107.9, Cd: 112.4, In: 114.8, Sn: 118.7, Sb: 121.8, Te: 127.6,
  I: 126.9, Xe: 131.3,
  // Period 6
  Cs: 132.9, Ba: 137.3,
  // Lanthanides
  La: 138.9, Ce: 140.1, Pr: 140.9, Nd: 144.2, Pm: 145.0, Sm: 150.4, Eu: 152.0, Gd: 157.3,
  Tb: 158.9, Dy: 162.5, Ho: 164.9, Er: 167.3, Tm: 168.9, Yb: 173.0, Lu: 175.0,
  // Period 6 continued
  Hf: 178.5, Ta: 180.9, W: 183.8, Re: 186.2, Os: 190.2, Ir: 192.2, Pt: 195.1, Au: 197.0,
  Hg: 200.6, Tl: 204.4, Pb: 207.2, Bi: 209.0, Po: 209.0, At: 210.0, Rn: 222.0,
  // Period 7
  Fr: 223.0, Ra: 226.0,
  // Actinides
  Ac: 227.0, Th: 232.0, Pa: 231.0, U: 238.0, Np: 237.0, Pu: 244.0, Am: 243.0, Cm: 247.0,
  Bk: 247.0, Cf: 251.0, Es: 252.0, Fm: 257.0, Md: 258.0, No: 259.0, Lr: 262.0,
  // Period 7 continued
  Rf: 267.0, Db: 268.0, Sg: 269.0, Bh: 270.0, Hs: 277.0, Mt: 278.0, Ds: 281.0, Rg: 282.0,
  Cn: 285.0, Nh: 286.0, Fl: 289.0, Mc: 290.0, Lv: 293.0, Ts: 294.0, Og: 294.0,
  // Deuterium (special isotope)
  D: 2.014,
};

/**
 * Result of molar mass calculation.
 */
export interface MolarMassResult {
  /** Total molar mass in g/mol */
  molarMass: number;
  /** Breakdown of mass contribution by element */
  breakdown: Record<string, { count: number; mass: number; total: number }>;
}

/**
 * Calculates the molar mass of a chemical formula.
 *
 * @param formula - Chemical formula string (e.g., 'H2O', 'NaCl', 'Ca(OH)2')
 * @returns Molar mass in g/mol
 *
 * @example
 * ```typescript
 * calculateMolarMass('H2O')   // 18.015
 * calculateMolarMass('NaCl')  // 58.44
 * calculateMolarMass('C6H12O6') // 180.16
 * ```
 */
export function calculateMolarMass(formula: string): number {
  return calculateMolarMassDetailed(formula).molarMass;
}

/**
 * Calculates the molar mass with detailed breakdown by element.
 *
 * @param formula - Chemical formula string
 * @returns MolarMassResult with total mass and element breakdown
 *
 * @example
 * ```typescript
 * calculateMolarMassDetailed('H2O')
 * // {
 * //   molarMass: 18.015,
 * //   breakdown: {
 * //     H: { count: 2, mass: 1.008, total: 2.016 },
 * //     O: { count: 1, mass: 16.00, total: 16.00 }
 * //   }
 * // }
 * ```
 */
export function calculateMolarMassDetailed(formula: string): MolarMassResult {
  const elements = Parser.parseFormula(formula);
  const breakdown: MolarMassResult['breakdown'] = {};
  let totalMass = 0;

  for (const [element, count] of Object.entries(elements)) {
    // Skip charge (_Q) which is used for ionic equations
    if (element === '_Q') continue;

    const atomicMass = ATOMIC_MASSES[element];
    if (atomicMass === undefined) {
      throw new Error(t('error.unknown_element_molar_mass', { element }));
    }

    const elementTotal = atomicMass * count;
    breakdown[element] = {
      count,
      mass: atomicMass,
      total: Math.round(elementTotal * 1000) / 1000, // Round to 3 decimal places
    };
    totalMass += elementTotal;
  }

  return {
    molarMass: Math.round(totalMass * 1000) / 1000, // Round to 3 decimal places
    breakdown,
  };
}
