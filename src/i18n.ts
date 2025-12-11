/**
 * Supported locales.
 */
export type Locale = 'en' | 'vi';

/**
 * Translation keys used in the library.
 */
export type MessageKey =
  // Error messages
  | 'error.empty_equation'
  | 'error.missing_separator'
  | 'error.multiple_separators'
  | 'error.missing_reactants_or_products'
  | 'error.element_missing_in_products'
  | 'error.element_missing_in_reactants'
  | 'error.invalid_formula_syntax'
  | 'error.invalid_characters'
  | 'error.invalid_characters_end'
  | 'error.unknown_element'
  | 'error.unknown_element_molar_mass'
  | 'error.balance_failed'
  | 'error.molecule_not_found'
  | 'error.calculation_error'
  | 'error.invalid_input'
  | 'error.positive_required'
  | 'error.missing_variables'
  | 'error.invalid_dilution'
  // Reaction types
  | 'reaction.combustion'
  | 'reaction.acid-base'
  | 'reaction.precipitation'
  | 'reaction.redox'
  | 'reaction.decomposition'
  | 'reaction.synthesis'
  | 'reaction.single-replacement'
  | 'reaction.double-replacement'
  | 'reaction.unknown'
  // Reaction reasons
  | 'reason.combustion'
  | 'reason.acid-base'
  | 'reason.decomposition'
  | 'reason.synthesis'
  | 'reason.precipitation'
  | 'reason.single-replacement'
  | 'reason.double-replacement'
  | 'reason.redox'
  | 'reason.unknown'
  | 'reason.invalid_format'
  // Stoichiometry steps
  | 'step.balanced_equation'
  | 'step.coefficients'
  | 'step.given_mol'
  | 'step.convert_to_mol'
  | 'step.mole_ratio'
  | 'step.convert_to_grams'
  // Limiting reagent
  | 'step.limiting_explanation'
  // Oxidation state messages
  | 'oxidation.calculated'
  | 'oxidation.element_state'
  | 'oxidation.oxidized'
  | 'oxidation.reduced'
  | 'oxidation.unchanged'
  | 'oxidation.electrons_lost'
  | 'oxidation.electrons_gained'
  // Gas law messages
  | 'gas.ideal_gas_law'
  | 'gas.combined_gas_law'
  | 'gas.solved_for'
  | 'gas.pressure'
  | 'gas.volume'
  | 'gas.moles'
  | 'gas.temperature'
  | 'gas.stp_conditions'
  // Concentration messages
  | 'concentration.molarity'
  | 'concentration.molality'
  | 'concentration.dilution'
  | 'concentration.mole_fraction'
  | 'concentration.ppm'
  | 'concentration.mass_needed'
  // pH messages
  | 'ph.acidic'
  | 'ph.basic'
  | 'ph.neutral'
  | 'ph.strong_acid'
  | 'ph.strong_base'
  | 'ph.weak_acid'
  | 'ph.weak_base'
  | 'ph.buffer'
  | 'ph.percent_ionization'
  // Formula calculator messages
  | 'formula.empirical'
  | 'formula.molecular'
  | 'formula.percent_composition'
  | 'formula.moles_calculated'
  | 'formula.ratio_calculated'
  | 'formula.multiplier'
  // Redox messages
  | 'redox.oxidation_half'
  | 'redox.reduction_half'
  | 'redox.oxidizing_agent'
  | 'redox.reducing_agent'
  | 'redox.electrons_transferred'
  | 'redox.balanced';

/**
 * Translations for all supported locales.
 */
