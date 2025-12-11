/**
 * Unified element database for the periodic table.
 * Single source of truth for all element data.
 */

/**
 * Complete element information.
 */
export interface ElementData {
  /** Element symbol (e.g., 'H', 'Fe') */
  symbol: string;
  /** Element name (e.g., 'Hydrogen', 'Iron') */
  name: string;
  /** Atomic number */
  atomicNumber: number;
  /** Atomic mass in g/mol (standard atomic weight from IUPAC) */
  atomicMass: number;
  /** Common oxidation states */
  oxidationStates: number[];
  /** Electronegativity (Pauling scale), undefined for noble gases */
  electronegativity?: number;
  /** Element category */
  category: ElementCategory;
}

/**
 * Element categories for classification.
 */
export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

/**
 * Complete periodic table data.
 * Includes all 118 elements plus Deuterium (D) as a special isotope.
 */
export const ELEMENTS: Record<string, ElementData> = {
  // Period 1
  H: { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, atomicMass: 1.008, oxidationStates: [-1, 1], electronegativity: 2.20, category: 'nonmetal' },
  He: { symbol: 'He', name: 'Helium', atomicNumber: 2, atomicMass: 4.003, oxidationStates: [0], category: 'noble-gas' },
  
  // Period 2
  Li: { symbol: 'Li', name: 'Lithium', atomicNumber: 3, atomicMass: 6.941, oxidationStates: [1], electronegativity: 0.98, category: 'alkali-metal' },
  Be: { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, atomicMass: 9.012, oxidationStates: [2], electronegativity: 1.57, category: 'alkaline-earth-metal' },
  B: { symbol: 'B', name: 'Boron', atomicNumber: 5, atomicMass: 10.81, oxidationStates: [3], electronegativity: 2.04, category: 'metalloid' },
  C: { symbol: 'C', name: 'Carbon', atomicNumber: 6, atomicMass: 12.01, oxidationStates: [-4, -3, -2, -1, 0, 1, 2, 3, 4], electronegativity: 2.55, category: 'nonmetal' },
  N: { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, atomicMass: 14.01, oxidationStates: [-3, -2, -1, 0, 1, 2, 3, 4, 5], electronegativity: 3.04, category: 'nonmetal' },
  O: { symbol: 'O', name: 'Oxygen', atomicNumber: 8, atomicMass: 16.00, oxidationStates: [-2, -1, 0], electronegativity: 3.44, category: 'nonmetal' },
  F: { symbol: 'F', name: 'Fluorine', atomicNumber: 9, atomicMass: 19.00, oxidationStates: [-1], electronegativity: 3.98, category: 'halogen' },
  Ne: { symbol: 'Ne', name: 'Neon', atomicNumber: 10, atomicMass: 20.18, oxidationStates: [0], category: 'noble-gas' },
  
  // Period 3
  Na: { symbol: 'Na', name: 'Sodium', atomicNumber: 11, atomicMass: 22.99, oxidationStates: [1], electronegativity: 0.93, category: 'alkali-metal' },
  Mg: { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, atomicMass: 24.31, oxidationStates: [2], electronegativity: 1.31, category: 'alkaline-earth-metal' },
  Al: { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, atomicMass: 26.98, oxidationStates: [3], electronegativity: 1.61, category: 'post-transition-metal' },
  Si: { symbol: 'Si', name: 'Silicon', atomicNumber: 14, atomicMass: 28.09, oxidationStates: [-4, 4], electronegativity: 1.90, category: 'metalloid' },
  P: { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, atomicMass: 30.97, oxidationStates: [-3, 3, 5], electronegativity: 2.19, category: 'nonmetal' },
  S: { symbol: 'S', name: 'Sulfur', atomicNumber: 16, atomicMass: 32.07, oxidationStates: [-2, 2, 4, 6], electronegativity: 2.58, category: 'nonmetal' },
  Cl: { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, atomicMass: 35.45, oxidationStates: [-1, 1, 3, 5, 7], electronegativity: 3.16, category: 'halogen' },
  Ar: { symbol: 'Ar', name: 'Argon', atomicNumber: 18, atomicMass: 39.95, oxidationStates: [0], category: 'noble-gas' },
  
  // Period 4
  K: { symbol: 'K', name: 'Potassium', atomicNumber: 19, atomicMass: 39.10, oxidationStates: [1], electronegativity: 0.82, category: 'alkali-metal' },
  Ca: { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, atomicMass: 40.08, oxidationStates: [2], electronegativity: 1.00, category: 'alkaline-earth-metal' },
  Sc: { symbol: 'Sc', name: 'Scandium', atomicNumber: 21, atomicMass: 44.96, oxidationStates: [3], electronegativity: 1.36, category: 'transition-metal' },
  Ti: { symbol: 'Ti', name: 'Titanium', atomicNumber: 22, atomicMass: 47.87, oxidationStates: [2, 3, 4], electronegativity: 1.54, category: 'transition-metal' },
  V: { symbol: 'V', name: 'Vanadium', atomicNumber: 23, atomicMass: 50.94, oxidationStates: [2, 3, 4, 5], electronegativity: 1.63, category: 'transition-metal' },
  Cr: { symbol: 'Cr', name: 'Chromium', atomicNumber: 24, atomicMass: 52.00, oxidationStates: [2, 3, 6], electronegativity: 1.66, category: 'transition-metal' },
  Mn: { symbol: 'Mn', name: 'Manganese', atomicNumber: 25, atomicMass: 54.94, oxidationStates: [2, 3, 4, 6, 7], electronegativity: 1.55, category: 'transition-metal' },
  Fe: { symbol: 'Fe', name: 'Iron', atomicNumber: 26, atomicMass: 55.85, oxidationStates: [2, 3], electronegativity: 1.83, category: 'transition-metal' },
  Co: { symbol: 'Co', name: 'Cobalt', atomicNumber: 27, atomicMass: 58.93, oxidationStates: [2, 3], electronegativity: 1.88, category: 'transition-metal' },
  Ni: { symbol: 'Ni', name: 'Nickel', atomicNumber: 28, atomicMass: 58.69, oxidationStates: [2, 3], electronegativity: 1.91, category: 'transition-metal' },
  Cu: { symbol: 'Cu', name: 'Copper', atomicNumber: 29, atomicMass: 63.55, oxidationStates: [1, 2], electronegativity: 1.90, category: 'transition-metal' },
  Zn: { symbol: 'Zn', name: 'Zinc', atomicNumber: 30, atomicMass: 65.38, oxidationStates: [2], electronegativity: 1.65, category: 'transition-metal' },
  Ga: { symbol: 'Ga', name: 'Gallium', atomicNumber: 31, atomicMass: 69.72, oxidationStates: [3], electronegativity: 1.81, category: 'post-transition-metal' },
  Ge: { symbol: 'Ge', name: 'Germanium', atomicNumber: 32, atomicMass: 72.64, oxidationStates: [2, 4], electronegativity: 2.01, category: 'metalloid' },
  As: { symbol: 'As', name: 'Arsenic', atomicNumber: 33, atomicMass: 74.92, oxidationStates: [-3, 3, 5], electronegativity: 2.18, category: 'metalloid' },
  Se: { symbol: 'Se', name: 'Selenium', atomicNumber: 34, atomicMass: 78.97, oxidationStates: [-2, 4, 6], electronegativity: 2.55, category: 'nonmetal' },
  Br: { symbol: 'Br', name: 'Bromine', atomicNumber: 35, atomicMass: 79.90, oxidationStates: [-1, 1, 3, 5], electronegativity: 2.96, category: 'halogen' },
  Kr: { symbol: 'Kr', name: 'Krypton', atomicNumber: 36, atomicMass: 83.80, oxidationStates: [0, 2], category: 'noble-gas' },
  
  // Period 5
  Rb: { symbol: 'Rb', name: 'Rubidium', atomicNumber: 37, atomicMass: 85.47, oxidationStates: [1], electronegativity: 0.82, category: 'alkali-metal' },
  Sr: { symbol: 'Sr', name: 'Strontium', atomicNumber: 38, atomicMass: 87.62, oxidationStates: [2], electronegativity: 0.95, category: 'alkaline-earth-metal' },
  Y: { symbol: 'Y', name: 'Yttrium', atomicNumber: 39, atomicMass: 88.91, oxidationStates: [3], electronegativity: 1.22, category: 'transition-metal' },
  Zr: { symbol: 'Zr', name: 'Zirconium', atomicNumber: 40, atomicMass: 91.22, oxidationStates: [4], electronegativity: 1.33, category: 'transition-metal' },
  Nb: { symbol: 'Nb', name: 'Niobium', atomicNumber: 41, atomicMass: 92.91, oxidationStates: [3, 5], electronegativity: 1.60, category: 'transition-metal' },
  Mo: { symbol: 'Mo', name: 'Molybdenum', atomicNumber: 42, atomicMass: 95.95, oxidationStates: [2, 3, 4, 5, 6], electronegativity: 2.16, category: 'transition-metal' },
  Tc: { symbol: 'Tc', name: 'Technetium', atomicNumber: 43, atomicMass: 98.00, oxidationStates: [4, 7], electronegativity: 1.90, category: 'transition-metal' },
  Ru: { symbol: 'Ru', name: 'Ruthenium', atomicNumber: 44, atomicMass: 101.1, oxidationStates: [2, 3, 4, 6, 8], electronegativity: 2.20, category: 'transition-metal' },
  Rh: { symbol: 'Rh', name: 'Rhodium', atomicNumber: 45, atomicMass: 102.9, oxidationStates: [3], electronegativity: 2.28, category: 'transition-metal' },
  Pd: { symbol: 'Pd', name: 'Palladium', atomicNumber: 46, atomicMass: 106.4, oxidationStates: [2, 4], electronegativity: 2.20, category: 'transition-metal' },
  Ag: { symbol: 'Ag', name: 'Silver', atomicNumber: 47, atomicMass: 107.9, oxidationStates: [1], electronegativity: 1.93, category: 'transition-metal' },
  Cd: { symbol: 'Cd', name: 'Cadmium', atomicNumber: 48, atomicMass: 112.4, oxidationStates: [2], electronegativity: 1.69, category: 'transition-metal' },
  In: { symbol: 'In', name: 'Indium', atomicNumber: 49, atomicMass: 114.8, oxidationStates: [3], electronegativity: 1.78, category: 'post-transition-metal' },
  Sn: { symbol: 'Sn', name: 'Tin', atomicNumber: 50, atomicMass: 118.7, oxidationStates: [2, 4], electronegativity: 1.96, category: 'post-transition-metal' },
  Sb: { symbol: 'Sb', name: 'Antimony', atomicNumber: 51, atomicMass: 121.8, oxidationStates: [-3, 3, 5], electronegativity: 2.05, category: 'metalloid' },
  Te: { symbol: 'Te', name: 'Tellurium', atomicNumber: 52, atomicMass: 127.6, oxidationStates: [-2, 4, 6], electronegativity: 2.10, category: 'metalloid' },
  I: { symbol: 'I', name: 'Iodine', atomicNumber: 53, atomicMass: 126.9, oxidationStates: [-1, 1, 5, 7], electronegativity: 2.66, category: 'halogen' },
  Xe: { symbol: 'Xe', name: 'Xenon', atomicNumber: 54, atomicMass: 131.3, oxidationStates: [0, 2, 4, 6], category: 'noble-gas' },
  
  // Period 6
  Cs: { symbol: 'Cs', name: 'Cesium', atomicNumber: 55, atomicMass: 132.9, oxidationStates: [1], electronegativity: 0.79, category: 'alkali-metal' },
  Ba: { symbol: 'Ba', name: 'Barium', atomicNumber: 56, atomicMass: 137.3, oxidationStates: [2], electronegativity: 0.89, category: 'alkaline-earth-metal' },
  
  // Lanthanides
  La: { symbol: 'La', name: 'Lanthanum', atomicNumber: 57, atomicMass: 138.9, oxidationStates: [3], electronegativity: 1.10, category: 'lanthanide' },
  Ce: { symbol: 'Ce', name: 'Cerium', atomicNumber: 58, atomicMass: 140.1, oxidationStates: [3, 4], electronegativity: 1.12, category: 'lanthanide' },
  Pr: { symbol: 'Pr', name: 'Praseodymium', atomicNumber: 59, atomicMass: 140.9, oxidationStates: [3], electronegativity: 1.13, category: 'lanthanide' },
  Nd: { symbol: 'Nd', name: 'Neodymium', atomicNumber: 60, atomicMass: 144.2, oxidationStates: [3], electronegativity: 1.14, category: 'lanthanide' },
  Pm: { symbol: 'Pm', name: 'Promethium', atomicNumber: 61, atomicMass: 145.0, oxidationStates: [3], electronegativity: 1.13, category: 'lanthanide' },
  Sm: { symbol: 'Sm', name: 'Samarium', atomicNumber: 62, atomicMass: 150.4, oxidationStates: [2, 3], electronegativity: 1.17, category: 'lanthanide' },
  Eu: { symbol: 'Eu', name: 'Europium', atomicNumber: 63, atomicMass: 152.0, oxidationStates: [2, 3], electronegativity: 1.20, category: 'lanthanide' },
  Gd: { symbol: 'Gd', name: 'Gadolinium', atomicNumber: 64, atomicMass: 157.3, oxidationStates: [3], electronegativity: 1.20, category: 'lanthanide' },
  Tb: { symbol: 'Tb', name: 'Terbium', atomicNumber: 65, atomicMass: 158.9, oxidationStates: [3], electronegativity: 1.20, category: 'lanthanide' },
  Dy: { symbol: 'Dy', name: 'Dysprosium', atomicNumber: 66, atomicMass: 162.5, oxidationStates: [3], electronegativity: 1.22, category: 'lanthanide' },
  Ho: { symbol: 'Ho', name: 'Holmium', atomicNumber: 67, atomicMass: 164.9, oxidationStates: [3], electronegativity: 1.23, category: 'lanthanide' },
  Er: { symbol: 'Er', name: 'Erbium', atomicNumber: 68, atomicMass: 167.3, oxidationStates: [3], electronegativity: 1.24, category: 'lanthanide' },
  Tm: { symbol: 'Tm', name: 'Thulium', atomicNumber: 69, atomicMass: 168.9, oxidationStates: [3], electronegativity: 1.25, category: 'lanthanide' },
  Yb: { symbol: 'Yb', name: 'Ytterbium', atomicNumber: 70, atomicMass: 173.0, oxidationStates: [2, 3], electronegativity: 1.10, category: 'lanthanide' },
  Lu: { symbol: 'Lu', name: 'Lutetium', atomicNumber: 71, atomicMass: 175.0, oxidationStates: [3], electronegativity: 1.27, category: 'lanthanide' },
  
  // Period 6 continued
  Hf: { symbol: 'Hf', name: 'Hafnium', atomicNumber: 72, atomicMass: 178.5, oxidationStates: [4], electronegativity: 1.30, category: 'transition-metal' },
  Ta: { symbol: 'Ta', name: 'Tantalum', atomicNumber: 73, atomicMass: 180.9, oxidationStates: [5], electronegativity: 1.50, category: 'transition-metal' },
  W: { symbol: 'W', name: 'Tungsten', atomicNumber: 74, atomicMass: 183.8, oxidationStates: [4, 6], electronegativity: 2.36, category: 'transition-metal' },
  Re: { symbol: 'Re', name: 'Rhenium', atomicNumber: 75, atomicMass: 186.2, oxidationStates: [4, 7], electronegativity: 1.90, category: 'transition-metal' },
  Os: { symbol: 'Os', name: 'Osmium', atomicNumber: 76, atomicMass: 190.2, oxidationStates: [4, 8], electronegativity: 2.20, category: 'transition-metal' },
  Ir: { symbol: 'Ir', name: 'Iridium', atomicNumber: 77, atomicMass: 192.2, oxidationStates: [3, 4], electronegativity: 2.20, category: 'transition-metal' },
  Pt: { symbol: 'Pt', name: 'Platinum', atomicNumber: 78, atomicMass: 195.1, oxidationStates: [2, 4], electronegativity: 2.28, category: 'transition-metal' },
  Au: { symbol: 'Au', name: 'Gold', atomicNumber: 79, atomicMass: 197.0, oxidationStates: [1, 3], electronegativity: 2.54, category: 'transition-metal' },
  Hg: { symbol: 'Hg', name: 'Mercury', atomicNumber: 80, atomicMass: 200.6, oxidationStates: [1, 2], electronegativity: 2.00, category: 'transition-metal' },
  Tl: { symbol: 'Tl', name: 'Thallium', atomicNumber: 81, atomicMass: 204.4, oxidationStates: [1, 3], electronegativity: 1.62, category: 'post-transition-metal' },
  Pb: { symbol: 'Pb', name: 'Lead', atomicNumber: 82, atomicMass: 207.2, oxidationStates: [2, 4], electronegativity: 1.87, category: 'post-transition-metal' },
  Bi: { symbol: 'Bi', name: 'Bismuth', atomicNumber: 83, atomicMass: 209.0, oxidationStates: [3, 5], electronegativity: 2.02, category: 'post-transition-metal' },
  Po: { symbol: 'Po', name: 'Polonium', atomicNumber: 84, atomicMass: 209.0, oxidationStates: [2, 4], electronegativity: 2.00, category: 'metalloid' },
  At: { symbol: 'At', name: 'Astatine', atomicNumber: 85, atomicMass: 210.0, oxidationStates: [-1, 1], electronegativity: 2.20, category: 'halogen' },
  Rn: { symbol: 'Rn', name: 'Radon', atomicNumber: 86, atomicMass: 222.0, oxidationStates: [0], category: 'noble-gas' },
  
  // Period 7
  Fr: { symbol: 'Fr', name: 'Francium', atomicNumber: 87, atomicMass: 223.0, oxidationStates: [1], electronegativity: 0.70, category: 'alkali-metal' },
  Ra: { symbol: 'Ra', name: 'Radium', atomicNumber: 88, atomicMass: 226.0, oxidationStates: [2], electronegativity: 0.90, category: 'alkaline-earth-metal' },
  
  // Actinides
  Ac: { symbol: 'Ac', name: 'Actinium', atomicNumber: 89, atomicMass: 227.0, oxidationStates: [3], electronegativity: 1.10, category: 'actinide' },
  Th: { symbol: 'Th', name: 'Thorium', atomicNumber: 90, atomicMass: 232.0, oxidationStates: [4], electronegativity: 1.30, category: 'actinide' },
  Pa: { symbol: 'Pa', name: 'Protactinium', atomicNumber: 91, atomicMass: 231.0, oxidationStates: [4, 5], electronegativity: 1.50, category: 'actinide' },
  U: { symbol: 'U', name: 'Uranium', atomicNumber: 92, atomicMass: 238.0, oxidationStates: [3, 4, 5, 6], electronegativity: 1.38, category: 'actinide' },
  Np: { symbol: 'Np', name: 'Neptunium', atomicNumber: 93, atomicMass: 237.0, oxidationStates: [3, 4, 5, 6], electronegativity: 1.36, category: 'actinide' },
  Pu: { symbol: 'Pu', name: 'Plutonium', atomicNumber: 94, atomicMass: 244.0, oxidationStates: [3, 4, 5, 6], electronegativity: 1.28, category: 'actinide' },
  Am: { symbol: 'Am', name: 'Americium', atomicNumber: 95, atomicMass: 243.0, oxidationStates: [3, 4, 5, 6], electronegativity: 1.30, category: 'actinide' },
  Cm: { symbol: 'Cm', name: 'Curium', atomicNumber: 96, atomicMass: 247.0, oxidationStates: [3], electronegativity: 1.30, category: 'actinide' },
  Bk: { symbol: 'Bk', name: 'Berkelium', atomicNumber: 97, atomicMass: 247.0, oxidationStates: [3, 4], electronegativity: 1.30, category: 'actinide' },
  Cf: { symbol: 'Cf', name: 'Californium', atomicNumber: 98, atomicMass: 251.0, oxidationStates: [3], electronegativity: 1.30, category: 'actinide' },
  Es: { symbol: 'Es', name: 'Einsteinium', atomicNumber: 99, atomicMass: 252.0, oxidationStates: [3], electronegativity: 1.30, category: 'actinide' },
  Fm: { symbol: 'Fm', name: 'Fermium', atomicNumber: 100, atomicMass: 257.0, oxidationStates: [3], electronegativity: 1.30, category: 'actinide' },
  Md: { symbol: 'Md', name: 'Mendelevium', atomicNumber: 101, atomicMass: 258.0, oxidationStates: [2, 3], electronegativity: 1.30, category: 'actinide' },
  No: { symbol: 'No', name: 'Nobelium', atomicNumber: 102, atomicMass: 259.0, oxidationStates: [2, 3], electronegativity: 1.30, category: 'actinide' },
  Lr: { symbol: 'Lr', name: 'Lawrencium', atomicNumber: 103, atomicMass: 262.0, oxidationStates: [3], electronegativity: 1.30, category: 'actinide' },
  
  // Period 7 continued
  Rf: { symbol: 'Rf', name: 'Rutherfordium', atomicNumber: 104, atomicMass: 267.0, oxidationStates: [4], category: 'transition-metal' },
  Db: { symbol: 'Db', name: 'Dubnium', atomicNumber: 105, atomicMass: 268.0, oxidationStates: [5], category: 'transition-metal' },
  Sg: { symbol: 'Sg', name: 'Seaborgium', atomicNumber: 106, atomicMass: 269.0, oxidationStates: [6], category: 'transition-metal' },
  Bh: { symbol: 'Bh', name: 'Bohrium', atomicNumber: 107, atomicMass: 270.0, oxidationStates: [7], category: 'transition-metal' },
  Hs: { symbol: 'Hs', name: 'Hassium', atomicNumber: 108, atomicMass: 277.0, oxidationStates: [8], category: 'transition-metal' },
  Mt: { symbol: 'Mt', name: 'Meitnerium', atomicNumber: 109, atomicMass: 278.0, oxidationStates: [3, 6], category: 'transition-metal' },
  Ds: { symbol: 'Ds', name: 'Darmstadtium', atomicNumber: 110, atomicMass: 281.0, oxidationStates: [2, 4, 6], category: 'transition-metal' },
  Rg: { symbol: 'Rg', name: 'Roentgenium', atomicNumber: 111, atomicMass: 282.0, oxidationStates: [3], category: 'transition-metal' },
  Cn: { symbol: 'Cn', name: 'Copernicium', atomicNumber: 112, atomicMass: 285.0, oxidationStates: [2], category: 'transition-metal' },
  Nh: { symbol: 'Nh', name: 'Nihonium', atomicNumber: 113, atomicMass: 286.0, oxidationStates: [1, 3], category: 'post-transition-metal' },
  Fl: { symbol: 'Fl', name: 'Flerovium', atomicNumber: 114, atomicMass: 289.0, oxidationStates: [2, 4], category: 'post-transition-metal' },
  Mc: { symbol: 'Mc', name: 'Moscovium', atomicNumber: 115, atomicMass: 290.0, oxidationStates: [1, 3], category: 'post-transition-metal' },
  Lv: { symbol: 'Lv', name: 'Livermorium', atomicNumber: 116, atomicMass: 293.0, oxidationStates: [2, 4], category: 'post-transition-metal' },
  Ts: { symbol: 'Ts', name: 'Tennessine', atomicNumber: 117, atomicMass: 294.0, oxidationStates: [-1, 1, 3], category: 'halogen' },
  Og: { symbol: 'Og', name: 'Oganesson', atomicNumber: 118, atomicMass: 294.0, oxidationStates: [0], category: 'noble-gas' },
  
  // Special: Deuterium (isotope of hydrogen)
  D: { symbol: 'D', name: 'Deuterium', atomicNumber: 1, atomicMass: 2.014, oxidationStates: [-1, 1], electronegativity: 2.20, category: 'nonmetal' },
};

