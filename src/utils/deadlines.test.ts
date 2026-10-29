import { cleanDeadlineText, yearsInDeadline } from './deadlines';

describe('yearsInDeadline', () => {
  it('lê só os anos citados, em ordem, sem repetir', () => {
    expect(yearsInDeadline('"até 2030, com meta intermediária em 2027 e 2030"')).toEqual([
      2027, 2030,
    ]);
  });

  it('não presume ano quando o texto não cita', () => {
    expect(yearsInDeadline('"no próximo período"')).toEqual([]);
    expect(yearsInDeadline(null)).toEqual([]);
  });

  it('ignora números que não são anos', () => {
    expect(yearsInDeadline('R$ 2027 milhões')).toEqual([2027]);
    expect(yearsInDeadline('em 12345 ou 1999')).toEqual([]);
  });
});

describe('cleanDeadlineText', () => {
  it('remove as aspas literais que vêm da fonte', () => {
    expect(cleanDeadlineText('"em 2027"')).toBe('em 2027');
  });
});
