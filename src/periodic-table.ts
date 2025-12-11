/**
 * Set of all valid chemical element symbols from the periodic table.
 * Includes all 118 officially recognized elements.
 */
export const VALID_ELEMENTS = new Set([
  // Period 1
  'H', 'He',
  // Period 2
  'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  // Period 3
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
  // Period 4
  'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
  'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
  // Period 5
  'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd',
  'In', 'Sn', 'Sb', 'Te', 'I', 'Xe',
  // Period 6
  'Cs', 'Ba',
  'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', // Lanthanides
  'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn',
  // Period 7
  'Fr', 'Ra',
  'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', // Actinides
  'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og',
  // Special: Deuterium (isotope of hydrogen, commonly used)
  'D',
]);

/**
 * Checks if the given symbol is a valid chemical element.
 * @param symbol - The element symbol to validate (e.g., 'Fe', 'O', 'Na')
 * @returns true if the symbol is a valid element, false otherwise
 * 
 * @example
 * isValidElement('Fe') // true
 * isValidElement('Xx') // false
 */
export function isValidElement(symbol: string): boolean {
  return VALID_ELEMENTS.has(symbol);
}
