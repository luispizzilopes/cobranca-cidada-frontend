import { Link } from 'react-router-dom';
import { Alert } from '../../components/common';

/** Itens atribuídos pela imprensa ou vindos da campanha não se misturam com o texto do plano de governo. */
export function CommitmentCardOriginNotice({ originName }: { originName: string }) {
  return (
    <Alert tone="warning" title={`Origem: ${originName}`}>
      <p>
        Este compromisso não vem do texto do plano de governo registrado no TSE. Ele foi reunido de
        declarações de campanha ou atribuído pela imprensa, e por isso a evidência é registrada como
        limitada. Veja as fontes abaixo e a <Link to="/metodologia">metodologia</Link>.
      </p>
    </Alert>
  );
}
