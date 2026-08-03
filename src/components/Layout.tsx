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

export const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="row">
    <span className="row__label">{label}</span>
    <span className="row__value">{value}</span>
  </div>
);
