import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import {
  ErrorText,
  Hint,
  InputContainer,
  Label,
  PasswordToggle,
  StyledInput,
  Wrapper,
} from './Input.styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, type, ...rest }: InputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && passwordVisible ? 'text' : type;
  const toggleLabel = passwordVisible ? 'Ocultar senha' : 'Mostrar senha';
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') ||
    undefined;

  return (
    <Wrapper>
      <Label htmlFor={id}>{label}</Label>
      {hint && <Hint id={`${id}-hint`}>{hint}</Hint>}
      <InputContainer>
        <StyledInput
          id={id}
          type={inputType}
          $hasError={!!error}
          $hasPasswordToggle={isPassword}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          {...rest}
        />
        {isPassword && (
          <PasswordToggle
            type="button"
            onClick={() => setPasswordVisible((visible) => !visible)}
            aria-label={toggleLabel}
            aria-pressed={passwordVisible}
            title={toggleLabel}
          >
            {passwordVisible ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </PasswordToggle>
        )}
      </InputContainer>
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </Wrapper>
  );
}
