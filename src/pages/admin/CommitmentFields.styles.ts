import styled from 'styled-components';

export const Fieldset = styled.fieldset`
  margin: 0 0 24px;
  padding: 16px 20px 4px;
  border: 1px solid var(--border);
  border-radius: var(--radius);

  legend {
    padding: 0 8px;
    font-weight: 700;
  }
`;

export const TwoColumns = styled.div`
  display: grid;
  gap: 0 16px;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const SourceCard = styled.div`
  margin-bottom: 16px;
  padding: 12px 16px 0;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius);

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }
`;
