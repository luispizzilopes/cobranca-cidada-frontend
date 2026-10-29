import { Alert } from '../Alert/Alert';

export function FormError({ message }: { message: string | null | undefined }) {
  if (!message) return null;
  return (
    <Alert tone="danger" role="alert">
      {message}
    </Alert>
  );
}
