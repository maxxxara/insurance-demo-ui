import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Footer } from "./components/Layout";
import Sidebar from "./components/Sidebar";
import StepPolicy from "./steps/StepPolicy";
import StepDetails from "./steps/StepDetails";
import ResultView from "./steps/ResultView";
import {
  createReferral,
  getReferral,
  type ReferralRequestResult,
} from "./api/client";
import ProcessingSteps, {
  PROCESSING_MIN_MS,
} from "./components/ProcessingSteps";
import { CLINICS, POLICIES } from "./data/mock";
import { EMPTY_FORM, type FormState } from "./types";

const TOTAL_STEPS = 2;
const RESULT_STEP = 3;
const POLL_INTERVAL_MS = 2000;
const POLL_ATTEMPTS = 40;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {
  /** Set on /referrals/:requestId — the request the page is meant to be showing. */
  const { requestId: routeRequestId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [loadingResult, setLoadingResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReferralRequestResult | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /** Uploaded names, known only for a request submitted in this session. */
  const [resultFileNames, setResultFileNames] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 1100,
  );
  const [listToken, setListToken] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const update = useCallback(
    (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch })),
    [],
  );

  /** Back to an empty wizard, leaving the URL to the caller. */
  const clearState = useCallback(() => {
    abortRef.current?.abort();
    setForm(EMPTY_FORM);
    setStep(1);
    setResult(null);
    setSelectedId(null);
    setResultFileNames([]);
    setError(null);
    setSubmitting(false);
    setProcessing(false);
    setLoadingResult(false);
  }, []);

  const reset = useCallback(() => {
    clearState();
    void navigate("/");
  }, [clearState, navigate]);

  const canContinue =
    step === 1
      ? Boolean(form.policyId && form.guaranteeType)
      : Boolean(form.service && form.clinic && form.files.length > 0);

  const openRequest = useCallback(async (requestId: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSelectedId(requestId);
    setStep(RESULT_STEP);
    setResult(null);
    setResultFileNames([]);
    setProcessing(false);
    setSubmitting(false);
    setLoadingResult(true);
    setError(null);

    try {
      const loaded = await getReferral(requestId, controller.signal);
      if (controller.signal.aborted) return;
      setResult(loaded);
    } catch (caught) {
      if (controller.signal.aborted) return;
      setError(
        caught instanceof Error
          ? caught.message
          : "მიმართვის ჩატვირთვა ვერ მოხერხდა",
      );
    } finally {
      if (!controller.signal.aborted) setLoadingResult(false);
    }
  }, []);

  /** The URL drives what is shown, so a reload or a back press lands on the same request. */
  useEffect(() => {
    if (routeRequestId) {
      if (routeRequestId !== selectedId) void openRequest(routeRequestId);
      return;
    }

    /* Back on the wizard URL — unless a submit is still running and about to
       swap in the URL of the request it created. */
    if (selectedId && !processing && !submitting) clearState();
  }, [
    routeRequestId,
    selectedId,
    processing,
    submitting,
    clearState,
    openRequest,
  ]);

  const submit = async () => {
    const policy = POLICIES.find((item) => item.id === form.policyId);
    const clinic = CLINICS.find((item) => item.value === form.clinic);
    if (!policy || !clinic) return;

    const controller = new AbortController();
    abortRef.current = controller;

    const loaderStartedAt = Date.now();
    setSubmitting(true);
    setProcessing(true);
    setLoadingResult(false);
    setStep(RESULT_STEP);
    setError(null);
    setResultFileNames(form.files.map((file) => file.name));

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

      setSubmitting(false);
      setSelectedId(created.requestId);
      /* replaces the wizard URL, so a back press does not drop the fresh result */
      void navigate(`/referrals/${created.requestId}`, { replace: true });

      if (created.status === "PENDING" || created.status === "PROCESSING") {
        for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
          await wait(POLL_INTERVAL_MS);
          created = await getReferral(created.requestId, controller.signal);
          if (created.status === "COMPLETED" || created.status === "FAILED")
            break;
        }
      }

      const elapsed = Date.now() - loaderStartedAt;
      if (elapsed < PROCESSING_MIN_MS) await wait(PROCESSING_MIN_MS - elapsed);
      if (controller.signal.aborted) return;

      setProcessing(false);
      setResult(created);
      setListToken((token) => token + 1);
    } catch (caught) {
      if (controller.signal.aborted) return;
      setSubmitting(false);
      setProcessing(false);
      setStep(2);
      /* the wizard is back on screen, so the URL must not claim a request */
      setSelectedId(null);
      void navigate("/", { replace: true });
      setError(
        caught instanceof Error
          ? caught.message
          : "მოთხოვნის გაგზავნა ვერ მოხერხდა",
      );
    }
  };

  return (
    <div className={`shell${sidebarOpen ? " shell--sidebar" : ""}`}>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((open) => !open)}
        selectedId={selectedId}
        onSelect={(requestId) => void navigate(`/referrals/${requestId}`)}
        onNew={reset}
        refreshToken={listToken}
      />

      <main className="page">
        {step === 1 && <StepPolicy form={form} update={update} />}
        {step === 2 && <StepDetails form={form} update={update} />}

        {step === RESULT_STEP &&
          (processing ? (
            <div className="fade-in">
              <h1 className="page__title">მიმართვა მუშავდება</h1>
              <ProcessingSteps />
            </div>
          ) : result ? (
            <ResultView result={result} fileNames={resultFileNames} />
          ) : (
            loadingResult && (
              <div className="processing fade-in">
                <span className="spinner spinner--green" />
                მიმართვა იტვირთება…
              </div>
            )
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
