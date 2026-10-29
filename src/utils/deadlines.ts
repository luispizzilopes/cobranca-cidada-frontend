/**
 * Extrai anos (2027, 2030, 2035...) de um texto de prazo. É só leitura do que a fonte diz;
 * não interpreta datas nem presume prazos.
 */
export function yearsInDeadline(text: string | null): number[] {
  if (!text) return [];
  const years = new Set<number>();
  for (const match of text.matchAll(/\b(20\d{2})\b/g)) years.add(Number(match[1]));
  return [...years].sort((a, b) => a - b);
}

export function cleanDeadlineText(text: string): string {
  return text.replace(/^"+|"+$/g, '');
}
