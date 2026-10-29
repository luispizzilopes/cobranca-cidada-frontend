# Cobrança Cidadã — Frontend

Veja `CLAUDE.md` para arquitetura e regras.

## Rodar

```bash
npm install
cp .env.example .env     # VITE_API_URL (padrão http://localhost:5399); VITE_GOOGLE_CLIENT_ID e VITE_SITE_URL são opcionais
npm run dev              # http://localhost:5173
```

A API precisa estar no ar com o banco migrado e populado (veja o README do backend, ou use o `docker compose` da raiz).

## Testes

```bash
npm test        # unidade (Vitest)
npm run lint
npm run build
```

### Ponta a ponta (Playwright)

```bash
npx playwright install chromium
# Com a API rodando e imprimindo os códigos de e-mail no log (sem chave do Brevo):
#   dotnet run ... > /tmp/api.log     ou     docker compose logs -f api > /tmp/api.log
# Os E2E criam contas e votos de teste: use um banco de desenvolvimento, nunca o de produção.
# Suba a API com limites de taxa maiores para as repetições: RateLimits__EmailCode=1000 RateLimits__AuthAnonymous=1000
E2E_API_LOG=/tmp/api.log npm run e2e
```

## Páginas de conteúdo

`src/content/*.md` (metodologia, limitações e privacidade) são escritos à mão. A privacidade deve passar por revisão jurídica.

## SEO

- `src/seo/pages.ts` é a fonte única de título, descrição e `noindex` das páginas estáticas. O plugin `vite-seo-plugin.ts` usa a tabela no build para gerar um HTML por rota (`dist/prazos/index.html`, ...), e o `usePageTitle` a usa no navegador a cada navegação.
- `/compromissos/:id` é dinâmico: o nginx pede à API as etiquetas e um resumo do compromisso (SSI no `index.html`). Sem o nginx (`npm run dev`) valem as etiquetas padrão e o título é ajustado no navegador.
- Imagem de compartilhamento: `public/og-image.png` (1200×630). O código-fonte é `design/og-image.svg`.
- Defina `VITE_SITE_URL` no build: redes sociais e o canonical exigem URL absoluta (o build avisa se faltar).

## Produção

`Dockerfile` (build com `VITE_API_URL`, `VITE_SITE_URL` e, se houver login com Google, `VITE_GOOGLE_CLIENT_ID`) e `nginx.conf.template` com cabeçalhos de segurança e CSP estrita. Variáveis do contêiner:

| Variável | Para quê |
|---|---|
| `API_ORIGIN` | A API vista pelo navegador (`connect-src` da CSP) |
| `API_INTERNAL_ORIGIN` | A API vista de dentro da rede (SEO: sitemap e etiquetas por compromisso). Padrão `http://api:8080` |
| `SITE_URL` | Endereço público do site (`robots.txt`) |
| `NGINX_RESOLVER` | DNS usado para achar a API. Padrão `127.0.0.11` (Docker) |

A CSP libera `accounts.google.com/gsi` (script, estilo, quadro e conexão) para o botão do Google, e a política de referência é `strict-origin-when-cross-origin` (com `no-referrer` o Google recusa o login).
