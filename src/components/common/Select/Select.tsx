import { Check, ChevronDown, Search } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  Control,
  Empty,
  Label,
  List,
  Option,
  Popover,
  SearchBox,
  SearchInput,
  Trigger,
  TriggerText,
  Wrapper,
} from './Select.styles';

interface SelectOption {
  value: string;
  label: string;
}
interface SelectProps {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  /** Quando informado, adiciona uma opção vazia (value "") com este texto. */
  placeholder?: string;
  disabled?: boolean;
}

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

export function Select({
  id,
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: SelectProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const allOptions = useMemo(
    () => (placeholder !== undefined ? [{ value: '', label: placeholder }, ...options] : options),
    [options, placeholder],
  );
  const visible = useMemo(() => {
    const term = normalize(query.trim());
    return term ? allOptions.filter((o) => normalize(o.label).includes(term)) : allOptions;
  }, [allOptions, query]);

  const selected = options.find((o) => o.value === value);
  const triggerText = selected?.label ?? placeholder ?? 'Selecione';

  const openList = () => {
    if (disabled) return;
    setQuery('');
    setActiveIndex(
      Math.max(
        0,
        allOptions.findIndex((o) => o.value === value),
      ),
    );
    setOpen(true);
  };
  const close = (restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };
  const choose = (option: SelectOption) => {
    if (option.value !== value) onChange(option.value);
    close(true);
  };

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.children[activeIndex]?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeIndex]);

  const onTriggerKeyDown = (event: KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      openList();
    }
  };

  const onSearchKeyDown = (event: KeyboardEvent) => {
    const last = visible.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, last));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(Math.max(last, 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (visible[activeIndex]) choose(visible[activeIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        close(true);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  const optionId = (index: number) => `${listId}-${index}`;

  return (
    <Wrapper>
      <Label htmlFor={id}>{label}</Label>
      <Control ref={containerRef}>
        <Trigger
          ref={triggerRef}
          id={id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          disabled={disabled}
          $placeholder={!selected && placeholder !== undefined}
          onClick={() => (open ? close(false) : openList())}
          onKeyDown={onTriggerKeyDown}
        >
          <TriggerText>{triggerText}</TriggerText>
          <ChevronDown size={16} aria-hidden="true" />
        </Trigger>
        {open && (
          <Popover>
            <SearchBox>
              <Search size={16} aria-hidden="true" />
              <SearchInput
                ref={searchRef}
                type="text"
                role="searchbox"
                aria-label={`Filtrar ${label}`}
                aria-controls={listId}
                aria-activedescendant={visible[activeIndex] ? optionId(activeIndex) : undefined}
                placeholder="Filtrar..."
                autoComplete="off"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onSearchKeyDown}
              />
            </SearchBox>
            <List ref={listRef} id={listId} role="listbox" aria-label={label}>
              {visible.length === 0 && <Empty role="presentation">Nenhum resultado</Empty>}
              {visible.map((option, index) => (
                <Option
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={option.value === value}
                  $active={index === activeIndex}
                  $selected={option.value === value}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(option)}
                >
                  {option.label}
                  {option.value === value && <Check size={16} aria-hidden="true" />}
                </Option>
              ))}
            </List>
          </Popover>
        )}
      </Control>
    </Wrapper>
  );
}
