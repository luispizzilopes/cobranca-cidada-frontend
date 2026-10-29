import { CalendarDays } from 'lucide-react';
import { INAUGURATION_DATE } from '../../data/site';
import { daysUntil, formatDate } from '../../utils/dates';
import { Big, Box, Label } from './Countdown.styles';

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
