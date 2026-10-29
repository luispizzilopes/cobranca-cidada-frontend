import { daysUntil, formatDate } from './dates';

describe('daysUntil', () => {
  it('conta dias de calendário, ignorando a hora', () => {
    expect(daysUntil('2027-01-05', new Date(2026, 9, 26, 23, 59))).toBe(71);
    expect(daysUntil('2027-01-05', new Date(2026, 9, 26, 0, 1))).toBe(71);
  });

  it('é zero no próprio dia e negativo depois', () => {
    expect(daysUntil('2027-01-05', new Date(2027, 0, 5, 12))).toBe(0);
    expect(daysUntil('2027-01-05', new Date(2027, 0, 8))).toBe(-3);
  });

  it('atravessa viradas de mês e de ano', () => {
    expect(daysUntil('2027-01-01', new Date(2026, 11, 31))).toBe(1);
  });
});

describe('formatDate', () => {
  it('formata em português sem deslocar o dia por fuso', () => {
    expect(formatDate('2027-01-05')).toBe('05 de janeiro de 2027');
  });
});
