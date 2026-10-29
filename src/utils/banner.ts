import { INDEPENDENT_NOTICE, SITE_NAME, SITE_TAGLINE } from '../data/site';
import {
  BAND,
  DISC,
  FLAG_COLORS,
  FLAG_H,
  FLAG_W,
  RHOMBUS,
  STARS,
  bandLetters,
  starPoints,
} from './brazilFlag';
import { drawNewspaper, drawPoster, drawScoreboard, drawStamp } from './bannerLayouts';
import { formatNumber } from './numbers';

export type BannerFormat = 'square' | 'story' | 'landscape';

export const bannerFormats: Record<
  BannerFormat,
  { label: string; hint: string; width: number; height: number }
> = {
  square: { label: 'Feed', hint: '1080×1080', width: 1080, height: 1080 },
  story: { label: 'Stories', hint: '1080×1920', width: 1080, height: 1920 },
  landscape: { label: 'Link / X', hint: '1200×630', width: 1200, height: 630 },
};

export interface BannerPlan {
  page: string | null;
}

/** Ex.: "No plano de governo, página 49". */
export function planLine(plan: BannerPlan): string {
  return `No plano de governo${plan.page ? `, página ${plan.page}` : ''}`;
}

export interface BannerData {
  charges: number;
  title: string;
  commitmentId: string;
  /** Resumo de do que se trata o compromisso. */
  description: string;
  /** Só para compromissos que constam do plano de governo. */
  plan?: BannerPlan;
  /** Endereço curto exibido no banner (sem protocolo). */
  url: string;
}

export type BannerTemplate =
  | 'classic'
  | 'green'
  | 'light'
  | 'alert'
  | 'night'
  | 'newspaper'
  | 'poster'
  | 'stamp'
  | 'scoreboard';

/** Composição do banner: `standard` é o original; os demais ficam em bannerLayouts.ts. */
type BannerLayout = 'standard' | 'newspaper' | 'poster' | 'stamp' | 'scoreboard';

export interface BannerTheme {
  /** Fundo de cartões e áreas claras dos layouts alternativos. */
  surface?: string;
  /** Cor de texto sobre `surface`. */
  ink?: string;
  bgFrom: string;
  bgTo: string;
  /** Três cores da faixa do topo. */
  stripe: [string, string, string];
  headline: string;
  number: string;
  text: string;
  soft: string;
  /** Barra ao lado da linha do plano de governo. */
  accent: string;
  ctaBg: string;
  ctaLabel: string;
  ctaText: string;
  pattern: 'none' | 'diagonal' | 'dots';
}

/**
 * Cores fixas: a imagem circula fora do site, então não acompanha o tema claro/escuro.
 * Mesma paleta do Padrão Digital de Governo usada no site (sem brasão nem marca oficial).
 */
const C = {
  blue: '#1351b4',
  blueDark: '#071d41',
  green: '#168821',
  greenDark: '#0b3d12',
  yellow: '#ffcd07',
  white: '#ffffff',
  soft: '#dbe8fb',
};

export const bannerTemplates: Record<
  BannerTemplate,
  { label: string; layout: BannerLayout; theme: BannerTheme }
