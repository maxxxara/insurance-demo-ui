import Select from "../components/Select";
import FileUploader from "../components/FileUploader";
import { Field, Requirement } from "../components/Layout";
import {
  CLINICS,
  MAX_TOTAL_MB,
  MEDICAL_SERVICES,
  SPECIALISTS,
} from "../data/mock";
import { STEP_TITLES, type FormState } from "../types";

type StepDetailsProps = {
  form: FormState;
  update: (patch: Partial<FormState>) => void;
};

const StepDetails = ({ form, update }: StepDetailsProps) => {
  return (
    <div className="fade-in">
      <h1 className="page__title">
        {STEP_TITLES[form.guaranteeType ?? ""] ?? "საგარანტიო მიმართვა"}
      </h1>

      <p className="page__lead">
        გთხოვთ, შეავსოთ საჭირო ინფორმაცია და ატვირთოთ დოკუმენტები:
      </p>

      <div className="reqs">
        <Requirement small>
          გთხოვთ, გაითვალისწინოთ, რომ ასატვირთი დოკუმენტების ჯამური მოცულობა არ
          უნდა იყოს {MAX_TOTAL_MB} მბ-ზე მეტი.
        </Requirement>
        <Requirement small>ფორმატი: PDF, JPG, PNG, DOC, XLS</Requirement>
      </div>

      <Field label="აირჩიე სამედიცინო მომსახურება" required>
        <div className="col-1">
          <Select
            value={form.service}
            options={MEDICAL_SERVICES}
            onChange={(service) => update({ service })}
          />
        </div>
      </Field>

      <Field label="კომენტარი">
        <textarea
          className="control"
          placeholder="დაწერეთ კომენტარი"
          value={form.comment}
          onChange={(event) => update({ comment: event.target.value })}
        />
      </Field>

      <div className="grid-2">
        <Field label="აირჩიე ექიმი სპეციალისტი" tight>
          <Select
            value={form.specialist}
            options={SPECIALISTS}
            onChange={(specialist) => update({ specialist })}
          />
        </Field>

        <Field label="აირჩიეთ კლინიკა" tight required>
          <Select
            value={form.clinic}
            options={CLINICS}
            onChange={(clinic) => update({ clinic })}
          />
        </Field>
      </div>

      <div className="col-1" style={{ marginTop: 22 }}>
        <input
          className="control"
          placeholder="ექიმის სახელი და გვარი  (თუ იცით)"
          value={form.doctorName}
          onChange={(event) => update({ doctorName: event.target.value })}
        />
      </div>

      <Field>
        <FileUploader
          required
          title="ფორმა 100 ან ექიმის დანიშნულება"
          subtitle="არსებობის შემთხვევაში"
          files={form.files}
          onChange={(files) => update({ files })}
        />
      </Field>
    </div>
  );
};

export default StepDetails;