const translations: Record<Locale, Record<MessageKey, string>> = {
  en: {
    'error.empty_equation': 'Empty equation',
    'error.missing_separator': 'Invalid equation syntax: missing separator (->, =>, =)',
    'error.multiple_separators': 'Invalid equation syntax: multiple separators found',
    'error.missing_reactants_or_products': 'Missing reactants or products',
    'error.element_missing_in_products': "Element '{element}' is present in reactants but missing in products",
    'error.element_missing_in_reactants': "Element '{element}' is present in products but missing in reactants",
    'error.invalid_formula_syntax': "Invalid formula syntax (unbalanced or malformed parentheses): {formula}",
    'error.invalid_characters': "Invalid characters in formula '{formula}': '{chars}'",
    'error.invalid_characters_end': "Invalid characters at end of formula '{formula}': '{chars}'",
    'error.unknown_element': "Unknown element '{element}' in formula '{formula}'",
    'error.unknown_element_molar_mass': "Unknown element '{element}' - cannot calculate molar mass",
    'error.balance_failed': 'Failed to balance equation: {message}',
    'error.molecule_not_found': "Molecule '{molecule}' not found in equation",
    // Reaction types
    'reaction.combustion': 'Combustion',
    'reaction.acid-base': 'Acid-Base Neutralization',
    'reaction.precipitation': 'Precipitation',
    'reaction.redox': 'Oxidation-Reduction (Redox)',
    'reaction.decomposition': 'Decomposition',
    'reaction.synthesis': 'Synthesis (Combination)',
    'reaction.single-replacement': 'Single Replacement',
    'reaction.double-replacement': 'Double Replacement',
    'reaction.unknown': 'Unknown',
    // Reaction reasons
    'reason.combustion': 'Reaction involves O2 and produces CO2 and/or H2O from organic compound',
    'reason.acid-base': 'Acid reacts with base to produce salt and water',
    'reason.decomposition': 'Single compound decomposes into multiple products',
    'reason.synthesis': 'Multiple reactants combine to form single product',
    'reason.precipitation': 'Products include a known insoluble compound',
    'reason.single-replacement': 'One element replaces another in a compound',
    'reason.double-replacement': 'Cations and anions exchange between two compounds',
    'reason.redox': 'Oxidation states change during reaction',
    'reason.unknown': 'Could not determine reaction type',
    'reason.invalid_format': 'Invalid equation format',
    // Stoichiometry steps
    'step.balanced_equation': 'Balanced equation: {equation}',
    'step.coefficients': 'Coefficients: {given}={givenCoeff}, {find}={findCoeff}',
    'step.given_mol': 'Given: {amount} mol {molecule}',
    'step.convert_to_mol': 'Convert {amount}g {molecule} to moles: {amount} / {molarMass} = {result} mol',
    'step.mole_ratio': 'Mole ratio: {givenMol} mol × ({findCoeff}/{givenCoeff}) = {result} mol {find}',
    'step.convert_to_grams': 'Convert to grams: {mol} mol × {molarMass} g/mol = {result} g',
    'step.limiting_explanation': '{limiting} is limiting because it supports only {reactions} complete reactions.',
    // Error messages (new)
    'error.calculation_error': 'Calculation error: {message}',
    'error.invalid_input': 'Invalid input: {message}',
    'error.positive_required': 'Value must be positive',
    'error.missing_variables': 'Missing required variables: {variables}',
    'error.invalid_dilution': 'Invalid dilution: final concentration cannot exceed initial',
    // Oxidation state messages
    'oxidation.calculated': 'Oxidation states calculated for {formula}',
    'oxidation.element_state': '{element}: {state}',
    'oxidation.oxidized': '{element} is oxidized (lost {electrons} electron(s))',
    'oxidation.reduced': '{element} is reduced (gained {electrons} electron(s))',
    'oxidation.unchanged': '{element} oxidation state unchanged',
    'oxidation.electrons_lost': 'Electrons lost: {count}',
    'oxidation.electrons_gained': 'Electrons gained: {count}',
    // Gas law messages
    'gas.ideal_gas_law': 'Ideal Gas Law: PV = nRT',
    'gas.combined_gas_law': 'Combined Gas Law: P1V1/T1 = P2V2/T2',
    'gas.solved_for': 'Solved for {variable}: {value}',
    'gas.pressure': 'Pressure: {value} {unit}',
    'gas.volume': 'Volume: {value} {unit}',
    'gas.moles': 'Moles: {value} mol',
    'gas.temperature': 'Temperature: {value} {unit}',
    'gas.stp_conditions': 'Standard Temperature and Pressure (STP): 273.15 K, 1 atm',
    // Concentration messages
    'concentration.molarity': 'Molarity: {molarity} M',
    'concentration.molality': 'Molality: {molality} m',
    'concentration.dilution': 'Dilution: M1V1 = M2V2',
    'concentration.mole_fraction': 'Mole fraction: {solute} (solute), {solvent} (solvent)',
    'concentration.ppm': 'Concentration: {ppm} ppm',
    'concentration.mass_needed': 'Mass needed: {mass} g',
    // pH messages
    'ph.acidic': 'Acidic solution (pH < 7)',
    'ph.basic': 'Basic solution (pH > 7)',
    'ph.neutral': 'Neutral solution (pH = 7)',
    'ph.strong_acid': 'Strong acid: complete dissociation',
    'ph.strong_base': 'Strong base: complete dissociation',
    'ph.weak_acid': 'Weak acid: partial dissociation (Ka = {ka})',
    'ph.weak_base': 'Weak base: partial dissociation (Kb = {kb})',
    'ph.buffer': 'Buffer solution (Henderson-Hasselbalch equation)',
    'ph.percent_ionization': 'Percent ionization: {percent}%',
    // Formula calculator messages
    'formula.empirical': 'Empirical formula: {formula}',
    'formula.molecular': 'Molecular formula: {formula}',
    'formula.percent_composition': 'Percent composition: {composition}',
    'formula.moles_calculated': '{element}: {mass}g ÷ {atomicMass} g/mol = {moles} mol',
    'formula.ratio_calculated': 'Mole ratio: {ratio}',
    'formula.multiplier': 'Multiplier (n): {n}',
    // Redox messages
    'redox.oxidation_half': 'Oxidation half-reaction: {equation}',
    'redox.reduction_half': 'Reduction half-reaction: {equation}',
    'redox.oxidizing_agent': 'Oxidizing agent: {agent}',
    'redox.reducing_agent': 'Reducing agent: {agent}',
    'redox.electrons_transferred': 'Electrons transferred: {count}',
    'redox.balanced': 'Balanced redox equation: {equation}',
  },
  vi: {
    'error.empty_equation': 'Phương trình rỗng',
    'error.missing_separator': 'Cú pháp phương trình không hợp lệ: thiếu dấu phân cách (->, =>, =)',
    'error.multiple_separators': 'Cú pháp phương trình không hợp lệ: có nhiều dấu phân cách',
    'error.missing_reactants_or_products': 'Thiếu chất phản ứng hoặc sản phẩm',
    'error.element_missing_in_products': "Nguyên tố '{element}' có trong chất phản ứng nhưng thiếu trong sản phẩm",
    'error.element_missing_in_reactants': "Nguyên tố '{element}' có trong sản phẩm nhưng thiếu trong chất phản ứng",
    'error.invalid_formula_syntax': "Cú pháp công thức không hợp lệ (ngoặc không cân bằng hoặc sai định dạng): {formula}",
    'error.invalid_characters': "Ký tự không hợp lệ trong công thức '{formula}': '{chars}'",
    'error.invalid_characters_end': "Ký tự không hợp lệ ở cuối công thức '{formula}': '{chars}'",
    'error.unknown_element': "Nguyên tố không xác định '{element}' trong công thức '{formula}'",
    'error.unknown_element_molar_mass': "Nguyên tố không xác định '{element}' - không thể tính khối lượng mol",
    'error.balance_failed': 'Không thể cân bằng phương trình: {message}',
    'error.molecule_not_found': "Không tìm thấy phân tử '{molecule}' trong phương trình",
    // Reaction types
    'reaction.combustion': 'Phản ứng đốt cháy',
    'reaction.acid-base': 'Phản ứng trung hòa acid-base',
    'reaction.precipitation': 'Phản ứng kết tủa',
    'reaction.redox': 'Phản ứng oxi-hóa khử',
    'reaction.decomposition': 'Phản ứng phân hủy',
    'reaction.synthesis': 'Phản ứng tổng hợp',
    'reaction.single-replacement': 'Phản ứng thế đơn',
    'reaction.double-replacement': 'Phản ứng thế kép',
    'reaction.unknown': 'Không xác định',
    // Reaction reasons
    'reason.combustion': 'Phản ứng có O2 và tạo ra CO2 và/hoặc H2O từ hợp chất hữu cơ',
    'reason.acid-base': 'Acid phản ứng với base tạo muối và nước',
    'reason.decomposition': 'Một hợp chất phân hủy thành nhiều sản phẩm',
    'reason.synthesis': 'Nhiều chất phản ứng kết hợp tạo một sản phẩm duy nhất',
    'reason.precipitation': 'Sản phẩm bao gồm hợp chất kết tủa',
    'reason.single-replacement': 'Một nguyên tố thay thế nguyên tố khác trong hợp chất',
    'reason.double-replacement': 'Cation và anion trao đổi giữa hai hợp chất',
    'reason.redox': 'Số oxi-hóa thay đổi trong phản ứng',
    'reason.unknown': 'Không thể xác định loại phản ứng',
    'reason.invalid_format': 'Định dạng phương trình không hợp lệ',
    // Stoichiometry steps
    'step.balanced_equation': 'Phương trình cân bằng: {equation}',
    'step.coefficients': 'Hệ số: {given}={givenCoeff}, {find}={findCoeff}',
    'step.given_mol': 'Cho: {amount} mol {molecule}',
    'step.convert_to_mol': 'Chuyển đổi {amount}g {molecule} sang mol: {amount} / {molarMass} = {result} mol',
    'step.mole_ratio': 'Tỉ lệ mol: {givenMol} mol × ({findCoeff}/{givenCoeff}) = {result} mol {find}',
    'step.convert_to_grams': 'Chuyển đổi sang gam: {mol} mol × {molarMass} g/mol = {result} g',
    'step.limiting_explanation': '{limiting} là chất giới hạn vì chỉ đủ cho {reactions} phản ứng hoàn toàn.',
    // Error messages (new)
    'error.calculation_error': 'Lỗi tính toán: {message}',
    'error.invalid_input': 'Đầu vào không hợp lệ: {message}',
    'error.positive_required': 'Giá trị phải dương',
    'error.missing_variables': 'Thiếu biến bắt buộc: {variables}',
    'error.invalid_dilution': 'Pha loãng không hợp lệ: nồng độ cuối không thể lớn hơn nồng độ đầu',
    // Oxidation state messages
    'oxidation.calculated': 'Số oxi-hóa đã tính cho {formula}',
    'oxidation.element_state': '{element}: {state}',
    'oxidation.oxidized': '{element} bị oxi-hóa (mất {electrons} electron)',
    'oxidation.reduced': '{element} bị khử (nhận {electrons} electron)',
    'oxidation.unchanged': 'Số oxi-hóa của {element} không đổi',
    'oxidation.electrons_lost': 'Số electron mất: {count}',
    'oxidation.electrons_gained': 'Số electron nhận: {count}',
    // Gas law messages
    'gas.ideal_gas_law': 'Phương trình khí lý tưởng: PV = nRT',
    'gas.combined_gas_law': 'Định luật khí kết hợp: P1V1/T1 = P2V2/T2',
    'gas.solved_for': 'Giải cho {variable}: {value}',
    'gas.pressure': 'Áp suất: {value} {unit}',
    'gas.volume': 'Thể tích: {value} {unit}',
    'gas.moles': 'Số mol: {value} mol',
    'gas.temperature': 'Nhiệt độ: {value} {unit}',
    'gas.stp_conditions': 'Điều kiện tiêu chuẩn (STP): 273.15 K, 1 atm',
    // Concentration messages
    'concentration.molarity': 'Nồng độ mol: {molarity} M',
    'concentration.molality': 'Nồng độ molan: {molality} m',
    'concentration.dilution': 'Pha loãng: M1V1 = M2V2',
    'concentration.mole_fraction': 'Phần mol: {solute} (chất tan), {solvent} (dung môi)',
    'concentration.ppm': 'Nồng độ: {ppm} ppm',
    'concentration.mass_needed': 'Khối lượng cần: {mass} g',
    // pH messages
    'ph.acidic': 'Dung dịch acid (pH < 7)',
    'ph.basic': 'Dung dịch base (pH > 7)',
    'ph.neutral': 'Dung dịch trung tính (pH = 7)',
    'ph.strong_acid': 'Acid mạnh: phân ly hoàn toàn',
    'ph.strong_base': 'Base mạnh: phân ly hoàn toàn',
    'ph.weak_acid': 'Acid yếu: phân ly một phần (Ka = {ka})',
    'ph.weak_base': 'Base yếu: phân ly một phần (Kb = {kb})',
    'ph.buffer': 'Dung dịch đệm (phương trình Henderson-Hasselbalch)',
    'ph.percent_ionization': 'Phần trăm ion hóa: {percent}%',
    // Formula calculator messages
    'formula.empirical': 'Công thức thực nghiệm: {formula}',
    'formula.molecular': 'Công thức phân tử: {formula}',
    'formula.percent_composition': 'Phần trăm thành phần: {composition}',
    'formula.moles_calculated': '{element}: {mass}g ÷ {atomicMass} g/mol = {moles} mol',
    'formula.ratio_calculated': 'Tỉ lệ mol: {ratio}',
    'formula.multiplier': 'Bội số (n): {n}',
    // Redox messages
    'redox.oxidation_half': 'Nửa phản ứng oxi-hóa: {equation}',
    'redox.reduction_half': 'Nửa phản ứng khử: {equation}',
    'redox.oxidizing_agent': 'Chất oxi-hóa: {agent}',
    'redox.reducing_agent': 'Chất khử: {agent}',
    'redox.electrons_transferred': 'Số electron trao đổi: {count}',
    'redox.balanced': 'Phương trình oxi-hóa khử cân bằng: {equation}',
  },
};

/**
 * Current locale setting.
 */
let currentLocale: Locale = 'en';

/**
 * Sets the current locale for all messages.
 * 
 * @param locale - The locale to use ('en' or 'vi')
 * 
 * @example
 * ```typescript
 * import { setLocale } from '@nam088/chemical-balancer';
 * 
 * setLocale('vi'); // Switch to Vietnamese
 * ```
 */
export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

/**
 * Gets the current locale.
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Gets a translated message.
 * 
 * @param key - The message key
 * @param params - Optional parameters to interpolate
 * @returns The translated message
 * 
 * @example
 * ```typescript
 * t('error.unknown_element', { element: 'Xx', formula: 'Xx2O' })
 * // English: "Unknown element 'Xx' in formula 'Xx2O'"
 * // Vietnamese: "Nguyên tố không xác định 'Xx' trong công thức 'Xx2O'"
 * ```
 */
export function t(key: MessageKey, params?: Record<string, string>): string {
  let message = translations[currentLocale][key] || translations.en[key] || key;
  
  if (params) {
    for (const [param, value] of Object.entries(params)) {
      message = message.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
    }
  }
  
  return message;
}
