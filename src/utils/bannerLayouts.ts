import { INDEPENDENT_NOTICE, SITE_NAME, SITE_TAGLINE } from '../data/site';
import {
  FONT,
  bannerFormats,
  bannerHeadline,
  chargesPhrase,
  drawFlag,
  drawPattern,
  planLine,
  wrapText,
  type BannerData,
  type BannerFormat,
  type BannerTheme,
} from './banner';
import { formatNumber } from './numbers';

/** Layouts alternativos do banner: composições diferentes, não só outras cores. */

const SERIF = 'Georgia, "Times New Roman", Times, serif';

interface Surface {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  /** Escala das medidas fixas (px de referência × s). */
  s: number;
  wide: boolean;
  story: boolean;
}

type Draw = (
  canvas: HTMLCanvasElement,
  format: BannerFormat,
  d: BannerData,
  t: BannerTheme,
) => void;

function setup(canvas: HTMLCanvasElement, format: BannerFormat): Surface | null {
  const { width: W, height: H } = bannerFormats[format];
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.textBaseline = 'alphabetic';
  const wide = format === 'landscape';
  return { ctx, W, H, s: wide ? 0.85 : 1, wide, story: format === 'story' };
}

function font(c: Surface, weight: number | string, size: number, family = FONT): void {
  c.ctx.font = `${weight} ${Math.round(size * c.s)}px ${family}`;
}

const measure = (c: Surface) => (value: string) => c.ctx.measureText(value).width;

function put(
  c: Surface,
  value: string,
  x: number,
  y: number,
  color: string,
  align: CanvasTextAlign = 'left',
): void {
  c.ctx.fillStyle = color;
  c.ctx.textAlign = align;
  c.ctx.fillText(value, x, y);
  c.ctx.textAlign = 'left';
}

function putLines(
  c: Surface,
  lines: string[],
  x: number,
  top: number,
  lineH: number,
  color: string,
  align: CanvasTextAlign = 'left',
): void {
  lines.forEach((line, i) => put(c, line, x, top + lineH * (i + 0.8), color, align));
}

function background(c: Surface, t: BannerTheme, from = t.bgFrom, to = t.bgTo): void {
  const bg = c.ctx.createLinearGradient(0, 0, c.W, c.H);
  bg.addColorStop(0, from);
  bg.addColorStop(1, to);
  c.ctx.fillStyle = bg;
  c.ctx.fillRect(0, 0, c.W, c.H);
  drawPattern(c.ctx, c.W, c.H, t, c.s);
}

interface FitOptions {
  weight: number | string;
  family?: string;
  size: number;
  min: number;
  text: string;
  maxW: number;
  maxH: number;
  lineH: number;
}

/** Encolhe a fonte até o texto caber em maxW × maxH; no mínimo, corta com "…". */
function fitText(c: Surface, o: FitOptions) {
  let size = o.size;
  let lines: string[];
  for (;;) {
    font(c, o.weight, size, o.family);
    lines = wrapText(measure(c), o.text, o.maxW, Infinity);
    if (lines.length * size * c.s * o.lineH <= o.maxH || size <= o.min) break;
    size -= 1;
  }
  const lineH = size * c.s * o.lineH;
  const maxLines = Math.max(1, Math.floor(o.maxH / lineH));
  if (lines.length > maxLines) lines = wrapText(measure(c), o.text, o.maxW, maxLines);
  return { size, lines, lineH, height: lines.length * lineH };
}

/** Largura da fonte que faz `value` caber em maxW, partindo de `size`. */
function shrinkToFit(
  c: Surface,
  weight: number | string,
  size: number,
  value: string,
  maxW: number,
  family = FONT,
): number {
  font(c, weight, size, family);
  const w = c.ctx.measureText(value).width;
  const fitted = w > maxW ? size * (maxW / w) : size;
  font(c, weight, fitted, family);
  return fitted;
}

