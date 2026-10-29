import styled from 'styled-components';

export const Form = styled.form`
  display: grid;
  gap: 12px;
  margin-bottom: 24px;
`;

export const FormFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
`;

export const Counter = styled.span`
  color: var(--muted);
  font-size: 0.857rem;
`;

export const List = styled.ul`
  display: grid;
  gap: 12px;
  margin: 0 0 16px;
  padding: 0;
  list-style: none;

  li {
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
  }
  p {
    margin: 4px 0 0;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
  font-size: 0.857rem;
`;

export const Replies = styled.ul`
  display: grid;
  gap: 8px;
  margin: 12px 0 0 !important;
  padding: 0 0 0 16px !important;
  list-style: none;
  border-left: 3px solid var(--border);

  li {
    background: transparent !important;
    border: 0 !important;
    padding: 4px 0 !important;
  }
`;

export const ReplyForm = styled.form`
  display: grid;
  gap: 8px;
  margin-top: 12px;
`;