> = {
  classic: {
    layout: 'standard',
    label: 'Clássico',
    theme: {
      bgFrom: C.blue,
      bgTo: C.blueDark,
      stripe: [C.green, C.yellow, C.white],
      headline: C.yellow,
      number: C.yellow,
      text: C.white,
      soft: C.soft,
      accent: C.yellow,
      ctaBg: C.white,
      ctaLabel: C.blue,
      ctaText: C.blueDark,
      pattern: 'none',
    },
  },
  green: {
    layout: 'standard',
    label: 'Verde',
    theme: {
      bgFrom: '#13771d',
      bgTo: C.greenDark,
      stripe: [C.yellow, C.white, C.blue],
      headline: C.yellow,
      number: C.yellow,
      text: C.white,
      soft: '#e2f4e4',
      accent: C.yellow,
      ctaBg: C.white,
      ctaLabel: '#13771d',
      ctaText: C.greenDark,
      pattern: 'dots',
    },
  },
  light: {
    layout: 'standard',
    label: 'Claro',
    theme: {
      bgFrom: C.white,
      bgTo: '#e3ecfa',
      stripe: [C.green, C.yellow, C.blue],
      headline: '#0e3f8c',
      number: C.blue,
      text: C.blueDark,
      soft: '#33476b',
      accent: C.blue,
      ctaBg: C.blue,
      ctaLabel: C.soft,
      ctaText: C.white,
      pattern: 'none',
    },
  },
  alert: {
    layout: 'standard',
    label: 'Alerta',
    theme: {
      bgFrom: C.yellow,
      bgTo: '#f2b800',
      stripe: [C.blueDark, C.blue, C.green],
      headline: C.blueDark,
      number: C.blueDark,
      text: C.blueDark,
      soft: '#2b2a10',
      accent: C.blueDark,
      ctaBg: C.blueDark,
      ctaLabel: C.soft,
      ctaText: C.yellow,
      pattern: 'diagonal',
    },
  },
  night: {
    layout: 'standard',
    label: 'Noturno',
    theme: {
      bgFrom: '#121826',
      bgTo: '#03060c',
      stripe: [C.green, C.yellow, C.blue],
      headline: C.yellow,
      number: C.white,
      text: C.white,
      soft: '#b9c4d8',
      accent: C.green,
      ctaBg: C.yellow,
      ctaLabel: C.blueDark,
      ctaText: C.blueDark,
      pattern: 'diagonal',
    },
  },
  newspaper: {
    label: 'Manchete',
    layout: 'newspaper',
    theme: {
      bgFrom: '#f6f1e3',
      bgTo: '#ebe4cf',
      stripe: ['#171717', '#171717', '#171717'],
      headline: '#a31c14',
      number: C.white,
      text: '#171717',
      soft: '#4a4538',
      accent: '#171717',
      ctaBg: '#171717',
      ctaLabel: '#d8d0b8',
      ctaText: '#f6f1e3',
      pattern: 'none',
    },
  },
  poster: {
    label: 'Cartaz',
    layout: 'poster',
    theme: {
      bgFrom: '#0e3a8a',
      bgTo: C.blueDark,
      stripe: [C.green, C.yellow, C.white],
      headline: C.yellow,
      number: C.yellow,
      text: C.white,
      soft: '#33476b',
      accent: C.blue,
      ctaBg: C.yellow,
      ctaLabel: C.blueDark,
      ctaText: C.blueDark,
      pattern: 'none',
      surface: C.white,
      ink: C.blueDark,
    },
  },
  stamp: {
    label: 'Carimbo',
    layout: 'stamp',
    theme: {
      bgFrom: '#fdfcf8',
      bgTo: '#f1eee4',
      stripe: ['#c0281c', '#c0281c', '#c0281c'],
      headline: '#b3241a',
      number: '#b3241a',
      text: '#1b1b1b',
      soft: '#57534a',
      accent: '#b3241a',
      ctaBg: '#1b1b1b',
      ctaLabel: '#d9d6cc',
      ctaText: '#fdfcf8',
      pattern: 'none',
    },
  },
  scoreboard: {
    label: 'Placar',
    layout: 'scoreboard',
    theme: {
      bgFrom: '#13771d',
      bgTo: C.greenDark,
      stripe: [C.yellow, C.white, C.blue],
      headline: '#0e5f17',
      number: C.yellow,
      text: C.blueDark,
      soft: '#3b4a68',
      accent: C.green,
      ctaBg: C.blue,
      ctaLabel: C.soft,
      ctaText: C.white,
      pattern: 'none',
      surface: C.white,
      ink: C.blueDark,
    },
  },
};

export const FONT = 'Rawline, Raleway, "Segoe UI", Arial, sans-serif';

