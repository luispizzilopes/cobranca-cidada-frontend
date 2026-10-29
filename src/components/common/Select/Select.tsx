import type { SelectHTMLAttributes } from 'react';
import { Label, StyledSelect, Wrapper } from './Select.styles';

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
