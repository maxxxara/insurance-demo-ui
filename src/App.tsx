import { useCallback, useRef, useState } from "react";
import { Footer } from "./components/Layout";
import StepPolicy from "./steps/StepPolicy";
import StepDetails from "./steps/StepDetails";
import ResultView from "./steps/ResultView";
import {
  createReferral,
  getReferral,
  type ReferralRequestResult,
} from "./api/client";
import { CLINICS, POLICIES } from "./data/mock";
import { EMPTY_FORM, type FormState } from "./types";

const TOTAL_STEPS = 2;
const RESULT_STEP = 3;
const POLL_INTERVAL_MS = 2000;
const POLL_ATTEMPTS = 40;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReferralRequestResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const update = useCallback(
    (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch })),
    [],
  );

  const reset = () => {
    abortRef.current?.abort();
    setForm(EMPTY_FORM);
    setStep(1);
    setResult(null);
    setError(null);
    setSubmitting(false);
    setProcessing(false);
  };

  const canContinue =
    step === 1
      ? Boolean(form.policyId && form.guaranteeType)
      : Boolean(form.service && form.clinic && form.files.length > 0);

  const submit = async () => {
    const policy = POLICIES.find((item) => item.id === form.policyId);
    const clinic = CLINICS.find((item) => item.value === form.clinic);
    if (!policy || !clinic) return;

    const controller = new AbortController();
    abortRef.current = controller;

    setSubmitting(true);
    setError(null);

    try {
      let created = await createReferral(
        {
          source: "IMEDI_L_WEB",
          patient: {
            name: policy.holder,
            nationalId: policy.nationalId,
            dob: policy.dob,
          },
          clinicName: clinic.label,
          comment: form.comment || undefined,
          recentReferrals: undefined,
        },
        form.files,
        controller.signal,
      );

      setStep(RESULT_STEP);
      setSubmitting(false);

      if (created.status === "PENDING" || created.status === "PROCESSING") {
        setProcessing(true);
        for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
          await wait(POLL_INTERVAL_MS);
          created = await getReferral(created.requestId, controller.signal);
          if (created.status === "COMPLETED" || created.status === "FAILED")
            break;
        }
        setProcessing(false);
      }

      setResult(created);
    } catch (caught) {
      if (controller.signal.aborted) return;
      setSubmitting(false);
      setProcessing(false);
      setStep(2);
      setError(
        caught instanceof Error
          ? caught.message
          : "მოთხოვნის გაგზავნა ვერ მოხერხდა",
      );
    }
  };

  return (
    <div className="shell">
      <main className="page">
        {step === 1 && <StepPolicy form={form} update={update} />}
        {step === 2 && <StepDetails form={form} update={update} />}

        {step === RESULT_STEP &&
          (processing || !result ? (
            <div className="fade-in">
              <h1 className="page__title">მიმართვა მუშავდება</h1>
              <div className="processing">
                <span className="spinner spinner--green" />
                დოკუმენტები იგზავნება დამუშავებაზე — გთხოვთ დაელოდოთ.
              </div>
            </div>
          ) : (
            <ResultView result={result} />
          ))}

        {error && (
          <div className="banner">
            <span>{error}</span>
          </div>
        )}
      </main>

      {step < RESULT_STEP && (
        <Footer
          step={step}
          totalSteps={TOTAL_STEPS}
          onBack={step > 1 ? () => setStep(step - 1) : undefined}
          onNext={step === TOTAL_STEPS ? submit : () => setStep(step + 1)}
          nextLabel={step === TOTAL_STEPS ? "გაგზავნა" : "შემდეგი"}
          nextDisabled={!canContinue}
          loading={submitting}
        />
      )}

      {step === RESULT_STEP && !processing && result && (
        <footer className="footer">
          <div className="footer__inner">
            <div />
            <div />
            <div className="footer__end">
              <button
                type="button"
                className="btn btn--outline"
                onClick={reset}
              >
                ახალი მიმართვა
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
