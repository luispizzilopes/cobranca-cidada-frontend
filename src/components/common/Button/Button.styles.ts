import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type Size = 'sm' | 'md';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.65s linear infinite;
  margin-right: 8px;
`;

const variants = {
  primary: css`
    background: var(--primary);
    color: var(--on-primary);
    border-color: var(--primary);
    &:hover:not(:disabled) {
      background: var(--primary-hover);
      border-color: var(--primary-hover);
      color: var(--on-primary);
    }
  `,
  secondary: css`
    background: transparent;
    color: var(--primary);
    border-color: var(--primary);
    &:hover:not(:disabled) {
      background: var(--hover);
      color: var(--primary);
    }
  `,
  ghost: css`
    background: transparent;
    color: var(--primary);
    border-color: transparent;
    &:hover:not(:disabled) {
      background: var(--hover);
      color: var(--primary);
    }
  `,
  danger: css`
    background: var(--danger-solid);
    color: #fff;
    border-color: var(--danger-solid);
    &:hover:not(:disabled) {
      filter: brightness(0.9);
      color: #fff;
    }
  `,
};

export const buttonBase = css<{ $variant: Variant; $size: Size; $fullWidth: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: ${({ $size }) => ($size === 'sm' ? '32px' : '40px')};
  padding: ${({ $size }) => ($size === 'sm' ? '0 16px' : '0 24px')};
  font-weight: 600;
  font-size: ${({ $size }) => ($size === 'sm' ? '0.875rem' : '1rem')};
  border: 1px solid transparent;
  border-radius: 100em;
  text-decoration: none;
  white-space: nowrap;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  transition:
    background 0.15s,
    border-color 0.15s;
  ${({ $variant }) => variants[$variant]}

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const StyledButton = styled.button<{ $variant: Variant; $size: Size; $fullWidth: boolean }>`
  ${buttonBase}
`;

export const StyledLinkButton = styled(Link)<{
  $variant: Variant;
  $size: Size;
  $fullWidth: boolean;
}>`
  ${buttonBase}
`;
