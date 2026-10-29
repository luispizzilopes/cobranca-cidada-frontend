import type { InputHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { Hint } from '../Input/Input.styles';

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 16px;
`;

const Line = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-weight: 600;
  font-size: 0.875rem;

  input {
    flex: none;
    width: 20px;
    height: 20px;
    margin: 0;
    accent-color: var(--primary);
  }
`;

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
