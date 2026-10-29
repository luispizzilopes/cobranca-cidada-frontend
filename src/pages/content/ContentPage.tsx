import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../../components/layout/Page/Page';
import { Container } from '../../components/layout/Page/Page.styles';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Article } from './ContentPage.styles';

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
