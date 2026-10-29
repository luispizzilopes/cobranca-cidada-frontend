import { Spinner, Wrapper } from './Loading.styles';

export function Loading({
  inline = false,
  label = 'Carregando...',
}: {
  inline?: boolean;
  label?: string;
}) {
  const spinner = <Spinner role="status" aria-label={label} />;
  return inline ? spinner : <Wrapper>{spinner}</Wrapper>;
}