/**
 * Set of all valid element symbols for quick lookup.
 */
export const ELEMENT_SYMBOLS = new Set(Object.keys(ELEMENTS));

/**
 * Checks if the given symbol is a valid chemical element.
 * @param symbol - The element symbol to validate (e.g., 'Fe', 'O', 'Na')
 * @returns true if the symbol is a valid element, false otherwise
 */
export function isValidElement(symbol: string): boolean {
  return ELEMENT_SYMBOLS.has(symbol);
}

/**
 * Gets the atomic mass of an element.
 * @param symbol - Element symbol
 * @returns Atomic mass in g/mol, or undefined if not found
 */
export function getAtomicMass(symbol: string): number | undefined {
  return ELEMENTS[symbol]?.atomicMass;
}

/**
 * Gets the electronegativity of an element.
 * @param symbol - Element symbol
 * @returns Electronegativity (Pauling scale), or undefined if not found
 */
export function getElectronegativity(symbol: string): number | undefined {
  return ELEMENTS[symbol]?.electronegativity;
}

/**
 * Gets the common oxidation states of an element.
 * @param symbol - Element symbol
 * @returns Array of oxidation states, or undefined if not found
 */
export function getOxidationStates(symbol: string): number[] | undefined {
  return ELEMENTS[symbol]?.oxidationStates;
}

/**
 * Gets complete element data.
 * @param symbol - Element symbol
 * @returns ElementData or undefined if not found
 */
export function getElement(symbol: string): ElementData | undefined {
  return ELEMENTS[symbol];
}
