const MS_PER_DAY = 86_400_000;

/** Dias inteiros até a data (yyyy-MM-dd), contados em calendário local. Negativo se já passou. */
export function daysUntil(isoDate: string, now: Date = new Date()): number {
  const [year, month, day] = isoDate.split('-').map(Number);
  const target = Date.UTC(year, month - 1, day);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / MS_PER_DAY);
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}
