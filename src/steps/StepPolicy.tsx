import Select from "../components/Select";
import { Field, Requirement } from "../components/Layout";
import { GUARANTEE_TYPES, POLICIES } from "../data/mock";
import type { FormState } from "../types";

type StepPolicyProps = {
  form: FormState;
  update: (patch: Partial<FormState>) => void;
};

const StepPolicy = ({ form, update }: StepPolicyProps) => (
  <div className="fade-in">
    <h1 className="page__title">საგარანტიო მიმართვა</h1>

    <p className="page__lead">
      რეგისტრაციის დაწყებამდე, დარწმუნდი, რომ თან გაქვს შემდეგი საჭირო
      დოკუმენტაციის ფოტო-ასლები:
    </p>

    <div className="reqs">
      <Requirement>
        ჩასატარებელი სამედიცინო მომსახურების სრული დოკუმენტაცია
      </Requirement>
    </div>

    <p className="formats">
      <b>ფორმატი:</b> PDF, JPG, PNG ფაილები – არაუმეტეს 100 მბ
    </p>

    <Field label="რომელ პოლისზე გსურთ მიმართვა" required>
      <div className="col-1">
        <Select
          value={form.policyId}
          options={POLICIES.map((policy) => ({
            value: policy.id,
            label: policy.label,
            hint: policy.plan,
          }))}
          onChange={(policyId) => update({ policyId })}
        />
      </div>
    </Field>

    <Field label="რომელი საგარანტიო მიმართვა გსურს?" required>
      <div className="col-1">
        <Select
          value={form.guaranteeType}
          options={GUARANTEE_TYPES}
          onChange={(guaranteeType) => update({ guaranteeType })}
        />
      </div>
    </Field>
  </div>
);

export default StepPolicy;
