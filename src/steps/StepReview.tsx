import { Row } from '../components/Layout';
import { formatSize } from '../lib/format';
import {
  CLINICS,
  GUARANTEE_TYPES,
  MEDICAL_SERVICES,
  POLICIES,
  SPECIALISTS
} from '../data/mock';
import type { FormState } from '../types';

type StepReviewProps = {
  form: FormState;
  onEdit: (step: number) => void;
};

const labelOf = (options: { value: string; label: string }[], value: string | null) =>
  options.find((option) => option.value === value)?.label ?? '—';

const StepReview = ({ form, onEdit }: StepReviewProps) => {
  const policy = POLICIES.find((item) => item.id === form.policyId);
  const totalMb =
    form.files.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024);

  return (
    <div className="fade-in">
      <h1 className="page__title">მიმართვის დადასტურება</h1>
      <p className="page__lead">
        გთხოვთ, გადაამოწმოთ მონაცემები გაგზავნამდე.
      </p>

      <div className="card">
        <div className="card__head">
          <h2 className="card__title">პოლისი და მიმართვის ტიპი</h2>
          <button type="button" className="card__edit" onClick={() => onEdit(1)}>
            რედაქტირება
          </button>
        </div>
        <div className="rows">
          <Row label="მზღვეველი" value={policy?.holder ?? '—'} />
          <Row label="პოლისის ნომერი" value={policy?.number ?? '—'} />
          <Row label="პაკეტი" value={policy?.plan ?? '—'} />
          <Row label="პირადი ნომერი" value={policy?.nationalId ?? '—'} />
          <Row
            label="საგარანტიო მიმართვა"
            value={labelOf(GUARANTEE_TYPES, form.guaranteeType)}
          />
        </div>
      </div>

      <div className="card">
        <div className="card__head">
          <h2 className="card__title">მომსახურების დეტალები</h2>
          <button type="button" className="card__edit" onClick={() => onEdit(2)}>
            რედაქტირება
          </button>
        </div>
        <div className="rows">
          <Row
            label="სამედიცინო მომსახურება"
            value={labelOf(MEDICAL_SERVICES, form.service)}
          />
          <Row label="კომენტარი" value={form.comment || '—'} />
          <Row
            label="ექიმი სპეციალისტი"
            value={labelOf(SPECIALISTS, form.specialist)}
          />
          <Row label="კლინიკა" value={labelOf(CLINICS, form.clinic)} />
          <Row label="ექიმის სახელი და გვარი" value={form.doctorName || '—'} />
        </div>
      </div>

      <div className="card">
        <div className="card__head">
          <h2 className="card__title">
            ატვირთული დოკუმენტები ({form.files.length})
          </h2>
          <button type="button" className="card__edit" onClick={() => onEdit(2)}>
            რედაქტირება
          </button>
        </div>
        <div className="rows">
          {form.files.map((file) => (
            <Row
              key={`${file.name}-${file.size}`}
              label={file.name}
              value={formatSize(file.size)}
            />
          ))}
          <Row label="ჯამური მოცულობა" value={`${totalMb.toFixed(2)} მბ`} />
        </div>
      </div>
    </div>
  );
};

export default StepReview;
