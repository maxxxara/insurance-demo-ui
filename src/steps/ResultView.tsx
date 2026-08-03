import { useMemo, useState } from "react";
import { Row } from "../components/Layout";
import DocumentPreview from "../components/DocumentPreview";
import {
  findMockAnchor,
  isMockDocument,
  MOCK_ANCHORS,
  MOCK_PAGES,
  type MockPoly,
} from "../data/mockAnchors";
import type { ReferralItem, ReferralRequestResult } from "../api/client";

const VALIDATION_LABELS: Record<string, string> = {
  patient_match: "პაციენტის იდენტიფიკაცია",
  seal_valid: "ბეჭედი და ხელმოწერა",
  diagnosis_present: "დიაგნოზის არსებობა",
  treatment_course_history: "მკურნალობის კურსის ისტორია",
};

const TYPE_LABELS: Record<string, string> = {
  AMBULATORY: "ამბულატორიული მომსახურება",
  MEDICATION: "მედიკამენტი",
};

const TREATMENT_TYPE_LABELS: Record<string, string> = {
  ambulatory: "ამბულატორიული",
  medication: "მედიკამენტური",
};

const asText = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  if (Array.isArray(value)) return value.map(asText).join(", ");
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const parts = [record.code, record.title, record.text, record.name]
      .filter(Boolean)
      .map(String);
    if (parts.length) return parts.join(" — ");
    if (record.value !== undefined)
      return `${record.value} ${record.unit ?? ""}`.trim();
  }
  return JSON.stringify(value);
};

/** Hover/focus handlers for a value we located in the document; undefined when we did not. */
type Activate = (value: string) => {
  anchorKey?: string;
  active?: boolean;
  onActivate?: (anchorKey: string) => void;
};

const ReferralCard = ({
  referral,
  activate,
}: {
  referral: ReferralItem;
  activate: Activate;
}) => {
  const fields = (referral.fields ?? {}) as Record<string, unknown>;

  return (
    <div className="card">
      <div className="card__head">
        <h2 className="card__title">
          #{referral.index + 1} · {TYPE_LABELS[referral.type] ?? referral.type}
        </h2>
      </div>

      <div className="rows">
        {fields.treatment !== undefined && (
          <Row
            label="დანიშნულება"
            value={asText(fields.treatment)}
            {...activate(asText(fields.treatment))}
          />
        )}
        {fields.service !== undefined && (
          <Row label="მომსახურება" value={asText(fields.service)} />
        )}
        {fields.price !== undefined && (
          <Row label="პრაისი" value={asText(fields.price)} />
        )}
        {fields.diagnose !== undefined && (
          <Row
            label="დიაგნოზი"
            value={asText(fields.diagnose)}
            {...activate(asText(fields.diagnose))}
          />
        )}
        {fields.medication !== undefined && (
          <Row label="მედიკამენტი" value={asText(fields.medication)} />
        )}
        {fields.quantity !== undefined && (
          <Row label="რაოდენობა" value={asText(fields.quantity)} />
        )}
        {fields.guaranteeType !== undefined && (
          <Row label="გარანტიის ტიპი" value={asText(fields.guaranteeType)} />
        )}
      </div>
    </div>
  );
};

type ResultViewProps = {
  result: ReferralRequestResult;
  /** Names of the uploaded files; the demo highlights only apply to a known one. */
  fileNames?: string[];
};

