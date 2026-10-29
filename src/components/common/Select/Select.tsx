import type { SelectHTMLAttributes } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.875rem;
`;

const StyledSelect = styled.select`
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
`;

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  id: string;
  label: string;
  options: Option[];
  placeholder?: string;
}

export function Select({ id, label, options, placeholder, ...rest }: SelectProps) {
  return (
    <Wrapper>
      <Label htmlFor={id}>{label}</Label>
      <StyledSelect id={id} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </Wrapper>
  );
}
