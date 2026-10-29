import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Breadcrumb } from '../../components/layout/Page/Page';
import { usePageTitle } from '../../hooks/usePageTitle';

const Article = styled.article`
  max-width: 920px;
  padding-bottom: 24px;

  h1 {
    margin: 8px 0 16px;
    font-size: 2rem;
  }
  h2 {
    margin-top: 32px;
    font-size: 1.571rem;
  }
  h3 {
    margin-top: 24px;
    font-size: 1.286rem;
  }
  li {
    margin-bottom: 4px;
  }
  hr {
    border: 0;
    border-top: 1px solid var(--border);
    margin: 24px 0;
  }

  .table-scroll {
    overflow-x: auto;
    margin-bottom: 16px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.929rem;
  }
  th,
  td {
    padding: 8px 12px;
    border: 1px solid var(--border);
    text-align: left;
    vertical-align: top;
  }
  th {
    background: var(--bg-alt);
  }
`;

interface ContentPageProps {
  title: string;
  markdown: string;
}

/** Páginas de conteúdo (metodologia, divergências, limitações, privacidade), renderizadas de arquivos Markdown. */
export function ContentPage({ title, markdown }: ContentPageProps) {
  usePageTitle(title);
  return (
    <Container>
      <Breadcrumb items={[{ label: 'Compromissos', to: '/' }, { label: title }]} />
      <Article>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ children }) => (
              <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabela rolável">
                <table>{children}</table>
              </div>
            ),
            a: ({ href, children }) => {
              if (href?.startsWith('/')) return <Link to={href}>{children}</Link>;
              const external = href?.startsWith('http');
              return (
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </Article>
    </Container>
  );
}
