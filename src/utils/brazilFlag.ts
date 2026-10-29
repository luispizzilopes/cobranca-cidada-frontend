/**
 * Bandeira do Brasil conforme a Lei nº 5.700/1971 (anexo nº 2), em um espaço de 200×140
 * (20×14 módulos, 1 módulo = 10 unidades). Compartilhada entre o logo (SVG) e o banner (canvas).
 */
export const FLAG_W = 200;
export const FLAG_H = 140;

export const FLAG_COLORS = {
  green: '#009b3a',
  yellow: '#ffdf00',
  blue: '#002776',
  white: '#ffffff',
};

/** Losango amarelo: vértices a 1,7 módulo das bordas. */
export const RHOMBUS: ReadonlyArray<readonly [number, number]> = [
  [100, 17],
  [183, 70],
  [100, 123],
  [17, 70],
];

export const DISC = { cx: 100, cy: 70, r: 35 };

/** Faixa branca: arco de raio 80 que passa pelo centro do disco, convexo para cima e descendo da esquerda para a direita. */
const BAND_BASE = Math.atan2(-0.990, 0.139);
export const BAND = {
  cx: DISC.cx - 80 * 0.139,
  cy: DISC.cy + 80 * 0.990 - 10,
  r: 80,
  width: 7,
  base: BAND_BASE,
  text: 'ORDEM E PROGRESSO',
  step: 0.042,
  fontSize: 4.4,
};

/** Ponto do arco da faixa no ângulo `beta` (rad), contado a partir do ponto central. */
export function bandPoint(beta: number, radius = BAND.r): [number, number] {
  const a = BAND.base + beta;
  return [BAND.cx + radius * Math.cos(a), BAND.cy + radius * Math.sin(a)];
}

/** Letras da faixa com posição e rotação (rad) já calculadas. */
export function bandLetters(): Array<{ ch: string; x: number; y: number; rot: number }> {
  const chars = [...BAND.text];
  const mid = (chars.length - 1) / 2;
  return chars.flatMap((ch, i) => {
    if (ch === ' ') return [];
    const beta = (i - mid) * BAND.step;
    const [x, y] = bandPoint(beta);
    return [{ ch, x, y, rot: BAND.base + beta + Math.PI / 2 }];
  });
}

/** 27 estrelas (uma por unidade federativa): posição relativa ao centro do disco e raio, em módulos. */
export const STARS: ReadonlyArray<readonly [number, number, number]> = [
  [-0.4, 0.8, 0.3],
  [-0.4, 2.5, 0.3],
  [0.6, 1.7, 0.3],
  [-1.4, 1.6, 0.3],
  [-0.9, 1.4, 0.15],
  [2.1, 1.4, 0.22],
  [1.5, 2.2, 0.22],
  [-1.5, 0.6, 0.15],
  [-2.4, 0.8, 0.22],
  [-2, 1.7, 0.15],
  [-1.2, 2.4, 0.22],
  [0.4, 2.7, 0.15],
  [1, 1.6, 0.15],
  [0, 0.9, 0.15],
  [-2.7, 1.5, 0.22],
  [0.7, 0.8, 0.15],
  [-0.3, 1.7, 0.22],
  [1.1, 2.8, 0.15],
  [1.4, 1.1, 0.15],
  [2.2, 2.1, 0.22],
  [-1.9, 2.4, 0.22],
  [0, 3.1, 0.22],
  [0.9, 2.3, 0.15],
  [-1.9, 1.1, 0.22],
  [-1.1, 0.9, 0.15],
  [1.5, 1.6, 0.15],
  [0.7, -1.6, 0.22],
];

/** Pontos de uma estrela de cinco pontas com centro (x, y) e raio externo r. */
export function starPoints(x: number, y: number, r: number): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.382;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push([x + rad * Math.cos(a), y + rad * Math.sin(a)]);
  }
  return pts;
}
