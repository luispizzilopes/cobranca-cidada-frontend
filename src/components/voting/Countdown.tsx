import { CalendarDays } from 'lucide-react';
import styled from 'styled-components';
import { INAUGURATION_DATE } from '../../data/site';
import { daysUntil, formatDate } from '../../utils/dates';

const Box = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-lg);
`;

const Big = styled.span`
  font-size: 2.571rem;
  font-weight: 700;
  line-height: 1;
`;

const Label = styled.span`
  display: block;
  font-size: 0.929rem;
`;

/** Dias até a posse prevista. Depois da data, mostra que o mandato começou. */
export function Countdown({ now }: { now?: Date }) {
  const days = daysUntil(INAUGURATION_DATE, now);
  const date = formatDate(INAUGURATION_DATE);

  return (
    <Box>
      <CalendarDays size={28} aria-hidden="true" />
      {days > 0 ? (
        <div>
          <Big>{days}</Big>
          <Label>
            {days === 1 ? 'dia' : 'dias'} para a posse prevista ({date})
          </Label>
        </div>
      ) : (
        <div>
          <Big>{Math.abs(days)}</Big>
          <Label>
            {Math.abs(days) === 1 ? 'dia' : 'dias'} desde a posse prevista ({date})
          </Label>
        </div>
      )}
    </Box>
  );
}