/** Marca (bandeira + nome + slogan). `centerIn` centraliza o conjunto numa largura. */
function drawBrand(
  c: Surface,
  x: number,
  y: number,
  nameColor: string,
  tagColor: string,
  centerIn?: number,
): number {
  const mark = Math.round(56 * c.s);
  const gap = 18 * c.s;
  font(c, 700, 32);
  const nameW = c.ctx.measureText(SITE_NAME).width;
  font(c, 600, 19);
  const tagW = c.ctx.measureText(SITE_TAGLINE).width;
  const total = mark + gap + Math.max(nameW, tagW);
  const left = centerIn === undefined ? x : x + (centerIn - total) / 2;
  drawFlag(c.ctx, left, y + (mark - mark * 0.7) / 2, mark);
  font(c, 700, 32);
  put(c, SITE_NAME, left + mark + gap, y + mark * 0.48, nameColor);
  font(c, 600, 19);
  put(c, SITE_TAGLINE, left + mark + gap, y + mark * 0.86, tagColor);
  return mark;
}

/** Rodapé: aviso de geração automática embaixo e a chamada com o link acima. Devolve o y livre acima dele. */
function drawFooter(
  c: Surface,
  d: BannerData,
  t: BannerTheme,
  x: number,
  w: number,
  bottom: number,
  noteColor: string,
): number {
  const { ctx, s, wide } = c;
  const noteSize = wide ? 14 : 18;
  font(c, 400, noteSize);
  const note = wrapText(
    measure(c),
    `Gerado automaticamente pelo ${SITE_NAME}. ${INDEPENDENT_NOTICE}`,
    w,
    2,
  );
  const noteLH = noteSize * s * 1.4;
  const noteTop = bottom - noteLH * note.length;
  putLines(c, note, x, noteTop, noteLH, noteColor);

  const base = wide ? 26 : 36;
  const inner = w - 48 * s;
  let label = `Cobre também: ${d.url}`;
  let size = base;
  font(c, 700, size);
  while (size > base * 0.5 && ctx.measureText(label).width > inner) {
    size -= 1;
    font(c, 700, size);
  }
  if (ctx.measureText(label).width > inner) {
    label = d.url;
    size = base * 0.9;
    font(c, 700, size);
    while (size > base * 0.4 && ctx.measureText(label).width > inner) {
      size -= 1;
      font(c, 700, size);
    }
  }
  const vPad = Math.round((wide ? 14 : 22) * s);
  const h = Math.round(vPad * 2 + size * s * 1.1);
  const top = noteTop - Math.round((wide ? 10 : 18) * s) - h;
  ctx.fillStyle = t.ctaBg;
  ctx.beginPath();
  ctx.roundRect(x, top, w, h, 12 * s);
  ctx.fill();
  ctx.textBaseline = 'middle';
  put(c, label, x + 24 * s, top + h / 2, t.ctaText);
  ctx.textBaseline = 'alphabetic';
  return top - Math.round(18 * s);
}

interface TitleOptions {
  family?: string;
  titleSize: number;
  descSize: number;
  titleWeight?: number | string;
  align?: CanvasTextAlign;
  titleColor: string;
  descColor: string;
}

/** Título e descrição entre `top` e `bottom`: o título ocupa no máximo metade e a descrição fica menor que ele. */
function drawTitleDesc(
  c: Surface,
  d: BannerData,
  x: number,
  top: number,
  w: number,
  bottom: number,
  o: TitleOptions,
): void {
  const align = o.align ?? 'left';
  const ax = align === 'center' ? x + w / 2 : x;
  const gap = 18 * c.s;
  const avail = bottom - top - gap;
  const title = fitText(c, {
    weight: o.titleWeight ?? 700,
    family: o.family,
    size: o.titleSize,
    min: 18,
    text: `“${d.title}”`,
    maxW: w,
    maxH: avail * 0.5,
    lineH: 1.2,
  });
  putLines(c, title.lines, ax, top, title.lineH, o.titleColor, align);
  if (!d.description) return;
  const descTop = top + title.height + gap;
  const desc = fitText(c, {
    weight: 400,
    family: o.family,
    size: Math.min(o.descSize, title.size * 0.62),
    min: 10,
    text: d.description,
    maxW: w,
    maxH: bottom - descTop,
    lineH: 1.35,
  });
  putLines(c, desc.lines, ax, descTop, desc.lineH, o.descColor, align);
}

