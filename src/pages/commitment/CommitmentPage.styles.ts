import styled from 'styled-components';

export const Title = styled.h1`
  margin: 8px 0 12px;
  font-size: 2rem;
`;

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
`;

export const Columns = styled.div`
  display: grid;
  gap: 32px;
  margin-top: 24px;

  @media (min-width: 1000px) {
    grid-template-columns: minmax(0, 1fr) 340px;
    align-items: start;
  }
`;

export const Facts = styled.dl`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 16px;
  margin: 0;

  dt {
    font-weight: 600;
  }
  dd {
    margin: 0;
  }
`;

export const Sources = styled.ul`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
  }
  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    word-break: break-word;
  }
`;

export const Timeline = styled.ol`
  position: relative;
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0 0 0 20px;
  list-style: none;
  border-left: 3px solid var(--border);

  li {
    position: relative;
  }
  li::before {
    content: '';
    position: absolute;
    left: -28px;
    top: 6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary);
    border: 2px solid var(--surface);
  }
`;

export const Description = styled.div`
  white-space: pre-line;
`;

export const KindLabel = styled.span`
  display: block;
  color: var(--muted);
  font-size: 0.857rem;
`;
