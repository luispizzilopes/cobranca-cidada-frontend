import { type ButtonHTMLAttributes } from 'react';
import type { LinkProps } from 'react-router-dom';
import { Spinner, StyledButton, StyledLinkButton, type Size, type Variant } from './Button.styles';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, CommonProps {
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <StyledButton
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner aria-hidden="true" />}
      {children}
    </StyledButton>
  );
}

/** Link de navegação com a aparência de botão. */
export function LinkButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...rest
}: LinkProps & CommonProps) {
  return <StyledLinkButton $variant={variant} $size={size} $fullWidth={fullWidth} {...rest} />;
}