/** Linha do plano de governo com barra lateral. Devolve o novo limite inferior. */
function drawPlanBar(
  c: Surface,
  d: BannerData,
  x: number,
  w: number,
  bottom: number,
  barColor: string,
  color: string,
  size: number,
): number {
  if (!d.plan) return bottom;
  font(c, 600, size);
  const lines = wrapText(measure(c), planLine(d.plan), w - 24 * c.s, 2);
  const lineH = size * c.s * 1.35;
  const h = lineH * lines.length;
  const top = bottom - h;
  c.ctx.fillStyle = barColor;
  c.ctx.fillRect(x, top, 6 * c.s, h);
  putLines(c, lines, x + 24 * c.s, top, lineH, color);
  return top - 18 * c.s;
}

const number = (d: BannerData) => formatNumber(d.charges);

/** Primeira página de jornal: cabeçalho, manchete, número em caixa e texto centralizado. */
export const drawNewspaper: Draw = (canvas, format, d, t) => {
  const c = setup(canvas, format);
  if (!c) return;
  const { ctx, W, H, s, wide, story } = c;
  const pad = Math.round(64 * s);
  const maxW = W - pad * 2;
  const mid = W / 2;
  background(c, t);

  let y = pad * 0.7 + (story ? 70 * s : 0);
  font(c, 700, 19, SERIF);
  put(c, 'EDIÇÃO ESPECIAL · COBRANÇA DE PROMESSA', mid, y + 14 * s, t.soft, 'center');
  y += 34 * s;
  const mast = shrinkToFit(c, 800, wide ? 54 : 74, SITE_NAME, maxW, SERIF);
  put(c, SITE_NAME, mid, y + mast * s * 0.85, t.text, 'center');
  y += mast * s * 1.05;
  ctx.fillStyle = t.text;
  ctx.fillRect(pad, y, maxW, Math.max(2, 4 * s));
  ctx.fillRect(pad, y + 9 * s, maxW, Math.max(1, 1.5 * s));
  y += 24 * s;

  const head = fitText(c, {
    weight: 800,
    family: SERIF,
    size: wide ? 52 : 84,
    min: 26,
    text: bannerHeadline(d.charges),
    maxW,
    maxH: H * (wide ? 0.2 : 0.17),
    lineH: 1.08,
  });
  putLines(c, head.lines, mid, y, head.lineH, t.headline, 'center');
  y += head.height + 14 * s;
  ctx.fillStyle = t.text;
  ctx.fillRect(pad, y, maxW, Math.max(1, 1.5 * s));
  y += 20 * s;

  const num = number(d);
  const numSize = shrinkToFit(c, 800, wide ? 100 : 170, num, maxW - 60 * s, SERIF);
  const phrase = `${chargesPhrase(d.charges)} o governo a cumprir o que prometeu`;
  const phraseSize = shrinkToFit(c, 600, wide ? 22 : 32, phrase, maxW - 60 * s, SERIF);
  const boxH = numSize * s * 0.95 + phraseSize * s * 1.5 + 34 * s;
  ctx.fillStyle = t.accent;
  ctx.fillRect(pad, y, maxW, boxH);
  font(c, 800, numSize, SERIF);
  put(c, num, mid, y + 16 * s + numSize * s * 0.8, t.number, 'center');
  font(c, 600, phraseSize, SERIF);
  put(c, phrase, mid, y + boxH - 16 * s - phraseSize * s * 0.25, t.ctaText, 'center');
  y += boxH + 22 * s;

  let limit = drawFooter(c, d, t, pad, maxW, H - (wide ? 24 : 44) * s, t.soft);
  if (d.plan) {
    font(c, 700, wide ? 18 : 24, SERIF);
    const lines = wrapText(measure(c), planLine(d.plan).toUpperCase(), maxW, 2);
    const lineH = (wide ? 18 : 24) * s * 1.35;
    putLines(c, lines, mid, limit - lineH * lines.length, lineH, t.headline, 'center');
    limit -= lineH * lines.length + 14 * s;
  }
  drawTitleDesc(c, d, pad, y, maxW, limit, {
    family: SERIF,
    titleSize: wide ? 38 : 54,
    descSize: wide ? 22 : 30,
    titleWeight: 'italic 700',
    align: 'center',
    titleColor: t.text,
    descColor: t.soft,
  });
};

