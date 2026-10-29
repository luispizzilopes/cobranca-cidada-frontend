import { createGlobalStyle } from 'styled-components';

/**
 * Tokens e tipografia do Padrão Digital de Governo (gov.br DS, MIT): azul #1351b4, verde #168821, amarelo #ffcd07,
 * cinzas neutros, cores de feedback, foco dourado tracejado e Rawline (OFL) com base de 14px.
 * O tema escuro é uma derivação nossa; o DS não define um.
 */
const GlobalStyle = createGlobalStyle`
  :root {
    --font: Rawline, Raleway, 'Segoe UI', Arial, sans-serif;

    --bg: #ffffff;
    --bg-alt: #f8f8f8;
    --surface: #ffffff;
    --border: #cccccc;
    --border-strong: #888888;
    --text: #333333;
    --muted: #555555;

    --primary: #1351b4;
    --primary-hover: #0c326f;
    --primary-dark: #071d41;
    --primary-light: #2670e8;
    --primary-pastel: #dbe8fb;
    --on-primary: #ffffff;
    --link: #1351b4;
    --header-bg: #ffffff;
    --footer-bg: #071d41;
    --footer-text: #ffffff;
    --hero-bg: #1351b4;
    --hero-text: #ffffff;

    --green: #168821;
    --green-hover: #0f5f17;
    --green-pastel: #e3f5e1;
    --yellow: #ffcd07;
    --yellow-dark: #7a591a;
    --yellow-pastel: #fff4d6;
    --on-yellow: #071d41;
    --stripe: linear-gradient(90deg, var(--green) 0 33.33%, var(--yellow) 33.33% 66.66%, var(--primary) 66.66% 100%);

    --focus: #c2850c;
    --hover: rgba(19, 81, 180, 0.08);
    --selected: #dbe8fb;

    --success: #168821;
    --success-bg: #e3f5e1;
    --warning: #7a591a;
    --warning-bg: #fff4d6;
    --danger: #b50909;
    --danger-solid: #b50909;
    --danger-bg: #fde8e4;
    --info: #155bcb;
    --info-bg: #e8f0fd;
    --neutral-bg: #ededed;
    --purple: #4a50c4;
    --purple-bg: #ececfd;
    --orange: #8a3b00;
    --orange-bg: #ffe9d6;

    --radius: 4px;
    --radius-lg: 8px;
    --shadow: 0 1px 6px rgba(0, 0, 0, 0.16);
    --focus-width: 3px;
    --focus-offset: 3px;
    --gutter: 16px;
    --container: 1200px;
  }

  [data-theme='dark'] {
    color-scheme: dark;
    --bg: #0e141d;
    --bg-alt: #131b27;
    --surface: #18212f;
    --border: #3d4551;
    --border-strong: #8d9297;
    --text: #ececec;
    --muted: #b8bec6;

    --primary: #7aa7f2;
    --primary-hover: #a9c6f7;
    --primary-dark: #071d41;
    --primary-light: #5992ed;
    --primary-pastel: #1b2e52;
    --on-primary: #071d41;
    --link: #8db5f5;
    --header-bg: #18212f;
    --footer-bg: #060d18;
    --footer-text: #ececec;
    --hero-bg: #0c326f;
    --hero-text: #ffffff;

    --green: #5ccb66;
    --green-hover: #8ddc94;
    --green-pastel: #14301a;
    --yellow: #ffcd07;
    --yellow-dark: #ffcd07;
    --yellow-pastel: #3a2f0a;
    --on-yellow: #071d41;

    --focus: #ffbe2e;
    --hover: rgba(122, 167, 242, 0.14);
    --selected: #1b2e52;

    --success: #5ccb66;
    --success-bg: #14301a;
    --warning: #ffcd07;
    --warning-bg: #3a2f0a;
    --danger: #ff8b7a;
    --danger-solid: #e5252f;
    --danger-bg: #3d1713;
    --info: #8db5f5;
    --info-bg: #14233f;
    --neutral-bg: #262f3d;
    --purple: #b3b6ff;
    --purple-bg: #25264d;
    --orange: #ffb877;
    --orange-bg: #3d2410;
    --shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 14px;
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    font-family: var(--font);
    font-size: 1rem;
    line-height: 1.45;
    color: var(--text);
    background: var(--bg);
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 {
    margin: 0 0 0.5em;
    line-height: 1.2;
    font-weight: 600;
  }

  p { margin: 0 0 1em; }

  a {
    color: var(--link);
    text-underline-offset: 2px;
  }

  a:hover { color: var(--primary-hover); }

  button, input, select, textarea {
    font: inherit;
    color: inherit;
  }

  button { cursor: pointer; }

  img, svg { max-width: 100%; }

  /* Foco visível em tudo que é interativo (WCAG 2.4.7 / 2.4.11): contorno tracejado dourado, como no gov.br. */
  :focus-visible {
    outline: var(--focus-width) dashed var(--focus);
    outline-offset: var(--focus-offset);
  }

  /* Campos de texto: contorno tracejado mais fino que o foco padrão. */
  input:focus-visible,
  textarea:focus-visible {
    outline-width: 1px;
  }

  /* Texto só para leitores de tela. */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export default GlobalStyle;
