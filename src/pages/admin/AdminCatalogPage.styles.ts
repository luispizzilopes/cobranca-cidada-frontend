import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  gap: 24px;
  max-width: 820px;
`;

export const Form = styled.form`
  display: grid;
  gap: 8px 12px;
  align-items: end;
  margin-bottom: 8px;

  @media (min-width: 600px) {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  & > div {
    margin-bottom: 0;
  }
`;
