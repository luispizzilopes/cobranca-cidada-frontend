import type { TextareaHTMLAttributes } from 'react';
import { ErrorText, Hint, Label, Wrapper } from '../Input/Input.styles';
import { StyledTextarea } from './Textarea.styles';

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
