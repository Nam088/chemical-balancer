import { setLocale, getLocale, t } from './i18n';

describe('Internationalization (i18n)', () => {
  beforeEach(() => {
    // Reset to default locale before each test
    setLocale('en');
  });

  describe('setLocale and getLocale', () => {
    test('should set and get locale', () => {
      setLocale('vi');
      expect(getLocale()).toBe('vi');
      
      setLocale('en');
      expect(getLocale()).toBe('en');
    });
  });

  describe('t() translation function', () => {
    describe('English translations', () => {
      test('should return English error messages', () => {
        setLocale('en');
        expect(t('error.empty_equation')).toBe('Empty equation');
        expect(t('error.positive_required')).toBe('Value must be positive');
      });

      test('should return English reaction types', () => {
        setLocale('en');
        expect(t('reaction.combustion')).toBe('Combustion');
        expect(t('reaction.acid-base')).toBe('Acid-Base Neutralization');
        expect(t('reaction.redox')).toBe('Oxidation-Reduction (Redox)');
      });

      test('should return English gas law messages', () => {
        setLocale('en');
        expect(t('gas.ideal_gas_law')).toBe('Ideal Gas Law: PV = nRT');
        expect(t('gas.combined_gas_law')).toBe('Combined Gas Law: P1V1/T1 = P2V2/T2');
      });

      test('should return English pH messages', () => {
        setLocale('en');
        expect(t('ph.acidic')).toBe('Acidic solution (pH < 7)');
        expect(t('ph.basic')).toBe('Basic solution (pH > 7)');
        expect(t('ph.neutral')).toBe('Neutral solution (pH = 7)');
      });
    });

    describe('Vietnamese translations', () => {
      test('should return Vietnamese error messages', () => {
        setLocale('vi');
        expect(t('error.empty_equation')).toBe('Phương trình rỗng');
        expect(t('error.positive_required')).toBe('Giá trị phải dương');
      });

      test('should return Vietnamese reaction types', () => {
        setLocale('vi');
        expect(t('reaction.combustion')).toBe('Phản ứng đốt cháy');
        expect(t('reaction.acid-base')).toBe('Phản ứng trung hòa acid-base');
        expect(t('reaction.redox')).toBe('Phản ứng oxi-hóa khử');
      });

      test('should return Vietnamese gas law messages', () => {
        setLocale('vi');
        expect(t('gas.ideal_gas_law')).toBe('Phương trình khí lý tưởng: PV = nRT');
      });

      test('should return Vietnamese pH messages', () => {
        setLocale('vi');
        expect(t('ph.acidic')).toBe('Dung dịch acid (pH < 7)');
        expect(t('ph.basic')).toBe('Dung dịch base (pH > 7)');
      });
    });

    describe('Parameter interpolation', () => {
      test('should interpolate parameters correctly', () => {
        setLocale('en');
        const result = t('error.unknown_element', { element: 'Xx', formula: 'XxO2' });
        expect(result).toContain('Xx');
        expect(result).toContain('XxO2');
      });

      test('should interpolate multiple parameters', () => {
        setLocale('en');
        const result = t('gas.solved_for', { variable: 'V', value: '22.4' });
        expect(result).toContain('V');
        expect(result).toContain('22.4');
      });
    });
  });
});
