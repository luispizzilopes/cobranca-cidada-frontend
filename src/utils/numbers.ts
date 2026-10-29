const nf = new Intl.NumberFormat('pt-BR');

/** Formata inteiros com separador de milhar (pt-BR): 1234567 → "1.234.567". */
export function formatNumber(value: number): string {
  return nf.format(value);
}