/** Bandeira do Brasil (proporção 10:7) com largura w, canto superior esquerdo em (x, y). */
export function drawFlag(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  const k = w / FLAG_W;
  const at = (px: number, py: number): [number, number] => [x + px * k, y + py * k];
  ctx.save();
  ctx.fillStyle = FLAG_COLORS.green;
  ctx.fillRect(x, y, w, FLAG_H * k);
  ctx.fillStyle = FLAG_COLORS.yellow;
  ctx.beginPath();
  RHOMBUS.forEach(([px, py], i) => (i ? ctx.lineTo(...at(px, py)) : ctx.moveTo(...at(px, py))));
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = FLAG_COLORS.blue;
  ctx.beginPath();
  ctx.arc(...at(DISC.cx, DISC.cy), DISC.r * k, 0, Math.PI * 2);
  ctx.fill();
  ctx.clip();
  ctx.strokeStyle = FLAG_COLORS.white;
  ctx.lineWidth = BAND.width * k;
  ctx.beginPath();
  ctx.arc(...at(BAND.cx, BAND.cy), BAND.r * k, BAND.base - 0.6, BAND.base + 0.6);
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.fillStyle = FLAG_COLORS.green;
  ctx.font = `700 ${BAND.fontSize * k}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const l of bandLetters()) {
    const [lx, ly] = at(l.x, l.y);
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(l.rot);
    ctx.fillText(l.ch, 0, 0);
    ctx.restore();
  }
  ctx.restore();
  ctx.fillStyle = FLAG_COLORS.white;
  for (const [sx, sy, sr] of STARS) {
    ctx.beginPath();
    starPoints(DISC.cx + sx * 10, DISC.cy + sy * 10, sr * 10).forEach(([px, py], i) =>
      i ? ctx.lineTo(...at(px, py)) : ctx.moveTo(...at(px, py)),
    );
    ctx.closePath();
    ctx.fill();
  }
}

/** Textura sutil de fundo, desenhada sob o conteúdo. */
export function drawPattern(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: BannerTheme,
  s: number,
): void {
  if (t.pattern === 'none') return;
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = t.text;
  ctx.strokeStyle = t.text;
  if (t.pattern === 'dots') {
    const step = Math.round(44 * s);
    for (let x = step / 2; x < W; x += step)
      for (let y = step / 2; y < H; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 3 * s, 0, Math.PI * 2);
        ctx.fill();
      }
  } else {
    const step = Math.round(56 * s);
    ctx.lineWidth = 6 * s;
    for (let x = -H; x < W; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, H);
      ctx.lineTo(x + H, 0);
      ctx.stroke();
    }
  }
  ctx.restore();
}

/** Quebra o texto em linhas que cabem em maxWidth; acrescenta "…" se passar de maxLines. */
export function wrapText(
  measure: (text: string) => number,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  let i = 0;
  for (; i < words.length; i++) {
    const candidate = current ? `${current} ${words[i]}` : words[i];
    if (current && measure(candidate) > maxWidth) {
      if (lines.length === maxLines - 1) break;
      lines.push(current);
      current = words[i];
    } else {
      current = candidate;
    }
  }
  if (i < words.length) {
    let last = `${current} ${words.slice(i).join(' ')}`;
    while (last.length > 1 && measure(`${last}…`) > maxWidth) last = last.slice(0, -1).trimEnd();
    current = `${last}…`;
  }
  if (current) lines.push(current);
  return lines;
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** Tira da descrição completa o trecho "Como o plano prevê fazer…" e as referências de página "(p.59)". */
function cleanDescription(text: string): string {
  return text
    .split(/Como o plano prevê fazer\s*:/i)[0]
    .replace(/\(p\.?\s*[^)]*\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Texto de "do que se trata" do banner: o resumo, se ele dizer algo além do título; senão a descrição completa
 * sem o "como o plano prevê fazer". Nunca repete o título.
 */
export function pickBannerDescription(
  title: string,
  shortDescription: string | null,
  description: string,
): string {
  const t = normalize(title);
  const candidates = [shortDescription, description].map((c) => cleanDescription(c ?? ''));
  const found = candidates.find((c) => {
    const n = normalize(c);
    return n !== '' && n !== t && !t.includes(n) && !n.includes(t);
  });
  return found ?? '';
}

/** Chamada que fica mais indignada a cada ordem de grandeza: 10, 100, 1.000, 10.000, 100.000... */
const headlines = [
  'PROMETEU. CADÊ A ENTREGA?',
  'PROMETEU! CADÊ A ENTREGA?!',
  'CHEGA DE PROMESSA! ENTREGUE!',
  'O BRASIL ESTÁ COBRANDO. ENTREGUE JÁ!',
  'BASTA DE ENROLAÇÃO! CUMPRA O QUE PROMETEU!',
];

export function bannerHeadline(charges: number): string {
  const tier = Math.max(0, Math.floor(Math.log10(Math.max(charges, 1))) - 1);
  return headlines[Math.min(tier, headlines.length - 1)];
}

export function chargesPhrase(charges: number): string {
  return charges === 1 ? 'pessoa cobra' : 'pessoas cobram';
}

export function bannerAltText(d: BannerData): string {
  return `Banner: ${bannerHeadline(d.charges)} ${formatNumber(d.charges)} ${chargesPhrase(d.charges)} o governo a cumprir o compromisso ${d.commitmentId}, "${d.title}". ${d.description}${d.plan ? ` ${planLine(d.plan)}.` : ''} Cobre também: ${d.url}`;
}

export async function loadBannerFonts(): Promise<void> {
  if (!document.fonts) return;
  await Promise.all(
    ['400', '600', '700'].map((w) => document.fonts.load(`${w} 32px Rawline`)),
  ).catch(() => {});
}

const layouts = {
  newspaper: drawNewspaper,
  poster: drawPoster,
  stamp: drawStamp,
  scoreboard: drawScoreboard,
};

/** Desenha o banner em um canvas já dimensionado para o formato. */
export function drawBanner(
  canvas: HTMLCanvasElement,
  format: BannerFormat,
  d: BannerData,
  template: BannerTemplate = 'classic',
): void {
  const { layout, theme: t } = bannerTemplates[template];
  if (layout !== 'standard') {
    layouts[layout](canvas, format, d, t);
    return;
  }
  const { width: W, height: H } = bannerFormats[format];
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const wide = format === 'landscape';
  const s = (Math.min(W, 1080) / 1080) * (wide ? 0.8 : 1);
  const pad = Math.round(72 * s);
  const maxW = W - pad * 2;
  ctx.textBaseline = 'alphabetic';
  const font = (weight: number, size: number) => `${weight} ${Math.round(size * s)}px ${FONT}`;
  const text = (value: string, x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillText(value, x, y);
  };

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, t.bgFrom);
  bg.addColorStop(1, t.bgTo);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  drawPattern(ctx, W, H, t, s);
  const stripe = Math.round(20 * s);
  const third = W / 3;
  t.stripe.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(i * third, 0, third + 1, stripe);
  });

  const top = stripe + (format === 'story' ? Math.round(150 * s) : Math.round(56 * s));
  const mark = Math.round(64 * s);
  drawFlag(ctx, pad, top + (mark - mark * 0.7) / 2, mark);
  ctx.font = font(700, 36);
  text(SITE_NAME, pad + mark + 20 * s, top + mark * 0.48, t.text);
  ctx.font = font(600, 22);
  text(SITE_TAGLINE, pad + mark + 20 * s, top + mark * 0.86, t.soft);

  const sz = {
    square: { num: 200, title: 54, desc: 30, plan: 28 },
    story: { num: 260, title: 66, desc: 36, plan: 34 },
    landscape: { num: 120, title: 40, desc: 26, plan: 22 },
  }[format];
  let y = top + mark + Math.round((format === 'story' ? 130 : wide ? 40 : 56) * s);
  const headline = bannerHeadline(d.charges);
  let headSize = wide ? 32 : 40;
  ctx.font = font(700, headSize);
  while (headSize > 16 && ctx.measureText(headline).width > maxW) {
    headSize -= 1;
    ctx.font = font(700, headSize);
  }
  text(headline, pad, y + 30 * s, t.headline);
  y += Math.round((wide ? 52 : 70) * s);

  const number = formatNumber(d.charges);
  const [first, second] = [chargesPhrase(d.charges), 'o governo'];
  const baseNum = sz.num;
  const basePhrase = wide ? 40 : 52;
  ctx.font = font(700, baseNum);
  const numberW0 = ctx.measureText(number).width;
  ctx.font = font(700, basePhrase);
  const phraseW0 = ctx.measureText(first).width;
  const gap0 = 28 * s;
  const fit = Math.min(1, maxW / (numberW0 + gap0 + phraseW0));
  const numSize = baseNum * fit;
  const phraseSize = basePhrase * fit;
  ctx.font = font(700, numSize);
  text(number, pad, y + numSize * s * 0.78, t.number);
  const phraseX = pad + ctx.measureText(number).width + gap0 * fit;
  ctx.font = font(700, phraseSize);
  text(first, phraseX, y + numSize * s * 0.5, t.text);
  text(second, phraseX, y + numSize * s * 0.5 + phraseSize * s * 1.2, t.text);
  y += numSize * s * 0.78 + Math.round((format === 'story' ? 60 : 36) * s);

  const infoSize = wide ? 15 : 18;
  ctx.font = font(400, infoSize);
  const info = wrapText(
    (t) => ctx.measureText(t).width,
    `Gerado automaticamente pelo ${SITE_NAME}. ${INDEPENDENT_NOTICE}`,
    maxW,
    2,
  );
  const infoLineH = infoSize * s * 1.4;
  const infoTop = H - Math.round((wide ? 28 : 44) * s) - infoLineH * info.length;
  info.forEach((line, i) => text(line, pad, infoTop + infoLineH * (i + 0.8), t.soft));

  const base = wide ? 28 : 38;
  const innerW = maxW - 56 * s;
  const label = 'Cobre também:';
  let size = base;
  ctx.font = font(700, size);
  let twoLines = false;
  while (size > base * 0.75 && ctx.measureText(`${label} ${d.url}`).width > innerW) {
    size -= 1;
    ctx.font = font(700, size);
  }
  if (ctx.measureText(`${label} ${d.url}`).width > innerW) {
    twoLines = true;
    size = base * 0.9;
    ctx.font = font(700, size);
    while (size > base * 0.4 && ctx.measureText(d.url).width > innerW) {
      size -= 1;
      ctx.font = font(700, size);
    }
  }
  const vPad = Math.round((wide ? 18 : 26) * s);
  const labelSize = base * 0.7;
  const ctaH = twoLines
    ? Math.round(vPad * 2 + (labelSize + size) * s * 1.25)
    : Math.round(vPad * 2 + size * s * 1.1);
  const ctaTop = infoTop - Math.round((wide ? 12 : 20) * s) - ctaH;
  ctx.fillStyle = t.ctaBg;
  ctx.beginPath();
  ctx.roundRect(pad, ctaTop, maxW, ctaH, 12 * s);
  ctx.fill();
  ctx.textBaseline = 'middle';
  if (twoLines) {
    ctx.font = font(600, labelSize);
    text(label, pad + 28 * s, ctaTop + vPad + labelSize * s * 0.6, t.ctaLabel);
    ctx.font = font(700, size);
    text(d.url, pad + 28 * s, ctaTop + ctaH - vPad - size * s * 0.55, t.ctaText);
  } else {
    ctx.font = font(700, size);
    text(`${label} ${d.url}`, pad + 28 * s, ctaTop + ctaH / 2, t.ctaText);
  }
  ctx.textBaseline = 'alphabetic';

  const gap = Math.round(18 * s);
  let bottomLimit = ctaTop - gap;
  if (d.plan) {
    ctx.font = font(600, sz.plan);
    const planH = sz.plan * s * 1.35;
    const planLines = wrapText((t) => ctx.measureText(t).width, planLine(d.plan), maxW - 24 * s, 2);
    const blockH = planH * planLines.length;
    const blockTop = bottomLimit - blockH;
    ctx.fillStyle = t.accent;
    ctx.fillRect(pad, blockTop, 6 * s, blockH);
    planLines.forEach((line, i) => text(line, pad + 24 * s, blockTop + planH * (i + 0.8), t.text));
    bottomLimit = blockTop - gap;
  }

  const titleText = `“${d.title}”`;
  const betweenGap = 20 * s;
  const available = bottomLimit - y - betweenGap;
  const wrapAt = (weight: number, size: number, value: string) => {
    ctx.font = font(weight, size);
    return wrapText((t) => ctx.measureText(t).width, value, maxW, Infinity);
  };

  let titleSize = sz.title;
  let titleLines = wrapAt(700, titleSize, titleText);
  while (titleLines.length * titleSize * s * 1.22 > available * 0.45 && titleSize > 20) {
    titleSize -= 1;
    titleLines = wrapAt(700, titleSize, titleText);
  }
  const titleH = titleSize * s * 1.22;
  const descRoom = available - titleH * titleLines.length;

  let descSize = Math.min(sz.desc, titleSize * 0.62);
  let descLines = d.description ? wrapAt(400, descSize, d.description) : [];
  while (descLines.length * descSize * s * 1.35 > descRoom && descSize > 10) {
    descSize -= 0.5;
    descLines = wrapAt(400, descSize, d.description);
  }
  const descH = descSize * s * 1.35;

  ctx.font = font(700, titleSize);
  titleLines.forEach((line, i) => text(line, pad, y + titleH * (i + 0.85), t.text));
  y += titleH * titleLines.length + betweenGap;
  ctx.font = font(400, descSize);
  descLines.forEach((line, i) => text(line, pad, y + descH * (i + 0.85), t.soft));
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Falha ao gerar a imagem.'))),
      'image/png',
    ),
  );
}