/** Cartaz: raios saindo do número gigante, no centro, e um cartão branco com o compromisso. */
export const drawPoster: Draw = (canvas, format, d, t) => {
  const c = setup(canvas, format);
  if (!c) return;
  const { ctx, W, H, s, wide, story } = c;
  const pad = Math.round(64 * s);
  const maxW = W - pad * 2;
  const mid = W / 2;
  background(c, t);

  const cy = H * (story ? 0.38 : wide ? 0.5 : 0.42);
  const rays = 20;
  const reach = Math.hypot(W, H);
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = t.accent;
  for (let i = 0; i < rays; i++) {
    const a0 = (i * 2 * Math.PI) / rays;
    const a1 = a0 + Math.PI / rays;
    ctx.beginPath();
    ctx.moveTo(mid, cy);
    ctx.lineTo(mid + Math.cos(a0) * reach, cy + Math.sin(a0) * reach);
    ctx.lineTo(mid + Math.cos(a1) * reach, cy + Math.sin(a1) * reach);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  let y = pad * 0.6 + (story ? 80 * s : 0);
  y += drawBrand(c, pad, y, t.text, t.text, W - pad * 2 + 0) + 22 * s;

  const head = fitText(c, {
    weight: 800,
    size: wide ? 34 : 50,
    min: 18,
    text: bannerHeadline(d.charges),
    maxW,
    maxH: H * 0.14,
    lineH: 1.12,
  });
  putLines(c, head.lines, mid, y, head.lineH, t.headline, 'center');
  y += head.height + 6 * s;

  const num = number(d);
  const numSize = shrinkToFit(c, 800, story ? 400 : wide ? 150 : 290, num, maxW);
  put(c, num, mid, y + numSize * s * 0.82, t.number, 'center');
  y += numSize * s * 0.9;
  const phrase = `${chargesPhrase(d.charges)} o governo`;
  const phraseSize = shrinkToFit(c, 700, wide ? 30 : 52, phrase, maxW);
  put(c, phrase, mid, y + phraseSize * s * 0.9, t.text, 'center');
  y += phraseSize * s * 1.2 + 26 * s;

  const limit = drawFooter(c, d, t, pad, maxW, H - (wide ? 24 : 44) * s, t.text);
  const inner = 28 * s;
  const surface = t.surface ?? '#ffffff';
  ctx.fillStyle = surface;
  ctx.beginPath();
  ctx.roundRect(pad, y, maxW, Math.max(40 * s, limit - y), 16 * s);
  ctx.fill();
  let cardBottom = limit - inner;
  cardBottom = drawPlanBar(
    c,
    d,
    pad + inner,
    maxW - inner * 2,
    cardBottom,
    t.headline,
    t.ink ?? t.text,
    wide ? 20 : 28,
  );
  drawTitleDesc(c, d, pad + inner, y + inner, maxW - inner * 2, cardBottom, {
    titleSize: wide ? 34 : 52,
    descSize: wide ? 22 : 30,
    align: 'center',
    titleColor: t.ink ?? t.text,
    descColor: t.soft,
  });
};

/** Carimbo "COBRADO" inclinado sobre uma folha clara, com o título em destaque. */
export const drawStamp: Draw = (canvas, format, d, t) => {
  const c = setup(canvas, format);
  if (!c) return;
  const { ctx, W, H, s, wide, story } = c;
  const pad = Math.round(64 * s);
  const maxW = W - pad * 2;
  background(c, t);

  ctx.fillStyle = t.headline;
  ctx.fillRect(0, 0, W, Math.round(14 * s));
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = t.text;
  for (let ly = 120 * s; ly < H; ly += 48 * s) ctx.fillRect(0, ly, W, Math.max(1, 2 * s));
  ctx.restore();

  let y = pad * 0.6 + (story ? 80 * s : 0) + 14 * s;
  y += drawBrand(c, pad, y, t.text, t.soft) + 30 * s;

  const limit = drawFooter(c, d, t, pad, maxW, H - (wide ? 24 : 44) * s, t.soft);
  const R = story ? 300 : wide ? 190 : 230;
  const r = R * s;
  const cx = W - pad - r * 0.95;
  const cyS = limit - r * 1.02;
  const zoneTop = cyS - r - 14 * s;

  drawTitleDesc(c, d, pad, y, maxW, zoneTop, {
    titleSize: wide ? 44 : story ? 110 : 76,
    descSize: wide ? 24 : story ? 46 : 32,
    titleWeight: 800,
    titleColor: t.text,
    descColor: t.soft,
  });

  const leftW = cx - r - 24 * s - pad;
  let blockBottom = cyS + r;
  blockBottom = drawPlanBar(c, d, pad, leftW, blockBottom, t.headline, t.text, wide ? 18 : 26);
  const head = fitText(c, {
    weight: 800,
    size: wide ? 28 : 46,
    min: 16,
    text: bannerHeadline(d.charges),
    maxW: leftW,
    maxH: Math.max(40 * s, blockBottom - zoneTop),
    lineH: 1.12,
  });
  putLines(c, head.lines, pad, blockBottom - head.height, head.lineH, t.headline);

  ctx.save();
  ctx.translate(cx, cyS);
  ctx.rotate(-0.21);
  ctx.globalAlpha = 0.93;
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = r * 0.05;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = r * 0.016;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.86, 0, Math.PI * 2);
  ctx.stroke();
  const num = number(d);
  font(c, 800, R * 0.24);
  put(c, 'COBRADO', 0, -r * 0.34, t.accent, 'center');
  shrinkToFit(c, 800, R * 0.62, num, r * 1.45);
  put(c, num, 0, r * 0.22, t.number, 'center');
  font(c, 700, R * 0.1);
  put(c, d.charges === 1 ? 'VEZ PELO POVO' : 'VEZES PELO POVO', 0, r * 0.62, t.accent, 'center');
  ctx.restore();
};

