import {
  ChemicalBalancer,
  calculateMolarMass,
  calculateMolarMassDetailed,
  calculateStoichiometry,
  findLimitingReagent,
  classifyReaction,
  Parser,
  setLocale,
} from '../src';

console.log('=== Chemical Equation Balancer Examples ===\n');

// 1. Balance Equations
console.log('1. BALANCE EQUATIONS');
console.log('-------------------');
const simple = ChemicalBalancer.balance('H2 + O2 -> H2O');
console.log('Simple:', simple.balancedString);

const complex = ChemicalBalancer.balance('Fe + O2 -> Fe2O3');
console.log('Complex:', complex.balancedString);

// 2. Molar Mass
console.log('\n2. MOLAR MASS');
console.log('-------------');
console.log('H2O:', calculateMolarMass('H2O'), 'g/mol');
console.log('NaCl:', calculateMolarMass('NaCl'), 'g/mol');
console.log('C6H12O6 (glucose):', calculateMolarMass('C6H12O6'), 'g/mol');

const detailed = calculateMolarMassDetailed('H2SO4');
console.log('H2SO4 breakdown:', detailed);

// 3. Stoichiometry
console.log('\n3. STOICHIOMETRY');
console.log('----------------');
const stoich = calculateStoichiometry({
  equation: 'H2 + O2 -> H2O',
  given: { molecule: 'H2', amount: 2, unit: 'mol' },
  find: { molecule: 'H2O', unit: 'g' },
});
console.log('2 mol H2 produces:', stoich.amount, 'g H2O');
console.log('Steps:', stoich.steps);

// 4. Limiting Reagent
console.log('\n4. LIMITING REAGENT');
console.log('-------------------');
const limiting = findLimitingReagent({
  equation: 'H2 + O2 -> H2O',
  reagents: [
    { molecule: 'H2', amount: 4, unit: 'mol' },
    { molecule: 'O2', amount: 1, unit: 'mol' },
  ],
});
console.log('Limiting:', limiting.limiting);
console.log('Excess:', limiting.excess);

// 5. Reaction Classification
console.log('\n5. REACTION CLASSIFICATION');
console.log('--------------------------');
const combustion = classifyReaction('CH4 + O2 -> CO2 + H2O');
console.log('CH4 + O2 -> CO2 + H2O');
console.log('  Type:', combustion.typeName);
console.log('  Reason:', combustion.reason);

const acidBase = classifyReaction('HCl + NaOH -> NaCl + H2O');
console.log('HCl + NaOH -> NaCl + H2O');
console.log('  Type:', acidBase.typeName);
console.log('  Reason:', acidBase.reason);

// 6. State Annotations
console.log('\n6. STATE ANNOTATIONS');
console.log('--------------------');
const water = Parser.parseFormulaWithState('H2O(l)');
console.log("H2O(l):", water);

const salt = Parser.parseFormulaWithState('NaCl(aq)');
console.log("NaCl(aq):", salt);

// 7. i18n (Vietnamese)
console.log('\n7. INTERNATIONALIZATION');
console.log('-----------------------');
setLocale('vi');

const viReaction = classifyReaction('CH4 + O2 -> CO2 + H2O');
console.log('Vietnamese Reaction:');
console.log('  Type:', viReaction.typeName);
console.log('  Reason:', viReaction.reason);

const viStoich = calculateStoichiometry({
  equation: 'H2 + O2 -> H2O',
  given: { molecule: 'H2', amount: 2, unit: 'mol' },
  find: { molecule: 'H2O', unit: 'g' },
});
console.log('\nVietnamese Stoichiometry Steps:');
viStoich.steps.forEach(step => console.log(' ', step));

const viLimiting = findLimitingReagent({
  equation: 'H2 + O2 -> H2O',
  reagents: [
    { molecule: 'H2', amount: 4, unit: 'mol' },
    { molecule: 'O2', amount: 1, unit: 'mol' },
  ],
});
console.log('\nVietnamese Limiting Reagent:');
console.log('  Explanation:', viLimiting.explanation);

// Reset to English
setLocale('en');
