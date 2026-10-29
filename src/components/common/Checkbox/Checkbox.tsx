import type { InputHTMLAttributes, ReactNode } from 'react';
import { Hint } from '../Input/Input.styles';
import { Line, Row } from './Checkbox.styles';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label: ReactNode;
  hint?: string;
}
export function Checkbox({ id, label, hint, ...rest }: CheckboxProps) {
  return (
    <Row>
      <Line htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          aria-describedby={hint ? `${id}-hint` : undefined}
          {...rest}
        />
        <span>{label}</span>
      </Line>
      {hint && <Hint id={`${id}-hint`}>{hint}</Hint>}
    </Row>
  );
}
