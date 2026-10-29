export interface TourStep {
  id: string;
  /** Valor de `data-tour` do elemento destacado. Sem alvo, o passo aparece centralizado. */
  target?: string;
  title: string;
  body: string;
  /** Passo que espera o usuário fazer algo na página; `done` olha a URL (os filtros vivem nela). */
  interactive?: {
    hint: string;
    success: string;
    done: (params: URLSearchParams) => boolean;
  };
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'boas-vindas',
    title: 'Bem-vindo à Cobrança Cidadã',
    body: 'Este passo a passo mostra, em cerca de 2 minutos, como conferir uma promessa, dar sua opinião e cobrar. Você pode sair quando quiser (tecla Esc).',
  },
  {
    id: 'busca',
    target: 'filtros',
    title: 'Encontre uma promessa',
    body: 'Aqui você filtra por área, origem e situação de execução, ou busca por palavra ou código.',
    interactive: {
      hint: 'Sua vez: digite uma palavra (por exemplo, "saúde") em "Buscar por palavra ou código" e clique em Buscar.',
      success: 'Isso! A lista foi filtrada. Você pode limpar o filtro quando quiser.',
      done: (params) => Boolean(params.get('busca')),
    },
  },
  {
    id: 'abas',
    target: 'abas',
    title: 'Visões da lista',
    body: '"Todas" mostra tudo, "Com prazo" separa as promessas que têm data para sair do papel, e "Minhas cobranças" reúne as que você já cobrou.',
    interactive: {
      hint: 'Sua vez: clique em "Com prazo".',
      success: 'Pronto! Agora só aparecem promessas com prazo. Para voltar, clique em "Todas".',
      done: (params) => params.get('aba') === 'prazo',
    },
  },
  {
    id: 'cartao',
    target: 'cartao',
    title: 'Cada promessa em um cartão',
    body: 'O cartão traz o código, a área, a origem (plano de governo, campanha ou imprensa), a situação de execução, o prazo e a página do plano onde a promessa aparece.',
  },
  {
    id: 'votos',
    target: 'votos',
    title: 'Cobre e opine',
    body: '"Cobrar" diz que você quer uma resposta sobre a promessa. "Boa proposta" e "Má proposta" registram sua opinião sobre ela. Voto é opinião: não muda a situação de execução, que depende só da fonte pública. Para votar, confirme seu e-mail ou crie uma conta.',
  },
  {
    id: 'detalhes',
    target: 'detalhes',
    title: 'Confira a fonte',
    body: 'Em "Ver fontes e detalhes" você encontra os documentos que sustentam a situação de cada promessa e os comentários de outras pessoas.',
  },
  {
    id: 'menu',
    target: 'menu',
    title: 'Mais sobre o site',
    body: '"Prazos" lista o que vence primeiro, "Metodologia" explica como conferimos cada promessa e "Limitações" diz o que o site não consegue mostrar.',
  },
  {
    id: 'conta',
    target: 'conta',
    title: 'Sua conta e o tema',
    body: 'Entre para guardar suas cobranças e gerenciar seus dados. O botão de lua/sol troca entre tema claro e escuro.',
  },
  {
    id: 'fim',
    title: 'Tudo pronto!',
    body: 'Agora é com você: escolha uma promessa e cobre. Para rever este passo a passo, use o botão "Tutorial" no topo da página.',
  },
];
