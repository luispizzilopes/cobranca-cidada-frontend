# Cobrança Cidadã — Frontend

## Visão Geral

SPA em React/TypeScript do Cobrança Cidadã: catálogo de compromissos de campanha (com fonte, página do plano e situação de execução), detalhe, linha do tempo de prazos, voto ("Cobrar" e "Boa/Má proposta"), conta e páginas de conteúdo (metodologia, divergências, limitações, privacidade). Consome a API do `cobranca-cidada-backend`.

Segue o padrão do Kerdos (`../../kerdos/kerdos-frontend`): mesma stack e estrutura de pastas. Visual no estilo do gov.br (Padrão Digital de Governo), sem usar a marca do governo.

## Stack

React 19, TypeScript, Vite, styled-components v6, react-router-dom v7, axios, lucide-react, oxlint, prettier. Testes: Vitest + Testing Library (unidade) e Playwright + axe (ponta a ponta e acessibilidade). Fonte Rawline (OFL) via `rawline-webfont`.

## Comandos

```bash
npm install
npm run dev          # http://localhost:5173 (API em VITE_API_URL, padrão http://localhost:5399)
npm run build
npm run lint         # oxlint
npm run format       # prettier
npm test             # Vitest (unidade)
npm run e2e          # Playwright; exige a API rodando e o log dela em E2E_API_LOG (veja o README)
```

## Estrutura

```
src/
├── components/
│   ├── common/           ← Button, Input, Select, Alert, Badge, Modal, Pagination, Toast, Logo... (barrel em index.ts)
│   ├── layout/           ← AppLayout, Header, Footer, IndependentBanner, Page, AuthCard, RequireAdmin
│   ├── auth/             ← GoogleSignInButton, GoogleAuthSection (Entrar com o Google), googleIdentity (script do Google)
│   ├── comments/         ← CommentsSection (opiniões em texto no detalhe do compromisso)
│   └── voting/           ← CommitmentCard, VoteBar, Countdown, VerifyEmailDialog
├── contexts/             ← ThemeContext, SessionContext, VerifyEmailContext
├── content/              ← Markdown das páginas de conteúdo (escritas à mão: metodologia, limitações e privacidade)
├── data/                 ← domains (URL da API), site (nome, posse, menu), statusMeta (cor por situação)
├── hooks/                ← useCommitments, useCommitment, useCatalog, useMyVotes, useVote, useComments, usePageTitle
├── pages/                ← uma pasta por rota (catalog, commitment, deadlines, auth, account, content, notFound)
├── routes/               ← router.tsx
├── seo/                  ← pages (tabela de SEO por rota), headTags (etiquetas como texto), applySeo (etiquetas no DOM)
├── services/             ← api/api.ts (axios + credenciais), commitment, catalog, auth, voting, types.ts
├── utils/                ← apiError, dates, deadlines, password, download
├── types-google.d.ts     ← tipos da parte usada do Google Identity Services
├── globalStyle.ts        ← tokens (claro/escuro), foco, reduced motion
├── App.tsx
└── main.tsx
```

Fluxo: Página → hook `use*` → service → `api.ts` → API. Pages não chamam services de dados diretamente quando há hook.

## Regras que não podem quebrar

