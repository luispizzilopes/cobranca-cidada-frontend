import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { type AlertTone, Box, Title } from './Alert.styles';

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
};
interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
  /** Use "alert" para erros que surgem após uma ação; "status" para avisos neutros. */
  role?: 'alert' | 'status' | 'none';
}
export function Alert({ tone = 'info', title, children, role = 'status' }: AlertProps) {
  const Icon = icons[tone];
  return (
    <Box $tone={tone} role={role === 'none' ? undefined : role}>
      <Icon size={20} aria-hidden="true" />
      <div>
        {title && <Title>{title}</Title>}
        {children}
      </div>
    </Box>
  );
}
