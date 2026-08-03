import { Row } from "../components/Layout";
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

const ReferralCard = ({ referral }: { referral: ReferralItem }) => {
  const fields = (referral.fields ?? {}) as Record<string, unknown>;

  return (
    <div className="card">
      <div className="card__head">
        <h2 className="card__title">
          #{referral.index + 1} · {TYPE_LABELS[referral.type] ?? referral.type}
        </h2>
      </div>

      <div className="rows">
        {fields.service !== undefined && (
          <Row label="მომსახურება" value={asText(fields.service)} />
        )}
        {fields.price !== undefined && (
          <Row label="პრაისი" value={asText(fields.price)} />
        )}
        {fields.diagnose !== undefined && (
          <Row label="დიაგნოზი" value={asText(fields.diagnose)} />
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
};

const ResultView = ({ result }: ResultViewProps) => {
  const extraction = (result.extraction ?? {}) as Record<string, unknown>;
  const patient = (extraction.patient ?? {}) as Record<string, unknown>;

  return (
    <div className="fade-in">
      {Boolean(Object.keys(extraction).length) && (
        <div className="card">
          <div className="card__head">
            <h2 className="card__title">დოკუმენტიდან ამოკითხული მონაცემები</h2>
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
            <Row label="დიაგნოზები" value={asText(extraction.diagnoses)} />
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
        <ReferralCard key={referral.id} referral={referral} />
      ))}
    </div>
  );
};

export default ResultView;
