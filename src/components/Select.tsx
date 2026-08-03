import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from './Icons';
import type { Option } from '../data/mock';

type SelectProps = {
  value: string | null;
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const Select = ({
  value,
  options,
  placeholder = 'აირჩიე',
  onChange,
  disabled
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value) ?? null;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="select" ref={rootRef}>
      <button
        type="button"
        disabled={disabled}
        className={[
          'select__button',
          open ? 'select__button--open' : '',
          selected ? '' : 'select__button--placeholder'
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="select__value">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={`select__chevron${open ? ' select__chevron--open' : ''}`}
        />
      </button>

      {open && (
        <div className="select__menu" role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`select__option${
                option.value === value ? ' select__option--active' : ''
              }`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span>
                {option.label}
                {option.hint && <small>{option.hint}</small>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
