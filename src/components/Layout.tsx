import type { ReactNode } from "react";
import { DocumentIcon } from "./Icons";

export const RequiredMark = () => (
  <span className="required-mark" aria-hidden="true">
    *
  </span>
);

export const Requirement = ({
  children,
  small,
}: {
  children: ReactNode;
  small?: boolean;
}) => (
  <span className={`req${small ? " req--sm" : ""}`}>
    <span className="req__icon">
      <DocumentIcon size={small ? 15 : 17} />
    </span>
    {children}
  </span>
);

type FooterProps = {
  step: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
};

export const Footer = ({
  step,
  totalSteps,
  onBack,
  onNext,
  nextLabel = "შემდეგი",
  nextDisabled,
  loading,
}: FooterProps) => (
  <footer className="footer">
    <div className="footer__inner">
      <div>
        {onBack && (
          <button type="button" className="btn btn--ghost" onClick={onBack}>
            უკან
          </button>
        )}
      </div>

      <div className="footer__step">
        ნაბიჯი {step} / {totalSteps}
      </div>

      <div className="footer__end">
        {onNext && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={onNext}
            disabled={nextDisabled || loading}
          >
            {loading && <span className="spinner" />}
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  </footer>
);

export const Field = ({
  label,
  children,
  hint,
  tight,
  required,
}: {
  label?: string;
  children: ReactNode;
  hint?: string;
  tight?: boolean;
  required?: boolean;
}) => (
  <div className={`field${tight ? " field--tight" : ""}`}>
    {label && (
      <label className="field__label">
        {label}
        {required && <RequiredMark />}
      </label>
    )}
    {children}
    {hint && <p className="field__hint">{hint}</p>}
  </div>
);

export const Row = ({
  label,
  value,
  anchorKey,
  active,
  onActivate,
}: {
  label: string;
  value: ReactNode;
  /** Document highlight this row points at; absent when the value was not located. */
  anchorKey?: string;
  active?: boolean;
  onActivate?: (anchorKey: string) => void;
}) => {
  const linked = Boolean(anchorKey && onActivate);
  const activate = linked ? () => onActivate?.(anchorKey as string) : undefined;

  return (
    <div
      className={`row${linked ? " row--linked" : ""}${
        active ? " row--active" : ""
      }`}
      onMouseEnter={activate}
      onFocus={activate}
      tabIndex={linked ? 0 : undefined}
    >
      <span className="row__label">{label}</span>
      <span className="row__value">{value}</span>
    </div>
  );
};