const ResultView = ({ result, fileNames = [] }: ResultViewProps) => {
  const extraction = (result.extraction ?? {}) as Record<string, unknown>;
  const patient = (extraction.patient ?? {}) as Record<string, unknown>;
  const treatments = Array.isArray(extraction.treatments)
    ? (extraction.treatments as Array<Record<string, unknown>>)
    : [];
  const diagnoses = Array.isArray(extraction.diagnoses)
    ? (extraction.diagnoses as unknown[])
    : [];

  const canPreview = useMemo(() => isMockDocument(fileNames), [fileNames]);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const activate: Activate = (value) => {
    const anchor = canPreview ? findMockAnchor(value) : undefined;
    if (!anchor) return {};
    return {
      anchorKey: anchor.key,
      active: activeKey === anchor.key,
      onActivate: setActiveKey,
    };
  };

  const { page, polys } = useMemo(() => {
    const anchor = MOCK_ANCHORS.find((entry) => entry.key === activeKey);
    return anchor
      ? { page: anchor.page, polys: anchor.polys }
      : { page: 1, polys: [] as MockPoly[] };
  }, [activeKey]);

  return (
    <div className={`fade-in${canPreview ? " result result--split" : ""}`}>
      <div className={canPreview ? "result__main" : undefined}>
        {Boolean(Object.keys(extraction).length) && (
          <div className="card">
            <div className="card__head">
              <h2 className="card__title">
                დოკუმენტიდან ამოკითხული მონაცემები
              </h2>
            </div>
            <div className="rows">
              <Row label="პაციენტი" value={asText(patient.name)} />
              <Row label="პირადი ნომერი" value={asText(patient.nationalId)} />
              <Row label="დაბადების თარიღი" value={asText(patient.dob)} />
              <Row
                label="დოკუმენტის თარიღი"
                value={asText(extraction.documentDate)}
              />
              <Row
                label="კლინიკა"
                value={asText(extraction.clinicName ?? result.clinicName)}
              />
              <Row
                label="დიაგნოზები"
                value={
                  diagnoses.length ? (
                    <span className="treatments">
                      {diagnoses.map((diagnosis, index) => (
                        <Chip
                          key={index}
                          text={asText(diagnosis)}
                          activate={activate}
                        />
                      ))}
                    </span>
                  ) : (
                    "—"
                  )
                }
              />
              <Row
                label="რეკომენდაციები"
                value={
                  treatments.length ? (
                    <span className="treatments">
                      {treatments.map((treatment, index) => (
                        <Chip
                          key={index}
                          label={
                            TREATMENT_TYPE_LABELS[String(treatment.type)] ??
                            asText(treatment.type)
                          }
                          text={asText(treatment.text)}
                          activate={activate}
                        />
                      ))}
                    </span>
                  ) : (
                    "—"
                  )
                }
              />
              <Row label="ექიმი" value={asText(extraction.doctor)} />
              <Row
                label="ბეჭედი / ხელმოწერა"
                value={`${extraction.hasSeal ? "ბეჭედი ✓" : "ბეჭედი ✗"} · ${
                  extraction.hasSignature ? "ხელმოწერა ✓" : "ხელმოწერა ✗"
                }`}
              />
            </div>
          </div>
        )}

        {result.validations && result.validations.length > 0 && (
          <div className="card">
            <div className="card__head">
              <h2 className="card__title">შემოწმებები</h2>
            </div>
            <div className="rows">
              {result.validations.map((validation) => (
                <Row
                  key={validation.step}
                  label={VALIDATION_LABELS[validation.step] ?? validation.step}
                  value={
                    <span
                      className={`pill ${
                        validation.status === "pass" ? "pill--ok" : "pill--fail"
                      }`}
                    >
                      {validation.status === "pass" ? "გავლილი" : "ჩავარდნილი"}
                      {validation.reason ? ` · ${validation.reason}` : ""}
                    </span>
                  }
                />
              ))}
            </div>
          </div>
        )}

        <h2 className="section-title section-title--divider">
          გამოწერილი მიმართვები
        </h2>

        {result.referrals.map((referral) => (
          <ReferralCard
            key={referral.id}
            referral={referral}
            activate={activate}
          />
        ))}
      </div>

      {canPreview && (
        <aside className="result__aside">
          <DocumentPreview pages={MOCK_PAGES} page={page} polys={polys} />
        </aside>
      )}
    </div>
  );
};

/** One diagnosis or treatment, hoverable when we know where it sits in the document. */
const Chip = ({
  label,
  text,
  activate,
}: {
  label?: string;
  text: string;
  activate: Activate;
}) => {
  const { anchorKey, active, onActivate } = activate(text);
  const linked = Boolean(anchorKey && onActivate);
  const trigger = linked ? () => onActivate?.(anchorKey as string) : undefined;

  return (
    <span
      className={`treatment${linked ? " treatment--linked" : ""}${
        active ? " treatment--active" : ""
      }`}
      onMouseEnter={trigger}
      onFocus={trigger}
      tabIndex={linked ? 0 : undefined}
    >
      {label && <span className="treatment__type">{label}</span>}
      <span className="treatment__text">{text}</span>
    </span>
  );
};

export default ResultView;
