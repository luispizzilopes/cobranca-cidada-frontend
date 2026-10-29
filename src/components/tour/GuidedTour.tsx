import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../common';
import type { TourStep } from '../../data/tour';
import {
  Actions,
  Blocker,
  Curtain,
  Dot,
  Dots,
  Popover,
  Progress,
  Spotlight,
  Task,
} from './GuidedTour.styles';

const PADDING = 8;
const GAP = 12;
const MARGIN = 16;

interface Props {
  steps: TourStep[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

function findTarget(name: string | undefined): HTMLElement | null {
  if (!name) return null;
  const el = document.querySelector<HTMLElement>(`[data-tour="${name}"]`);
  if (!el) return null;
  const { width, height } = el.getBoundingClientRect();
  return width > 0 && height > 0 ? el : null;
}

/** Próximo passo que dá para mostrar: pula os cujo alvo não existe (menu fechado no celular, lista vazia). */
function nextAvailable(steps: TourStep[], from: number, direction: 1 | -1): number | null {
  for (let i = from; i >= 0 && i < steps.length; i += direction) {
    if (!steps[i].target || findTarget(steps[i].target)) return i;
  }
  return null;
}

/** Passo a passo com destaque no elemento. Passos interativos esperam o usuário agir na própria página. */
export function GuidedTour({ steps, index, onIndexChange, onClose }: Props) {
  const step = steps[index];
  const [params] = useSearchParams();
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const done = step.interactive ? step.interactive.done(params) : true;

  const measure = useCallback(() => {
    const el = findTarget(step.target);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [step.target]);

  useEffect(() => {
    const el = findTarget(step.target);
    el?.scrollIntoView({ block: 'center', behavior: 'auto' });
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    // O conteúdo da página muda (resultado da busca, carregamento): remede de vez em quando.
    const timer = window.setInterval(measure, 250);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
      window.clearInterval(timer);
    };
  }, [step.target, measure]);

  useLayoutEffect(() => {
    const pop = popoverRef.current;
    if (!pop) return;
    const { offsetWidth: w, offsetHeight: h } = pop;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (!rect) {
      setPosition({ top: Math.max(MARGIN, (vh - h) / 2), left: Math.max(MARGIN, (vw - w) / 2) });
      return;
    }
    const left = Math.min(Math.max(MARGIN, rect.left), vw - w - MARGIN);
    const below = rect.bottom + PADDING + GAP;
    const above = rect.top - PADDING - GAP - h;
    let top: number;
    if (below + h <= vh - MARGIN) top = below;
    else if (above >= MARGIN) top = above;
    else top = vh - h - MARGIN;
    setPosition({ top, left });
  }, [rect, index, done]);

  useEffect(() => {
    if (!step.interactive)
      popoverRef.current?.querySelector<HTMLElement>('[data-next]')?.focus({ preventScroll: true });
  }, [index, step.interactive]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function go(direction: 1 | -1) {
    const target = nextAvailable(steps, index + direction, direction);
    if (target === null) {
      if (direction === 1) onClose();
      return;
    }
    onIndexChange(target);
  }

  const last = index === steps.length - 1;
  const interactive = Boolean(step.interactive);

  return createPortal(
    <>
      {!interactive && <Blocker aria-hidden="true" />}
      {rect ? (
        <Spotlight
          aria-hidden="true"
          style={{
            top: rect.top - PADDING,
            left: rect.left - PADDING,
            width: rect.width + PADDING * 2,
            height: rect.height + PADDING * 2,
          }}
        />
      ) : (
        <Curtain aria-hidden="true" />
      )}
      <Popover
        ref={popoverRef}
        role="dialog"
        aria-labelledby="tour-titulo"
        aria-live="polite"
        style={{
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          visibility: position ? 'visible' : 'hidden',
        }}
      >
        <Dots aria-hidden="true">
          {steps.map((s, i) => (
            <Dot key={s.id} $state={i < index ? 'done' : i === index ? 'current' : 'todo'} />
          ))}
        </Dots>
        <Progress>
          Passo {index + 1} de {steps.length}
        </Progress>
        <h2 id="tour-titulo">{step.title}</h2>
        <p>{step.body}</p>
        {step.interactive && (
          <Task $done={done}>{done ? step.interactive.success : step.interactive.hint}</Task>
        )}
        <Actions>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Sair
          </Button>
          <span className="spacer" />
          {index > 0 && (
            <Button variant="secondary" size="sm" onClick={() => go(-1)}>
              Voltar
            </Button>
          )}
          {interactive && !done && (
            <Button variant="ghost" size="sm" onClick={() => go(1)}>
              Pular
            </Button>
          )}
          <Button data-next size="sm" disabled={!done} onClick={() => (last ? onClose() : go(1))}>
            {last ? 'Concluir' : index === 0 ? 'Começar' : 'Continuar'}
          </Button>
        </Actions>
      </Popover>
    </>,
    document.body,
  );
}
