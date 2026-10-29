import styled from 'styled-components';
import { Container } from '../../components/layout/Page/Page.styles';

export const Hero = styled.section`
  background: var(--hero-bg);
  color: var(--hero-text);
  padding: 40px 0;
  border-bottom: 6px solid var(--yellow);

  h1 {
    margin: 0 0 8px;
    font-size: 2.571rem;
  }
  p {
    max-width: 62ch;
    margin: 0 0 20px;
    font-size: 1.143rem;
  }
`;

export const Layout = styled(Container)`
  display: grid;
  gap: 32px;
  padding-top: 32px;

  @media (min-width: 1000px) {
    grid-template-columns: minmax(0, 1fr) 320px;
    align-items: start;
  }

  @media (min-width: 1200px) {
    grid-template-columns: minmax(0, 1fr) 380px;
  }
`;

export const Filters = styled.form`
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const SearchRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;

  @media (min-width: 700px) {
    grid-column: 1 / -1;
  }
  & > div {
    flex: 1;
  }
`;

export const SearchLabel = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 0.875rem;
`;

export const SearchInput = styled.input`
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
`;

export const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
`;

export const TabButton = styled.button<{ $on: boolean }>`
  padding: 10px 16px;
  border: 0;
  border-bottom: 4px solid ${({ $on }) => ($on ? 'var(--green)' : 'transparent')};
  background: transparent;
  color: ${({ $on }) => ($on ? 'var(--primary)' : 'var(--text)')};
  font-weight: 600;

  &:hover {
    background: var(--hover);
  }
`;

export const Results = styled.div`
  display: grid;
  gap: 16px;
`;

export const Summary = styled.p`
  margin: 0 0 12px;
  color: var(--muted);
`;

export const Side = styled.aside`
  display: grid;
  gap: 16px;
`;
