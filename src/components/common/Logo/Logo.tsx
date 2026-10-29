import {
  BAND,
  DISC,
  FLAG_COLORS,
  FLAG_H,
  FLAG_W,
  RHOMBUS,
  STARS,
  bandLetters,
  bandPoint,
  starPoints,
} from '../../../utils/brazilFlag';
import { SITE_NAME, SITE_TAGLINE } from '../../../data/site';
import { Mark, Name, Tagline, Text, Wrapper } from './Logo.styles';

/** Bandeira do Brasil como símbolo do site. Não usa o brasão nem a marca do gov.br. */
export function Logo() {
  return (
    <Wrapper to="/" aria-label={`${SITE_NAME}, ${SITE_TAGLINE} — página inicial`}>
      <Mark aria-hidden="true">
        <svg width="44" height="31" viewBox={`0 0 ${FLAG_W} ${FLAG_H}`}>
          <defs>
            <clipPath id="logo-flag-disc">
              <circle cx={DISC.cx} cy={DISC.cy} r={DISC.r} />
            </clipPath>
          </defs>
          <rect width={FLAG_W} height={FLAG_H} fill={FLAG_COLORS.green} />
          <polygon points={RHOMBUS.map((p) => p.join(',')).join(' ')} fill={FLAG_COLORS.yellow} />
          <circle cx={DISC.cx} cy={DISC.cy} r={DISC.r} fill={FLAG_COLORS.blue} />
          <path
            clipPath="url(#logo-flag-disc)"
            d={`M${bandPoint(-0.6)} A${BAND.r} ${BAND.r} 0 0 1 ${bandPoint(0.6)}`}
            fill="none"
            stroke={FLAG_COLORS.white}
            strokeWidth={BAND.width}
          />
          {bandLetters().map((l, i) => (
            <text
              key={i}
              x={0}
              y={0}
              transform={`translate(${l.x} ${l.y}) rotate(${(l.rot * 180) / Math.PI})`}
              fill={FLAG_COLORS.green}
              fontSize={BAND.fontSize}
              fontWeight={700}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {l.ch}
            </text>
          ))}
          {STARS.map(([sx, sy, sr], i) => (
            <polygon
              key={i}
              points={starPoints(DISC.cx + sx * 10, DISC.cy + sy * 10, sr * 10)
                .map((p) => p.join(','))
                .join(' ')}
              fill={FLAG_COLORS.white}
            />
          ))}
        </svg>
      </Mark>
      <Text>
        <Name>{SITE_NAME}</Name>
        <Tagline>{SITE_TAGLINE}</Tagline>
      </Text>
    </Wrapper>
  );
}