- **Os compromissos vêm só da API.** Nenhuma lista de compromissos no código, em arquivos estáticos ou em variáveis de ambiente. As páginas de conteúdo (`src/content`) são texto editorial, não dados de compromissos.
- **Situação de execução é editorial, voto é opinião.** Nunca mostrar contagem de votos como prova de cumprimento; o voto aparece separado da situação, sempre com o rótulo "Opinião de pessoas com e-mail verificado. Não é pesquisa estatística."
- **Contagens só quando a API as entrega.** A interface sempre exibe cobranças e avaliações (boa/má) vindas da API. Nunca calcular nem estimar contagens no cliente. "Mais cobradas agora" lista itens com ao menos uma cobrança.
- **Cor nunca é o único sinal.** A situação sempre vem com o rótulo em texto.
- **Aviso fixo** "Site de cidadãos, sem vínculo com o governo." (`IndependentBanner`). Não usar brasão, marca "gov.br" ou selo oficial.
- **Nada de dado pessoal em logs ou no armazenamento além do necessário.** `localStorage` guarda: tema, usuário (id, nome, e-mail, papéis), token de votante e uma dica de sessão. Token de conta fica só em memória.
- **Painel `/admin`** (`pages/admin`, carregado sob demanda): só aparece para conta com papel `Admin` (`useSession().isAdmin`), mas isso é só navegação; a API é quem recusa quem não tem a claim. `RequireAdmin` manda anônimo ao login e mostra "não encontrada" a quem não é admin. A flag é concedida no banco (`set-admin`), nunca pela interface. O E2E `admin.spec.ts` usa `E2E_SET_ADMIN_CMD` ou o CLI do backend.
- Redirecionamento após login só para caminhos internos (`safeRedirect`).
- **Login com Google:** o botão só existe com `VITE_GOOGLE_CLIENT_ID`; sem ele o site segue só com e-mail e senha. O script do Google só é carregado nas telas que mostram o botão. O ID token vai para `POST /authentication/google`, que valida tudo (nada do token é confiável no navegador). Conta nova exige o aceite da política (`Auth.ConsentRequired` mostra a caixa de aceite). Conta criada pelo Google **não tem senha** (`profile.hasPassword`): a tela da conta esconde "Alterar senha" e pede a confirmação pelo Google para excluir a conta. **O site não oferece troca de e-mail** (o e-mail é a identidade da conta e do vínculo com o Google); os endpoints continuam na API, sem tela.
- **SEO:** título, descrição, canonical, robots e Open Graph de toda página passam por `usePageTitle` (que chama `applySeo`). As páginas estáticas ficam em `src/seo/pages.ts` (e viram HTML no build); a de compromisso informa o seu `description`. Rotas de conta e do painel são `noindex`. O título/descrição do compromisso seguem a mesma regra do servidor (`commitmentTitle`/`commitmentDescription` ↔ `SeoPageRenderer`): mexeu em um, mexa no outro.

## Credenciais (`services/api/api.ts`)

- **Conta:** token de acesso curto só em memória; renovado por cookie HttpOnly (`/authentication/refresh`) uma única vez por 401 (interceptor). Só tenta restaurar se já houve login neste navegador.
- **Votante só com e-mail verificado:** token de 30 dias no `localStorage`, escopo limitado a votar e gerir os próprios votos. Um 401 com esse token o descarta.
- Login de conta substitui o token de votante. O voto que motivou a verificação é aplicado assim que o e-mail é confirmado (`useVote` + `VerifyEmailContext.ensureCanVote`).
- `VerifyEmailProvider` precisa ficar **dentro do roteador** (o diálogo usa `useNavigate`); está no `AppLayout`.

## Acessibilidade (WCAG 2.2 AA)

Link de pular conteúdo, foco levado ao `<main>` a cada navegação, foco visível tracejado dourado (como no gov.br), `aria-pressed` nos botões de voto, `aria-live` nos resumos e toasts, modal com foco preso e Esc, `prefers-reduced-motion`, tema claro e escuro com contraste AA. O axe roda no E2E nas telas principais, nos dois temas, e falha em violações sérias ou críticas.

## Convenções

| Artefato       | Convenção                                                       | Exemplo                                   |
| -------------- | --------------------------------------------------------------- | ----------------------------------------- |
| Componente     | PascalCase, pasta própria                                       | `VoteBar/VoteBar.tsx`                     |
| Estilos        | `<Componente>.styles.ts` quando grandes; senão no mesmo arquivo | `Button.styles.ts`                        |
| Hook           | `use` + camelCase                                               | `useCommitments`                          |
| Service        | objeto literal exportado, sufixo `Service`                      | `commitmentService`                       |
| Rotas públicas | em português                                                    | `/compromissos/:id`, `/prazos`, `/entrar` |

- `extractApiError(err)` em todo catch de chamada HTTP. Evite `any`.
- A tela inicial mostra "Veja o que as pessoas estão comentando" (`RecentCommentsPanel`, abaixo de "Mais cobradas agora"); "Ver mais" abre `/compromissos/:id#comentarios` e a página rola até a seção quando o compromisso termina de carregar.
- Estado de filtros do catálogo fica na URL (`useCatalogFilters`).
- Mensagens e textos em português do Brasil.

## Testes

- `src/**/*.test.ts(x)` — Vitest: utilitários, filtros na URL, `VoteBar`, `CommitmentCard`, `Modal`, `Pagination`, credenciais, `GoogleAuthSection` (aceite, redirecionamento, erro), SEO (`seo.test.ts`: tabela de páginas, etiquetas, `applySeo`, plugin do Vite).
- `e2e/*.spec.ts` — Playwright contra a API real: filtros, detalhe, voto só com e-mail verificado (votar, trocar, desfazer, "minhas cobranças", apagar), conta (cadastro, login, recuperação de senha, exclusão) e axe nos dois temas.
