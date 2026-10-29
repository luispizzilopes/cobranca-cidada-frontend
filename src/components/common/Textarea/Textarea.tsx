import type { TextareaHTMLAttributes } from 'react';
import styled from 'styled-components';
import { ErrorText, Hint, Label, Wrapper } from '../Input/Input.styles';

const StyledTextarea = styled.textarea<{ $hasError: boolean }>`
  width: 100%;
  min-height: 96px;
  padding: 8px 12px;
  background: var(--surface);
  border: 1px solid ${({ $hasError }) => ($hasError ? 'var(--danger)' : 'var(--border-strong)')};
  border-radius: var(--radius);
  resize: vertical;
`;

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, id, error, hint, ...rest }: TextareaProps) {
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') ||
    undefined;

  return (
    <Wrapper>
      <Label htmlFor={id}>{label}</Label>
      {hint && <Hint id={`${id}-hint`}>{hint}</Hint>}
      <StyledTextarea
        id={id}
        $hasError={!!error}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        {...rest}
      />
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </Wrapper>
  );
}
