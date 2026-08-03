import { useEffect, useState } from "react";
import { CheckIcon } from "./Icons";

/** How long the extraction stage stays on screen before switching to resolution. */
export const EXTRACTION_STAGE_MS = 3000;
/** Shortest total time the loader stays visible, so both stages are readable. */
export const PROCESSING_MIN_MS = 3000;

const STAGES = [
  {
    title: "დოკუმენტის ამოკითხვა",
    hint: "პაციენტის მონაცემები, დიაგნოზები, დანიშნულებები და ა.შ",
  },
  {
    title: "მიმართვების შექმნა",
    hint: "სერვისების, პრაისების და დიაგნოზის კოდების დამუშავება",
  },
];

const ProcessingSteps = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setStage(1), EXTRACTION_STAGE_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="processing-steps">
      {STAGES.map((item, index) => {
        const state =
          index < stage ? "done" : index === stage ? "active" : "pending";

        return (
          <div className={`pstep pstep--${state}`} key={item.title}>
            <span className="pstep__icon">
              {state === "done" && <CheckIcon size={16} />}
              {state === "active" && (
                <span className="spinner spinner--green" />
              )}
              {state === "pending" && <span className="pstep__dot" />}
            </span>
            <span className="pstep__body">
              <span className="pstep__title">{item.title}</span>
              <span className="pstep__hint">{item.hint}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProcessingSteps;