/** Placar: painel colorido com o número e, ao lado ou abaixo, o compromisso em fundo claro. */
export const drawScoreboard: Draw = (canvas, format, d, t) => {
  const c = setup(canvas, format);
  if (!c) return;
  const { ctx, W, H, s, wide, story } = c;
  const pad = Math.round(60 * s);
  const surface = t.surface ?? '#ffffff';
  ctx.fillStyle = surface;
  ctx.fillRect(0, 0, W, H);

  const pw = wide ? Math.round(W * 0.4) : W;
  const ph = wide ? H : Math.round(H * (story ? 0.38 : 0.44));
  const grad = ctx.createLinearGradient(0, 0, pw, ph);
  grad.addColorStop(0, t.bgFrom);
  grad.addColorStop(1, t.bgTo);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, pw, ph);
  const stripe = Math.round(16 * s);
  const seg = pw / 3;
  t.stripe.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(i * seg, 0, seg + 1, stripe);
  });
  const panelText = '#ffffff';
  const markH = drawBrand(
    c,
    pad,
    stripe + (story ? 80 : 36) * s,
    panelText,
    panelText,
    wide ? pw - pad * 2 : undefined,
  );

  const pMax = pw - pad * 2;
  const num = number(d);
  const numSize = shrinkToFit(c, 800, story ? 340 : wide ? 190 : 270, num, pMax);
  const phrase = `${chargesPhrase(d.charges)} o governo`;
  const phraseSize = shrinkToFit(c, 700, wide ? 30 : 46, phrase, pMax);
  const groupH = numSize * s * 0.82 + phraseSize * s * 1.5;
  const areaTop = stripe + markH + (story ? 100 : 40) * s;
  const gy = areaTop + Math.max(0, (ph - areaTop - groupH) / 2 - 6 * s);
  font(c, 800, numSize);
  put(c, num, pw / 2, gy + numSize * s * 0.8, t.number, 'center');
  font(c, 700, phraseSize);
  put(c, phrase, pw / 2, gy + numSize * s * 0.82 + phraseSize * s * 1.05, panelText, 'center');

  const x = wide ? pw + pad : pad;
  const w = wide ? W - pw - pad * 2 : W - pad * 2;
  let y = wide ? pad * 0.75 : ph + 36 * s;
  const head = fitText(c, {
    weight: 800,
    size: wide ? 28 : 38,
    min: 16,
    text: bannerHeadline(d.charges),
    maxW: w,
    maxH: H * 0.12,
    lineH: 1.12,
  });
  putLines(c, head.lines, x, y, head.lineH, t.headline);
  y += head.height + 16 * s;

  let limit = drawFooter(c, d, t, x, w, H - (wide ? 24 : 44) * s, t.soft);
  limit = drawPlanBar(c, d, x, w, limit, t.accent, t.ink ?? t.text, wide ? 20 : 28);
  drawTitleDesc(c, d, x, y, w, limit, {
    titleSize: wide ? 38 : story ? 88 : 58,
    descSize: wide ? 22 : story ? 42 : 30,
    titleColor: t.ink ?? t.text,
    descColor: t.soft,
  });
};
