import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 0.875rem;
`;

export const Control = styled.div`
  position: relative;
  min-width: 0;
`;

export const Trigger = styled.button<{ $placeholder: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  color: ${({ $placeholder }) => ($placeholder ? 'var(--muted)' : 'inherit')};
  text-align: left;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    flex-shrink: 0;
    transition: transform 0.15s;
  }

  &[aria-expanded='true'] svg {
    transform: rotate(180deg);
  }
`;

export const TriggerText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Popover = styled.div`
  position: absolute;
  z-index: 50;
  top: calc(100% + 4px);
  left: 0;
  min-width: 100%;
  width: max-content;
  max-width: min(420px, 90vw);
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.18);
  overflow: hidden;
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-bottom: 1px solid var(--border-strong);
  color: var(--muted);
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  min-height: 40px;
  background: transparent;
  border: 0;
  color: inherit;

  &:focus {
    outline: none;
  }
`;

export const List = styled.ul`
  max-height: 240px;
  margin: 0;
  padding: 4px;
  overflow-y: auto;
  list-style: none;
`;

export const Option = styled.li<{ $active: boolean; $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: calc(var(--radius) - 2px);
  background: ${({ $active }) => ($active ? 'var(--border)' : 'transparent')};
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  cursor: pointer;
`;

export const Empty = styled.li`
  padding: 12px;
  color: var(--muted);
  text-align: center;
`;
